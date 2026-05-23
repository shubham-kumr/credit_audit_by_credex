# Application Flow Documentation — SpendLens

## 1. Entry Points

### Primary Entry Points
- **Direct URL**: User lands on `/` — sees the landing hero + "Start Audit" CTA
- **Tweet / HN / Blog**: Same landing page; anchor link scrolls to form
- **Shared Audit URL**: User lands on `/audit/[slug]` — sees public read-only audit result directly

### Secondary Entry Points
- **Email confirmation link**: Redirects to `/audit/[slug]` for the user's own audit
- **Credex website referral**: Deep link to `/` with `?ref=credex` query param (tracked)

---

## 2. Core User Flows

---

### Flow 1: Complete an Audit (Primary Flow)

**Goal**: User enters their AI tool spend and receives a personalized audit  
**Entry Point**: Landing page `/`  
**Frequency**: Every new audit; primary conversion event

#### Happy Path

1. **Page: Landing Page (`/`)**
   - Elements: Hero headline, sub-headline, "Start Free Audit" CTA button, social proof strip, FAQ accordion
   - User Action: Clicks "Start Free Audit"
   - Trigger: Scroll to / navigate to form section (`/#form` or `/audit/new`)

2. **Page: Spend Input Form (`/audit/new`)**
   - Elements: Tool rows (each with: tool name dropdown, plan dropdown, monthly spend input, seat count input), global fields (team size, primary use case), "Add another tool" button, "Run My Audit" CTA
   - User Actions:
     - Selects tool from dropdown
     - Selects plan tier
     - Enters monthly spend (pre-filled with official pricing on plan select as a hint)
     - Enters seat count
     - Repeats for each tool
     - Sets team size (number input)
     - Sets primary use case (radio: coding / writing / data / research / mixed)
   - Validation (client-side, real-time):
     - Spend: must be a number ≥ 0
     - Seats: must be an integer ≥ 1
     - At least one tool row must be filled
     - Team size: integer ≥ 1
   - Persistence: All form state saved to localStorage on every change
   - Trigger: User clicks "Run My Audit"

3. **System Action**: Client-side audit engine runs (no server round-trip for core math)
   - Audit engine evaluates each tool row
   - Calls backend `/api/audit` to: save audit to DB, trigger AI summary generation, return audit slug
   - Loading state shown during API call (spinner + "Crunching your numbers…")

4. **Page: Audit Results (`/audit/[slug]`)**
   - Elements: Hero savings block, AI summary paragraph, per-tool recommendation cards, CTA section (conditional on savings tier), share button
   - Auto-scrolls to hero on load
   - Success State: Full audit displayed

5. **Page: Email Capture Modal / Section**
   - Triggered automatically after results render (2-second delay or on scroll past hero)
   - Elements: "Get your report emailed" header, email input, optional fields (company name, role), submit button, skip link
   - User Action: Submits email OR clicks "Skip"
   - Trigger: Submit → POST `/api/leads`
   - Success: Confirmation message inline; email sent via Resend

#### Error States

- **No tools entered**:
  - Display: Inline form error "Add at least one AI tool to audit"
  - Action: Form does not submit; focus moves to first empty tool row

- **Invalid spend value** (letters, negative):
  - Display: Red border + "Enter a valid dollar amount" below the field
  - Action: Run Audit button disabled until resolved

- **API call fails** (audit save / AI summary):
  - Display: Results page still renders with hardcoded templated summary
  - Note shown: "Personalized summary unavailable — showing standard analysis"
  - Audit data displayed from client-side engine (no data loss)

- **Network offline during form submit**:
  - Display: Toast: "No internet connection. Your form data is saved — try again when connected."
  - Form data remains in localStorage

#### Edge Cases

- User adds duplicate tool → system flags it as potentially redundant in audit
- User enters $0 spend → tool is included but flagged: "Are you on a free plan?"
- User closes browser mid-form → localStorage restores all fields on return
- User changes plan after entering custom spend → hint updates but entered value is preserved

#### Exit Points

- Success: `/audit/[slug]` with results
- Skip email: stays on results page, no lead captured
- Abandonment: localStorage saves progress; "Continue your audit" prompt on next visit

---

### Flow 2: View a Shared Audit (Read-Only)

**Goal**: A team member or colleague views someone else's shared audit  
**Entry Point**: `/audit/[slug]` from a shared link  
**Frequency**: 1–3x per audit (virality loop)

#### Happy Path

1. **Page: Public Audit Result (`/audit/[slug]`)**
   - Elements: Same results page layout BUT with PII stripped (no email, no company name shown)
   - "Run Your Own Audit" CTA displayed prominently
   - Share button shows the current URL for re-sharing

2. User reads the audit, sees savings, clicks "Run Your Own Audit"
3. Redirected to `/audit/new` (fresh form)

#### Error States

- **Slug not found (404)**:
  - Display: Custom 404 page: "This audit link has expired or doesn't exist"
  - Actions: "Run a new audit" CTA

---

### Flow 3: Email Lead Capture

**Goal**: Capture contact info after value is demonstrated  
**Entry Point**: Triggered from audit results page  
**Frequency**: Once per audit session

#### Happy Path

1. After results render, email capture section appears (not a blocking modal — inline section or bottom sheet)
2. User enters email (required), optionally company name + role
3. Clicks "Email me this report"
4. System: POST `/api/leads` with audit_id + email + optional fields
5. Response: 201 Created
6. UI: Success message — "Check your inbox! We'll also reach out if we find more savings."
7. If audit savings > $500/mo: additional message "A Credex advisor will be in touch — we can often unlock 20% more savings through our credit program."
8. Confirmation email sent (Resend) with:
   - Audit summary
   - Link to public audit URL
   - Credex CTA (if high-savings)

#### Error States

- **Invalid email**:
  - Display: "Enter a valid email address" inline
  - Submit button remains disabled

- **Rate limit hit (>5 submissions / IP / hour)**:
  - Display: "Too many requests. Please try again later."
  - HTTP 429 returned

- **Email send fails**:
  - Lead still saved to DB
  - UI shows success to user (don't punish them for backend issue)
  - Error logged server-side

---

## 3. Navigation Map

```
/                        Landing page (hero + form entry)
├── /audit/new           Spend input form
└── /audit/[slug]        Audit results (public read-only)
    └── (email modal)    Lead capture (inline, no route change)
```

### Navigation Rules

- **No authentication required** anywhere
- **Back button** from results → goes to form (state preserved via localStorage)
- **No persistent nav bar needed** for MVP — single-flow app

---

## 4. Screen Inventory

### Screen: Landing Page (`/`)
- **Route**: `/`
- **Access**: Public
- **Purpose**: Convert cold visitors into audit-starters
- **Key Elements**:
  - Hero: headline, sub-headline, primary CTA ("Start Free Audit")
  - How-it-works: 3-step visual (Input → Audit → Save)
  - Social proof strip (mocked for MVP, labeled as such)
  - FAQ accordion (5 Q&As from LANDING_COPY.md)
  - Footer: Credex branding, link to credex.rocks
- **Actions**:
  - "Start Free Audit" → `/audit/new`
- **State Variants**: Static; no loading/empty states

### Screen: Spend Input Form (`/audit/new`)
- **Route**: `/audit/new`
- **Access**: Public
- **Purpose**: Collect the user's AI tool spend data
- **Key Elements**:
  - Tool row list (dynamic — add/remove rows)
  - Per-row: tool selector, plan selector, spend input, seat count
  - Global: team size, primary use case
  - CTA: "Run My Audit"
- **Actions**:
  - Add tool row → adds row inline
  - Remove row → removes with confirmation if row has data
  - "Run My Audit" → submits, navigates to `/audit/[slug]`
- **State Variants**:
  - Empty: placeholder row with "Add your first AI tool"
  - Partial: rows filled, validation errors shown inline
  - Submitting: button disabled, spinner shown
  - Error: toast notification

### Screen: Audit Results (`/audit/[slug]`)
- **Route**: `/audit/[slug]`
- **Access**: Public (PII stripped for shared views)
- **Purpose**: Display savings findings and capture leads
- **Key Elements**:
  - Hero: total monthly + annual savings
  - AI summary paragraph
  - Per-tool recommendation cards (current spend, action, savings, reason)
  - CTA block (conditional: high-savings = Credex CTA; low-savings = notification signup)
  - Share button with URL copy
  - Email capture section
- **Actions**:
  - "Book a Credex Consultation" → external link (Calendly or credex.rocks)
  - "Share" → copies URL to clipboard + shows share sheet on mobile
  - Email submit → POST `/api/leads`
  - "Run Your Own Audit" (on shared view) → `/audit/new`
- **State Variants**:
  - Loading: spinner while `/api/audit` returns slug
  - High-savings (>$500/mo): Credex CTA prominent
  - Low/optimal: "You're spending well" message
  - Shared view: email/company hidden, "Run Your Own" CTA shown

---

## 5. Decision Points

### Decision: Savings Tier
```
IF total_monthly_savings > 500
  THEN show Credex consultation CTA (prominent, above fold)
  AND flag lead as high_intent in DB
ELSE IF total_monthly_savings > 100
  THEN show standard Credex mention
  AND show email capture
ELSE
  THEN show "You're spending well" message
  AND show "notify me" signup CTA
  AND still capture email (nurture list)
```

### Decision: AI Summary Availability
```
IF OpenRouter (DeepSeek) API call succeeds within 5s
  THEN display AI-generated summary
ELSE IF API call fails or times out
  THEN display templated summary (generated client-side from audit data)
  AND log error to server
```

### Decision: Lead Savings Flag
```
IF audit.total_savings > 500
  THEN lead.tier = "high_intent"
  AND include Credex advisor outreach note in confirmation email
ELSE
  THEN lead.tier = "standard"
  AND include standard confirmation email
```

### Decision: Shared vs. Own Audit
```
IF current URL slug matches audit created in this session (localStorage)
  THEN show full view (with email capture)
ELSE
  THEN show public view (PII stripped, "Run Your Own Audit" CTA)
```

### Decision: Form Restore on Return
```
IF localStorage has saved form state
  THEN show "Continue your audit" banner with restore option
  AND auto-populate form with saved data
ELSE
  THEN show empty form
```

---

## 6. Error Handling Flows

### 404 Not Found (invalid audit slug)
- Display: Custom 404 page with friendly message
- Elements: "This audit doesn't exist" + "Run a new audit" button
- Log: 404 event to analytics

### 500 Server Error (audit save fails)
- Display: Audit results still shown (from client-side engine)
- Toast: "We couldn't save your audit — results shown below"
- Retry: "Save my results" button retries the API call
- Log: Error to Sentry

### API Rate Limit (OpenRouter 429/402)
- Display: Templated fallback summary shown
- User-facing: No error shown — seamless fallback
- Log: Rate limit or credit exhaustion event

### Form Validation Failure (on submit)
- Display: Inline errors on each invalid field
- Scroll: Page auto-scrolls to first error
- CTA: "Run My Audit" button re-enables after all errors resolved

---

## 7. Responsive Behavior

### Mobile (< 640px)
- Tool rows stack vertically (single column)
- Spend input and seat count on separate lines
- Share button triggers native share sheet (Web Share API)
- Email capture is full-width inline section (no modal)
- Hero savings numbers use larger text for screenshot appeal

### Desktop (≥ 1024px)
- Tool rows in a compact table-like layout
- Results page uses 2-column layout: hero left, per-tool cards right
- Share button copies URL to clipboard with toast confirmation

---

## 8. Animation & Transitions

### Page Transitions
- Form → Results: fade out form, slide up results (300ms ease-out)

### Micro-interactions
- Tool row add: slide down (200ms)
- Tool row remove: slide up + fade (150ms)
- "Run My Audit" submit: button scale(0.97) + spinner replaces text
- Results hero: savings number counts up from 0 (800ms, ease-out)
- Per-tool cards: staggered fade-in (100ms delay between cards)
- Copy URL: button text changes to "Copied!" for 2s then reverts
- Email submit success: checkmark animation inline

### Loading States
- Audit API call: skeleton cards in results layout while waiting
- AI summary: pulsing placeholder text block

---

## 9. Data Flow Summary

```
User fills form
  → Client-side audit engine runs (instant, no network)
  → POST /api/audit { tools[], team_size, use_case }
      → Server saves audit to DB
      → Server calls OpenRouter (DeepSeek) API (async, non-blocking)
      → Server returns { slug, audit_data, summary }
  → Client navigates to /audit/[slug]
  → Results rendered from response data
  → (Optional) User submits email
      → POST /api/leads { slug, email, company?, role? }
          → Server saves lead to DB
          → Server sends confirmation email via Resend
          → Response: 201
```
