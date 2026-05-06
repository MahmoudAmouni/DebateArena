# DebateArena — Project Description

---

## What It Is

DebateArena is a web platform where two users debate any topic in a structured, turn-based format. An AI system fact-checks claims in real time during the debate, and once it ends, delivers a full scored verdict — covering who argued more clearly, who used better evidence, and who failed to respond. The platform does not decide who is factually "right" on opinion topics. It scores how well each person argued, the same way a human debate judge would.

---

## The Problem It Solves

Online debates are chaotic — no structure, no time limits, no accountability, no way to know who actually "won." DebateArena turns a debate into a fair, structured event with a credible outcome both sides can respect.

---

## User Flow

**1. Register & Onboard**
User signs up with email or Google/Apple OAuth. They set a display name, profile photo, and short bio. A quick 30-second onboarding explains how the debate format and scoring works. Explicit consent for AI transcription/recording is collected here.

**2. Home Feed**
The main screen shows all open sessions. Users can filter by category or search by keyword. Each session card shows the main topic and the 5 specific sub-questions that will be debated.

**3. Create a Session**
The user writes a main topic title, states their position, and **defines 5 specific sub-questions (rounds)** for the debate. They select a category and visibility. The session expires after 2 hours if no one joins.

**4. Join & Lobby**
The joining user reads the topic and the 5 sub-questions, declares their position, and enters the lobby. Both must press Ready to begin.

**5. Live Debate — Phase 1: Discussion (30 Minutes)**
Once both are ready, a 30-minute live call begins. Both users discuss the 5 sub-questions freely. A timer tracks the 30-minute limit. This is the "Evidence & Argument" phase.

**6. Live Debate — Phase 2: Submission (5 Minutes)**
After the call ends (or is ended early), the "Writing Phase" begins. Both users have 5 minutes to write their final arguments/summaries for **each of the 5 sub-questions**. These are submitted as a batch to the AI Judge.

**7. Verdict Screen**
After both users submit their written answers, the AI Judge reads the 10 total responses (5 from each user). It compares them point-by-point for each sub-question and produces a structured verdict within 20 seconds. Each debater receives scores out of 10 for:

- **Clarity** — how structured and readable their written points were
- **Logic** — quality of reasoning for each sub-question
- **Evidence** — use of facts and cited sources in the summaries
- **Responsiveness** — how well they addressed the core of each sub-question
- **Consistency** — no contradictions across the 5 points

The higher total score wins. Both users see the verdict simultaneously.

**8. Profile & Stats**
The debate archives to both users' profiles. Global ELO and topic-specific ELO ratings update based on the outcome and opponent strength.

---

## AI System — Three Distinct Modes

**AI Moderator** — Ensures the 5 sub-questions are relevant to the main topic during session creation.

**AI Judge** — Fully automated after the submission phase ends. Reads the 10 written responses (5 per user). Scores each debater on the 5 criteria above and writes a summary for each of the 5 sub-questions, explaining who won each specific point.

---

---

## Social & Engagement Features

**Spectator Mode** — Any user can watch a live public debate in real time. Spectators can vote on who they think is winning mid-debate — results are hidden from participants and revealed alongside the AI verdict.

**Direct Challenges** — Users can challenge a specific person: "I challenge @username to debate [topic]." The challenge appears on the recipient's profile and notification feed.

**Scheduled Debates** — Both parties agree on a future time. The session is listed publicly as upcoming so spectators can set reminders.

**ELO Ranking** — Global rating plus a separate rating per topic category. Winning against a higher-rated opponent gives more ELO. Losing to a lower-rated one loses more. Displayed as a tier: Bronze, Silver, Gold, Platinum, Diamond.

**Shareable Verdict Card** — A visual summary card showing the topic, scores, and winner. One-tap share to X, Instagram, or WhatsApp. Every shared card is organic growth for the platform.

**Notifications** — Push and in-app. Triggered by: someone joining your session, a challenge received, your verdict being ready, a scheduled debate starting, a session about to expire.

---

## User Profile

Each profile shows:
- Global ELO rating and tier badge
- Topic-specific ratings (e.g. "Expert in Science · #47 globally")
- Win/loss record and win rate per category
- Average AI judge scores across all debates (shows whether logic or clarity is your strength)
- Fact-check accuracy rate — percentage of the user's stated facts that checked out
- Full debate archive with AI verdicts, togglable public/private per debate
- Achievement badges: first win, 5-debate streak, fact-check champion, 1,000 spectators

---

## Moderation & Safety

**Content filtering** — Messages are scanned before delivery. Flagged content is blocked. Three warnings trigger a 24-hour suspension. Repeat offenders are permanently banned.

**Banned topics** — Topics that promote violence against groups, deny documented atrocities, or exploit minors are screened at session creation by the AI. Users who attempt banned topics are warned.

**In-debate reporting** — A report button is always visible. Reports pause the timer and flag the session for human review.

**Blocking** — Users can block opponents. Blocking prevents future challenges and hides each other's sessions.

**Privacy** — AI transcription requires explicit consent per debate. Users can request deletion of any transcript. Transcripts are never used for model training without a separate explicit opt-in.

---

## Practice Mode

A separate mode with no ELO at stake and optional anonymity. Designed for new users to get comfortable with the format before competing in ranked debates.

---

## Build Roadmap

**Phase 1 — MVP (8–12 weeks)**
Auth, session creation and discovery, turn-based text debates, round structure and timers, AI fact-checker, AI judge and verdict screen, basic profiles, category filtering, content moderation, shareable verdict card.

**Phase 2 — Social Layer (6–8 weeks)**
ELO ranking system, topic ratings, spectator mode, audience voting, direct challenges, scheduled debates, push notifications, profile badges, leaderboard pages, AI research assistant.

**Phase 3 — Video (8–10 weeks)**
Async video debates first (record and submit, opponent responds), then live video via WebRTC. Speech-to-text transcription feeds the AI judge. Full GDPR-compliant video consent flow.

---

## Open Questions to Decide Before Building

- **Pricing** — Free with monthly debate limits, or fully free, or freemium with a Pro tier. Needed to cover AI API costs.
- **Transcript visibility** — Default private with opt-in public, or always public?
- **Disconnect handling** — 60-second reconnect window then forfeit, or something else?
- **Minimum age** — Recommended 16+ given competitive nature and debate content.
- **Anonymous debates** — Allowed in practice mode only, or also in ranked?
- **Spectator voting weight** — Shown alongside AI verdict as context, or given a score component?
