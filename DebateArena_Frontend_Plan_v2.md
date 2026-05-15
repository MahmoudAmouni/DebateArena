# DebateArena — Frontend Implementation Plan
### React + Vite + TypeScript

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, instant HMR |
| Language | TypeScript | Matches backend types, catches errors early |
| Routing | React Router v6 | Nested routes, loaders, protected route wrappers |
| State — Server | TanStack Query v5 | Caching, refetching, loading/error states for all API calls |
| State — Client | Context API + useReducer | Built into React, no extra library, clean for auth + debate state |
| Styling | Tailwind CSS | Utility-first, fast to build |
| UI Components | shadcn/ui | Accessible, built on Radix UI |
| Forms | React Hook Form + Zod | Validation matching backend schemas |
| Animations | Framer Motion | All animations — landing page, transitions, verdict reveal, timers |
| Real-time | Socket.io-client | Connects to backend Socket.io server |
| HTTP Client | Axios | Interceptors for JWT attach + refresh token rotation |
| Rich Text | TipTap | Phase 2 writing editor |
| Notifications (toast) | Sonner | Lightweight toast |
| Date/Time | date-fns | Format timestamps, countdowns |
| Icons | Lucide React | Consistent icon set |
| Charts | Recharts | Profile average scores chart |
| Sharing | Web Share API + html2canvas | Native share + verdict card image generation |

---

## Folder Structure

```
src/
│
├── api/
│   ├── axios.ts
│   ├── auth.api.ts
│   ├── users.api.ts
│   ├── sessions.api.ts
│   ├── debates.api.ts
│   ├── verdicts.api.ts
│   ├── challenges.api.ts
│   └── notifications.api.ts
│
├── context/
│   ├── AuthContext.tsx           Current user + token state + actions
│   ├── DebateContext.tsx         Active debate state + actions
│   └── NotificationContext.tsx  Unread count + actions
│
├── socket/
│   ├── socket.ts                Socket.io client singleton
│   ├── useDebateSocket.ts
│   ├── useTimerSocket.ts
│   └── useObserverSocket.ts
│
├── hooks/
│   ├── useAuth.ts               Reads from AuthContext
│   ├── useDebate.ts             Reads from DebateContext
│   ├── useCountdown.ts          Local countdown timer
│   ├── useDebounce.ts           Debounce for search inputs
│   └── useShareCard.ts          html2canvas verdict card generator
│
├── pages/
│   ├── LandingPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── VerifyEmailPage.tsx
│   ├── home/
│   │   └── HomePage.tsx
│   ├── sessions/
│   │   ├── CreateSessionPage.tsx
│   │   └── SessionDetailPage.tsx
│   ├── lobby/
│   │   └── LobbyPage.tsx
│   ├── debate/
│   │   ├── DebatePage.tsx
│   │   └── WritingPage.tsx
│   ├── verdict/
│   │   └── VerdictPage.tsx
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   └── MyProfilePage.tsx
│   ├── leaderboard/
│   │   └── LeaderboardPage.tsx
│   ├── challenges/
│   │   └── ChallengesPage.tsx
│   ├── observe/
│   │   └── ObservePage.tsx
│   └── misc/
│       └── NotFoundPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── GuestLayout.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── AIJudgeSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── LandingNavbar.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── OAuthButtons.tsx
│   ├── sessions/
│   │   ├── SessionCard.tsx
│   │   ├── SessionFeed.tsx
│   │   ├── SessionFilters.tsx
│   │   ├── CreateSessionForm.tsx
│   │   └── SubQuestionBuilder.tsx
│   ├── lobby/
│   │   ├── LobbyPanel.tsx
│   │   ├── PlayerCard.tsx
│   │   └── ReadyButton.tsx
│   ├── debate/
│   │   ├── SubQuestionList.tsx
│   │   ├── PhaseTimer.tsx
│   │   ├── CallPlaceholder.tsx
│   │   └── PhaseTransition.tsx
│   ├── writing/
│   │   ├── WritingPanel.tsx
│   │   ├── QuestionEditor.tsx
│   │   ├── WritingTimer.tsx
│   │   └── SubmitButton.tsx
│   ├── verdict/
│   │   ├── VerdictReveal.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── CriterionBar.tsx
│   │   ├── SubQuestionVerdict.tsx
│   │   ├── VerdictSummary.tsx
│   │   ├── WinnerBanner.tsx
│   │   ├── ObserverVoteTally.tsx
│   │   └── ShareCard.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── TopicRatings.tsx
│   │   ├── AverageScores.tsx
│   │   ├── DebateHistoryList.tsx
│   │   ├── DebateHistoryItem.tsx
│   │   └── BadgeGrid.tsx
│   ├── challenges/
│   │   ├── ChallengeCard.tsx
│   │   ├── SendChallengeModal.tsx
│   │   └── ChallengeInbox.tsx
│   ├── notifications/
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationDrawer.tsx
│   │   └── NotificationItem.tsx
│   ├── observer/
│   │   ├── ObserverPanel.tsx
│   │   ├── ObserverVoteButton.tsx
│   │   └── ObserverCount.tsx
│   └── shared/
│       ├── Avatar.tsx
│       ├── EloBadge.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── ConfirmModal.tsx
│       ├── PageTitle.tsx
│       └── InfiniteScrollTrigger.tsx
│
├── types/
│   ├── user.types.ts
│   ├── session.types.ts
│   ├── debate.types.ts
│   ├── verdict.types.ts
│   ├── challenge.types.ts
│   └── socket.types.ts
│
├── lib/
│   ├── queryClient.ts
│   ├── zodSchemas.ts
│   └── constants.ts
│
├── router/
│   └── index.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Setup Steps

**Step 1 — Initialize the project**
Run `npm create vite@latest debatearena -- --template react-ts`. Install all dependencies. Configure tsconfig.json with strict mode and path alias `@/` pointing to `src/`. Configure vite.config.ts to resolve the `@/` alias. Add `.env` and `.env.local` to .gitignore.

**Step 2 — Configure environment variables**
Create `.env`. Variables: `VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_GOOGLE_CLIENT_ID`. Create `src/lib/env.ts` that exports all env vars typed — never read `import.meta.env` directly in components.

**Step 3 — Set up Tailwind CSS**
Install tailwindcss, postcss, autoprefixer. Configure `tailwind.config.ts`. In `index.css` define CSS custom properties for the full color palette: `--color-primary`, `--color-accent`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-text`, `--color-muted`, `--color-danger`, `--color-success`. Expose these as Tailwind theme extensions so they can be used as class names.

**Step 4 — Set up shadcn/ui**
Run `npx shadcn-ui@latest init`. Add components: Button, Input, Textarea, Dialog, Sheet, Tabs, Badge, Avatar, Card, Separator, Skeleton, DropdownMenu, Form, Label, Progress, Accordion.

**Step 5 — Set up React Router**
Create `src/router/index.tsx`. Use `createBrowserRouter`. Define all routes. Create a `ProtectedRoute` component that checks `AuthContext` — if no user, redirects to `/login` storing the intended URL. Create a `GuestRoute` that redirects logged-in users away from auth pages to `/home`. Wrap the whole router in `RouterProvider` in `main.tsx`.

**Step 6 — Set up Axios**
Create `src/api/axios.ts`. Create an Axios instance with `baseURL = VITE_API_URL` and `withCredentials: true`. Request interceptor: reads the access token from `AuthContext` via a module-level getter function and attaches it as `Authorization: Bearer`. Response interceptor: on 401, call the refresh endpoint once, update the token in context, retry the original request. On refresh failure, clear auth context and redirect to `/login`.

**Step 7 — Set up TanStack Query**
Create `src/lib/queryClient.ts`. Config: staleTime 60s, retry 1, do not retry on 4xx. Wrap the app in `QueryClientProvider` in `main.tsx`. Add `ReactQueryDevtools` in development only.

**Step 8 — Set up Framer Motion**
Install framer-motion. Create `src/lib/motionVariants.ts` — a central file that exports all reusable animation variants so they're consistent and easy to change in one place. Define variants for: `fadeIn`, `fadeInUp`, `fadeInDown`, `staggerContainer` (parent that staggers children), `scaleIn`, `slideInLeft`, `slideInRight`, `pageTransition`. These are used throughout the whole app.

**Step 9 — Set up Socket.io client**
Create `src/socket/socket.ts`. Create a Socket.io client with `autoConnect: false`. Export `connectSocket(token)` — sets the auth token and calls `socket.connect()`. Export `disconnectSocket()`. The token is passed in explicitly at connect time rather than read from context, which avoids closure issues.

---

## Context Setup

**Step 10 — Create AuthContext**
Create `src/context/AuthContext.tsx`.

State shape: `{ user: User | null, accessToken: string | null, isLoading: boolean }`.

Actions via `useReducer`: `SET_USER` (sets user + token), `CLEAR_AUTH` (nulls both), `SET_LOADING`.

On mount, the provider checks localStorage for a stored access token, calls the refresh endpoint to verify it is still valid, and sets the user. While this check is in flight, `isLoading` is true and the app shows a full-screen loading state instead of flashing to the login page. This prevents the logged-in user from seeing the landing page for a split second on every refresh.

Exports: `AuthContext`, `AuthProvider`, `useAuthContext` hook (throws if used outside provider).

**Step 11 — Create DebateContext**
Create `src/context/DebateContext.tsx`.

State shape: `{ sessionId: string | null, phase: 'lobby' | 'phase1' | 'phase2' | 'completed' | null, participants: SessionParticipant[], subQuestions: string[], timeRemaining: number, myAnswers: Record<number, string>, observerCount: number }`.

Actions via `useReducer`: `SET_SESSION`, `SET_PHASE`, `SET_PARTICIPANTS`, `SET_TIME`, `UPDATE_ANSWER` (updates one answer by index), `SET_OBSERVER_COUNT`, `CLEAR_DEBATE`.

`UPDATE_ANSWER` is called on every keystroke in the writing editor — it updates `myAnswers[questionIndex]` with the latest value. This ensures answers survive re-renders and brief disconnects without any debounce or delay.

Exports: `DebateContext`, `DebateProvider`, `useDebateContext` hook.

**Step 12 — Create NotificationContext**
Create `src/context/NotificationContext.tsx`.

State shape: `{ unreadCount: number }`.

Actions: `SET_UNREAD_COUNT`, `INCREMENT_UNREAD`, `CLEAR_UNREAD`.

On mount, calls the notifications API to get the current unread count and sets it. Exports `NotificationProvider` and `useNotificationContext` hook.

**Step 13 — Compose all providers**
In `main.tsx`, wrap the app in providers in this order from outermost to innermost: `QueryClientProvider` → `AuthProvider` → `NotificationProvider` → `DebateProvider` → `RouterProvider`. Order matters — `AuthProvider` must be outside `NotificationProvider` because the notifications API call needs the auth token.

---

## Hooks

**Step 14 — Create useAuth hook**
`src/hooks/useAuth.ts`. Reads from `AuthContext`. Provides: `user`, `isLoggedIn`, `isLoading`, `login(email, password)`, `register(data)`, `logout()`. `login` calls the API, dispatches `SET_USER`, calls `connectSocket(token)`, navigates to `/home`. `logout` calls the API, dispatches `CLEAR_AUTH`, calls `disconnectSocket()`, navigates to `/`.

**Step 15 — Create useDebate hook**
`src/hooks/useDebate.ts`. Reads from `DebateContext`. Re-exports state and dispatch actions as named functions: `setPhase`, `updateAnswer`, `setTimeRemaining`, etc. Components use this hook — they never import the context directly.

**Step 16 — Create useCountdown hook**
`src/hooks/useCountdown.ts`. Takes `initialSeconds` and a `onExpire` callback. Uses `useRef` for the interval ID. Returns `{ minutes, seconds, totalRemaining, isExpired }`. Cleans up the interval on unmount. Used by `PhaseTimer` and `WritingTimer`.

**Step 17 — Create useDebounce hook**
`src/hooks/useDebounce.ts`. Takes a value and a delay in ms. Returns the debounced value. Used by the session search input and the username availability check in the register form.

---

## Types

**Step 18 — Define all TypeScript types**
Create all type files mirroring the backend schema exactly.

`user.types.ts`: `User`, `EloTier` enum, `UserTopicRating`, `Badge`, `UserBadge`, `PublicProfile`, `OwnProfile`.

`session.types.ts`: `Session`, `SessionStatus` enum, `SessionFormat` enum, `SessionParticipant`, `SessionObserver`, `CreateSessionPayload`.

`debate.types.ts`: `DebateRound`, `RoundType` enum, `Message`, `DebatePhase` enum.

`verdict.types.ts`: `Verdict`, `VerdictScore`, `VerdictCriterion` enum, `FullVerdict`.

`challenge.types.ts`: `Challenge`, `ChallengeStatus` enum.

`socket.types.ts`: One interface per socket event for both inbound and outbound events.

---

## API Layer

**Step 19 — Create all API modules**
One file per module. Each function returns a typed response using the types defined in Step 18.

`auth.api.ts`: `register`, `login`, `logout`, `refreshToken`, `verifyEmail`, `resendVerification`.

`users.api.ts`: `getPublicProfile`, `getOwnProfile`, `updateProfile`, `getOwnDebates`, `getOwnBadges`, `getOwnNotifications`, `markNotificationRead`, `blockUser`, `unblockUser`, `getLeaderboard`, `getCategoryLeaderboard`.

`sessions.api.ts`: `getSessions`, `createSession`, `getSession`, `getInviteLink`, `joinSession`, `markReady`, `cancelSession`, `getScheduledSessions`.

`debates.api.ts`: `getTranscript`, `concede`, `submitWritingAnswers`.

`verdicts.api.ts`: `getVerdict`.

`challenges.api.ts`: `sendChallenge`, `getReceivedChallenges`, `getSentChallenges`, `acceptChallenge`, `declineChallenge`.

`notifications.api.ts`: `getNotifications`, `markAllRead`.

---

## Landing Page

**Step 20 — Create LandingNavbar**
`src/components/landing/LandingNavbar.tsx`. A fixed top navbar that is transparent when at the top of the page and becomes a blurred frosted-glass background when the user scrolls down. Uses a `useEffect` + `scroll` event listener to toggle a class. Contains the logo on the left and Login + Get Started buttons on the right. On mobile it collapses to a hamburger menu.

**Step 21 — Create HeroSection**
`src/components/landing/HeroSection.tsx`. The first section on the landing page. Full viewport height. Content is centered vertically and horizontally.

Animation sequence using Framer Motion — each element animates in with a staggered delay:
- A small eyebrow label ("AI-Judged Debates") fades in first
- The main headline fades up — something like "Debate Anyone. Win on Merit." with the key word in the accent color
- A subheadline fades up next
- Two CTA buttons scale in — "Start Debating" (primary) and "Watch a Live Debate" (secondary)
- A subtle animated background — floating gradient orbs that move very slowly using Framer Motion's `animate` with `repeat: Infinity` and `repeatType: 'reverse'`. These are absolutely positioned blurred circles behind the text, giving depth without being distracting.

Below the fold, a row of 3 stat counters animated with a count-up effect when they enter the viewport: "X Debates Held", "Y Topics Covered", "Z AI Verdicts Delivered." Use an `IntersectionObserver` to trigger the count-up animation only when the section is visible.

**Step 22 — Create HowItWorksSection**
`src/components/landing/HowItWorksSection.tsx`. A section with a centered heading and a horizontal (desktop) or vertical (mobile) timeline of 4 steps: Create a Session → Join & Lobby → Debate in 2 Phases → Get an AI Verdict.

Each step has a number badge, icon, title, and short description. Animation: when this section scrolls into view, the steps animate in one by one from left to right (desktop) or top to bottom (mobile) using Framer Motion's `whileInView` prop with `viewport={{ once: true }}` so they only animate in once, not every time the user scrolls past.

The connecting line between steps draws itself using a Framer Motion `pathLength` animation on an SVG line, timed to complete as the last step finishes animating in.

**Step 23 — Create FeaturesSection**
`src/components/landing/FeaturesSection.tsx`. A 3-column grid of feature cards. Features: Structured Rounds, Live Sub-Questions, AI Fact Screening, AI Judge Verdict, ELO Rankings, Spectator Mode. Each card has an icon, title, and 2-sentence description.

Animation: each card animates in with a `fadeInUp` variant triggered by `whileInView`. The cards stagger using `staggerContainer` variant on the parent grid. On hover, each card lifts slightly with a Framer Motion `whileHover={{ y: -4, boxShadow: '...' }}` transition.

**Step 24 — Create AIJudgeSection**
`src/components/landing/AIJudgeSection.tsx`. A full-width section that showcases the AI judge with a mock verdict card as the visual. Left side has the copy — "An impartial judge for every debate." Right side shows an animated mock `ScoreCard` component with fake data that animates the score bars filling up when the section enters the viewport. This is the most important section on the landing page — it shows rather than tells.

The mock score bars use Framer Motion `animate={{ width: targetPercent }}` triggered by `useInView`. Bars fill from 0 to their target values with a smooth ease-out over 1.2 seconds, each slightly staggered.

**Step 25 — Create StatsSection**
`src/components/landing/StatsSection.tsx`. A dark full-width banner with 4 large animated numbers. Each number counts up from 0 to its final value when the section enters the viewport. Built with a custom `useCountUp` hook using `requestAnimationFrame` for smooth animation. Below each number is a short label.

**Step 26 — Create LandingPage**
`src/pages/LandingPage.tsx`. Composes all landing sections: `LandingNavbar`, `HeroSection`, `HowItWorksSection`, `FeaturesSection`, `AIJudgeSection`, `StatsSection`, and a final CTA section ("Ready to debate? Start for free") followed by a simple footer. Each section is separated by enough whitespace to breathe. If the user is already logged in, redirect them to `/home` — logged-in users should never see the landing page.

---

## Auth Module

**Step 27 — Create LoginPage**
Uses `GuestLayout`. Contains `LoginForm`. On success calls `useAuth().login` and redirects. Shows link to register and `OAuthButtons`.

**Step 28 — Create LoginForm**
React Hook Form + Zod. Email input, password input with show/hide toggle. Submit button with loading state. API error shown below the form. On mount, the email field is auto-focused and the form fades in using `fadeInUp` variant.

**Step 29 — Create RegisterPage**
Uses `GuestLayout`. Contains `RegisterForm` and `OAuthButtons`. On success redirects to `/verify-email`.

**Step 30 — Create RegisterForm**
Fields: username (debounced availability check — green checkmark or red X appears inline after 500ms), email, password, confirm password, age confirmation checkbox. All validated with Zod. Inline errors animate in using Framer Motion `AnimatePresence` with a `fadeInDown` so they don't cause jarring layout shifts.

**Step 31 — Create VerifyEmailPage**
Shows a message to check email. Resend button disabled for 60 seconds with countdown shown on the button text. Reads `?token=` from the URL — if present, auto-calls verify and shows a success animation (a checkmark that draws itself using SVG `pathLength` animation) before redirecting to login.

---

## Layout

**Step 32 — Create GuestLayout**
Full-screen centered layout with the DebateArena logo. Renders children in a card. The card fades in on mount using `scaleIn` variant.

**Step 33 — Create AppLayout**
Fixed sidebar left, main content right. Topbar across the top. Renders `<Outlet />` wrapped in a Framer Motion `AnimatePresence` keyed by route location — every page transition gets a `pageTransition` fade animation. On mobile, sidebar collapses to a bottom navigation bar.

**Step 34 — Create Sidebar**
Navigation links with active highlight. Create Debate button styled prominently. Current user's avatar, username, and EloBadge at the bottom. Active link has a small animated indicator dot that slides between items using Framer Motion `layoutId` — this makes the active indicator smoothly slide when the route changes instead of instantly snapping.

**Step 35 — Create Topbar**
Logo on left, `NotificationBell` and user dropdown on right.

---

## Home Feed

**Step 36 — Create HomePage**
Fetches sessions with TanStack Query. Filters kept in URL search params. Renders `SessionFilters` and `SessionFeed`.

**Step 37 — Create SessionFilters**
Category tabs scrolling horizontally on mobile. Debounced search input. Sort dropdown. Active category tab has an animated underline indicator using Framer Motion `layoutId` — the indicator slides between tabs on click.

**Step 38 — Create SessionFeed**
Grid of `SessionCard` components with infinite scroll via `InfiniteScrollTrigger`. New cards that load animate in with `fadeInUp` and a stagger using `staggerContainer` on the grid parent. Shows skeleton loaders during the initial fetch.

**Step 39 — Create SessionCard**
Shows topic, creator info + EloBadge, stance, category badge, format badge, observer count, time since posted, Join button. On hover: a subtle lift animation using `whileHover={{ y: -2 }}`. The card fades in on mount using `fadeInUp`.

---

## Create Session Flow

**Step 40 — Create CreateSessionPage**
Multi-step form: step 1 is session details, step 2 is sub-questions. The step transition animates using `slideInLeft` / `slideInRight` with `AnimatePresence` so step 1 slides out left and step 2 slides in from the right. A progress indicator at the top shows which step the user is on.

**Step 41 — Create CreateSessionForm**
Fields: topic title (character counter), stance textarea, description, category select, format select (each format option shows a description), visibility toggle. Validated with Zod.

**Step 42 — Create SubQuestionBuilder**
Five numbered input fields. All required. AI-assist button per field — clicking shows a loading spinner then populates the field with a suggestion using a typewriter animation (the text types itself in character by character using `setInterval`, giving the feeling that the AI is generating it in real time).

---

## Session Detail & Join Flow

**Step 43 — Create SessionDetailPage**
Fetches session by ID. Shows all session info. The 5 sub-questions are listed as numbered cards that animate in with stagger on mount. Join form appears inline when the Join button is clicked — it slides down using `AnimatePresence` + height animation so it doesn't cause a jump.

---

## Lobby

**Step 44 — Create LobbyPage**
Connects to Socket.io on mount. Shows `LobbyPanel`. Navigates to debate page on `debate:started` event.

**Step 45 — Create LobbyPanel**
Two `PlayerCard` components with a "VS" between them. The VS text pulses subtly using a Framer Motion `animate={{ scale: [1, 1.05, 1] }}` with `repeat: Infinity` to keep the page feeling alive while waiting. When both players are ready, shows a large countdown from 3 to 1 with a scale+fade animation on each number before navigating.

**Step 46 — Create PlayerCard**
Avatar, username, EloBadge, stance. Ready indicator: a grey dot that becomes a pulsing green dot using Framer Motion `animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}` with `repeat: Infinity` when ready is true.

**Step 47 — Create ReadyButton**
Large button. On click: button animates a quick `scaleIn` bounce, changes text to "Ready ✓", turns green, becomes disabled. Uses Framer Motion `whileTap={{ scale: 0.95 }}` for a press-down feel.

---

## Debate Phase 1

**Step 48 — Create DebatePage**
Phase 1 screen. Connects to socket. Shows `PhaseTimer`, `CallPlaceholder`, and `SubQuestionList`. Listens for `debate:phase_transition` event — triggers `PhaseTransition` overlay then navigates to the writing page. Concede button with `ConfirmModal`.

**Step 49 — Create PhaseTimer**
Receives time from `useTimerSocket`. Shows MM:SS. Color transitions: green → amber under 5 minutes → red under 60 seconds. The color change uses Framer Motion `animate={{ color: targetColor }}` for a smooth transition instead of an instant class swap. Under 60 seconds, the timer pulses using `animate={{ scale: [1, 1.05, 1] }}` with `repeat: Infinity`.

**Step 50 — Create CallPlaceholder**
Placeholder panel for the live call. Shows participant names and stances. Styled to look like a video call UI. Subtly animated background — a very slow pulsing glow effect to make the screen feel live.

**Step 51 — Create SubQuestionList**
5 sub-question cards. Read-only. Animate in with `staggerContainer` + `fadeInUp` on mount.

**Step 52 — Create PhaseTransition**
A full-screen overlay using Framer Motion that covers everything. Slides in from the bottom with a dark background. Shows "Phase 1 Complete" with a checkmark SVG that draws itself (pathLength animation). Then shows "Writing Phase begins in 3..." with number countdown. After 3 seconds, slides back out upward and navigation happens.

**Step 53 — Create useTimerSocket hook**
Listens for `debate:timer_sync`. Dispatches `SET_TIME` to `DebateContext`. Returns `timeRemaining` from context.

**Step 54 — Create useDebateSocket hook**
Registers all debate event listeners. Handles `debate:phase_transition`, `debate:debate_ended`, `debate:extension_granted`. Cleans up on unmount.

---

## Debate Phase 2 — Writing

**Step 55 — Create WritingPage**
Phase 2 screen. Shows `WritingPanel`. Auto-submits on timer expiry. Navigates to verdict page on `debate:all_submitted` socket event.

**Step 56 — Create WritingPanel**
`WritingTimer` at top. Five `QuestionEditor` components stacked. `SubmitButton` at bottom. A progress bar shows "X/5 answered" — the bar fills using a Framer Motion `animate={{ width: percent }}` as answers are added.

**Step 57 — Create QuestionEditor**
Sub-question text at top. TipTap editor below. Word count shown. Each editor fades in with a stagger on mount so they don't all appear at once. When the editor is focused, a subtle border glow animates in using Framer Motion. Calls `useDebate().updateAnswer(index, value)` on every change.

**Step 58 — Create WritingTimer**
Large prominent countdown. Color transitions same as PhaseTimer. At 30 seconds, adds a pulsing ring animation around the timer using Framer Motion `animate={{ scale: [1, 1.15, 1], opacity: [1, 0, 1] }}` with `repeat: Infinity` on an absolutely-positioned ring element — draws attention without being obnoxious.

**Step 59 — Create SubmitButton**
Disabled until all 5 answered. On click, shows `ConfirmModal`. On confirm: button shows a loading spinner, then a checkmark animation when the API call succeeds. Disabled state: grey and slightly faded. Enabled state transitions smoothly using Framer Motion `animate` on the background color.

---

## Verdict

**Step 60 — Create VerdictPage**
Fetches verdict via TanStack Query. Loading screen while AI processes: shows the DebateArena logo with a pulsing animation and the text "AI Judge is reading both sides..." with animated dots. Renders `VerdictReveal` once data is ready.

**Step 61 — Create VerdictReveal**
Controls the full reveal sequence with Framer Motion `AnimatePresence` and staggered delays. Sections reveal in order: WinnerBanner (instant) → ScoreCards (0.8s) → SubQuestionVerdict (1.8s) → VerdictSummary (2.8s) → ObserverVoteTally (3.4s) → Share buttons (4s). Each section uses `fadeInUp`. This makes the verdict feel like an awards ceremony, not a static page load.

**Step 62 — Create WinnerBanner**
Full-width banner. Winner: gold gradient background, trophy icon, winner's username. Tie: neutral gradient, handshake icon. Animates in with a `scaleIn` that goes slightly above 1.0 then settles — a subtle bounce. If it's a win, a burst of confetti particles rains down for 2 seconds using Framer Motion — small colored squares that fall from the top of the banner with randomized x positions and rotation, using `animate={{ y: [0, 300], opacity: [1, 0], rotate: [0, 360] }}`.

**Step 63 — Create ScoreCard**
Participant avatar, username, total score. Five `CriterionBar` components. Winner's card has a gold border that glows subtly using a `box-shadow` animation. The total score number counts up from 0 to its final value using a count-up animation with `requestAnimationFrame`.

**Step 64 — Create CriterionBar**
Label, animated progress bar, score number. On mount, the bar animates from width 0 to `(score / 10) * 100%` using Framer Motion `animate={{ width: targetPercent }}` with `ease: 'easeOut'` and a 1-second duration, staggered slightly between bars. Score number counts up alongside the bar. On hover, a tooltip shows the AI's explanation for that score using a `fadeInUp` on a small tooltip element.

**Step 65 — Create SubQuestionVerdict**
5 accordion items. Each shows the sub-question, who won that point, and an AI explanation. Built with shadcn/ui Accordion. First item is open by default. The winner indicator per sub-question is a colored badge that scales in with `scaleIn` when the accordion opens.

**Step 66 — Create VerdictSummary**
AI written summary. Displayed as prose. Animates in character by character — a typewriter effect using `setInterval` that appends one character at a time to displayed text until the full summary is shown. Duration is capped at 3 seconds regardless of length so it doesn't drag. A "Show full text" button skips the animation for users who don't want to wait.

**Step 67 — Create ObserverVoteTally**
Two bars showing spectator vote percentages. The bars animate in like `CriterionBar`. Only shown if observers voted.

**Step 68 — Create ShareCard**
An off-screen div with a styled card. `useShareCard` captures it with html2canvas. "Share Result" uses the Web Share API on mobile or shows a download button on desktop. "Share on X" opens a pre-filled tweet.

---

## Profile

**Step 69 — Create ProfilePage and MyProfilePage**
Both fetch profile data using TanStack Query. On load, sections stagger in using `staggerContainer`. The stats numbers count up from 0 when the `StatsGrid` enters the viewport.

**Step 70 — Create ProfileHeader**
Large avatar, username, bio, `EloBadge`. The ELO badge animates in with a `scaleIn`. On own profile, an edit button opens an inline form that slides down using height animation.

**Step 71 — Create StatsGrid**
Row of stat cards. Each number counts up from 0 on mount using the count-up pattern. Cards animate in with stagger.

**Step 72 — Create TopicRatings**
Per-category ELO rows with a bar. Bars animate from 0 to their value using `whileInView` so they animate when the user scrolls to this section.

**Step 73 — Create AverageScores**
A recharts RadarChart showing average scores across the 5 criteria. The chart animates in using recharts' built-in animation. Gives a visual fingerprint of the user's debate style.

**Step 74 — Create DebateHistoryList**
Infinite scroll list. Items animate in with `fadeInUp` stagger as they load. Each item has a win/loss/tie badge in the appropriate color.

**Step 75 — Create BadgeGrid**
Earned badges: full color, hover shows a tooltip with description. Unearned: greyed out with a lock icon. On hover of unearned badges, the tooltip explains how to earn them. Badges animate in with stagger on mount.

---

## Challenges

**Step 76 — Create ChallengesPage**
Two tabs: Received and Sent. Tab indicator slides using Framer Motion `layoutId`.

**Step 77 — Create ChallengeCard**
Challenge details + Accept/Decline buttons. Expiry countdown using `useCountdown`. On Accept, a stance input slides down inline before confirming. On Decline, the card fades out and shrinks using `AnimatePresence`.

**Step 78 — Create SendChallengeModal**
A Dialog. Form fields: topic, stance, category, optional message. On success, shows a confirmation animation inside the modal before closing.

---

## Notifications

**Step 79 — Create NotificationBell**
Bell icon with unread badge. The badge does a bounce animation when the count increases using `animate={{ scale: [1, 1.4, 1] }}`. On click opens `NotificationDrawer`.

**Step 80 — Create NotificationDrawer**
A Sheet that slides in from the right. Notification list with infinite scroll. When a new notification arrives via socket, it slides in at the top using `AnimatePresence` + `slideInDown`. "Mark all read" button.

**Step 81 — Create NotificationItem**
Icon per type, title, body, time ago. Unread: blue dot indicator. Clicking marks as read (dot fades out) and navigates to the reference page.

**Step 82 — Connect socket notifications**
In a `useEffect` inside `NotificationProvider`, after the socket connects, listen for `notification:new`. On receipt: dispatch `INCREMENT_UNREAD`, show a Sonner toast with the notification title. Clicking the toast navigates to the relevant page.

---

## Observer

**Step 83 — Create ObservePage**
Emits `observer:join` on mount, `observer:leave` on unmount. Shows `ObserverPanel` and `ObserverVoteButton`.

**Step 84 — Create ObserverPanel**
Read-only view. Shows participants, topic, sub-questions, current phase indicator. Phase indicator badge animates between "Phase 1 — Discussion" and "Phase 2 — Writing" using `AnimatePresence`.

**Step 85 — Create ObserverVoteButton**
Two vote buttons. On click, the selected button fills with color (animated via Framer Motion), both become disabled, and a small "Vote recorded" message fades in below.

**Step 86 — Create ObserverCount**
Eye icon + number. When the count changes, the number does a brief scale-up animation to draw attention to the change.

---

## Leaderboard

**Step 87 — Create LeaderboardPage**
Two tabs: Global and By Category. Table of users with rank, avatar, username, ELO, tier badge, W/L/T. The current user's row is highlighted and has a "You" badge. Rows animate in with stagger on load. Infinite scroll for more entries.

---

## Shared Components

**Step 88 — Create EloBadge**
Takes ELO number, computes tier, renders colored badge. Bronze, Silver, Gold, Platinum, Diamond — each with its own color. Diamond gets a subtle gradient shimmer animation using Framer Motion.

**Step 89 — Create InfiniteScrollTrigger**
Uses `IntersectionObserver`. Calls `onVisible` prop when it enters the viewport. Used across SessionFeed, DebateHistoryList, NotificationDrawer, LeaderboardPage.

**Step 90 — Create ErrorBoundary**
Class component. Fallback UI with error message and "Reload page" button. Wrap the full app and also DebatePage and VerdictPage individually.

**Step 91 — Create ConfirmModal**
Reusable Dialog. Props: `isOpen`, `onClose`, `onConfirm`, `title`, `body`, `confirmLabel`, `confirmVariant` (default or danger). Danger variant shows a red confirm button. Used by SubmitButton, Concede, Cancel session.

---

## Route Guards

**Step 92 — Create ProtectedRoute**
Reads from `AuthContext`. If `isLoading` is true, shows a full-screen spinner. If no user, redirects to `/login` with the intended URL stored in location state. If user is banned, redirects to a `/suspended` page showing the ban expiry.

**Step 93 — Create debate route guards**
`/lobby/:sessionId`, `/debate/:sessionId`, `/writing/:sessionId` check that the current user is a participant of that session. Read from `DebateContext.sessionId` — if it doesn't match the URL param, redirect to `/sessions/:sessionId` detail page. This prevents direct URL access to debates the user isn't part of.

---

## Polish

**Step 94 — Add page transitions**
In `AppLayout`, wrap `<Outlet />` with `AnimatePresence` keyed by `location.pathname`. Each page uses the `pageTransition` variant (fade + slight upward movement). Duration 0.2s — fast enough to not feel sluggish.

**Step 95 — Add loading skeletons**
Every page that fetches data shows skeletons during the initial load. `SessionFeed` shows 6 skeleton card shapes. `ProfilePage` shows skeleton versions of the header and stats. `VerdictPage` shows the AI processing screen. Skeletons use a CSS shimmer animation (background-position moving on a gradient).

**Step 96 — Add empty states**
Every list that can be empty has an `EmptyState` with an icon, message, and action button. `SessionFeed` empty: "No open debates — start one." `DebateHistoryList` empty: "No debates yet." `ChallengesPage` empty: "No challenges yet."

**Step 97 — Handle socket disconnection**
In `useDebateSocket`, listen for socket `disconnect` event. Show a Sonner toast: "Connection lost — reconnecting..." On reconnect, rejoin the debate room and refetch session state from the API. If reconnect fails after 60 seconds, show a full-screen overlay with a "Try again" button.

**Step 98 — Add mobile responsiveness**
Audit every page at 375px. Changes: Sidebar becomes a bottom nav bar on mobile. `SessionCard` stacks vertically. `LobbyPanel` stacks both `PlayerCard` components vertically. `DebatePage` shows `SubQuestionList` as a collapsible bottom sheet triggered by a button. `WritingPanel` shows one `QuestionEditor` at a time with prev/next navigation and a dot indicator showing current question. `VerdictPage` `ScoreCard` components stack vertically.

---

## Implementation Order

**Phase 1 — Shell (Steps 1–9)**
Vite setup, Tailwind, shadcn, Framer Motion variants, Router, Axios, TanStack Query, Socket.io client.

**Phase 2 — Context + Hooks (Steps 10–17)**
All three contexts, all hooks, types, API modules.

**Phase 3 — Landing page (Steps 20–26)**
LandingNavbar, HeroSection, HowItWorks, Features, AIJudge, Stats, LandingPage.

**Phase 4 — Auth (Steps 27–31)**
Login, Register, VerifyEmail.

**Phase 5 — Layout (Steps 32–35)**
GuestLayout, AppLayout, Sidebar, Topbar.

**Phase 6 — Home feed (Steps 36–39)**
HomePage, SessionFilters, SessionFeed, SessionCard.

**Phase 7 — Create session (Steps 40–42)**
CreateSessionPage, form, SubQuestionBuilder.

**Phase 8 — Join + Lobby (Steps 43–47)**
SessionDetailPage, join flow, LobbyPage, LobbyPanel, PlayerCard, ReadyButton.

**Phase 9 — Debate Phase 1 (Steps 48–54)**
DebatePage, PhaseTimer, CallPlaceholder, SubQuestionList, PhaseTransition, socket hooks.

**Phase 10 — Debate Phase 2 (Steps 55–59)**
WritingPage, WritingPanel, QuestionEditor, WritingTimer, SubmitButton.

**Phase 11 — Verdict (Steps 60–68)**
VerdictPage through ShareCard — the full reveal experience.

**Phase 12 — Profile (Steps 69–75)**
All profile pages and sub-components.

**Phase 13 — Social (Steps 76–87)**
Challenges, Notifications, Observer, Leaderboard.

**Phase 14 — Polish (Steps 88–98)**
Shared components, route guards, page transitions, skeletons, empty states, disconnection handling, mobile.
