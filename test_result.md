# Test Report - Morsaab's Restaurant

**Project:** Morsaab's Vegetarian Restaurant Website
**Stack under test:** FastAPI on Lambda + DynamoDB + React on CloudFront
**Last verified:** 2026-08-15

## Automated tests

`pytest tests/ -q` — 15 tests, all passing. They run against an in-memory
DynamoDB (moto), so they need no AWS account and no running container.

| Area | Covered |
|------|---------|
| Health | reports `database: connected` |
| Menu | 9 categories, every item has a name, description and positive price |
| Menu | still served when the database is unreachable |
| Reservations | create, list, optional email omitted, defaults to `pending` |
| Orders | create, defaults, prices survive the Decimal round-trip (139, 179.5) |
| Contact | create, optional phone omitted |
| Listings | newest first, empty to start |
| Validation | missing field, wrong type and missing message all return 422 |
| Lambda | Mangum `handler` is importable and bound |

Run in CI on every push and pull request (`.github/workflows/ci.yml`), alongside
a frontend production build and `sam validate --lint`.

## Manual verification

Performed locally on 2026-08-15.

| Check | Result |
|-------|--------|
| `python server.py` against dynamodb-local | All 7 endpoints return expected payloads |
| `sam local start-api` (real Lambda + API Gateway path) | Same results as uvicorn |
| Frontend dev server (`npm start`) | Compiles clean, loads menu from the API |
| Frontend production build | Compiles clean; calls relative `/api`, no localhost baked in |
| `sam build` | Succeeds; 37 MB package, well under the 250 MB limit |
| `sam validate --lint` | Template valid |

## Not yet verified

- **Nothing has been deployed to AWS.** Every result above is local or emulated;
  the CloudFront/S3/API Gateway wiring in `template.yaml` has not been exercised
  against real infrastructure.
- No frontend unit or end-to-end tests exist.
- No load testing, and no cross-browser testing on real devices.

## Known issues

- `GET /api/reservations` and `GET /api/orders` are unauthenticated and return
  customer names and phone numbers.
- Nothing notifies the restaurant when a reservation or order comes in.
