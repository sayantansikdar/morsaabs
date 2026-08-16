# Morsaab's - Premium Vegetarian Restaurant

## Project Overview
A full-stack web application for Morsaab's restaurant featuring online reservations, menu display, and contact management. Built with modern web technologies and designed for local deployment.

## Features
- **Responsive Restaurant Website**: Showcases menu, ambiance, and location
- **Online Reservation System**: Table booking with confirmation
- **Dynamic Menu Management**: Real-time menu updates
- **Contact & Feedback Forms**: Customer communication channels
- **Admin Dashboard**: Content management interface

## Technology Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript, Tailwind CSS, Framer Motion, Radix primitives
- **Backend**: Python FastAPI
- **Database**: MongoDB
- **Authentication**: JWT-based sessions

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone and setup:**
   ```bash
   git clone https://github.com/sayantansikdar/morsaabs.git
   cd morsaabs
   ```

2. **Frontend:**
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

