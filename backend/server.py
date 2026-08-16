from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import db
from menu import MENU

ROOT_DIR = Path(__file__).parent

# Local development only. In Lambda every setting arrives as a real environment
# variable, and a .env that slipped into the package would point the app at a
# localhost database that does not exist there.
if not os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app without a prefix
app = FastAPI(title="Morsaab's Restaurant API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Reservation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    date: str
    time: str
    guests: int
    special_requests: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReservationCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    date: str
    time: str
    guests: int
    special_requests: Optional[str] = None

class OrderItem(BaseModel):
    name: str
    price: float
    quantity: int
    category: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    phone: str
    items: List[OrderItem]
    total: float
    order_type: str = "delivery"
    address: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    items: List[OrderItem]
    total: float
    order_type: str = "delivery"
    address: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str


def _store(table_name: str, record: BaseModel) -> None:
    """Persist a record, keeping created_at as an ISO string in DynamoDB."""
    item = record.model_dump()
    item['created_at'] = item['created_at'].isoformat()
    db.put_item(table_name, item)


# API Routes
@api_router.get("/")
def root():
    return {"message": "Morsaab's Restaurant API"}

@api_router.get("/health")
def health():
    try:
        db.table(db.RESERVATIONS_TABLE).table_status
    except Exception as e:
        logger.error("DynamoDB check failed: %s", e)
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"status": "ok", "database": "connected"}

# Reservation endpoints
@api_router.post("/reservations", response_model=Reservation)
def create_reservation(input: ReservationCreate):
    reservation = Reservation(**input.model_dump())
    _store(db.RESERVATIONS_TABLE, reservation)
    return reservation

@api_router.get("/reservations", response_model=List[Reservation])
def get_reservations():
    return db.list_items(db.RESERVATIONS_TABLE)

# Order endpoints
@api_router.post("/orders", response_model=Order)
def create_order(input: OrderCreate):
    order = Order(**input.model_dump())
    _store(db.ORDERS_TABLE, order)
    return order

@api_router.get("/orders", response_model=List[Order])
def get_orders():
    return db.list_items(db.ORDERS_TABLE)

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessage)
def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(**input.model_dump())
    _store(db.CONTACT_TABLE, message)
    return message

# Menu data endpoint
@api_router.get("/menu")
def get_menu():
    return MENU

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lambda entrypoint (API Gateway -> Mangum -> FastAPI)
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:  # local dev without the Lambda adapter installed
    handler = None

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", 8000)),
        reload=True,
    )
