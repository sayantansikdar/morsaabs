import os
import sys
from pathlib import Path

import pytest

BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

# Must be set before boto3 builds a session, and before anything reads the
# developer's real backend/.env.
os.environ.update(
    AWS_ACCESS_KEY_ID="testing",
    AWS_SECRET_ACCESS_KEY="testing",
    AWS_SESSION_TOKEN="testing",
    AWS_DEFAULT_REGION="ap-south-1",
    AWS_REGION="ap-south-1",
)

from fastapi.testclient import TestClient  # noqa: E402
from moto import mock_aws  # noqa: E402

import db  # noqa: E402
from server import app  # noqa: E402

TABLES = [db.RESERVATIONS_TABLE, db.ORDERS_TABLE, db.CONTACT_TABLE]


@pytest.fixture
def client(monkeypatch):
    """A TestClient backed by moto's in-memory DynamoDB."""
    # backend/.env points at dynamodb-local; tests must hit moto instead.
    monkeypatch.setattr(db, "DYNAMODB_ENDPOINT_URL", None)

    with mock_aws():
        db._resource = None
        resource = db.resource()
        for name in TABLES:
            resource.create_table(
                TableName=name,
                AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
                KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
                BillingMode="PAY_PER_REQUEST",
            )
        with TestClient(app) as test_client:
            yield test_client
        db._resource = None
