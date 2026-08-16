"""Create the DynamoDB tables in a local dynamodb-local instance.

Deployed tables come from template.yaml; this only exists so `python server.py`
has something to talk to during development. Safe to re-run.

    docker run -d --name morsaabs-dynamodb -p 8001:8000 amazon/dynamodb-local
    python scripts/create_local_tables.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

import db  # noqa: E402  (must follow load_dotenv -- db reads env at import)

TABLES = [db.RESERVATIONS_TABLE, db.ORDERS_TABLE, db.CONTACT_TABLE]


def main() -> None:
    if not db.DYNAMODB_ENDPOINT_URL:
        sys.exit(
            "DYNAMODB_ENDPOINT_URL is not set -- refusing to run against real AWS. "
            "Set it in backend/.env (see .env.example)."
        )

    client = db.resource().meta.client
    existing = set(client.list_tables()["TableNames"])

    for name in TABLES:
        if name in existing:
            print(f"exists  {name}")
            continue
        client.create_table(
            TableName=name,
            AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            BillingMode="PAY_PER_REQUEST",
        )
        client.get_waiter("table_exists").wait(TableName=name)
        print(f"created {name}")


if __name__ == "__main__":
    main()
