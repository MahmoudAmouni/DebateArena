<div align="center">

# ⚔️ DebateArena

**AI-judged, real-time debate platform.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-MySQL-2D3748?style=flat&logo=prisma&logoColor=white)](https://prisma.io)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io)
[![Claude AI](https://img.shields.io/badge/Claude-AI%20Judge-CC785C?style=flat)](https://anthropic.com)

</div>

---

## What It Does

Two users debate a topic across **5 sub-questions**. Claude AI fact-checks in real time, then delivers a full scored verdict after both sides submit written summaries.

**Flow:** Create Session → Lobby → 30-min Discussion → 5-min Writing Phase → AI Verdict → ELO Update

---

## Stack

| | Frontend | Backend |
|---|---|---|
| **Core** | React 19 + Vite + TypeScript | Node.js + Express + TypeScript |
| **Data** | TanStack Query v5 + Axios | Prisma + MySQL |
| **Real-time** | Socket.io-client | Socket.io |
| **Auth** | JWT via AuthContext | JWT + Passport.js (Google/Apple OAuth) |
| **AI** | — | Anthropic Claude API |
| **Queue** | — | BullMQ + Redis |
| **Styling** | Vanilla CSS + Framer Motion | — |
| **Forms** | React Hook Form + Zod | Zod validation |
| **Uploads** | — | Multer + Cloudinary |
| **Email / Push** | — | Resend + OneSignal |

---

## Monorepo Structure

```
DebateArena/
├── debatearena-client/     # React + Vite frontend
│   └── src/
│       ├── api/            # Typed API modules per feature
│       ├── context/        # AuthContext, DebateContext, NotificationContext
│       ├── socket/         # Socket.io client + hooks
│       ├── components/     # landing/ auth/ sessions/ lobby/ debate/ verdict/ profile/
│       ├── pages/          # Route-level views
│       ├── hooks/          # useAuth, useDebate, useCountdown, useDebounce
│       └── types/          # Shared TypeScript types
│
└── debatearena-server/     # Express API + Socket.io
    └── src/
        ├── modules/        # auth/ users/ sessions/ debates/ ai/ verdicts/ challenges/
        ├── middleware/      # authenticate, authorize, validate, rateLimiter, errorHandler
        ├── socket/         # handlers: debate, timer, ai, observer
        ├── workers/        # verdictWorker, eloWorker, expiryWorker
        ├── config/         # Prisma, Redis, BullMQ, Passport, env
        └── utils/          # apiResponse, elo, pagination, hash, inviteCode
```

---

## AI Roles

| Role | Trigger | Output |
|---|---|---|
| **Moderator** | Session creation | Flags banned/policy-violating topics |
| **Fact-Checker** | During debate (max 3/user) | `supported / disputed / unverifiable` + sources |
| **Judge** | After both submit | Scores 1–10 per criterion × 2 users → winner + summary |

**Verdict Criteria:** Clarity · Logic · Evidence · Responsiveness · Consistency

---

## Database (20 Tables)

`users` · `categories` · `sessions` · `session_participants` · `session_observers` · `debate_rounds` · `messages` · `fact_checks` · `research_queries` · `verdicts` · `verdict_scores` · `observer_votes` · `challenges` · `notifications` · `reports` · `blocks` · `badges` · `user_badges` · `user_topic_ratings` · `consent_logs`

---

## Background Workers (BullMQ)

| Worker | Trigger | Job |
|---|---|---|
| `verdictWorker` | Debate ends | Calls Claude → writes verdict → emits `verdict:ready` → queues ELO |
| `eloWorker` | After verdict | Recalculates global + topic ELO, updates W/L/T, checks badges |
| `expiryWorker` | 2h delay on session create | Expires unjoined sessions, notifies creator |

---

## Key Socket Events

| Event | Direction |
|---|---|
| `debate:timer_sync` | Server → Room every 5s |
| `debate:round_advanced` / `debate:phase_transition` | Server → Room |
| `ai:fact_check_result` / `ai:research_result` | Server → Room (visible to both) |
| `verdict:ready` | Server → Room |
| `observer:count_updated` | Server → Room |
| `notification:new` | Server → `user:{userId}` |

---

## API Response Shape

```json
// Success
{ "success": true, "data": {}, "meta": {} }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {} } }
```

---

## Setup

```bash
# Backend
cd debatearena-server
npm install
cp .env.example .env        # fill all vars
npx prisma migrate dev
npx prisma db seed
npm run dev                 # http://localhost:3000

# Frontend
cd debatearena-client
npm install
cp .env.example .env.local  # set VITE_API_URL + VITE_SOCKET_URL
npm run dev                 # http://localhost:5173
```

---

## Required Environment Variables

```env
# Backend
DATABASE_URL=mysql://root:@localhost:3306/debatearena
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ANTHROPIC_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=
CLIENT_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## ELO Tiers

`Bronze < 1100` · `Silver < 1300` · `Gold < 1600` · `Platinum < 2000` · `Diamond ≥ 2000`

---

## Design Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0B0F` | Page background |
| `--surface-1` | `#111318` | Cards / panels |
| `--accent` | `#C9A84C` | Gold — CTAs, winners |
| `--text-primary` | `#F0EDE8` | Warm white headings |
| `--win` / `--loss` | `#4CAF82` / `#E05C5C` | Outcome states |

**Fonts:** `Playfair Display` (headings) · `DM Sans` (body) · `DM Mono` (numbers/timers)
