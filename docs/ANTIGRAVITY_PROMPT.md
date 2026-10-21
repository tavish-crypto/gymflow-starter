# Antigravity implementation prompt — GymFlow

You are working on an existing full-stack project called **GymFlow**. A starter repository and a visual prototype are attached. Complete and refine the project rather than replacing it.

## Product

GymFlow is a simple, production-oriented gym operations + member fitness platform connecting four roles:

- Admin
- Fitness Manager
- Trainer
- Member

The core product loop is:

Member joins → goal is set → trainer is assigned → workout/nutrition plan → calendar scheduling → daily logging → progress review.

The project must remain easy to use. Do not turn it into a crowded dashboard or an AI-generated Dribbble concept.

## Critical AI rule

**DO NOT implement AI.**

The AI integration is intentionally reserved for me to learn and build myself.

Keep these routes as explicit HTTP 501 placeholders:

- `POST /api/ai/workout-plan`
- `POST /api/ai/nutrition`
- `POST /api/ai/progress-summary`

Keep the AI Coach UI as a clean placeholder explaining that integration is not connected. Do not add Gemini, OpenAI, Anthropic, LangChain, RAG, agents, fake AI responses, or hardcoded recommendations.

## Existing stack

Client:
- React
- TypeScript
- Vite
- React Router
- Lucide icons

Server:
- Node.js
- Express
- TypeScript
- Prisma
- Zod
- PostgreSQL

Preserve backend layering:

Route → Controller → Service → Repository → Prisma → PostgreSQL

Do not put Prisma queries in controllers.

## Visual direction

Use the attached `docs/gymflow-prototype.png` as the reference.

The UI direction is deliberately restrained:

- warm beige/off-white app background
- slightly darker beige/sage left sidebar
- white/cream elevated surfaces
- premium deep green as the main brand/action color
- muted sage for active navigation and subtle success states
- charcoal text
- muted gray secondary text
- amber only for warnings
- red only for risk/destructive states
- blue only for neutral information
- almost no gradients
- almost no shadows
- thin borders
- 8–12px radii
- generous whitespace
- predictable typography

Think closer to Linear, Notion, Stripe, Vercel and mature Google products than an over-designed fitness dashboard.

One screen must have one primary job.

## Do not overcrowd

Avoid:

- giant hero areas inside the app
- 8–12 KPI cards in one viewport
- excessive progress circles
- random colored cards
- neon fitness styling
- heavy glassmorphism
- excessive gradients
- meaningless charts
- decorations that reduce readability

## Role navigation

Admin:
- Dashboard
- Members
- Calendar
- Fitness overview

Fitness Manager:
- Overview
- Members
- Workout Plans
- Calendar
- AI Insights placeholder

Trainer:
- Today
- Members
- Plans
- Calendar

Member:
- Home
- Workout
- Nutrition
- Calendar
- Progress
- AI Coach placeholder

The starter uses a demo role switcher. Keep it for development. Do not pretend it is production authentication. Structure the code so Clerk/Auth.js can replace it later.

## Pages to complete

### Login/demo entry
Simple two-column layout. Minimal copy, premium beige and green, role selection for demo only.

### Admin dashboard
Only the core operational information:
- Active members
- Today’s check-ins
- Memberships expiring soon
- Inactive/at-risk members
- 7-day attendance trend
- Members needing attention

No unnecessary widgets.

### Members
Clean CRM-style table:
- Name
- Goal
- Trainer
- Membership
- Status

Features:
- search
- status filter
- trainer filter
- add member
- row navigation to member profile
- loading, empty, error states

### Member profile
Shared profile screen for staff and member progress view:
- member name/status
- goal
- trainer
- membership
- current/target weight
- workout adherence
- attendance
- active workout plan
- recent progress

Keep tabs visually simple:
- Overview
- Workouts
- Nutrition
- Progress
- Calendar

Only implement tabs that have real data. Do not add fake content.

### Fitness Manager dashboard
Focus on members who need action:
- members under coaching
- need review
- no active workout plan
- low adherence / at-risk
- compact cards/list of members needing attention

### Trainer dashboard
Focus on today:
- today’s schedule
- assigned members
- member goal/status/adherence
- quick navigation to member profile

### Member home
Answer one question: **What should I do today?**

Show only:
- current goal/current vs target weight
- today’s workout
- daily nutrition progress
- today’s schedule
- simple weekly consistency where data supports it

### Workout session
Production-friendly logging UI:
- exercise name
- sets
- weight
- reps
- done checkbox
- finish workout

Do not make workout logging decorative. It must be fast to use on mobile.

### Workout plan
- plan name
- workout days
- exercise name
- sets/reps/target weight
- trainer/manager can review structure
- AI generate button remains disabled/placeholder

### Nutrition
- calorie target vs consumed
- protein/carbs/fat
- meal list
- add meal
- simple daily view
- AI button remains disabled/placeholder

Nutrition is general fitness tracking only, not medical nutrition advice.

### Calendar
Calendar is a core product feature.

Support:
- workouts
- meals
- trainer sessions
- progress reviews
- weight checks
- reminders

Keep the month grid simple and familiar, closer to Google Calendar than a custom futuristic scheduler.

Clicking a date shows that day’s events.

Allow scheduling a new activity.

### AI Coach
Do not implement AI.
Show:
- reserved endpoints
- explanation that AI will be added later
- no fake conversation or fake recommendations

## Backend/domain model

Preserve the existing Prisma models unless a genuine bug requires adjustment.

Current core concepts include:
- Gym
- User
- TrainerProfile
- MemberProfile
- Membership
- Attendance
- WorkoutPlan
- WorkoutDay
- Exercise
- WorkoutExercise
- WorkoutSession
- ExerciseLog
- NutritionGoal
- MealLog
- ProgressEntry
- CalendarEvent

Do not replace relational data with JSON blobs.

## Core API behavior

Preserve/refine the starter endpoints.

Dashboard:
- `GET /api/dashboard/admin`
- `GET /api/dashboard/fitness-manager`

Members:
- `GET /api/members`
- `POST /api/members`
- `GET /api/members/:id`
- `GET /api/members/:id/home`

Trainers:
- `GET /api/trainers`
- `GET /api/trainers/:id/dashboard`

Workouts:
- `GET /api/workouts/member/:memberId/active-plan`
- `POST /api/workouts/member/:memberId/plans`
- `POST /api/workouts/member/:memberId/sessions`
- `PATCH /api/workouts/sessions/:id`
- `PUT /api/workouts/sessions/:id/logs`

Nutrition:
- `GET /api/nutrition/member/:memberId/today`
- `PUT /api/nutrition/member/:memberId/goal`
- `POST /api/nutrition/member/:memberId/meals`

Calendar:
- `GET /api/calendar/member/:memberId`
- `POST /api/calendar/events`
- `DELETE /api/calendar/events/:id`

AI:
- leave all AI routes as HTTP 501 placeholders

## Production-readiness expectations

Improve the starter where necessary:

- no TypeScript errors
- no broken buttons for non-AI features
- no console warnings
- no `any` where a stable type can reasonably be defined
- no hardcoded API URL scattered through components
- no hardcoded dashboard numbers
- no fake AI output
- no destructive database reset outside seed/dev workflow
- good Zod validation
- useful API errors
- responsive layout
- accessible labels and focus states
- reusable UI components
- centralized date formatting
- loading/error/empty states

## Authentication

Do not spend the entire task integrating a third-party provider unless explicitly asked.

Keep demo role switching clearly labeled as development/demo behavior. Make it easy to swap for real auth later.

## Seed data

Seed data is allowed and useful for development. UI data must still come from PostgreSQL through the API.

Do not hardcode demo member names/metrics directly in React components.

## Implementation order

1. Audit repo
2. Run server/client baseline builds
3. Fix build/type problems
4. Review Prisma schema
5. Refine design system
6. App shell/navigation
7. Admin dashboard
8. Members + add member
9. Member profile
10. Fitness Manager dashboard
11. Trainer dashboard
12. Member home
13. Workout logging
14. Workout plan screens
15. Nutrition
16. Calendar
17. AI placeholders only
18. Responsive/accessibility pass
19. README/setup cleanup
20. Final server/client build

## Final validation

Run:

```bash
npm run build
```

from the root, and ensure both server and client pass.

Then report:
- files changed
- pages completed
- API changes
- schema changes
- remaining limitations
- exact local run commands

The final result should look like a calm, premium, production-oriented fitness product—not an overcrowded concept dashboard.
