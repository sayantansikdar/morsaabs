from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

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

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Morsaab's Restaurant API"}

# Reservation endpoints
@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(input: ReservationCreate):
    reservation = Reservation(**input.model_dump())
    doc = reservation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reservations.insert_one(doc)
    return reservation

@api_router.get("/reservations", response_model=List[Reservation])
async def get_reservations():
    reservations = await db.reservations.find({}, {"_id": 0}).to_list(1000)
    for r in reservations:
        if isinstance(r['created_at'], str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return reservations

# Order endpoints
@api_router.post("/orders", response_model=Order)
async def create_order(input: OrderCreate):
    order = Order(**input.model_dump())
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    for o in orders:
        if isinstance(o['created_at'], str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
    return orders

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(**input.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

# Menu data endpoint
@api_router.get("/menu")
async def get_menu():
    return {
        "categories": [
            {
                "name": "Starters",
                "items": [
                    {"name": "Roasted Peanuts", "price": 99, "description": "Crispy spiced peanuts"},
                    {"name": "Veg Seekh Kebab", "price": 199, "description": "Smoky vegetable kebabs"},
                    {"name": "Achari Soya Chaap", "price": 219, "description": "Tangy pickle-flavored chaap"},
                    {"name": "Dal Ke Kebab", "price": 299, "description": "Crispy lentil patties"},
                    {"name": "Achari Paneer Tikka", "price": 310, "description": "Tangy cottage cheese tikka"},
                    {"name": "Hariyali Paneer Tikka", "price": 310, "description": "Mint-marinated paneer"},
                    {"name": "Paneer Malai Tikka", "price": 349, "description": "Creamy cottage cheese tikka"}
                ]
            },
            {
                "name": "Main Course",
                "items": [
                    {"name": "Dal Tadka", "price": 199, "description": "Tempered yellow lentils"},
                    {"name": "Jeera Aloo", "price": 199, "description": "Cumin-spiced potatoes"},
                    {"name": "Aloo Gobi Adraki", "price": 219, "description": "Ginger-infused potato cauliflower"},
                    {"name": "Punjabi Kadhi", "price": 229, "description": "Tangy yogurt curry"},
                    {"name": "Mix Veg", "price": 219, "description": "Seasonal mixed vegetables"},
                    {"name": "Pindi Chana", "price": 229, "description": "Spiced chickpea curry"},
                    {"name": "Kadhai Paneer", "price": 349, "description": "Wok-tossed cottage cheese"},
                    {"name": "Shahi Paneer", "price": 349, "description": "Royal creamy paneer"},
                    {"name": "Palak Paneer", "price": 349, "description": "Spinach cottage cheese"},
                    {"name": "Paneer Tikka Masala", "price": 349, "description": "Grilled paneer in gravy"},
                    {"name": "Paneer Butter Masala", "price": 349, "description": "Rich buttery paneer curry"}
                ]
            },
            {
                "name": "South Indian",
                "items": [
                    {"name": "Vada", "price": 109, "description": "Crispy lentil fritters"},
                    {"name": "Plain Dosa", "price": 119, "description": "Crispy rice crepe"},
                    {"name": "Plain Butter Dosa", "price": 139, "description": "Buttery rice crepe"},
                    {"name": "Masala Dosa", "price": 139, "description": "Stuffed with potato filling"},
                    {"name": "Utthappam Masala", "price": 139, "description": "Thick rice pancake"},
                    {"name": "Plain Idli (3pcs)", "price": 139, "description": "Steamed rice cakes with sambhar"},
                    {"name": "Masala Idli", "price": 209, "description": "Spiced idli tossed in masala"},
                    {"name": "Podi Idli", "price": 249, "description": "Idli with spice powder"}
                ]
            },
            {
                "name": "Chinese",
                "items": [
                    {"name": "Veg Spring Roll", "price": 199, "description": "Crispy vegetable rolls"},
                    {"name": "Chili Potato", "price": 199, "description": "Spicy crispy potatoes"},
                    {"name": "Honey Chili Potato", "price": 199, "description": "Sweet & spicy potatoes"},
                    {"name": "Veg Crispy Corn", "price": 199, "description": "Crispy corn kernels"},
                    {"name": "Dry Manchurian", "price": 249, "description": "Crispy vegetable balls"},
                    {"name": "Salt and Pepper", "price": 209, "description": "Seasoned crispy veggies"},
                    {"name": "Chili Paneer", "price": 249, "description": "Spicy Indo-Chinese paneer"},
                    {"name": "Chili Mushroom", "price": 299, "description": "Spicy wok-tossed mushrooms"},
                    {"name": "Paneer 65", "price": 299, "description": "South Indian style crispy paneer"}
                ]
            },
            {
                "name": "Pizza",
                "items": [
                    {"name": "Margherita", "price": 299, "description": "Classic cheese & tomato"},
                    {"name": "Fresh Farmhouse", "price": 299, "description": "Garden fresh vegetables"},
                    {"name": "Mexican", "price": 319, "description": "Spicy jalapeño & veggies"},
                    {"name": "Sizzling Chilli Paneer", "price": 349, "description": "Spicy paneer topping"},
                    {"name": "Paneer Tikka Pizza", "price": 349, "description": "Indian fusion pizza"},
                    {"name": "Spinach Sun-Dried Tomato", "price": 399, "description": "Gourmet pizza with olives"},
                    {"name": "Chef's Special Mushroom", "price": 399, "description": "Truffle oil drizzled"}
                ]
            },
            {
                "name": "Pasta",
                "items": [
                    {"name": "Arrabiata", "price": 199, "description": "Spicy red sauce pasta"},
                    {"name": "Alfredo", "price": 219, "description": "Creamy white sauce pasta"},
                    {"name": "Mix Sauce", "price": 219, "description": "Pink sauce pasta"},
                    {"name": "Pesto Sauce", "price": 249, "description": "Basil pesto pasta"},
                    {"name": "Aglio E Olio", "price": 249, "description": "Garlic olive oil pasta"},
                    {"name": "Mac and Cheese", "price": 249, "description": "Baked cheese pasta"}
                ]
            },
            {
                "name": "Beverages",
                "items": [
                    {"name": "Espresso", "price": 99, "description": "Strong Italian coffee"},
                    {"name": "Cappuccino", "price": 179, "description": "Frothy milk coffee"},
                    {"name": "Cafe Latte", "price": 169, "description": "Smooth milk coffee"},
                    {"name": "Mocha Frappe", "price": 169, "description": "Chocolate coffee blend"},
                    {"name": "Classic Sweet Lassi", "price": 99, "description": "Traditional yogurt drink"},
                    {"name": "Mango Saffron Lassi", "price": 119, "description": "Premium mango lassi"},
                    {"name": "Chilli Guava Cooler", "price": 229, "description": "Morsaab's Special"},
                    {"name": "Mix Berry Smoothie", "price": 199, "description": "Fresh berry blend"}
                ]
            },
            {
                "name": "Desserts",
                "items": [
                    {"name": "Assorted Ice Cream", "price": 79, "description": "2 scoops of choice"},
                    {"name": "Rasmalai (2 Pcs)", "price": 79, "description": "Creamy milk dessert"},
                    {"name": "Gulab Jamun", "price": 99, "description": "Deep-fried milk dumplings"},
                    {"name": "Assorted Pastry", "price": 159, "description": "Fresh bakery selection"},
                    {"name": "Butterscotch Sundae", "price": 179, "description": "Ice cream with toppings"},
                    {"name": "Oreo Overload Sundae", "price": 179, "description": "Cookie crumble sundae"},
                    {"name": "Nutty Nutella Sundae", "price": 179, "description": "Hazelnut chocolate sundae"}
                ]
            },
            {
                "name": "Thali",
                "items": [
                    {"name": "Deluxe Thali", "price": 299, "description": "2 Paratha, Paneer, Dal Makhani, Pulao, Dal"},
                    {"name": "Morsaab's Royal Special", "price": 349, "description": "Complete meal with Paneer, Dal, Mix Veg, Naan, Sweet"}
                ]
            }
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
