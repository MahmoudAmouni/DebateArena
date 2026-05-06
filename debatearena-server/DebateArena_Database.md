# DebateArena — Full Database Structure

---

## Table Index

1. users
2. user_topic_ratings
3. categories
4. sessions
5. session_participants
6. session_observers
7. debate_rounds
8. messages
9. fact_checks
10. research_queries
11. verdicts
12. verdict_scores
13. observer_votes
14. challenges
15. notifications
16. reports
17. blocks
18. badges
19. user_badges
20. consent_logs

---

## 1. users

Stores every registered account.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Public display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | NULLABLE | Null if OAuth only |
| oauth_provider | VARCHAR(20) | NULLABLE | google / apple / null |
| oauth_id | VARCHAR(255) | NULLABLE | Provider's user ID |
| avatar_url | TEXT | NULLABLE | |
| bio | VARCHAR(300) | NULLABLE | |
| global_elo | INT | NOT NULL, DEFAULT 1000 | Overall rating |
| total_wins | INT | NOT NULL, DEFAULT 0 | |
| total_losses | INT | NOT NULL, DEFAULT 0 | |
| total_ties | INT | NOT NULL, DEFAULT 0 | |
| fact_check_accuracy | DECIMAL(5,2) | NULLABLE | % of claims that checked out |
| is_banned | BOOLEAN | NOT NULL, DEFAULT false | |
| ban_expires_at | TIMESTAMP | NULLABLE | Null = permanent ban |
| warning_count | INT | NOT NULL, DEFAULT 0 | Resets after suspension served |
| is_verified | BOOLEAN | NOT NULL, DEFAULT false | Email verified |
| age_confirmed | BOOLEAN | NOT NULL, DEFAULT false | 16+ confirmation at signup |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| last_active_at | TIMESTAMP | NULLABLE | |

---

## 2. user_topic_ratings

Separate ELO per category per user. One row per user per category.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| category_id | UUID | FK → categories.id, NOT NULL | |
| elo | INT | NOT NULL, DEFAULT 1000 | |
| wins | INT | NOT NULL, DEFAULT 0 | |
| losses | INT | NOT NULL, DEFAULT 0 | |
| ties | INT | NOT NULL, DEFAULT 0 | |
| debates_count | INT | NOT NULL, DEFAULT 0 | |

**Unique constraint:** (user_id, category_id)

---

## 3. categories

Predefined topic categories.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Politics, Science, etc. |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | politics, science, etc. |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | |

---

## 4. sessions

A debate session — from creation to close.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| creator_id | UUID | FK → users.id, NOT NULL | |
| category_id | UUID | FK → categories.id, NOT NULL | |
| title | VARCHAR(120) | NOT NULL | Main debate topic |
| questions | JSON | NOT NULL | Array of 5 strings (sub-questions) |
| description | TEXT | NULLABLE | |
| creator_stance | TEXT | NOT NULL | Creator's stated position |
| format | ENUM | NOT NULL | quick / standard / extended |
| total_rounds | INT | NOT NULL | 3 / 5 / 8 |
| visibility | ENUM | NOT NULL | public / invite_only |
| invite_code | VARCHAR(16) | UNIQUE, NULLABLE | Only set if invite_only |
| status | ENUM | NOT NULL, DEFAULT 'open' | open / active / completed / expired / cancelled |
| is_ranked | BOOLEAN | NOT NULL, DEFAULT true | False for practice mode |
| allow_observers | BOOLEAN | NOT NULL, DEFAULT true | |
| observer_count | INT | NOT NULL, DEFAULT 0 | Cached count |
| scheduled_at | TIMESTAMP | NULLABLE | If pre-scheduled |
| expires_at | TIMESTAMP | NOT NULL | created_at + 2 hours if not joined |
| started_at | TIMESTAMP | NULLABLE | When both pressed Ready |
| ended_at | TIMESTAMP | NULLABLE | |
| end_reason | ENUM | NULLABLE | completed / conceded / timeout / disconnect / cancelled |
| ai_screened | BOOLEAN | NOT NULL, DEFAULT false | Whether AI checked topic for violations |
| flagged | BOOLEAN | NOT NULL, DEFAULT false | Flagged by moderation |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## 5. session_participants

The two debaters in a session.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| user_id | UUID | FK → users.id, NOT NULL | |
| role | ENUM | NOT NULL | creator / joiner |
| stance | TEXT | NOT NULL | Their stated position |
| is_anonymous | BOOLEAN | NOT NULL, DEFAULT false | Practice mode only |
| is_ready | BOOLEAN | NOT NULL, DEFAULT false | Pressed Ready in lobby |
| extensions_used | INT | NOT NULL, DEFAULT 0 | Max 1 per debate |
| fact_checks_used | INT | NOT NULL, DEFAULT 0 | Max 3 per debate |
| research_queries_used | INT | NOT NULL, DEFAULT 0 | Max 5 per debate |
| conceded | BOOLEAN | NOT NULL, DEFAULT false | |
| disconnected | BOOLEAN | NOT NULL, DEFAULT false | |
| elo_before | INT | NULLABLE | Snapshot before debate |
| elo_after | INT | NULLABLE | Snapshot after verdict |
| elo_change | INT | NULLABLE | |
| joined_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

**Unique constraint:** (session_id, user_id)

---

## 6. session_observers

Users watching a debate as spectators.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| user_id | UUID | FK → users.id, NULLABLE | Null = anonymous guest |
| joined_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| left_at | TIMESTAMP | NULLABLE | |

---

## 7. debate_rounds

Each round within a session.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| round_number | INT | NOT NULL | 1-indexed |
| round_type | ENUM | NOT NULL | opening / rebuttal / closing |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending / active / completed |
| active_participant_id | UUID | FK → session_participants.id | Whose turn it is |
| turn_duration_seconds | INT | NOT NULL | Based on format |
| started_at | TIMESTAMP | NULLABLE | |
| ended_at | TIMESTAMP | NULLABLE | |
| timed_out | BOOLEAN | NOT NULL, DEFAULT false | |

---

## 8. messages

Individual messages sent during a debate round.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| round_id | UUID | FK → debate_rounds.id, NOT NULL | |
| participant_id | UUID | FK → session_participants.id, NOT NULL | |
| content | TEXT | NOT NULL | |
| word_count | INT | NOT NULL | |
| is_flagged | BOOLEAN | NOT NULL, DEFAULT false | Auto-moderation flag |
| flagged_reason | VARCHAR(100) | NULLABLE | |
| sent_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## 9. fact_checks

Every fact-check request made during a debate.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| requested_by | UUID | FK → session_participants.id, NOT NULL | |
| message_id | UUID | FK → messages.id, NULLABLE | Message the claim was highlighted from |
| claim_text | TEXT | NOT NULL | The highlighted text |
| verdict | ENUM | NULLABLE | supported / disputed / unverifiable |
| explanation | TEXT | NULLABLE | 2-sentence plain-English result |
| sources | JSONB | NULLABLE | Array of {title, url} |
| processing_ms | INT | NULLABLE | AI response time |
| requested_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| completed_at | TIMESTAMP | NULLABLE | |

---

## 10. research_queries

Free-form AI research questions asked during a debate.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| requested_by | UUID | FK → session_participants.id, NOT NULL | |
| query_text | TEXT | NOT NULL | |
| response_text | TEXT | NULLABLE | |
| sources | JSONB | NULLABLE | Array of {title, url} |
| was_declined | BOOLEAN | NOT NULL, DEFAULT false | If AI refused (opinion question) |
| declined_reason | VARCHAR(255) | NULLABLE | |
| processing_ms | INT | NULLABLE | |
| requested_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| completed_at | TIMESTAMP | NULLABLE | |

---

## 11. verdicts

The AI judge's final output for a session. One row per session.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, UNIQUE, NOT NULL | |
| winner_participant_id | UUID | FK → session_participants.id, NULLABLE | Null if tie |
| is_tie | BOOLEAN | NOT NULL, DEFAULT false | |
| summary | TEXT | NOT NULL | 3–5 paragraph plain-language explanation |
| processing_ms | INT | NULLABLE | AI generation time |
| generated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## 12. verdict_scores

Per-criterion scores for each participant. One row per participant per criterion.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| verdict_id | UUID | FK → verdicts.id, NOT NULL | |
| participant_id | UUID | FK → session_participants.id, NOT NULL | |
| criterion | ENUM | NOT NULL | clarity / logic / evidence / responsiveness / consistency |
| score | DECIMAL(4,1) | NOT NULL | 1.0 – 10.0 |
| explanation | TEXT | NULLABLE | AI note on why this score was given |

**Unique constraint:** (verdict_id, participant_id, criterion)

---

## 13. observer_votes

Mid-debate votes cast by spectators.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| session_id | UUID | FK → sessions.id, NOT NULL | |
| observer_id | UUID | FK → session_observers.id, NOT NULL | |
| voted_for_participant_id | UUID | FK → session_participants.id, NOT NULL | |
| voted_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

**Unique constraint:** (session_id, observer_id) — one vote per observer per session

---

## 14. challenges

Direct challenges sent from one user to another.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| challenger_id | UUID | FK → users.id, NOT NULL | |
| challenged_id | UUID | FK → users.id, NOT NULL | |
| topic | VARCHAR(120) | NOT NULL | |
| challenger_stance | TEXT | NOT NULL | |
| category_id | UUID | FK → categories.id, NOT NULL | |
| message | TEXT | NULLABLE | Optional personal note |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending / accepted / declined / expired |
| session_id | UUID | FK → sessions.id, NULLABLE | Set when accepted |
| expires_at | TIMESTAMP | NOT NULL | created_at + 7 days |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| responded_at | TIMESTAMP | NULLABLE | |

---

## 15. notifications

In-app and push notification records.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | Recipient |
| type | ENUM | NOT NULL | session_joined / challenge_received / verdict_ready / session_expiring / debate_starting / warning_issued / account_suspended |
| title | VARCHAR(100) | NOT NULL | |
| body | TEXT | NOT NULL | |
| reference_id | UUID | NULLABLE | Session, challenge, or verdict ID |
| reference_type | VARCHAR(30) | NULLABLE | sessions / challenges / verdicts |
| is_read | BOOLEAN | NOT NULL, DEFAULT false | |
| push_sent | BOOLEAN | NOT NULL, DEFAULT false | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## 16. reports

Moderation reports submitted during or after a debate.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| reporter_id | UUID | FK → users.id, NOT NULL | |
| reported_user_id | UUID | FK → users.id, NOT NULL | |
| session_id | UUID | FK → sessions.id, NULLABLE | |
| message_id | UUID | FK → messages.id, NULLABLE | Specific message reported |
| reason | ENUM | NOT NULL | hate_speech / harassment / threats / spam / banned_topic / other |
| details | TEXT | NULLABLE | |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending / reviewed / actioned / dismissed |
| reviewed_by | UUID | NULLABLE | Admin user ID |
| reviewed_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## 17. blocks

User block relationships.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| blocker_id | UUID | FK → users.id, NOT NULL | |
| blocked_id | UUID | FK → users.id, NOT NULL | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

**Unique constraint:** (blocker_id, blocked_id)

---

## 18. badges

Master list of all achievable badges.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | first_win, fact_check_champion, etc. |
| name | VARCHAR(100) | NOT NULL | |
| description | TEXT | NOT NULL | |
| icon_url | TEXT | NULLABLE | |

---

## 19. user_badges

Badges earned by users.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| badge_id | UUID | FK → badges.id, NOT NULL | |
| earned_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

**Unique constraint:** (user_id, badge_id)

---

## 20. consent_logs

Audit trail of user consent actions for privacy compliance.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| consent_type | ENUM | NOT NULL | ai_transcription / data_processing / marketing |
| granted | BOOLEAN | NOT NULL | |
| session_id | UUID | FK → sessions.id, NULLABLE | Per-debate consent if applicable |
| ip_address | VARCHAR(45) | NOT NULL | |
| user_agent | TEXT | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |

---

## Key Relationships Summary

- One **user** has many **sessions** (as creator), many **session_participants**, many **notifications**, many **challenges**, many **user_badges**, many **user_topic_ratings**
- One **session** has two **session_participants**, many **session_observers**, many **debate_rounds**, one **verdict**, many **fact_checks**, many **research_queries**, many **reports**
- One **debate_round** has many **messages**
- One **verdict** has many **verdict_scores** (5 criteria × 2 participants = 10 rows per debate)
- One **challenge**, when accepted, creates one **session**
- One **consent_log** row is written every time a user grants or revokes any consent

---

## Indexes to Add

| Table | Index On | Reason |
|---|---|---|
| sessions | status, created_at | Home feed filtering |
| sessions | category_id, status | Category filter |
| sessions | creator_id | Profile page |
| sessions | expires_at | Expiry cleanup job |
| messages | session_id, sent_at | Debate transcript retrieval |
| fact_checks | session_id | Sidebar retrieval |
| research_queries | session_id | Sidebar retrieval |
| notifications | user_id, is_read | Notification feed |
| observer_votes | session_id | Tallying votes at verdict |
| challenges | challenged_id, status | Incoming challenges feed |
| blocks | blocker_id | Block lookup before showing sessions |
| user_topic_ratings | user_id, category_id | Profile stats |
| verdict_scores | verdict_id | Verdict display |
