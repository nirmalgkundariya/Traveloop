# 🌍 TraveLoop — Solo Travel Planner

A full-stack travel planning app with 14 pages, JWT auth, drag-and-drop itinerary builder, budget tracking, packing lists, trip notes, and shareable itineraries.

## 🏗️ Project Structure

```
traveloop/
├── client/               # React + Vite + Tailwind frontend
│   └── src/
│       ├── pages/        # 14 pages
│       ├── components/   # Layout, UI, Shared components
│       ├── context/      # Auth + Trip context
│       └── services/     # Axios API client
├── server/               # Express + Prisma backend
│   └── src/
│       ├── routes/       # 8 route files
│       ├── controllers/  # Auth controller
│       ├── middleware/   # JWT auth + error handler
│       └── prisma/       # Schema + seed
└── uploads/              # User uploaded files
```

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone & Install

```bash
# Install root deps
npm install

# Install all deps
npm run install:all
```

### 2. Backend Setup

```bash
cd server

# Copy env file
cp .env.example .env

# Edit .env and set your DATABASE_URL
# DATABASE_URL="postgresql://user:password@localhost:5432/traveloop"
# JWT_SECRET=your_secret_here

# Setup database
npm run db:generate
npm run db:push

# Seed with test data (optional)
npm run db:seed
```

### 3. Frontend Setup

```bash
cd client

# Copy env file
cp .env.example .env

# VITE_API_URL=http://localhost:5000/api
```

### 4. Run Dev Servers

```bash
# From root - runs both client and server
npm run dev

# OR individually:
npm run dev:server    # http://localhost:5000
npm run dev:client    # http://localhost:3000
```

## 📱 Pages

| # | Page | Route |
|---|------|-------|
| 1 | Auth (Login/Signup) | `/auth` |
| 2 | Dashboard | `/dashboard` |
| 3 | Create Trip | `/trips/create` |
| 4 | My Trips | `/trips` |
| 5 | Itinerary Builder | `/trips/:id/itinerary` |
| 6 | Itinerary View | `/trips/:id/view` |
| 7 | City Search | `/cities` |
| 8 | Activity Search | `/activities` |
| 9 | Budget & Cost | `/trips/:id/budget` |
| 10 | Packing List | `/trips/:id/packing` |
| 11 | Shared Itinerary | `/share/:shareId` |
| 12 | Profile Settings | `/profile` |
| 13 | Trip Notes/Journal | `/trips/:id/notes` |
| 14 | Admin Dashboard | `/admin` |

## 🔑 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET/POST | `/api/trips` | List/Create trips |
| GET/PUT/DELETE | `/api/trips/:id` | Single trip CRUD |
| GET/POST/PUT/DELETE | `/api/activities` | Activity CRUD |
| GET/POST/PUT/DELETE | `/api/budget` | Budget item CRUD |
| GET/POST/PUT/DELETE | `/api/packing` | Packing item CRUD |
| GET/POST/PUT/DELETE | `/api/notes` | Notes CRUD |
| POST | `/api/share/generate/:tripId` | Generate share link |
| GET | `/api/share/:shareId` | Public itinerary view |
| GET | `/api/admin/stats` | Admin statistics |
| GET | `/api/admin/users` | List all users |

## 🧪 Test Credentials (after seeding)

```
Admin: admin@traveloop.com / admin123
User:  test@traveloop.com / test1234
```

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, Framer Motion, React Router v6, React Query, React Hook Form, Zod, Recharts, react-beautiful-dnd, Lucide React

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT (jsonwebtoken), bcryptjs, Helmet, CORS, express-rate-limit, Zod
