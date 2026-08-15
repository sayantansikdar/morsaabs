"""DynamoDB access layer.

Each entity gets its own table keyed by `id`. Listing endpoints scan and sort
in memory, which is fine at a single restaurant's volume; if a table ever grows
past a few thousand rows, add a GSI on `created_at` and query it instead.

Table names come from the environment so SAM can wire in the deployed names,
falling back to local defaults for `dynamodb-local`.
"""

import os
from decimal import Decimal
from typing import Any

import boto3

RESERVATIONS_TABLE = os.environ.get("RESERVATIONS_TABLE", "morsaabs-reservations")
ORDERS_TABLE = os.environ.get("ORDERS_TABLE", "morsaabs-orders")
CONTACT_TABLE = os.environ.get("CONTACT_TABLE", "morsaabs-contact-messages")

# Points at dynamodb-local during development. Ignored outright in Lambda: if a
# stray .env ever got packaged, honouring it would send every production write
# to a localhost address that does not exist.
# Set to a dynamodb-local address during development, and left unset in AWS so
# boto3 resolves the real regional endpoint. server.py deliberately skips
# loading .env inside Lambda, so a packaged .env cannot redirect writes here.
DYNAMODB_ENDPOINT_URL = os.environ.get("DYNAMODB_ENDPOINT_URL") or None

_resource = None


def resource():
    """Lazily build the boto3 resource so imports stay cheap in Lambda."""
    global _resource
    if _resource is None:
        _resource = boto3.resource(
            "dynamodb",
            endpoint_url=DYNAMODB_ENDPOINT_URL,
            region_name=os.environ.get("AWS_REGION", "ap-south-1"),
        )
    return _resource


def table(name: str):
    return resource().Table(name)


def to_dynamo(value: Any) -> Any:
    """Convert a Python value into something DynamoDB accepts.

    DynamoDB has no float type, so numbers go in as Decimal. Empty strings are
    legal in DynamoDB but Pydantic treats absent optionals as None, so None is
    dropped rather than stored as NULL.
    """
    if isinstance(value, float):
        return Decimal(str(value))
    if isinstance(value, dict):
        return {k: to_dynamo(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [to_dynamo(v) for v in value]
    return value


def from_dynamo(value: Any) -> Any:
    """Convert a DynamoDB item back into plain Python types."""
    if isinstance(value, Decimal):
        # Keep whole numbers as int so `guests` and `quantity` round-trip.
        return int(value) if value == value.to_integral_value() else float(value)
    if isinstance(value, dict):
        return {k: from_dynamo(v) for k, v in value.items()}
    if isinstance(value, list):
        return [from_dynamo(v) for v in value]
    return value


def put_item(table_name: str, item: dict) -> None:
    table(table_name).put_item(Item=to_dynamo(item))


def list_items(table_name: str, limit: int = 1000) -> list[dict]:
    """Return every item in a table, newest first."""
    items: list[dict] = []
    kwargs: dict = {}
    while len(items) < limit:
        response = table(table_name).scan(**kwargs)
        items.extend(from_dynamo(i) for i in response.get("Items", []))
        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break
        kwargs["ExclusiveStartKey"] = last_key
    items.sort(key=lambda i: i.get("created_at", ""), reverse=True)
    return items[:limit]
