# Morsaab's - Premium Vegetarian Restaurant

## Project Overview
A serverless web application for Morsaab's restaurant featuring online reservations,
menu display, and order/contact capture. Runs on AWS at effectively zero cost at a
single restaurant's traffic.

## Features
- **Responsive Restaurant Website**: Showcases menu, ambiance, and location
- **Online Reservation System**: Table booking with confirmation
- **Menu Display**: Nine categories served from the API
- **Order Capture**: Cart, delivery/pickup, order submission
- **Contact & Feedback Forms**: Customer communication channels

## Technology Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript, Tailwind CSS, Framer Motion, Radix primitives
- **Backend**: Python FastAPI on AWS Lambda (via Mangum)
- **API**: Amazon API Gateway (HTTP API)
- **Database**: Amazon DynamoDB (on-demand billing)
- **CDN/Hosting**: Amazon CloudFront in front of a private S3 bucket
- **Infrastructure**: AWS SAM (`template.yaml`)

## Architecture

CloudFront fronts the API, so the browser talks to a single origin and CORS
never comes into play:

```
                  ┌────────────────────────────────┐
  Browser ───────▶│         CloudFront             │
                  │                                │
                  │  /api/*  ──▶ API Gateway       │
                  └──────────────────┬─────────────┘
                                     │
                                Lambda (FastAPI)
                                     │
                    DynamoDB: reservations, orders, contact-messages
```

> **The web app's hosting is still undecided.** This stack was designed to serve
> a static CRA bundle from S3, and the frontend is now Next.js: SSR, the route
> handlers under `app/api/`, the generated OG image and `sitemap.ts` all need a
> Node runtime that S3 cannot provide. Either deploy the web app to Vercel and
> keep this stack for the API, or move the site behind Lambda via OpenNext.
> `scripts/deploy.sh` still syncs a static build to S3 and will not work as-is.


## Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (for dynamodb-local)
- AWS SAM CLI and AWS CLI (only needed to deploy)

### Setup

1. **Clone:**
   ```bash
   git clone https://github.com/sayantansikdar/morsaabs.git
   cd morsaabs
   ```

2. **Start the local database:**
   ```bash
   docker run -d --name morsaabs-dynamodb -p 8001:8000 \
     amazon/dynamodb-local:latest -jar DynamoDBLocal.jar -sharedDb -inMemory
   ```
   `-sharedDb` matters: without it dynamodb-local keeps a separate set of tables
   per credential pair, and the API and your scripts stop seeing the same data.

3. **Backend:**
   ```bash
   cd backend
   python3.11 -m venv .venv && source .venv/bin/activate
   pip install -r requirements-dev.txt
   cp .env.example .env
   python scripts/create_local_tables.py
   python server.py            # http://localhost:8000
   ```

4. **Frontend** (in a second terminal):
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev                  # http://localhost:3000
   ```

   The frontend runs standalone. With `BACKEND_API_URL` unset, the route
   handlers under `app/api/` accept form submissions and log them instead of
   forwarding, so every page and form is exercisable without the backend up.

   See [frontend/README.md](frontend/README.md) for the project layout, the
   design decisions worth knowing before changing them, and the list of
   placeholders to replace before launch.
