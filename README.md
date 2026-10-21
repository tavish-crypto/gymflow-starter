# GymFlow

GymFlow is a gym operations + member fitness platform for Admins, Fitness Managers, Trainers, and Members.

This starter implements the non-AI product foundation and intentionally leaves AI features as explicit stubs so they can be implemented and understood separately.

## Core product areas

- Admin operations dashboard
- Members and memberships
- Attendance overview
- Fitness-manager review dashboard
- Trainer schedule and assigned members
- Member home dashboard
- Workout plans and workout session logging
- Nutrition goals and meal logging
- Calendar and scheduling
- Progress tracking foundation
- AI routes and UI placeholders (not implemented)

## Tech stack

**Client:** React, TypeScript, Vite, React Router, Lucide React, plain CSS design system  
**Server:** Node.js, Express, TypeScript, Prisma, Zod  
**Database:** PostgreSQL

## Architecture

```text
Frontend
  ↓
REST API
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

## Local setup

### 1. Install

```bash
npm install
npm run install:all
```

### 2. Server environment

Copy:

```bash
cp server/.env.example server/.env
```

Set `DATABASE_URL` to your PostgreSQL database.

### 3. Create database schema

```bash
cd server
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Client environment

```bash
cp client/.env.example client/.env
```

### 5. Run both apps

From the root:

```bash
npm run dev
```

Client: `http://localhost:5173`  
API: `http://localhost:5000`

## Demo roles

The starter intentionally uses a **demo role switcher**, not production authentication. This keeps the product runnable without external credentials. Replace it with Clerk/Auth.js before production deployment.

## AI implementation

AI is intentionally **not implemented**. The project contains:

- `POST /api/ai/workout-plan`
- `POST /api/ai/nutrition`
- `POST /api/ai/progress-summary`

These return HTTP `501`. Implement them yourself after you understand prompting, structured output, validation, model APIs, and safety boundaries.

See `docs/AI_IMPLEMENTATION_GUIDE.md`.

## Prototype

The design reference is included at:

`docs/gymflow-prototype.png`

The implementation uses the same simple premium direction: warm beige surfaces, restrained green accents, generous spacing, readable typography, and minimal visual noise.
