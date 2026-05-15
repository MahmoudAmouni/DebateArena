# DebateArena — Step-by-Step Backend Implementation Plan

---

## Setup Steps

**Step 1 — Initialize the project**
Create the Node.js project. Install all dependencies: express, prisma, @prisma/client, socket.io, jsonwebtoken, bcryptjs, passport, passport-google-oauth20, zod, bullmq, ioredis, multer, cloudinary, resend, winston, dotenv, cors, helmet, cookie-parser. Install dev dependencies: typescript, ts-node, nodemon, @types packages.

**Step 2 — Configure environment variables**
Create .env file with all variables: PORT, NODE_ENV, DATABASE_URL (MySQL), REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ANTHROPIC_API_KEY, CLOUDINARY credentials, RESEND_API_KEY, ONESIGNAL credentials, CLIENT_URL.

Create src/config/env.ts — use Zod to parse and validate process.env at startup. If any required variable is missing the app throws immediately with a clear message before anything starts.

**Step 3 — Set up Prisma and connect to MySQL**
Run prisma init. Set the provider to mysql in schema.prisma and point DATABASE_URL at XAMPP's MySQL instance. Create src/config/database.ts as a singleton that exports one PrismaClient instance reused across the whole app.

**Step 4 — Set up Redis**
Create src/config/redis.ts. Export a single ioredis client instance. On connection error log it clearly. Redis is used by the queue workers and rate limiters — everything shares this one client.

**Step 5 — Set up the Express app**
Create src/app.ts. Register in order: helmet (security headers), cors (allow CLIENT_URL origin with credentials), cookie-parser, express.json(), requestLogger middleware, all route modules, and finally the global errorHandler middleware at the bottom.

**Step 6 — Create the HTTP server and attach Socket.io**
Create src/server.ts. Create an HTTP server from the Express app. Attach Socket.io to it with cors config matching the app. Import and run the Socket.io event registration from src/socket/index.ts. Start listening on PORT.

---

## Database Tables — Prisma Schema Steps

**Step 7 — Write the users table**
Fields: id (uuid, default cuid), username (unique), email (unique), passwordHash (nullable), oauthProvider (nullable), oauthId (nullable), avatarUrl (nullable), bio (nullable), globalElo (default 1000), totalWins, totalLosses, totalTies (all default 0), factCheckAccuracy (nullable decimal), isBanned (default false), banExpiresAt (nullable), warningCount (default 0), isVerified (default false), ageConfirmed (default false), createdAt, lastActiveAt (nullable).

**Step 8 — Write the categories table**
Fields: id, name (unique), slug (unique), isActive (default true). Seed this table immediately after migration with the 7 fixed categories: Politics, Science, Philosophy, Technology, Sports, Culture, Other.

**Step 9 — Write the user_topic_ratings table**
Fields: id, userId (FK → users), categoryId (FK → categories), elo (default 1000), wins, losses, ties, debatesCount (all default 0). Add a unique constraint on (userId, categoryId) so there is exactly one rating row per user per category.

**Step 10 — Write the sessions table**
Fields: id, creatorId (FK → users), categoryId (FK → categories), title (max 120), description (nullable), creatorStance, format (enum: quick/standard/extended), totalRounds, visibility (enum: public/invite_only), inviteCode (unique, nullable), status (enum: open/active/completed/expired/cancelled, default open), isRanked (default true), allowObservers (default true), observerCount (default 0), scheduledAt (nullable), expiresAt, startedAt (nullable), endedAt (nullable), endReason (enum: completed/conceded/timeout/disconnect/cancelled, nullable), aiScreened (default false), flagged (default false), createdAt.

**Step 11 — Write the session_participants table**
Fields: id, sessionId (FK → sessions), userId (FK → users), role (enum: creator/joiner), stance, isAnonymous (default false), isReady (default false), extensionsUsed (default 0), factChecksUsed (default 0), researchQueriesUsed (default 0), conceded (default false), disconnected (default false), eloBefore (nullable), eloAfter (nullable), eloChange (nullable), joinedAt. Unique constraint on (sessionId, userId).

**Step 12 — Write the session_observers table**
Fields: id, sessionId (FK → sessions), userId (FK → users, nullable — null means anonymous guest), joinedAt, leftAt (nullable).

**Step 13 — Write the debate_rounds table**
Fields: id, sessionId (FK → sessions), roundNumber, roundType (enum: opening/rebuttal/closing), status (enum: pending/active/completed, default pending), activeParticipantId (FK → session_participants), turnDurationSeconds, startedAt (nullable), endedAt (nullable), timedOut (default false).

**Step 14 — Write the messages table**
Fields: id, sessionId (FK → sessions), roundId (FK → debate_rounds), participantId (FK → session_participants), content, wordCount, isFlagged (default false), flaggedReason (nullable), sentAt.

**Step 15 — Write the fact_checks table**
Fields: id, sessionId (FK → sessions), requestedBy (FK → session_participants), messageId (FK → messages, nullable), claimText, verdict (enum: supported/disputed/unverifiable, nullable), explanation (nullable), sources (Json nullable — array of objects with title and url), processingMs (nullable), requestedAt, completedAt (nullable).

**Step 16 — Write the research_queries table**
Fields: id, sessionId (FK → sessions), requestedBy (FK → session_participants), queryText, responseText (nullable), sources (Json nullable), wasDeclined (default false), declinedReason (nullable), processingMs (nullable), requestedAt, completedAt (nullable).

**Step 17 — Write the verdicts table**
Fields: id, sessionId (FK → sessions, unique), winnerParticipantId (FK → session_participants, nullable — null means tie), isTie (default false), summary (long text), processingMs (nullable), generatedAt.

**Step 18 — Write the verdict_scores table**
Fields: id, verdictId (FK → verdicts), participantId (FK → session_participants), criterion (enum: clarity/logic/evidence/responsiveness/consistency), score (decimal 4,1 between 1 and 10), explanation (nullable). Unique constraint on (verdictId, participantId, criterion) — exactly one score row per person per criterion.

**Step 19 — Write the observer_votes table**
Fields: id, sessionId (FK → sessions), observerId (FK → session_observers), votedForParticipantId (FK → session_participants), votedAt. Unique constraint on (sessionId, observerId) — one vote per observer per session.

**Step 20 — Write the challenges table**
Fields: id, challengerId (FK → users), challengedId (FK → users), topic, challengerStance, categoryId (FK → categories), message (nullable), status (enum: pending/accepted/declined/expired, default pending), sessionId (FK → sessions, nullable — set when accepted), expiresAt (created_at + 7 days), createdAt, respondedAt (nullable).

**Step 21 — Write the notifications table**
Fields: id, userId (FK → users), type (enum: session_joined/challenge_received/verdict_ready/session_expiring/debate_starting/warning_issued/account_suspended), title, body, referenceId (uuid nullable), referenceType (nullable string), isRead (default false), pushSent (default false), createdAt.

**Step 22 — Write the reports table**
Fields: id, reporterId (FK → users), reportedUserId (FK → users), sessionId (FK → sessions, nullable), messageId (FK → messages, nullable), reason (enum: hate_speech/harassment/threats/spam/banned_topic/other), details (nullable), status (enum: pending/reviewed/actioned/dismissed, default pending), reviewedBy (nullable uuid), reviewedAt (nullable), createdAt.

**Step 23 — Write the blocks table**
Fields: id, blockerId (FK → users), blockedId (FK → users), createdAt. Unique constraint on (blockerId, blockedId).

**Step 24 — Write the badges table**
Fields: id, slug (unique), name, description, iconUrl (nullable). Seed with initial badges: first_win, five_streak, ten_streak, fact_check_champion, top_100_global, thousand_spectators, perfect_score.

**Step 25 — Write the user_badges table**
Fields: id, userId (FK → users), badgeId (FK → badges), earnedAt. Unique constraint on (userId, badgeId).

**Step 26 — Write the consent_logs table**
Fields: id, userId (FK → users), consentType (enum: ai_transcription/data_processing/marketing), granted (boolean), sessionId (FK → sessions, nullable), ipAddress, userAgent (nullable), createdAt. This table is append-only — never update rows, always insert a new one.

**Step 27 — Run migration and add indexes**
Run prisma migrate dev. Then add the following indexes manually or via Prisma: sessions on (status, createdAt), sessions on (categoryId, status), sessions on (creatorId), sessions on (expiresAt), messages on (sessionId, sentAt), notifications on (userId, isRead), challenges on (challengedId, status), blocks on (blockerId), user_topic_ratings on (userId, categoryId), verdict_scores on (verdictId).

---

## Utilities

**Step 28 — Create apiResponse utility**
Create src/utils/apiResponse.ts. Two functions: success(data, meta?) returns { success: true, data, meta } and error(code, message, fields?) returns { success: false, error: { code, message, fields } }. Every controller uses these — never build the response shape manually.

**Step 29 — Create pagination utility**
Create src/utils/pagination.ts. Takes a Prisma result array, a cursor field name, and a page size. Returns the data slice and a nextCursor value. Used by sessions feed, debate history, notifications, and leaderboard routes.

**Step 30 — Create ELO utility**
Create src/utils/elo.ts. Implements the standard ELO formula. Takes playerRating, opponentRating, and outcome (win/loss/tie). Returns the new rating. K-factor is 32 for players under 10 debates, 24 for 10–30 debates, 16 for 30+. This function is pure — no database access.

**Step 31 — Create hash utility**
Create src/utils/hash.ts. Two functions: hashPassword(plain) uses bcrypt with salt rounds 12 and returns the hash. comparePassword(plain, hash) returns a boolean. Never call bcrypt directly outside this file.

**Step 32 — Create inviteCode utility**
Create src/utils/inviteCode.ts. Generates a random 10-character alphanumeric string. After generating, checks the database to confirm it does not already exist on another session. Retries if collision found. Returns the unique code.

---

## Middleware

**Step 33 — Create requestLogger middleware**
Create src/middleware/requestLogger.ts. Uses Winston to log method, path, status code, and response time in milliseconds on every completed request. Skip logging for GET /health.

**Step 34 — Create authenticate middleware**
Create src/middleware/authenticate.ts. Extracts the Bearer token from the Authorization header. Verifies it using JWT_ACCESS_SECRET. If valid, fetches the user from the database by the id in the token payload and attaches the full user object to req.user. If the token is missing, malformed, expired, or the user no longer exists, responds with 401. All protected routes use this middleware.

**Step 35 — Create authorize middleware**
Create src/middleware/authorize.ts. A higher-order function that takes a role string and returns a middleware. Roles: 'session_creator' checks that req.user.id matches the session's creatorId fetched from the database using the sessionId param. 'participant' checks that the user has a row in session_participants for that session. 'admin' checks a role field on the user. Returns 403 if the check fails.

**Step 36 — Create validate middleware**
Create src/middleware/validate.ts. Takes a Zod schema and a target ('body', 'params', or 'query'). Runs schema.safeParse on the relevant part of the request. If it fails, calls next with a ValidationError containing the formatted field errors. If it passes, replaces the target on req with the parsed (typed, clean) data and calls next.

**Step 37 — Create rateLimiter middleware**
Create src/middleware/rateLimiter.ts. Uses Redis to count requests per key (IP or user ID) within a time window. Returns a factory function: rateLimiter(key, maxRequests, windowSeconds). Key is a function that receives req and returns a string — for example (req) => req.ip for IP-based or (req) => req.user.id for user-based. Returns 429 with a Retry-After header when the limit is exceeded.

**Step 38 — Create errorHandler middleware**
Create src/middleware/errorHandler.ts. The global Express error handler — must be registered last in app.ts. Maps error types to status codes: ValidationError → 422, NotFoundError → 404, ForbiddenError → 403, UnauthorizedError → 401, ConflictError → 409, everything else → 500. Logs unexpected 500 errors with full stack trace using Winston. Always responds using the apiResponse.error format. Never exposes internal stack traces to the client in production.

---

## Auth Module

**Step 39 — Create auth Zod schemas**
Create src/modules/auth/auth.schema.ts. Define: registerSchema (username, email, password min 8 chars, ageConfirmed boolean must be true), loginSchema (email, password), refreshSchema (refreshToken string).

**Step 40 — Create auth repository**
Create src/modules/auth/auth.repository.ts. Functions: findUserByEmail(email), findUserByUsername(username), createUser(data), saveRefreshToken(userId, tokenHash) stores in Redis with key refresh:{userId} and 30-day expiry, getRefreshToken(userId) returns stored hash, deleteRefreshToken(userId) removes it.

**Step 41 — Create auth service**
Create src/modules/auth/auth.service.ts.

register(data): Check username and email are not already taken — throw ConflictError if either exists. Hash the password. Create the user row. Create consent_log rows for data_processing consent. Generate and send a verification email via Resend. Return the new user without the password hash.

login(email, password): Find user by email — throw 401 if not found. Compare password using hash utility — throw 401 if wrong. If user is banned and banExpiresAt is in the future, throw 403 with a message showing when the ban expires. If permanently banned, throw 403. Generate access token (JWT signed with JWT_ACCESS_SECRET, expires in 15 min, payload contains userId and email). Generate refresh token (random UUID, store its hash in Redis, return the raw token). Return both tokens.

refreshTokens(rawRefreshToken): Hash the incoming token. Find the userId it belongs to by looking it up in Redis. Fetch the user. If user is banned, throw 403. Issue a new access token. Rotate the refresh token: delete the old one from Redis, store the new one. Return both new tokens.

logout(userId): Delete the refresh token from Redis.

**Step 42 — Create auth controller**
Create src/modules/auth/auth.controller.ts. One function per route. Each function calls the service, then responds using apiResponse.success or lets the error propagate to errorHandler. The refresh token is set as an httpOnly cookie in addition to being returned in the body. The controller does no logic — only calls service and shapes the response.

**Step 43 — Create auth routes**
Create src/modules/auth/auth.routes.ts. Register: POST /register with validate(registerSchema), POST /login with rateLimiter by IP (5 per 15 min), POST /logout with authenticate, POST /refresh, GET /google, GET /google/callback, POST /verify-email, POST /resend-verification.

---

## Users Module

**Step 44 — Create users Zod schemas**
Define: updateProfileSchema (bio optional, avatarUrl optional).

**Step 45 — Create users repository**
Functions: findByUsername(username), findById(id), updateUser(id, data), getDebateHistory(userId, cursor, limit) — paginated query on session_participants joined with sessions and verdicts, getUserBadges(userId), getUserTopicRatings(userId), getLeaderboard(cursor, limit) — ordered by globalElo desc, getCategoryLeaderboard(categorySlug, cursor, limit).

**Step 46 — Create users service**
getPublicProfile(username): Fetch user. Calculate win rate. Resolve ELO tier. Fetch topic ratings, badges, and recent 5 public debates. Return assembled profile object.

getOwnProfile(userId): Same as above but includes private debates and all stats including factCheckAccuracy and average verdict scores.

getAverageVerdictScores(userId): Query verdict_scores joined through session_participants to get all scores for this user. Group by criterion. Average each one. Return an object with clarity, logic, evidence, responsiveness, consistency averages.

resolveEloTier(elo): Pure function. Bronze < 1100, Silver < 1300, Gold < 1600, Platinum < 2000, Diamond >= 2000.

blockUser(blockerId, blockedId): Check they are not the same user. Check block does not already exist. Create the block row.

unblockUser(blockerId, blockedId): Delete the block row if it exists.

**Step 47 — Create users controller and routes**
Routes: GET /me, GET /:username, PATCH /me (authenticate + validate), GET /me/debates, GET /me/badges, GET /me/notifications, PATCH /me/notifications/:id/read, POST /:id/block (authenticate), DELETE /:id/block (authenticate), GET /leaderboard, GET /leaderboard/:categorySlug.

---

## Sessions Module

**Step 48 — Create sessions Zod schemas**
createSessionSchema: title (string max 120), creatorStance (string), description (optional string), categoryId (uuid), format (enum quick/standard/extended), visibility (enum public/invite_only), scheduledAt (optional datetime), isRanked (optional boolean default true).

**Step 49 — Create sessions repository**
Functions: createSession(data), findById(id), findOpenSessions(filters, cursor, limit) — filters include categoryId, search keyword against title, status = open, findByCreator(userId), updateStatus(id, status, extra?), setStartedAt(id), setEndedAt(id, reason), incrementObserverCount(id), decrementObserverCount(id).

**Step 50 — Create sessions service**
createSession(userId, data): Call AI screening service to check the topic title — if flagged throw a ForbiddenError with the reason. Generate invite code if visibility is invite_only using inviteCode utility. Calculate expiresAt as now + 2 hours if not scheduled. Set totalRounds based on format (quick=3, standard=5, extended=8). Create session row. Create a session_participants row for the creator. Enqueue an expiry job with a 2-hour delay. Return the session.

screenTopic(title): Call Claude API with a system prompt instructing it to return only JSON in the shape { flagged: boolean, reason: string | null }. Check the title against the banned topic policy. Parse the response. Return the result. If the API call fails, default to flagged: false and log the error — do not block session creation on an AI failure.

joinSession(userId, sessionId, stance): Fetch session — throw NotFoundError if not found, throw ConflictError if status is not open. Check the user is not the creator. Check there is no block in either direction between the two users — throw ForbiddenError if blocked. Create session_participants row for the joiner with role joiner. Update session status to active — not yet, wait for both to press ready. Send a notification to the creator that someone joined. Return the session and participant row.

markReady(userId, sessionId): Find the participant row for this user. Set isReady to true. Check if the other participant is also ready. If both are ready: update session status to active, set startedAt to now, create all debate_rounds rows for this session (one per round type per format), set the first round to active, emit Socket.io event debate:started to the session room. Return ready status.

createRoundsForSession(sessionId, format, creatorParticipantId, joinerParticipantId): Build the full list of rounds based on format. Quick: opening (creator), opening (joiner), rebuttal (creator), rebuttal (joiner), closing (creator), closing (joiner) — but collapsed to 3 rounds means one opening each and one shared closing. Standard is 5 rounds alternating. Extended is 8. Set turnDurationSeconds per round type: opening = 300s, rebuttal = 180s, closing = 240s. All start as pending except the first which is active.

**Step 51 — Create sessions controller and routes**
Routes: GET / (feed, public), POST / (authenticate + validate), GET /:id, GET /:id/invite (authenticate + authorize session_creator), POST /:id/join (authenticate + validate stance), POST /:id/ready (authenticate + authorize participant), POST /:id/cancel (authenticate + authorize session_creator), GET /scheduled.

---

## Debates Module

**Step 52 — Create debates repository**
Functions: findRound(roundId), findActiveRound(sessionId), findParticipant(sessionId, userId), getTranscript(sessionId) — all messages ordered by sentAt, createMessage(data), markRoundCompleted(roundId), activateNextRound(sessionId, currentRoundNumber), findSession(id).

**Step 53 — Create debates service**
sendMessage(userId, sessionId, content): Find the participant row. Find the active round. Verify it is this user's turn by checking the round's activeParticipantId matches this participant's id — throw ForbiddenError if not their turn. Calculate word count. Call content moderation service — if flagged, increment user's warningCount, save the message as flagged anyway (so the full transcript is preserved), and emit the message to the room with a flagged indicator. Create the message row. Emit debate:message_received to the session room via Socket.io. Return the message.

handleTurnEnd(sessionId, roundId): Mark the current round as completed. Find the next pending round for this session. If one exists, set it to active and emit debate:round_advanced to the session room. If no more rounds exist, call endDebate.

handleTimeout(sessionId, roundId): Mark timedOut as true on the round. Proceed with handleTurnEnd — a timeout counts as ending the turn, not ending the debate, unless it is the final round.

endDebate(sessionId, reason): Set session status to completed, set endedAt to now, set endReason. Emit debate:debate_ended to the session room. Enqueue a verdict job with the sessionId. Update both participant eloBefore snapshots from their current globalElo.

concede(userId, sessionId): Find participant. Set conceded to true. Call endDebate with reason 'conceded'. The non-conceding participant will be marked winner in the verdict worker.

requestExtension(userId, sessionId): Find participant. Check extensionsUsed is 0 — throw ConflictError if already used one. Increment extensionsUsed to 1. Find the active round and add 120 seconds to its turnDurationSeconds. Emit debate:extension_granted to the session room with the new duration.

**Step 54 — Create debates controller and routes**
Routes: GET /:sessionId/transcript (authenticate + authorize participant), POST /:sessionId/concede (authenticate + authorize participant), POST /:sessionId/extend (authenticate + authorize participant).

---

## Socket.io Setup

**Step 55 — Create Socket.io auth middleware**
Create src/socket/middleware/socketAuth.ts. Extracts the token from socket.handshake.auth.token. Verifies it the same way as the HTTP authenticate middleware. Attaches the user object to socket.user. Rejects the connection with an auth error if the token is invalid.

**Step 56 — Create debate socket handler**
Create src/socket/handlers/debateHandler.ts. On debate:message event: call debates service sendMessage, then emit the result to the room. On debate:typing event: emit debate:typing to the room excluding the sender. On debate:turn_end event: call debates service handleTurnEnd. On debate:concede event: call debates service concede. On debate:extend event: call debates service requestExtension.

**Step 57 — Create timer socket handler**
Create src/socket/handlers/timerHandler.ts. When a round becomes active, start a server-side interval that emits debate:timer_sync to the session room every 5 seconds with the remaining seconds. Store the interval reference in a Map keyed by roundId so it can be cleared when the round ends. When turnDurationSeconds reaches 0, call debates service handleTimeout and clear the interval. Timers must be authoritative on the server — never trust the client's timer.

**Step 58 — Create AI socket handler**
Create src/socket/handlers/aiHandler.ts. On ai:fact_check: call AI service factCheck, emit ai:fact_check_result to the room. On ai:research: call AI service research, emit ai:research_result to the room or ai:request_declined if the AI refused.

**Step 59 — Create observer socket handler**
Create src/socket/handlers/observerHandler.ts. On observer:join: create session_observers row, call sessions repository incrementObserverCount, emit observer:count_updated to the room. On observer:leave: set leftAt on the observer row, call decrementObserverCount, emit observer:count_updated. On observer:vote: call observers service castVote which checks the one-vote-per-observer constraint, creates the observer_votes row, emits observer:vote_confirmed back to the sender only.

**Step 60 — Register all Socket.io events**
Create src/socket/index.ts. On connection: run socketAuth middleware. Join the user to their personal room user:{userId}. Register all handlers. On disconnect: call observerHandler cleanup to set leftAt and update observer count.

---

## AI Module

**Step 61 — Create AI service**
Create src/modules/ai/ai.service.ts.

factCheck(sessionId, participantId, claimText, messageId): Check the participant's factChecksUsed count in the database — if already 3, throw a rate limit error with message 'Fact-check limit reached (3 per debate)'. Increment factChecksUsed. Create a fact_checks row with null verdict (pending). Call Claude API with a system prompt that instructs it to return only JSON in the shape { verdict: 'supported' | 'disputed' | 'unverifiable', explanation: string (2 sentences max), sources: [{ title: string, url: string }] (max 3 items) }. Parse the response. Update the fact_checks row with the result and completedAt. Return the full result.

research(sessionId, participantId, queryText): Check researchQueriesUsed — if already 5, throw rate limit error. Call Claude API with a system prompt that says: you are a neutral research assistant. If the question asks for your opinion or asks which option is better, respond with JSON { declined: true, reason: 'Opinion questions cannot be answered' }. Otherwise respond with JSON { declined: false, response: string, sources: [{ title, url }] }. Parse the response. If declined: write the row with wasDeclined true. If not declined: write the row with the response. Increment researchQueriesUsed. Return the result.

buildFactCheckPrompt(claimText): Returns the full system + user prompt string for the Claude API call. Kept in a separate function so it can be adjusted without touching the service logic.

buildResearchPrompt(queryText): Same pattern for research prompts.

**Step 62 — Create AI routes**
Routes: POST /fact-check (authenticate + authorize participant) and POST /research (authenticate + authorize participant). These REST endpoints exist as a fallback for when the Socket.io connection drops mid-debate. They call the same service functions.

---

## Verdicts Module

**Step 63 — Create verdict worker**
Create src/workers/verdictWorker.ts. This is a BullMQ worker that processes verdict jobs.

Process function for each job:
1. Fetch the full session including both participants and their stances.
2. Fetch all messages ordered by sentAt.
3. Fetch all fact_checks with their verdicts.
4. Fetch all research_queries with their responses.
5. Build the full transcript as a structured string with speaker labels, fact-check results inline, and research query results inline.
6. Call Claude API with the judge system prompt. The prompt instructs Claude to score each participant on five criteria (clarity, logic, evidence, responsiveness, consistency) each from 1 to 10, explain each score in one sentence, write a 3–5 paragraph plain-language summary of the debate, and declare a winner or tie. Response must be valid JSON in a defined shape.
7. Parse the response. Determine winner: if one participant's total is more than 3 points higher, they win. Otherwise it is a tie.
8. If one participant conceded, override the AI winner and mark the non-conceding participant as winner regardless of scores. Still generate the summary.
9. Write the verdict row. Write 10 verdict_scores rows (5 criteria × 2 participants).
10. Emit verdict:ready to the Socket.io session room with the full verdict payload.
11. Enqueue the ELO job.
12. Enqueue badge check job.

**Step 64 — Create verdict repository and routes**
Repository: createVerdict(data), createVerdictScores(data[]), findBySessionId(sessionId) joined with scores. Route: GET /api/verdicts/:sessionId (authenticate + authorize participant or observer). Observers can view verdicts of sessions they watched.

---

## ELO Module (Worker)

**Step 65 — Create ELO worker**
Create src/workers/eloWorker.ts. Processes ELO jobs from the queue.

Process function:
1. Fetch the verdict and both session_participants including their eloBefore.
2. Determine outcome for each participant: win, loss, or tie.
3. Count how many total ranked debates each participant has — use this to select the K-factor (32 / 24 / 16).
4. Call elo utility to calculate new global ELO for each participant.
5. Update session_participants with eloAfter and eloChange.
6. Update users.globalElo for both.
7. Find or create the user_topic_ratings row for each participant for this session's category.
8. Run the ELO calculation again using topic-specific ELO values.
9. Update user_topic_ratings for both participants.
10. Update totalWins / totalLosses / totalTies on users.
11. Update wins / losses / ties on user_topic_ratings.

---

## Challenges Module

**Step 66 — Create challenges Zod schemas**
createChallengeSchema: challengedId (uuid), topic (string max 120), challengerStance (string), categoryId (uuid), message (optional string max 300).

**Step 67 — Create challenges repository**
Functions: createChallenge(data), findById(id), findReceivedChallenges(userId) — status pending and not expired, findSentChallenges(userId), updateStatus(id, status, sessionId?).

**Step 68 — Create challenges service**
sendChallenge(challengerId, data): Check block in either direction — throw ForbiddenError if blocked. Check challenged user exists. Create challenge row with expiresAt = now + 7 days. Send notification to challenged user. Return the challenge.

acceptChallenge(userId, challengeId): Fetch challenge — verify userId matches challengedId. Verify status is pending and not expired. Call sessions service createSession internally to make the session, using the challenge topic and stance. Pass the challenger as the creator participant and the acceptor as the joiner participant, skipping the normal join flow since both parties are known. Update challenge status to accepted and set sessionId. Notify the challenger. Return session.

declineChallenge(userId, challengeId): Verify userId matches challengedId. Update status to declined. Notify the challenger. Return the updated challenge.

**Step 69 — Create challenges controller and routes**
Routes: POST / (authenticate + validate), GET /received (authenticate), GET /sent (authenticate), POST /:id/accept (authenticate), POST /:id/decline (authenticate).

---

## Notifications Module

**Step 70 — Create notifications service**
Create src/modules/notifications/notifications.service.ts. Single function: send(userId, type, title, body, referenceId?, referenceType?). Creates the notification row. Fetches user's push token if they have one — sends via OneSignal REST API. For high-priority types (verdict_ready, account_suspended), also sends an email via Resend. This function is called by other services — it is never called by a route directly.

---

## Moderation Module

**Step 71 — Create moderation service**
Create src/modules/moderation/moderation.service.ts.

scanMessage(content): Call Claude API or a keyword list check. Returns { flagged: boolean, reason: string | null }. Keep this fast — it runs on every message before delivery.

handleViolation(userId, sessionId, messageId, reason): Increment user's warningCount. If warningCount reaches 3: set banExpiresAt to now + 24 hours, send account_suspended notification. Create a report row with status actioned.

submitReport(reporterId, data): Create report row with status pending. 

reviewReport(adminId, reportId, action): Set status to actioned or dismissed. Set reviewedBy and reviewedAt. If actioned: call handleViolation on the reported user.

**Step 72 — Create moderation routes**
Routes (all require admin role via authorize middleware): GET /reports, PATCH /reports/:id, POST /users/:id/warn, POST /users/:id/suspend, POST /users/:id/ban. Also a public route: POST /report (authenticate) for users to submit reports from within the debate UI.

---

## Observers Module

**Step 73 — Create observers service**
Create src/modules/observers/observers.service.ts.

castVote(observerId, sessionId, votedForParticipantId): Check the session is still active. Find the observer_votes row for this observer and session — if it exists throw ConflictError (already voted). Verify the votedForParticipantId belongs to this session. Create the observer_votes row. Return confirmation.

getVoteTally(sessionId): Count observer_votes grouped by votedForParticipantId. Return totals for each participant. This is called only after the verdict is generated — never during the debate.

---

## Expiry Worker

**Step 74 — Create expiry worker**
Create src/workers/expiryWorker.ts. Processes expiry jobs. Each job contains a sessionId. Fetch the session. If status is still 'open', update it to 'expired'. Notify the creator that their session expired with no opponent. Also runs a scheduled sweep every 15 minutes: query all sessions where status = open and expiresAt < now, mark them all expired in one batch query, notify each creator.

---

## Badge Worker

**Step 75 — Create badge checking logic**
Create src/workers/badgeWorker.ts or fold into eloWorker. After ELO updates, run checks:

- first_win: check totalWins just became 1.
- five_streak: track current win streak on the user — check if it just hit 5. Track streak in a separate column or compute from recent debate history.
- fact_check_champion: check if factCheckAccuracy is above 90% and user has done at least 10 debates.
- top_100_global: check if user's globalElo rank is within the top 100 — run a count query.
- perfect_score: check if any verdict_score row for this user has all five criteria above 9.0.
- thousand_spectators: after each debate, sum total observer counts across all the user's sessions.

For each badge earned: check the user does not already have it (unique constraint on user_badges), insert the row, send a notification.

---

## Final Steps

**Step 76 — Add health check route**
GET /health returns { status: 'ok', timestamp } with no authentication. Used by deployment platforms to verify the server is running.

**Step 77 — Add graceful shutdown**
In server.ts, listen for SIGTERM and SIGINT. On signal: stop accepting new connections, wait for active connections to finish, close the Prisma client, close the Redis client, shut down BullMQ workers cleanly. This prevents data corruption if the server restarts mid-debate.

**Step 78 — Set up Winston logging**
Create src/config/logger.ts. In development: log to console with colorized output and include stack traces. In production: log to files (combined.log and error.log) in JSON format with timestamps. Log levels: error, warn, info, debug. Import and use this logger everywhere instead of console.log.

**Step 79 — Write Prisma seed file**
Create prisma/seed.ts. Seeds the categories table with the 7 categories. Seeds the badges table with the 7 badges. Run with prisma db seed. Safe to run multiple times — use upsert so it does not create duplicates.

**Step 80 — Test every route manually**
Use a tool like Postman or Insomnia. Test in this order: register → verify email → login → create session → join session → mark ready (both users) → send messages alternating → request a fact-check → end debate → poll for verdict → check profile stats updated. Fix anything that breaks before moving to Socket.io testing. Then test real-time flows with two browser tabs.
