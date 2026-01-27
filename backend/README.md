# Sanskriti Backend API

Backend server for Sanskriti Admin & Customer Panel built with Node.js, Express, Prisma, and MySQL.

## Features

- **Authentication System**: JWT-based authentication with access and refresh tokens
- **User Management**: Admin and Customer roles
- **Secure Password Storage**: Using bcryptjs for password hashing
- **Database ORM**: Prisma for type-safe database access
- **CORS**: Configured for frontend communication

## Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` with your MySQL credentials.

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with admin and test user
node seed.js
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Default Users

After seeding the database:

**Admin:**
- User ID: `admin`
- Password: `admin123`

**Test Customer:**
- User ID: `test_user`
- Password: `password123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `GET /api/auth/me` - Get current user (protected)

### Health Check

- `GET /api/health` - Server health status

## Scripts

- `npm run dev` - Start development server with watch mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for complete VPS deployment instructions.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Language**: TypeScript
