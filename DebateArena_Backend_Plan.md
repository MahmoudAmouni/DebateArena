# DebateArena — Backend Implementation Plan

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js | |
| Framework | Express.js | |
| Database | MySQL via XAMPP | |
| ORM | Prisma | Works natively with MySQL, auto-generates a typed client from your schema, handles migrations cleanly |
| Real-time | Socket.io | Handles WebSocket connections for live debate, typing indicators, timers, AI sidebar |
| Auth | JWT (access + refresh tokens) | Stateless, works well with Socket.io auth |
| OAuth | Passport.js | Google and Apple strategies |
| Validation | Zod | Schema-based request validation, pairs well with Prisma types |
| File Uploads | Multer + Cloudinary | Profile avatar uploads |
| Email | Resend | Transactional email |
| Push Notifications | OneSignal | In-app and push |
| Queue / Jobs | BullMQ + Redis | Background jobs: AI verdict generation, session expiry checks, ELO updates |
| AI | Anthropic Claude API | Fact-checker, research assistant, AI judge |
| Caching | Redis | Session state, rate limit counters, active debate state |
| Logging | Winston | Structured logs per environment |
| Environment | dotenv | |

> **Note on Redis:** BullMQ requires Redis. Run Redis locally alongside XAMPP — it's one command and adds the background job infrastructure you'll need for AI processing and session expiry.

---

## Separation of Concerns — Layer Architecture

Every request flows through exactly these layers in order. No layer skips another.

```
Request
  → Router          (defines the route, attaches middleware)
  → Middleware       (auth, validation, rate limiting)
  → Controller       (receives req/res, calls service, returns response)
  → Service          (business logic, orchestrates repositories)
  → Repository       (all database access via Prisma, nothing else)
  → Prisma Client    (talks to MySQL)
```

No controller touches Prisma directly.
No service touches req or res.
No repository contains business logic.

---

## Folder Structure

```
src/
│
├── config/
│   ├── database.ts          Prisma client singleton
│   ├── redis.ts             Redis client singleton
│   ├── socket.ts            Socket.io server setup
│   ├── queue.ts             BullMQ queue definitions
│   ├── passport.ts          Passport OAuth strategies
│   ├── cloudinary.ts        Cloudinary setup
│   └── env.ts               Zod-validated environment variables
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── sessions/
│   ├── debates/
│   ├── ai/
│   ├── verdicts/
│   ├── challenges/
│   ├── notifications/
│   ├── moderation/
│   └── observers/
│
├── middleware/
│   ├── authenticate.ts      Verify JWT, attach user to req
│   ├── authorize.ts         Role/ownership checks
│   ├── validate.ts          Zod schema validation wrapper
│   ├── rateLimiter.ts       Per-route and per-user rate limiting
│   ├── errorHandler.ts      Global error handler
│   └── requestLogger.ts     Log every request
│
├── workers/
│   ├── verdictWorker.ts     Processes AI judge jobs from queue
│   ├── expiryWorker.ts      Marks sessions expired after 2 hours
│   └── eloWorker.ts         Recalculates ELO after verdict
│
├── socket/
│   ├── index.ts             Socket.io event registration
│   ├── middleware/
│   │   └── socketAuth.ts    Authenticate socket connections via JWT
│   ├── handlers/
│   │   ├── debateHandler.ts  Message send, turn change, round advance
│   │   ├── timerHandler.ts   Countdown sync, timeout handling
│   │   ├── aiHandler.ts      Fact-check and research query events
│   │   └── observerHandler.ts  Join/leave room, vote events
│   └── rooms.ts             Room naming conventions and helpers
│
├── jobs/
│   ├── verdictJob.ts        Job payload type and enqueue helper
│   ├── expiryJob.ts         Job payload type and enqueue helper
│   └── eloJob.ts            Job payload type and enqueue helper
│
├── utils/
│   ├── apiResponse.ts       Standardised success/error response shapes
│   ├── pagination.ts        Cursor-based pagination helper
│   ├── elo.ts               ELO calculation logic
│   ├── inviteCode.ts        Generate unique invite codes
│   └── hash.ts              Password hashing with bcrypt
│
├── types/
│   ├── express.d.ts         Extend Express Request with req.user
│   └── socket.d.ts          Extend Socket with socket.user
│
├── app.ts                   Express app setup, middleware registration
├── server.ts                HTTP server + Socket.io attach + start
└── prisma/
    └── schema.prisma        Full database schema
```

---

## Module Breakdown

Each module contains exactly these files:

```
module/
  ├── module.routes.ts       Route definitions, middleware chains
  ├── module.controller.ts   Request handling, response shaping
  ├── module.service.ts      Business logic
  ├── module.repository.ts   Prisma queries only
  └── module.schema.ts       Zod validation schemas for requests
```

---

### auth module

**Routes**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh — issue new access token from refresh token
- GET  /api/auth/google — redirect to Google OAuth
- GET  /api/auth/google/callback
- GET  /api/auth/apple — redirect to Apple OAuth
- GET  /api/auth/apple/callback
- POST /api/auth/verify-email
- POST /api/auth/resend-verification

**Service responsibilities**
- Hash password on register
- Issue access token (15 min) and refresh token (30 days) on login
- Store refresh token hash in Redis with user ID
- Revoke refresh token on logout
- Send verification email via Resend
- Record consent_log entry on registration

---

### users module

**Routes**
- GET  /api/users/:username — public profile
- GET  /api/users/me — own profile with private stats
- PATCH /api/users/me — update bio, avatar
- GET  /api/users/me/debates — own debate history
- GET  /api/users/me/badges
- GET  /api/users/me/notifications
- PATCH /api/users/me/notifications/:id/read
- POST /api/users/:id/block
- DELETE /api/users/:id/block
- GET  /api/users/leaderboard — global ELO leaderboard
- GET  /api/users/leaderboard/:categorySlug — topic leaderboard

**Service responsibilities**
- Aggregate profile stats: win rate, average verdict scores, fact-check accuracy
- Resolve ELO tier from numeric rating (Bronze / Silver / Gold / Platinum / Diamond)
- Block/unblock with check for existing block
- Paginate debate history

---

### sessions module

**Routes**
- GET  /api/sessions — home feed, open sessions (paginated, filtered, searched)
- POST /api/sessions — create session (must include 5 sub-questions)
- GET  /api/sessions/:id — session detail
- POST /api/sessions/:id/join — join as opponent
- POST /api/sessions/:id/ready — mark self ready in lobby
- POST /api/sessions/:id/cancel — creator cancels before anyone joined

**Service responsibilities**
- Validate topic and **5 sub-questions** via AI screening on creation
- Transition session status: `open` → `active` (Call Phase) when both participants ready
- Handle the 30-minute call phase (Socket.io timer)
- Transition session status: `active` → `writing` (Submission Phase) when call ends
- Transition session status: `writing` → `completed` once both batches submitted

---

### debates module

*This module handles the transition from the live call to the written submission phase.*

**REST Routes**
- GET  /api/debates/:sessionId/transcript — full message/submission history
- POST /api/debates/:sessionId/batch-submit — Submit 5 written summaries (Batch Phase)
- POST /api/debates/:sessionId/concede — forfeit the debate

**Socket.io Events**
- call:start — starts the 30-minute timer for the discussion phase
- call:end — forces transition to the writing phase
- timer:sync — broadcasts remaining time for both phases

**Service responsibilities**
- Validate the 5-minute writing window
- Enforce batch submission requirements (all 5 questions must have a response)
- Enqueue verdict job once both participants have submitted their batches
- Handle timeout: if a user fails to submit in 5 mins, mark their answers as empty and proceed

---

### ai module

*Handles fact-check and research query requests, called by Socket.io AI handler and optionally via REST.*

**REST Routes** (used for retries if socket drops)
- POST /api/ai/fact-check
- POST /api/ai/research

**Socket.io Events handled in aiHandler**

Inbound:
- ai:fact_check — user highlights a claim
- ai:research — user submits a question

Outbound to room (visible to both participants):
- ai:fact_check_result
- ai:research_result
- ai:request_declined — if opinion question or rate limit hit

**Service responsibilities**
- Check rate limit from Redis before forwarding to Claude API (3 fact-checks, 5 research queries)
- Increment rate limit counter in Redis after each request
- Call Claude API with appropriate system prompt per request type
- For fact-check: parse verdict (Supported / Disputed / Unverifiable), extract sources
- For research: detect if question is opinion-seeking and decline it
- Persist request and result to fact_checks or research_queries table
- Broadcast result to the session room so both parties see it

---

### verdicts module

**Routes**
- GET /api/verdicts/:sessionId — get the verdict for a completed session

**Worker: verdictWorker**

This runs as a background job, not in the request cycle.

Responsibilities:
1. Receive session ID from queue
2. Fetch the 10 batch submissions (5 from each participant) linked to the session's sub-questions.
3. Build a structured prompt for Claude:
   - Provide the main topic and the 5 specific sub-questions.
   - Provide Participant A's 5 answers and Participant B's 5 answers.
   - Instruct Claude to compare them point-by-point.
4. Parse Claude's response:
   - Scores (1-10) for each participant across the 5 criteria.
   - A written summary for each of the 5 points, explaining who won that specific sub-topic.
   - An overall winner/tie declaration.
5. Write verdict and verdict_scores rows to the database.
6. Enqueue elo job.
7. Emit verdict:ready Socket.io event to session room.

---

### challenges module

**Routes**
- POST /api/challenges — send a challenge
- GET  /api/challenges/received — incoming challenges
- GET  /api/challenges/sent — outgoing challenges
- POST /api/challenges/:id/accept — accept, auto-create session
- POST /api/challenges/:id/decline

**Service responsibilities**
- Check block relationship before allowing challenge
- On accept: create a session linked to the challenge, notify challenger
- Challenges expire after 7 days — handled by expiry worker

---

### notifications module

*Used internally by other services — not called directly by the client as a request.*

**Service responsibilities**
- Create notification row
- Send push via OneSignal if user has push enabled
- Send email via Resend for high-priority notifications (verdict ready, account suspension)
- Called by: session service, verdict worker, moderation service, challenge service

---

### moderation module

**Routes** (admin only, requires admin role check)
- GET  /api/moderation/reports — list pending reports
- PATCH /api/moderation/reports/:id — action a report
- POST /api/moderation/users/:id/warn
- POST /api/moderation/users/:id/suspend
- POST /api/moderation/users/:id/ban

**Service responsibilities**
- Content scan on each message (called by debate service before delivery)
- Topic screen on session creation (called by session service)
- Increment warning_count on user
- If warning_count reaches 3: create suspension, set ban_expires_at to +24 hours, notify user
- Permanent ban: set is_banned = true, no expiry
- Write all moderation actions to reports table

---

### observers module

**Routes**
- GET /api/sessions/:id/observers/count — live count

**Socket.io Events handled in observerHandler**

Inbound:
- observer:join — join a session room as spectator
- observer:leave
- observer:vote — cast mid-debate vote

Outbound:
- observer:count_updated — broadcast new count to room
- observer:vote_confirmed — back to the voter only

**Service responsibilities**
- Write session_observers row on join
- Set left_at on leave, update cached observer_count on session
- Validate one vote per observer per session before writing
- Tally and return observer vote results as part of the verdict screen (not before)

---

## Middleware Plan

### authenticate.ts
Extracts Bearer token from Authorization header, verifies JWT signature, fetches user from database, attaches to req.user. Returns 401 if missing or invalid.

### authorize.ts
Higher-order function: authorize('session_creator') checks req.user.id matches the session creator. authorize('participant') checks user is in session_participants. Used on routes that require ownership.

### validate.ts
Wraps a Zod schema. Validates req.body, req.params, or req.query. Returns 422 with field-level errors if validation fails. Controller receives clean, typed data.

### rateLimiter.ts
Per-route limiters using Redis. Examples: login (5 requests / 15 min per IP), session creation (10 / hour per user), AI requests are handled inside the AI service against per-debate counters rather than here.

### errorHandler.ts
Global Express error handler. Catches all thrown errors. Maps known error types (ValidationError, NotFoundError, ForbiddenError) to appropriate HTTP status codes. Returns a consistent JSON shape. Logs unexpected errors to Winston.

### requestLogger.ts
Logs method, path, status, response time on every request. Skips health check endpoint.

---

## Background Jobs Plan

### Verdict Job
- Trigger: debate service enqueues after debate ends
- Worker: reads transcript → calls Claude → writes verdict + scores → emits Socket.io event → enqueues ELO job
- Retry: up to 3 times on Claude API failure, with exponential backoff

### ELO Job
- Trigger: verdict worker enqueues after verdict is written
- Worker: reads verdict winner, both participants' current ELO, calculates new ELO using standard formula, writes elo_before / elo_after / elo_change to session_participants, updates users.global_elo and user_topic_ratings row
- Checks badge eligibility after update (first win, streak, rank milestones) and writes user_badges if earned, sends badge notification

### Expiry Job
- Trigger: session service enqueues with a 2-hour delay when session is created
- Worker: checks if session still has status 'open' — if yes, marks it 'expired', notifies creator
- Also runs a scheduled sweep every 15 minutes to catch any sessions that slipped through

---

## API Response Standard

Every endpoint returns this shape:

**Success**
```
{
  success: true,
  data: { ... },
  meta: { pagination, timestamp }   ← meta is optional
}
```

**Error**
```
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Human-readable message",
    fields: { fieldName: "error detail" }   ← only for validation errors
  }
}
```

---

## Socket.io Room Naming

| Room | Name pattern | Who is in it |
|---|---|---|
| Session room | session:{sessionId} | Both participants + all observers |
| Participant private | user:{userId} | Single user only — for direct notifications |

When a debate ends and the verdict is ready, the verdict:ready event is emitted to session:{sessionId} so both participants and all observers see it simultaneously.

---

## Environment Variables

```
# App
PORT
NODE_ENV

# Database
DATABASE_URL          MySQL connection string for Prisma

# Redis
REDIS_URL

# JWT
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES     15m
JWT_REFRESH_EXPIRES    30d

# OAuth
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
APPLE_CLIENT_ID
APPLE_TEAM_ID
APPLE_KEY_ID
APPLE_PRIVATE_KEY

# Claude AI
ANTHROPIC_API_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# Email
RESEND_API_KEY

# Push
ONESIGNAL_APP_ID
ONESIGNAL_REST_API_KEY

# App URL
CLIENT_URL
```

---

## Implementation Order

Build in this order — each phase is independently runnable.

**Phase 1 — Foundation**
config setup → Prisma schema + migrations → app.ts + server.ts → middleware stack → auth module → users module (read-only)

**Phase 2 — Core Debate Loop**
sessions module → Socket.io setup → debates module (turn logic) → timers → basic moderation (content scan on messages)

**Phase 3 — AI Features**
ai module (fact-check + research) → verdict worker + job queue → verdicts module → ELO worker

**Phase 4 — Social Layer**
challenges module → observers module (spectator mode + voting) → notifications module → badges via ELO worker

**Phase 5 — Admin & Safety**
moderation module (admin routes) → suspension/ban logic → full report workflow
```
