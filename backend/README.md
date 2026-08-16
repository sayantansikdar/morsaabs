# Morsaab's Restaurant - Backend API

## Overview
FastAPI application serving Morsaab's restaurant website. It runs as a single AWS
Lambda function behind API Gateway (Mangum adapts ASGI to the Lambda event
format) and stores data in DynamoDB. The same code runs locally under uvicorn.

## Layout
| File | Purpose |
|------|---------|
| `server.py` | FastAPI app, Pydantic models, routes, Lambda `handler` |
| `db.py` | DynamoDB access and Decimal/float conversion |
| `menu.py` | Static menu data |
| `scripts/create_local_tables.py` | Creates the tables in dynamodb-local |

## API Documentation
Swagger UI is at `http://localhost:8000/docs` when running locally.

### Endpoints
- **GET /api/health** — service status and a DynamoDB reachability check
- **GET /api/menu** — complete restaurant menu (static, needs no database)
- **POST /api/reservations** / **GET /api/reservations** — table reservations
- **POST /api/orders** / **GET /api/orders** — food orders
- **POST /api/contact** — customer messages

## Local Setup

### Prerequisites
- Python 3.11+
- Docker, for dynamodb-local

```bash
docker run -d --name morsaabs-dynamodb -p 8001:8000 \
  amazon/dynamodb-local:latest -jar DynamoDBLocal.jar -sharedDb -inMemory

python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt

cp .env.example .env
python scripts/create_local_tables.py

python server.py
```

## Data model
Three tables, each partitioned on a UUID `id`:

| Table | Contents |
|-------|----------|
| `morsaabs-reservations` | name, phone, email, date, time, guests, status |
| `morsaabs-orders` | customer, phone, line items, total, type, address, status |
| `morsaabs-contact-messages` | name, email, phone, message |

Two details worth knowing:

- **DynamoDB has no float type.** `db.to_dynamo` converts money to `Decimal` on
  write and `db.from_dynamo` converts back, keeping whole numbers as `int` so
  `guests` and `quantity` round-trip unchanged.
- **`created_at` is stored as an ISO 8601 string**, which sorts lexicographically,
  so listings can sort on it directly.

## Dependencies
`requirements.txt` holds only what ships in the Lambda package. Test and lint
tooling lives in `requirements-dev.txt`, which installs both.

## Notes
- `.env` is read only outside Lambda. In AWS every setting arrives as a real
  environment variable set by `template.yaml`.
- The listing endpoints scan their table and sort in memory. That is fine at this
  scale; add a GSI on `created_at` if a table ever grows past a few thousand rows.
- Route handlers are sync (`def`, not `async def`) because boto3 blocks. FastAPI
  runs them in a threadpool, so a slow DynamoDB call cannot stall the event loop.
