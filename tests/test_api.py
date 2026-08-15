"""API tests for Morsaab's backend, run against an in-memory DynamoDB."""

import uuid

RESERVATION = {
    "name": "Asha Verma",
    "phone": "9876543210",
    "email": "asha@example.com",
    "date": "2026-09-01",
    "time": "20:00",
    "guests": 4,
    "special_requests": "Window seat",
}

ORDER = {
    "customer_name": "Rohit Nair",
    "phone": "9812345670",
    "items": [
        {"name": "Masala Dosa", "price": 139, "quantity": 2, "category": "South Indian"},
        {"name": "Cappuccino", "price": 179.5, "quantity": 1, "category": "Beverages"},
    ],
    "total": 457.5,
    "order_type": "delivery",
    "address": "12 Park Street",
}

CONTACT = {
    "name": "Priya Das",
    "email": "priya@example.com",
    "message": "Do you cater for private events?",
}


def test_health_reports_database_connected(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "connected"}


def test_root_returns_api_name(client):
    assert client.get("/api/").json() == {"message": "Morsaab's Restaurant API"}


def test_menu_is_complete_and_well_formed(client):
    response = client.get("/api/menu")
    assert response.status_code == 200

    categories = response.json()["categories"]
    assert [c["name"] for c in categories] == [
        "Starters",
        "Main Course",
        "South Indian",
        "Chinese",
        "Pizza",
        "Pasta",
        "Beverages",
        "Desserts",
        "Thali",
    ]

    for category in categories:
        assert category["items"], f"{category['name']} has no items"
        for item in category["items"]:
            assert item["name"] and item["description"]
            assert item["price"] > 0


def test_menu_needs_no_database(client, monkeypatch):
    """The menu is static, so it must serve even when DynamoDB is unreachable."""
    import db

    monkeypatch.setattr(db, "resource", lambda: (_ for _ in ()).throw(RuntimeError("down")))
    assert client.get("/api/menu").status_code == 200


def test_create_reservation_persists_and_defaults(client):
    created = client.post("/api/reservations", json=RESERVATION).json()

    assert created["status"] == "pending"
    assert uuid.UUID(created["id"])
    assert created["guests"] == 4
    assert created["special_requests"] == "Window seat"

    listed = client.get("/api/reservations").json()
    assert len(listed) == 1
    assert listed[0] == created


def test_reservation_optional_email_may_be_omitted(client):
    payload = {k: v for k, v in RESERVATION.items() if k != "email"}
    created = client.post("/api/reservations", json=payload).json()

    assert created["email"] is None
    assert client.get("/api/reservations").json()[0]["email"] is None


def test_order_preserves_prices_through_dynamodb(client):
    """DynamoDB stores numbers as Decimal; money must come back unrounded."""
    created = client.post("/api/orders", json=ORDER).json()
    assert created["total"] == 457.5

    stored = client.get("/api/orders").json()[0]
    assert stored["total"] == 457.5
    assert [i["price"] for i in stored["items"]] == [139, 179.5]
    assert [i["quantity"] for i in stored["items"]] == [2, 1]
    assert stored["status"] == "pending"
    assert stored["order_type"] == "delivery"


def test_order_defaults_to_delivery_without_address(client):
    payload = {k: v for k, v in ORDER.items() if k not in ("order_type", "address")}
    created = client.post("/api/orders", json=payload).json()

    assert created["order_type"] == "delivery"
    assert created["address"] is None


def test_create_contact_message(client):
    created = client.post("/api/contact", json=CONTACT).json()

    assert created["name"] == "Priya Das"
    assert created["phone"] is None
    assert uuid.UUID(created["id"])


def test_listings_are_newest_first(client):
    names = ["First", "Second", "Third"]
    for name in names:
        client.post("/api/reservations", json={**RESERVATION, "name": name})

    listed = client.get("/api/reservations").json()
    assert [r["name"] for r in listed] == list(reversed(names))


def test_listings_start_empty(client):
    for path in ("/api/reservations", "/api/orders"):
        assert client.get(path).json() == []


def test_missing_required_field_is_rejected(client):
    payload = {k: v for k, v in RESERVATION.items() if k != "phone"}
    assert client.post("/api/reservations", json=payload).status_code == 422


def test_wrong_type_is_rejected(client):
    payload = {**RESERVATION, "guests": "a table for four"}
    assert client.post("/api/reservations", json=payload).status_code == 422


def test_contact_requires_message(client):
    payload = {k: v for k, v in CONTACT.items() if k != "message"}
    assert client.post("/api/contact", json=payload).status_code == 422


def test_lambda_handler_is_wired(client):
    """Mangum must be importable and bound, or API Gateway has nothing to call."""
    import server

    assert server.handler is not None
