# DebateArena — Full Design Specification
### Senior Graphic Designer's Complete Visual Guide

---

## Design Philosophy

DebateArena is a serious, competitive platform. The design language should feel like a premium sports app crossed with a legal courtroom — authoritative, sharp, and intense. Not playful. Not corporate. Think ESPN meets a high-end dark-mode productivity tool. Every screen should make the user feel like what they're doing matters.

**Three words that define every design decision:** Intensity. Clarity. Prestige.

---

## 1. Color System

### Base Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0A0B0F` | Page background — near black with a blue undertone |
| `--surface-1` | `#111318` | Cards, panels, modals — one step above background |
| `--surface-2` | `#1A1D26` | Inputs, secondary cards, hover states |
| `--surface-3` | `#22263A` | Active states, selected items |
| `--border` | `rgba(255,255,255,0.06)` | Subtle borders on cards |
| `--border-strong` | `rgba(255,255,255,0.12)` | More visible borders, dividers |

### Text

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#F0EDE8` | Headings, important content — warm white, not pure white |
| `--text-secondary` | `#8A8A96` | Subtitles, labels, secondary info |
| `--text-muted` | `#4A4A58` | Placeholders, disabled text, timestamps |

### Accent — Gold

The gold accent is the identity of the platform. It represents prestige, victory, and the AI judge. Used sparingly — only for the most important elements.

| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#C9A84C` | Primary CTA buttons, active states, winner highlights |
| `--accent-bright` | `#E8C97A` | Hover state of accent elements |
| `--accent-dim` | `rgba(201,168,76,0.12)` | Subtle accent backgrounds, badges |
| `--accent-border` | `rgba(201,168,76,0.3)` | Borders on accent elements |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `--win` | `#4CAF82` | Win badges, success states |
| `--win-dim` | `rgba(76,175,130,0.12)` | Win badge backgrounds |
| `--loss` | `#E05C5C` | Loss badges, error states, danger actions |
| `--loss-dim` | `rgba(224,92,92,0.12)` | Loss badge backgrounds |
| `--tie` | `#7A8BA8` | Tie badges, neutral states |
| `--tie-dim` | `rgba(122,139,168,0.12)` | Tie badge backgrounds |
| `--warning` | `#E8A44C` | Timer warnings, caution states |

### ELO Tier Colors

| Tier | Primary | Glow |
|---|---|---|
| Bronze | `#CD7F32` | `rgba(205,127,50,0.3)` |
| Silver | `#A8B2C0` | `rgba(168,178,192,0.3)` |
| Gold | `#C9A84C` | `rgba(201,168,76,0.4)` |
| Platinum | `#4ECDC4` | `rgba(78,205,196,0.35)` |
| Diamond | Gradient `#6A8EF0` → `#C084F5` | `rgba(106,142,240,0.4)` |

---

## 2. Typography

### Font Stack
- **Display / Headings:** `Playfair Display` — serif, gives weight and prestige to major headings
- **Body / UI:** `DM Sans` — clean, modern sans-serif for all UI text
- **Mono / Data:** `DM Mono` — for ELO numbers, timers, scores, stats, labels

### Scale

| Name | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `display-xl` | Playfair Display | 72px | 900 | 1.0 | Landing page hero |
| `display-lg` | Playfair Display | 52px | 800 | 1.05 | Section headings |
| `display-md` | Playfair Display | 36px | 700 | 1.1 | Page titles |
| `display-sm` | Playfair Display | 26px | 700 | 1.2 | Card titles, modal titles |
| `heading` | DM Sans | 20px | 600 | 1.3 | Section subheadings |
| `body-lg` | DM Sans | 17px | 400 | 1.7 | Hero subtext, key descriptions |
| `body` | DM Sans | 15px | 400 | 1.75 | Default body text |
| `body-sm` | DM Sans | 13px | 400 | 1.6 | Secondary descriptions, card text |
| `label` | DM Sans | 12px | 500 | 1.4 | Input labels, badges |
| `label-sm` | DM Sans | 11px | 500 | 1.3 | Eyebrows, overlines |
| `mono-lg` | DM Mono | 32px | 400 | 1.0 | Large ELO numbers, big scores |
| `mono-md` | DM Mono | 18px | 400 | 1.0 | Timer display, stat numbers |
| `mono-sm` | DM Mono | 12px | 400 | 1.0 | Small data labels, codes |

### Typography Rules
- Headings use Playfair Display. Everything else uses DM Sans.
- Numbers that represent scores, ELO, timers always use DM Mono.
- Letter-spacing on all uppercase labels: `0.10em`.
- Never use pure white `#FFFFFF` for text — always use `--text-primary` `#F0EDE8` which is warmer.
- Paragraph text max width: `680px` to maintain readability.

---

## 3. Spacing System

Uses an 8px base grid. All spacing values are multiples of 4 or 8.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro gaps, icon padding |
| `--space-2` | 8px | Tight spacing between inline elements |
| `--space-3` | 12px | Inner card padding (tight), badge padding |
| `--space-4` | 16px | Standard inner padding |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section element gaps |
| `--space-8` | 32px | Card gap, between form fields |
| `--space-10` | 40px | Section inner padding top/bottom |
| `--space-12` | 48px | Between major sections |
| `--space-16` | 64px | Large section gaps |
| `--space-24` | 96px | Landing page section padding |
| `--space-32` | 128px | Hero top padding |

---

## 4. Elevation & Shadows

| Level | CSS | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Small cards, inputs |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Verdict cards, main panels |
| `shadow-accent` | `0 0 24px rgba(201,168,76,0.2)` | Winner cards, CTA buttons on hover |
| `shadow-danger` | `0 0 16px rgba(224,92,92,0.2)` | Error states, concede button |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Badges, tags, small buttons |
| `--radius-md` | `10px` | Inputs, small cards |
| `--radius-lg` | `14px` | Standard cards, panels |
| `--radius-xl` | `20px` | Large cards, modals |
| `--radius-full` | `9999px` | Pills, avatar circles, round buttons |

---

## 6. Iconography

- Library: Lucide React
- All icons in UI: `20px` size, `1.5px` stroke width
- Icons inside buttons: `16px`
- Large decorative icons in empty states and features: `32px`, but wrapped in a styled container
- Icon color always matches the context text color — never use a different color for icons unless intentionally calling attention

---

## 7. Core Component Specs

### Button

Four variants. All buttons have `border-radius: --radius-sm` (6px), `font: DM Sans 14px 500`, `letter-spacing: 0.02em`, `height: 40px`, `padding: 0 20px`.

**Primary (Gold)**
- Background: `--accent` `#C9A84C`
- Text: `#0A0B0F` (dark, high contrast on gold)
- Hover: background `--accent-bright` `#E8C97A`, box-shadow `shadow-accent`
- Active: scale down to 0.97 (Framer Motion `whileTap`)
- Disabled: background `rgba(201,168,76,0.3)`, text `rgba(0,0,0,0.4)`, cursor not-allowed

**Secondary**
- Background: `--surface-2`
- Text: `--text-primary`
- Border: `1px solid --border-strong`
- Hover: background `--surface-3`, border-color `rgba(255,255,255,0.2)`

**Ghost**
- Background: transparent
- Text: `--text-secondary`
- Hover: background `rgba(255,255,255,0.05)`, text `--text-primary`

**Danger**
- Background: `--loss-dim`
- Text: `--loss`
- Border: `1px solid rgba(224,92,92,0.3)`
- Hover: background `rgba(224,92,92,0.2)`, box-shadow `shadow-danger`

### Input

- Height: `44px`
- Background: `--surface-2`
- Border: `1px solid --border`
- Border radius: `--radius-md` (10px)
- Text: `--text-primary`, `DM Sans 15px`
- Placeholder: `--text-muted`
- Focus: border-color `--accent-border`, box-shadow `0 0 0 3px rgba(201,168,76,0.1)`, no default browser outline
- Error: border-color `rgba(224,92,92,0.5)`, box-shadow `0 0 0 3px rgba(224,92,92,0.08)`
- Label above: `DM Sans 12px 500`, `--text-secondary`, `margin-bottom: 6px`

### Textarea

Same as Input but `min-height: 100px`, `resize: vertical`, `padding: 12px 14px`, `line-height: 1.65`.

### Card

The standard card is the most repeated element in the app.
- Background: `--surface-1`
- Border: `1px solid --border`
- Border radius: `--radius-lg` (14px)
- Padding: `20px 24px`
- No box-shadow by default
- Hover (when interactive): border-color `--border-strong`, background slightly lighter `rgba(255,255,255,0.02)` added on top

**Accent card** (used for winner, featured session): same as above but with a top border 2px in `--accent` and subtle `--accent-dim` background.

### Badge / Tag

- Border radius: `--radius-sm` (6px)
- Font: `DM Sans 11px 500`, `letter-spacing: 0.06em`
- Padding: `3px 8px`
- Height: `22px`

Win badge: background `--win-dim`, text `--win`
Loss badge: background `--loss-dim`, text `--loss`
Tie badge: background `--tie-dim`, text `--tie`
Category badge: background `rgba(255,255,255,0.06)`, text `--text-secondary`
Format badge (Quick/Standard/Extended): same as category

### Avatar

- Shape: circle, `border-radius: --radius-full`
- Sizes: 24px (inline), 32px (list items), 40px (cards), 56px (profile header), 80px (large profile)
- Border: `2px solid --border-strong` on the 56px and 80px sizes
- Fallback: dark background with the first letter of the username in `--text-secondary` DM Sans

### EloBadge

A small pill next to a username. Font: DM Mono 11px. Padding: `2px 8px`. Border-radius: `--radius-full`.

- Bronze: `background: rgba(205,127,50,0.15)`, `color: #CD7F32`, `border: 1px solid rgba(205,127,50,0.3)`
- Silver: same pattern with silver values
- Gold: same pattern with gold values
- Platinum: same pattern with platinum values
- Diamond: `background: linear-gradient(135deg, rgba(106,142,240,0.15), rgba(192,132,245,0.15))`, text uses gradient via `-webkit-background-clip: text`, border is gradient — this is the only badge that gets special treatment

### Divider

- `border: none`
- `border-top: 1px solid --border`
- Used to separate sections within a card, or between the sidebar nav groups

---

## 8. Layout System

### App Shell (authenticated pages)

```
┌────────────────────────────────────────────────┐
│  TOPBAR — height: 60px, fixed, z-index: 100    │
├──────────────┬─────────────────────────────────┤
│              │                                  │
│  SIDEBAR     │   MAIN CONTENT                  │
│  width: 240px│   padding: 32px                 │
│  fixed       │   max-width: 1100px             │
│              │   centered                       │
│              │                                  │
└──────────────┴─────────────────────────────────┘
```

Main content area max-width is `1100px`, centered. On screens wider than that, the background shows on both sides. Page content left-padding accounts for the `240px` sidebar.

### Guest Shell (auth pages)

Full viewport, vertical + horizontal center. The background is the same `--bg` color but a very subtle radial gradient from the center: `radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.04) 0%, transparent 70%)`. This gives a very faint warm glow in the center of auth screens without being noticeable.

---

## 9. Screen-by-Screen Design

---

### 9.1 Landing Page

**Overall feel:** Dark, cinematic, premium. Think a teaser trailer for a competitive platform.

**LandingNavbar**
- Position: fixed top, full width
- Height: `70px`
- Default state: fully transparent, no border
- Scrolled state: `background: rgba(10,11,15,0.85)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid --border`
- Transition: CSS `transition: background 0.3s, border 0.3s`
- Left: DebateArena wordmark. Font: Playfair Display 22px 700. The word "Debate" in `--text-primary`, "Arena" in `--accent`.
- Right: Ghost "Login" button + Primary "Get Started" button. Small gap between.
- On mobile (< 768px): hamburger icon replaces nav links, opens a full-screen overlay menu.

**HeroSection**
- Height: `100vh`, minimum `700px`
- Background: `--bg` with two large blurred gradient orbs:
  - Orb 1: `400px` circle, `background: radial-gradient(circle, rgba(201,168,76,0.12), transparent)`, positioned top-left `(-100px, 100px)`, animated very slowly drifting: `x: [-100, -80, -100], y: [100, 130, 100]` over 12 seconds, repeat infinity.
  - Orb 2: `500px` circle, `background: radial-gradient(circle, rgba(106,142,240,0.08), transparent)`, positioned bottom-right `(+80px, -50px)`, animated: `x: [80, 60, 80], y: [-50, -80, -50]` over 15 seconds, repeat infinity.
- Content centered, max-width `720px`, center-aligned text.
- Eyebrow: `DM Sans 11px 500 letter-spacing 0.18em uppercase`, color `--accent`, content `"AI-POWERED DEBATE PLATFORM"`. Animated: fade in, `y: 10 → 0`, delay 0s.
- H1: Playfair Display, `clamp(44px, 6vw, 72px)`, weight 900. Content: `"Debate Anyone."` line break `"Win on Merit."`. "Merit." in `--accent`. Animated: `y: 20 → 0`, fade in, delay 0.15s.
- Subheading: DM Sans 18px, `--text-secondary`, max-width `520px`. Animated: `y: 16 → 0`, fade in, delay 0.3s.
- CTA row: two buttons side by side, `gap: 12px`. Primary "Start Debating →" and Ghost "Watch a Live Debate". Animated: `y: 12 → 0`, fade in, delay 0.45s.
- Scroll indicator: a small animated downward chevron at the very bottom center, `opacity: 0.3`, bouncing up and down with `y: [0, 6, 0]` repeat infinity at 1.5s.
- Stat counter strip: at the very bottom of the section, a horizontal row of 3 stats separated by vertical dividers. Background: `rgba(255,255,255,0.03)`, `border-top: 1px solid --border`, `border-bottom: 1px solid --border`. Each stat: a large DM Mono number in `--text-primary` and a DM Sans 13px label in `--text-secondary`. Numbers count up when the section enters viewport.

**HowItWorksSection**
- Background: `--bg`
- Top padding: `128px`, bottom padding: `128px`
- Section eyebrow: `"HOW IT WORKS"`, `DM Sans 11px 500 letter-spacing 0.18em`, `--accent`
- Section heading: Playfair Display 44px, `--text-primary`
- Below heading: a 4-step horizontal timeline on desktop, vertical on mobile.
- Connecting line between steps: a thin `1px` horizontal line in `--border-strong`, with a Framer Motion SVG overlay that has `pathLength` animated from 0 to 1 when the section enters viewport over 1.5s ease-out.
- Each step: centered column. Number badge at top: `40px` circle, `background: --accent-dim`, `border: 1px solid --accent-border`, DM Mono 16px `--accent`. Icon below number. Title: DM Sans 16px 600 `--text-primary`. Description: DM Sans 14px `--text-secondary`.
- Steps animate in sequentially with `whileInView`, `viewport once: true`, stagger 0.15s each.

**FeaturesSection**
- Background: `--surface-1` — slightly lighter than `--bg` to create a visual break between sections
- Padding: `96px` top/bottom
- Heading centered, Playfair Display 44px
- Grid: 3 columns on desktop, 2 on tablet, 1 on mobile. `gap: 16px`.
- Each feature card: `background: --bg`, `border: 1px solid --border`, `border-radius: --radius-lg`, `padding: 28px`. Icon container: `44px` square, `border-radius: --radius-md`, background matches the icon's accent color at 10% opacity. Icon: 22px, accent color. Title: DM Sans 16px 600. Description: DM Sans 14px `--text-secondary`.
- On hover: `y: -4px`, border brightens to `--border-strong`, subtle `shadow-md`. Framer Motion `whileHover`.
- Cards animate in with `whileInView` + stagger when the grid enters viewport.

**AIJudgeSection**
- Background: `--bg`
- Two-column layout, `gap: 80px`, vertically centered. Left: copy. Right: mock verdict card.
- Left side: eyebrow "THE AI JUDGE", headline Playfair Display 44px "An impartial verdict. Every time.", body copy DM Sans 17px, a short bullet list of what the AI scores (5 criteria) with small gold checkmark icons.
- Right side: a mock `ScoreCard` component with fabricated data. The card uses `--surface-1` background, `--accent` top border 2px. Score bars animate from 0 to their target values when this section enters the viewport, one by one with stagger. This is the most visually impressive element on the landing page — spend the most effort here.
- On mobile: stacks to single column, copy on top, mock card below.

**StatsSection**
- Full-width dark banner: `background: --surface-1`, `border-top: 1px solid --border`, `border-bottom: 1px solid --border`
- Padding: `80px` top/bottom
- 4 stats in a row: number in DM Mono 52px `--text-primary`, label in DM Sans 14px `--text-secondary` below
- Vertical `1px --border` dividers between stats
- Numbers count up from 0 on viewport entry using `requestAnimationFrame`

**Final CTA Section**
- Background: `--bg` with the same subtle gold radial gradient from the hero
- Centered content: Playfair Display 48px heading, subtext, Primary CTA button
- This section should feel like a closing argument — make it feel final and compelling

---

### 9.2 Auth Pages (Login / Register)

**GuestLayout**
- Full screen `--bg` background
- Same very subtle `radial-gradient` as hero center glow
- Card: `background: --surface-1`, `border: 1px solid --border`, `border-radius: --radius-xl` (20px), `padding: 40px`, max-width `420px`, centered
- Logo above card: Playfair Display 24px, "Debate**Arena**" with "Arena" in `--accent`

**LoginPage**
- Card contains: logo small at top, heading "Welcome back" DM Sans 22px 600, subtitle "Sign in to your account" `--text-secondary`
- Form: email input, password input with eye icon toggle, "Forgot password?" ghost link right-aligned
- Primary submit button full width
- Divider "or continue with" in `--text-muted` with lines on either side
- Google OAuth button: `background: --surface-2`, `border: 1px solid --border-strong`, icon + "Continue with Google" text, secondary style
- "Don't have an account? Register" link at the bottom centered

**RegisterPage**
- Same card layout, heading "Create your account"
- Fields: Username (with live availability indicator — small spinner while checking, green dot if available, red dot if taken), Email, Password, Confirm Password
- Age confirmation checkbox: smaller text below, a subtle info callout `background: --accent-dim`, `border-left: 3px solid --accent`, explaining that users must be 16+
- Inline errors: `DM Sans 12px`, `--loss` color, appear below each field with `fadeInDown` animation
- Submit button full width, primary style

---

### 9.3 App Sidebar

Width: `240px`. Background: `--surface-1`. `border-right: 1px solid --border`. Fixed on the left.

**Top:** Logo wordmark `Playfair Display 18px` with padding `20px`.

**Navigation links:** Each link is `44px` tall, `border-radius: --radius-md`, `padding: 0 12px`, `gap: 10px` between icon and label. `DM Sans 14px 500`.
- Default state: icon and text both `--text-secondary`
- Hover: `background: rgba(255,255,255,0.04)`, icon and text `--text-primary`
- Active: `background: --surface-3`, icon `--accent`, text `--text-primary`. A `3px` left border in `--accent` on the active item.
- Active indicator slides between items using Framer Motion `layoutId` — it's an absolutely positioned `3px` left border that animates smoothly.

**Create Debate button:** Below the main nav links, a full-width button inside the sidebar. `background: --accent-dim`, `border: 1px solid --accent-border`, `color: --accent`, `DM Sans 14px 600`. Hover: `background: rgba(201,168,76,0.18)`.

**Bottom:** User info row: `40px` avatar, username `DM Sans 14px 500 --text-primary`, EloBadge below username. Separated from the nav by a full-width `--border` divider.

---

### 9.4 Topbar

Height: `60px`. Background: `--surface-1`. `border-bottom: 1px solid --border`. Fixed top, full width minus sidebar.

Right side: notification bell icon (20px, `--text-secondary`, hover `--text-primary`) with unread count badge (`12px` circle, `background: --loss`, `DM Mono 10px white`). Then the user avatar `32px` that opens a dropdown menu on click.

---

### 9.5 Home Feed

**SessionFilters**
- Category tabs: a horizontal scrolling row of pill buttons. Each pill: `background: --surface-2`, `border: 1px solid --border`, `border-radius: --radius-full`, `DM Sans 13px 500`, `padding: 6px 16px`. Active: `background: --accent-dim`, `border-color: --accent-border`, `color: --accent`. The active state transitions smoothly with Framer Motion `layoutId` on the background.
- Search input: `background: --surface-2`, `border: 1px solid --border`, `border-radius: --radius-full`, left-aligned search icon inside, `height: 40px`. Below the category tabs.
- Sort dropdown: right-aligned, ghost button style with a chevron icon.

**SessionCard**
- `background: --surface-1`, `border: 1px solid --border`, `border-radius: --radius-lg`, `padding: 20px`
- Top row: category badge left, format badge right. Both are small tags.
- Title: Playfair Display 18px 700, `--text-primary`, `margin: 10px 0 6px`. Max 2 lines, truncate with ellipsis.
- Creator stance: a small colored pill — blue-tinted `background: rgba(106,172,240,0.1)`, `color: #6AACF0`, `border: 1px solid rgba(106,172,240,0.2)`, DM Sans 12px — showing their position.
- Creator row: `32px` avatar + username `DM Sans 13px --text-secondary` + EloBadge.
- Bottom row: observer count with eye icon `--text-muted 12px` on the left, "X min ago" timestamp `--text-muted 12px`, Join button (small, secondary style, `height: 32px`) on the right.
- Hover: `border-color: --border-strong`, `transform: translateY(-2px)`, `shadow-sm` appears. Framer Motion `whileHover`.
- Grid: 2 columns on desktop, 1 on mobile. `gap: 14px`.

---

### 9.6 Create Session Page

Two-step form. Step indicator at the top: two circles connected by a line. Active step: `--accent` filled circle with number. Inactive: `--surface-2` circle with `--text-muted` number.

**Step 1 — Session Details**
- Page background: `--bg`. Content in a centered card `max-width: 640px`.
- Form fields spaced `24px` apart.
- Format selector: three large radio-style cards in a row. Each card: `background: --surface-2`, `border: 2px solid --border`, `border-radius: --radius-lg`, `padding: 16px`. Contains format name, round count, and a short description. Selected: `border-color: --accent`, `background: --accent-dim`. Transition: border-color and background animate smoothly on selection.
- Visibility toggle: a segmented control, two options "Public" and "Invite Only." Selected segment: `background: --surface-3`, `color: --text-primary`. Unselected: transparent, `--text-muted`.

**Step 2 — Sub-Questions**
- Heading "Define the 5 sub-questions" with a description explaining their purpose.
- Five numbered input fields. Number badge on the left of each: `28px` circle, `background: --accent-dim`, `DM Mono 13px --accent`.
- Each input has a hint below it: `DM Sans 11px --text-muted`.
- An "AI Suggest" micro-button (ghost, tiny) to the right of each field. On click: field gets a loading shimmer, then text types itself in.
- "Next" button at the bottom right: primary style.

---

### 9.7 Session Detail Page

Split layout: left `60%` for session info, right `40%` for the join panel.

**Left — Session Info**
- Category badge + format badge in a row at the top.
- Title: Playfair Display 28px 700.
- Creator card: horizontal row with avatar, name, EloBadge, stance indicator.
- Divider.
- "The 5 Sub-Questions" heading DM Sans 14px 600 `--text-secondary` uppercase. Five numbered cards stacked. Each card: `background: --surface-2`, `border-radius: --radius-md`, `padding: 14px 16px`. Number on the left in `--accent` DM Mono. Question text DM Sans 15px.
- Observer count row at the bottom: eye icon + "X people are watching" `--text-muted`.

**Right — Join Panel**
- Card: `background: --surface-1`, `border: 1px solid --border-strong`, `border-radius: --radius-xl`, `padding: 28px`, sticky on desktop.
- Session status badge at top center.
- If joinable: a Textarea for the user's stance, then a large primary "Join & Enter Lobby" button.
- If waiting (user is creator): "Waiting for an opponent..." with a subtle pulsing indicator dot (green, `repeat: infinity`). "Copy invite link" ghost button.
- If active or completed: appropriate CTA buttons.

---

### 9.8 Lobby Page

Full-screen layout centered vertically and horizontally. No sidebar or topbar — this is a focused experience.

Background: `--bg` with the subtle gold center glow from the auth pages. It signals that something important is about to start.

**LobbyPanel**
- Max-width `720px`, centered.
- At the top: session title in Playfair Display 24px centered.
- Two `PlayerCard` components side by side with a "VS" badge between them. The VS: DM Mono 20px, `--text-muted`, inside a `40px` circle `background: --surface-2`.
- Divider.
- The 5 sub-questions listed in a compact read-only format below.
- Divider.
- A rules/format summary row: three items (format name, total rounds, time per phase) as small stat chips.
- `ReadyButton` at the bottom: large, full-width primary button `height: 56px`, font DM Sans 16px 600. Once clicked: turns green with a checkmark icon + "Ready ✓" text.
- "Waiting for opponent..." text below the button, fades in after 2 seconds if the opponent hasn't readied yet.

**PlayerCard**
- `background: --surface-2`, `border: 1px solid --border`, `border-radius: --radius-lg`, `padding: 20px`, width roughly `45%`.
- Avatar `56px` centered at top.
- Username DM Sans 15px 600 centered.
- EloBadge centered below username.
- Stance: a small text block `DM Sans 13px --text-secondary` with `"Position: ..."` label.
- Ready indicator at the bottom: grey dot + "Not ready" OR pulsing green dot + "Ready" — animated transition between states.

---

### 9.9 Debate Page (Phase 1)

Full-screen experience, no sidebar. A persistent header strip replaces the normal topbar.

**Header strip** (height `56px`, `background: --surface-1`, `border-bottom: 1px solid --border`):
- Left: topic title truncated, `DM Sans 14px 600`
- Center: Phase badge "Phase 1 — Discussion" in an amber-tinted pill
- Right: `PhaseTimer`

**Main layout:** Two columns. Left `65%`: `CallPlaceholder`. Right `35%`: `SubQuestionList`.

**CallPlaceholder**
- Full height of the content area. `background: --surface-1`, `border-radius: --radius-xl`, `border: 1px solid --border`.
- Inside: centered content with a microphone icon (large, `48px`), a heading "Live Discussion", a subheading "Argue each sub-question with your opponent."
- Two participant name chips at the bottom of the panel showing who is in the call.
- Subtle animated pulsing ring around the microphone icon to suggest live activity: `scale: [1, 1.15, 1]`, `opacity: [0.3, 0.1, 0.3]`, repeat infinity 2s.

**SubQuestionList**
- Scrollable if needed. Heading "Sub-Questions" `DM Sans 13px 600 --text-secondary uppercase`.
- 5 cards stacked with `gap: 8px`. Each: `background: --surface-2`, `border-radius: --radius-md`, `padding: 12px 14px`. Number in `--accent`. Text `DM Sans 14px`.

**PhaseTimer**
- DM Mono 24px showing MM:SS.
- A thin progress ring around the timer (SVG circle) that drains clockwise as time runs out.
- Color: green → amber → red based on thresholds.

**Bottom bar** (height `52px`, `background: --surface-1`, `border-top: 1px solid --border`):
- A "Concede" button in the bottom-left: Danger style, small.

---

### 9.10 Writing Page (Phase 2)

Full-screen, no sidebar. Same persistent header strip as Phase 1 but badge changes to "Phase 2 — Writing" in a blue-tinted pill.

**WritingTimer:** Displayed prominently in the header strip. Larger than Phase 1 timer: DM Mono 28px. Color transitions same pattern. Under 30 seconds: pulsing ring animation.

**Main content:** Single centered column, max-width `760px`.

**Progress bar** below the header: "3 / 5 questions answered." A slim `4px` bar full width. Background `--surface-2`, fill `--accent`, `border-radius: --radius-full`. Animated: fill width changes smoothly with Framer Motion as answers are saved.

**QuestionEditors:** 5 stacked sections. Each:
- Question header: `background: --surface-2`, `border-radius: --radius-md --radius-md 0 0` (top rounded only), `padding: 12px 16px`. Number badge + question text DM Sans 15px 600.
- Editor area: `background: --surface-1`, `border: 1px solid --border`, `border-radius: 0 0 --radius-md --radius-md` (bottom rounded only), connected visually to the header. Min-height `160px`, `padding: 16px`. TipTap editor inside, no toolbar, clean cursor.
- Word count: `DM Mono 11px --text-muted` bottom-right of the editor area.
- When focused: the entire section (header + editor) gets `border-color: --accent-border` and a very subtle `box-shadow: 0 0 0 3px rgba(201,168,76,0.06)`.

**SubmitButton:** Centered below all 5 editors. Primary style, large `height: 52px`, full width. Text "Submit All Answers." Disabled state: gold-less, greyed out. When all 5 answered: gold lights up with a subtle shimmer animation before the user clicks, drawing the eye.

---

### 9.11 Verdict Page

Full-screen, no sidebar, no topbar. This is a standalone cinematic moment.

**Background:** `--bg` with two large gradient orbs similar to the landing hero, but positioned differently — one top-left in gold, one bottom-right in blue. They are larger and slightly more intense because this is the most dramatic page.

**Loading state (while AI processes):**
- Centered: DebateArena logo, below it the text "AI Judge is reading both sides..." `DM Sans 16px --text-secondary`, below it three animated dots pulsing in sequence. No other elements. Minimal. Tension.

**WinnerBanner**
- Full-width, centered.
- Win state: `background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`, `border: 1px solid --accent-border`. Trophy icon `--accent` 32px. Winner's avatar `64px` with a gold border `3px solid --accent`. Username Playfair Display 28px 700. "Won this debate" DM Sans 16px `--text-secondary`.
- Tie state: neutral gradient, handshake icon, "It's a Tie" in `--text-primary`.
- Confetti: on a win, 40 small particles (rectangles 6px × 3px) in varying gold/white/amber colors rain down from the top of the banner with randomized start X positions, fall velocity, and rotation. Duration 2.5 seconds, no repeat.

**ScoreCards** — side by side below the banner, `gap: 16px`.
- Each card: `background: --surface-1`, `border: 1px solid --border`, `border-radius: --radius-xl`, `padding: 28px`.
- Winner card: `border-color: rgba(201,168,76,0.3)`, `box-shadow: 0 0 32px rgba(201,168,76,0.1)`.
- Total score: DM Mono 48px `--accent` (winner) or `--text-secondary` (loser).
- 5 `CriterionBar` rows below. Each: label `DM Sans 12px --text-secondary` left, animated bar in the middle, score `DM Mono 14px --text-primary` right.
- Bar colors: gradient from `rgba(201,168,76,0.3)` to `--accent` for winner, grey for loser. Bars animate from 0 on stagger.

**SubQuestionVerdict** — full width, below the score cards.
- Heading "Point-by-Point Breakdown" DM Sans 16px 600.
- 5 accordion items using shadcn Accordion. Each closed item shows the question number, a snippet of the question, and a small badge showing who won that point. Open item shows the full question and the AI explanation.
- The per-point winner badge: green "Player A" or blue "Player B" — two distinct colors so there's immediate visual clarity on who dominated.

**VerdictSummary** — full width card.
- `background: --surface-1`, `border-left: 3px solid --accent`, `border-radius: --radius-lg`, `padding: 28px 32px`.
- Heading "AI Judge's Summary" with a small scales-of-justice icon in `--accent`.
- Typewriter text effect for the summary paragraphs.

**ObserverVoteTally** — if observers voted.
- Two horizontal bars showing the split. A heading "What the audience thought" `DM Sans 13px --text-secondary`.

**Share row** — at the very bottom.
- "Share Result" primary button, "Share on X" ghost button, "View Full Transcript" ghost button.

---

### 9.12 User Profile

**ProfileHeader**
- Not a card — extends the full width of the page with `background: --surface-1`, `border-bottom: 1px solid --border`, `padding: 40px 0`.
- Left: Avatar `80px` with ELO tier colored border. Right of avatar: username Playfair Display 28px, EloBadge, bio DM Sans 15px `--text-secondary`, member since `DM Mono 12px --text-muted`.
- Right side (desktop): a "Challenge" button if viewing someone else, an "Edit Profile" button if viewing own.

**StatsGrid**
- Row of 7 stat cards. `background: --surface-1`, `border: 1px solid --border`, `border-radius: --radius-lg`, `padding: 20px`. Number DM Mono 28px `--text-primary` on top. Label DM Sans 12px `--text-secondary` below. On own profile, Win count is in `--win`, Loss count in `--loss`.

**TopicRatings**
- Per-category rows. Category name, ELO number DM Mono 16px, W/L/T in small badges, a slim bar showing ELO/2000 ratio. Bars animate on scroll into view.

**AverageScores**
- A recharts RadarChart. `--surface-1` background card. Radar fill: `rgba(201,168,76,0.15)`. Radar stroke: `--accent`. Grid lines: `--border`. Axis labels: DM Sans 12px `--text-secondary`.

**DebateHistoryList**
- Each item: horizontal row, `border-bottom: 1px solid --border`, `padding: 14px 0`. Topic DM Sans 14px 600, opponent name + EloBadge, outcome badge (W/L/T), category badge, date `DM Mono 12px --text-muted`, "View Verdict" link in `--accent`.

**BadgeGrid**
- 5-column grid. Each badge item: circle container `56px`, centered. Earned: full color icon + label below `DM Sans 11px`. Unearned: `filter: grayscale(1) opacity(0.3)` with a lock icon overlay.

---

### 9.13 Leaderboard

- Full-width table. `background: --surface-1`, `border-radius: --radius-xl`, `overflow: hidden`.
- Table header: `background: --surface-2`, `DM Sans 11px 500 --text-muted uppercase letter-spacing 0.1em`, `padding: 10px 16px`.
- Rank column: DM Mono 14px `--text-muted`. Top 3 ranks get gold / silver / bronze colored number.
- Avatar + username row. EloBadge in the tier column.
- Current user row: `background: rgba(201,168,76,0.06)`, `border-left: 3px solid --accent`.
- Rows alternate barely: odd rows are default, even rows add `rgba(255,255,255,0.01)`.
- Clicking a username navigates to their profile.

---

### 9.14 Challenges Page

- Two-tab layout. Tab active indicator: a `2px` bottom border in `--accent` that slides using Framer Motion `layoutId`.
- Each `ChallengeCard`: a standard card. Left side: challenger avatar + username + EloBadge + topic. Right side: Accept / Decline buttons. Below topic: a small expiry countdown in `DM Mono 12px --warning` if expiring within 24 hours.

---

### 9.15 Notifications Drawer

- Sheet slides in from the right, width `380px`.
- Header: "Notifications" DM Sans 16px 600, "Mark all read" ghost button right-aligned.
- Each item: icon (circle `32px` background tinted to notification type color), title DM Sans 14px, body DM Sans 13px `--text-secondary`, time ago DM Mono 11px `--text-muted`. Unread: blue dot `6px` + `background: rgba(255,255,255,0.02)`.
- New notification slides in at the top with `slideInDown` + fade.

---

## 10. Motion Design Summary

All animations use Framer Motion. Durations are intentionally short — the app should feel snappy not sluggish.

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| Page transition | 0.2s | easeOut | Route changes |
| FadeIn | 0.3s | easeOut | Most elements |
| FadeInUp | 0.35s | easeOut | Cards loading in |
| ScaleIn | 0.25s | spring (stiffness 300) | Modals, winner banner |
| SlideInRight | 0.3s | easeOut | Notification drawer, right panels |
| Stagger children | 0.08s between each | — | Card grids, list items |
| whileHover lift | 0.15s | easeOut | Interactive cards |
| whileTap press | 0.1s | easeOut | All buttons |
| Score bar fill | 1.0s | easeOut | Verdict criterion bars |
| Count up | 1.5s | easeOut | Stats, ELO numbers |
| Typewriter | Capped 3s | Linear | Verdict summary |
| Confetti fall | 2.5s | easeIn | Winner confetti |
| Orb drift | 12–15s | easeInOut | Landing hero background |
| Pulse | 2s repeat | easeInOut | Ready indicator, live dots |
| Timer pulse | 0.8s repeat | easeInOut | Under-60s timer |

---

## 11. Responsive Breakpoints

| Name | Width | Changes |
|---|---|---|
| Mobile | < 640px | Bottom nav bar replaces sidebar. Single column layouts. Writing page shows one editor at a time. |
| Tablet | 640px–1024px | Sidebar collapses to icon-only (48px wide). 2-column grid where possible. |
| Desktop | > 1024px | Full 240px sidebar. All layouts as designed. |

**Mobile-specific design changes:**
- Bottom navigation bar: `height: 64px`, `background: --surface-1`, `border-top: 1px solid --border`, `padding-bottom: env(safe-area-inset-bottom)`. 5 icons: Home, Create, Challenges, Leaderboard, Profile. Active icon: `--accent`.
- Session cards in a single column.
- Verdict ScoreCards stack vertically.
- LobbyPanel PlayerCards stack with creator on top.
- Debate page SubQuestionList becomes a slide-up bottom sheet triggered by a "View Questions" button.
- Writing page: one QuestionEditor visible at a time. Prev/next navigation with a dot indicator showing which of the 5 you're on.
- Profile StatsGrid: 2 columns.
- ProfileHeader: avatar centered, stats centered below.

---

## 12. Accessibility Requirements

- Minimum contrast ratio of 4.5:1 for all body text.
- `--text-primary` `#F0EDE8` on `--bg` `#0A0B0F`: contrast ratio approximately 17:1 ✓
- `--text-secondary` `#8A8A96` on `--bg`: approximately 4.6:1 ✓
- All interactive elements have `focus-visible` styles: `outline: 2px solid --accent`, `outline-offset: 2px`.
- All icons used as standalone interactive elements have an `aria-label`.
- Form inputs have associated `<label>` elements, never placeholder-only labels.
- Modals trap focus when open. Pressing Escape closes them.
- Framer Motion animations respect `prefers-reduced-motion` — wrap all animation variants with a check and set duration to 0 if reduced motion is preferred.
- Color alone is never the only indicator of state — win/loss badges have text too, timer color changes are accompanied by a pulsing animation.
