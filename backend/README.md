# Morsaab's Restaurant - Backend API

## Overview
FastAPI backend server powering Morsaab's premium vegetarian restaurant website. Handles online reservations, menu management, and customer communications.

## Features
- RESTful API with OpenAPI documentation
- MongoDB integration with async operations
- Input validation using Pydantic models
- CORS configured for frontend development
- Comprehensive error handling

## API Documentation
Access auto-generated Swagger UI at `http://localhost:8000/docs`

### Core Endpoints:
- **GET /api/health** - Service status
- **GET /api/menu** - Complete restaurant menu
- **POST /api/reservations** - Create table reservation
- **POST /api/contact** - Submit contact message
- **POST /api/orders** - Place food order (future)

## Local Setup

### Prerequisites
- Python 3.11+
- MongoDB instance (local or Atlas)
- pip package manager

### Installation
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection details

# Start server
python server.py
