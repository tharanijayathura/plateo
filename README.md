# 🍽️ Plateo — Luxury Dining Full-Stack Application

Plateo is an elevated dining and culinary experience web platform built with **Next.js** on the frontend and **Express + PostgreSQL (Prisma)** on the backend.

---

## 📁 Repository Structure

```
plateo/
├── client/                 # Next.js 16 (App Router, React 19, CSS Modules)
│   ├── src/
│   │   ├── app/            # Pages: Home, Menu, Reservations, Contact, Admin
│   │   │   └── admin/      # Admin Login & Management Dashboard
│   │   ├── components/     # UI Components
│   │   └── data/           # Menu data & definitions
│   └── package.json
│
└── server/                 # Node.js + Express + TypeScript Backend
    ├── prisma/
    │   └── schema.prisma   # PostgreSQL Database Schema
    ├── src/
    │   ├── controllers/    # Menu, Reservation, Contact & Admin logic
    │   ├── middleware/     # JWT Auth middleware
    │   ├── routes/         # API Route definitions
    │   ├── lib/            # Prisma client instance
    │   ├── index.ts        # Server entry point
    │   └── seed.ts         # Database seed script for menu items
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install

# Copy environment variables and configure your PostgreSQL connection
cp .env.example .env

# Push database schema to PostgreSQL
npx prisma db push

# (Optional) Seed the database with initial menu items
npm run seed

# Start development server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

---

## 🔐 Admin Dashboard

Visit `http://localhost:3000/admin` to log into the Admin Console:
- Manage table reservations (confirm, cancel, complete)
- View and respond to guest correspondence
- Track dining analytics and status metrics
