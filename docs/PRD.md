# Product Requirements Document (PRD)

## 1. Product Overview

- **Project Title**: SpendLens — AI Tool Spend Auditor
- **Version**: 1.0 (MVP)
- **Last Updated**: 2025-05-21
- **Owner**: Credex Intern Candidate
- **Context**: Round 1 assignment for Credex Web Dev Internship

---

## 2. Problem Statement

Engineering managers and startup founders pay monthly AI tool bills without any visibility into whether they're on the right plan, overpaying for seats, or missing cheaper alternatives. There is no "Mint for AI tool spend" — no free, instant tool that benchmarks a team's AI stack, surfaces redundancies, and quantifies savings in under 2 minutes. The result: teams routinely overpay by $200–$2,000/month simply because no one has done the math.

---

## 3. Goals & Objectives

### Business Goals
- Generate qualified leads for Credex's discounted AI credit offering
- Surface high-intent users (>$500/mo savings) for direct Credex consultation bookings
- Demonstrate Credex's domain expertise to cold audiences
- Achieve Product Hunt launch readiness within 4 days

### User Goals
- Instantly know if their team is overpaying for AI tools
- Get specific, defensible recommendations (not vague advice)
- Share audit results with their team or finance person
- Optionally receive their audit report by email

---

## 4. Success Metrics

- **Audit completion rate**: ≥ 60% of users who start the form complete the audit
- **Email capture rate**: ≥ 25% of users who see audit results submit their email
- **Consultation booking rate (high-savings)**: ≥ 10% of users with >$500/mo savings book a Credex call
- **Share rate**: ≥ 15% of completed audits are shared via the unique URL
- **Lighthouse scores**: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90

---

## 5. Target Users & Personas

### Primary Persona: Maya — Engineering Manager at Seed/Series A Startup
- **Demographics**: 28–38, technical background, manages a team of 4–15 engineers
- **Pain Points**: AI tool bills have grown quietly; no budget dashboard; gets asked by finance to justify AI spend
- **Goals**: Know exactly what the team is paying, cut waste without disrupting workflows
- **Technical Proficiency**: High — comfortable with dev tools, SaaS pricing pages

### Secondary Persona: Raj — Founder/CTO of a 2–10 person startup
- **Demographics**: 25–40, wears multiple hats, controls the company card
- **Pain Points**: Signed up for every shiny AI tool; hasn't audited since onboarding
- **Goals**: Reduce burn without sacrificing velocity
- **Technical Proficiency**: Medium-high — can evaluate trade-offs if explained clearly

---

## 6. Features & Requirements

### Must-Have Features (P0)

#### 1. Spend Input Form
- **Description**: A multi-tool form where users input current AI subscriptions, plans, seat count, and monthly spend. Supports: Cursor (Hobby/Pro/Business/Enterprise), GitHub Copilot (Individual/Business/Enterprise), Claude (Free/Pro/Max/Team/Enterprise/API), ChatGPT (Plus/Team/Enterprise/API), Anthropic API direct, OpenAI API direct, Gemini (Pro/Ultra/API), and Windsurf (Free/Pro/Teams).
- **User Story**: As an engineering manager, I want to enter all my team's AI tool subscriptions so that I can get a consolidated audit of our spend.
- **Acceptance Criteria**:
  - [ ] All 8 tools listed with their plans as dropdowns
  - [ ] Each tool row accepts: plan, monthly spend (USD), seat count
  - [ ] Team size and primary use case (coding/writing/data/research/mixed) collected globally
  - [ ] Form state persists across page reloads (localStorage)
  - [ ] Can add/remove tool rows dynamically
  - [ ] Client-side validation: spend must be ≥ 0, seats must be ≥ 1
- **Success Metric**: ≥ 60% of users who land on the form complete it

#### 2. Audit Engine
- **Description**: Rules-based logic (not AI) that evaluates each tool entry for plan-fit, redundancy, cheaper alternatives, and Credex credit opportunity. Produces per-tool findings with explicit numeric reasoning.
- **User Story**: As a user, I want to see exactly why I'm overspending and what I should switch to, so I can make a decision my finance team will accept.
- **Acceptance Criteria**:
  - [ ] Per-tool verdict: Optimal / Downgrade / Switch / Redundant
  - [ ] Each recommendation includes the savings amount ($/mo) and a 1-sentence rationale
  - [ ] Plan-fit check: flags when team size doesn't match plan tier
  - [ ] Redundancy check: flags when two tools serve the same use case for the same team
  - [ ] All pricing data sourced from official vendor pages, cited in PRICING_DATA.md
  - [ ] Logic is deterministic — same inputs always produce same outputs
- **Success Metric**: A finance-literate reviewer agrees with ≥ 90% of recommendations

#### 3. Audit Results Page
- **Description**: A visually polished results page showing per-tool breakdown and a hero summary of total monthly + annual savings.
- **User Story**: As a user, I want to see my savings clearly so I can screenshot and share it with my team.
- **Acceptance Criteria**:
  - [ ] Hero section: total monthly savings + annual savings, displayed prominently
  - [ ] Per-tool card: current spend → recommended action → savings + reason
  - [ ] High-savings (>$500/mo): Credex CTA is surfaced prominently
  - [ ] Low-savings (<$100/mo) or optimal: honest "You're spending well" message + notification signup
  - [ ] Page is visually shareable (screenshot-worthy)
- **Success Metric**: ≥ 15% share rate from this page

#### 4. AI-Generated Personalized Summary
- **Description**: A ~100-word paragraph generated via the OpenRouter API (using DeepSeek V4 Flash), personalized to the user's specific tool stack and use case.
- **User Story**: As a user, I want a human-readable summary of my audit so I can paste it into a Slack message or email to my team.
- **Acceptance Criteria**:
  - [ ] Calls OpenRouter API (DeepSeek V4 Flash) with audit data as context
  - [ ] Generates ≤ 150-word summary
  - [ ] Gracefully falls back to a templated summary if API call fails or times out
  - [ ] Full prompt documented in PROMPTS.md
  - [ ] API key stored in environment variables, never exposed to client
- **Success Metric**: 0 unhandled errors in production; fallback triggers correctly on API failure

#### 5. Lead Capture + Storage
- **Description**: Email gate shown after audit results. Optional fields for company name, role, team size. Stored in backend DB. Confirmation email sent via Resend/Postmark.
- **User Story**: As Credex, I want to capture leads who see high savings so our sales team can follow up.
- **Acceptance Criteria**:
  - [ ] Email capture form shown after results (never before)
  - [ ] Optional fields: company name, role, team size
  - [ ] Submitted data stored in Supabase (or equivalent)
  - [ ] Transactional confirmation email sent on submission (Resend preferred)
  - [ ] High-savings leads (>$500/mo) flagged in DB for Credex follow-up
  - [ ] Rate limiting: max 5 submissions per IP per hour
  - [ ] Honeypot field or hCaptcha for bot protection
- **Success Metric**: 0 duplicate/spam leads in first 100 submissions

#### 6. Shareable Result URL
- **Description**: Each completed audit gets a unique public URL. PII stripped. Open Graph + Twitter Card tags for clean link previews.
- **User Story**: As a user, I want to share my audit with my team so we can discuss the recommendations together.
- **Acceptance Criteria**:
  - [ ] Unique URL generated per audit (UUID-based slug)
  - [ ] Public URL strips email and company name; shows tool stack + savings numbers
  - [ ] Open Graph meta tags: title, description, image (dynamic or static)
  - [ ] Twitter Card tags set correctly
  - [ ] URL accessible without login
  - [ ] Audit data stored and retrievable from DB by slug
- **Success Metric**: Shared links render correctly in Slack, Twitter, and iMessage previews

---

### Should-Have Features (P1)

- **PDF Export**: Download the full audit as a formatted PDF
- **Benchmark Mode**: "Your AI spend per developer is $X — companies your size average $Y"
- **Referral Codes**: Share the tool, both parties get a perk (discount on Credex credits)

### Nice-to-Have Features (P2)

- **Embeddable Widget**: `<script>` tag version for blogs and newsletters
- **Launch Blog Post / Twitter Thread**: Draft marketing content for Credex's Product Hunt launch

---

## 7. Explicitly OUT OF SCOPE

- User accounts, login, or authentication (no auth required for MVP)
- Real-time pricing syncing (pricing is hardcoded at submission time, cited in PRICING_DATA.md)
- Support for tools beyond the 8 listed (no Notion AI, Perplexity, Midjourney, etc.)
- Payment processing or actual credit purchases within the app
- A/B testing infrastructure
- Mobile app (web only, but must be mobile-responsive)
- Admin dashboard for Credex to manage leads (leads go directly to Supabase)
- Internationalization / multi-currency support

---

## 8. User Scenarios

### Scenario 1: Engineering Manager Discovers Overspend
- **Context**: Maya gets asked by their CFO to justify the $3,200/month AI tools line item
- **Steps**:
  1. Maya finds the tool via a tweet
  2. Enters 5 tools: Cursor Business (8 seats), GitHub Copilot Business (8 seats), Claude Team (8 seats), ChatGPT Team (3 seats), Gemini Pro (2 seats)
  3. Sets team size = 8, use case = coding
  4. Hits "Run Audit"
  5. Sees: Cursor + Copilot flagged as redundant for coding use case; ChatGPT Team for 3 seats flagged (overkill vs Plus); total savings = $680/mo
  6. Credex CTA surfaces: "Get this through Credex credits and save an additional 20%"
  7. Maya screenshots the results page and shares with CFO
  8. Maya submits email to receive the full report
- **Expected Outcome**: Lead captured, Credex consultation booked
- **Edge Cases**: If Maya enters $0 for a tool, audit skips that tool with a note

### Scenario 2: Solo Founder Gets "You're Fine" Verdict
- **Context**: Raj is spending $40/mo on Claude Pro for writing tasks
- **Steps**:
  1. Enters 1 tool: Claude Pro (1 seat, $20/mo actual spend)
  2. Use case: writing
  3. Gets audit: "Your spend is already optimal for a solo writer"
  4. Sees: notification signup CTA ("We'll alert you when better options emerge")
  5. Optionally subscribes
- **Expected Outcome**: No false savings manufactured; lead still captured for nurture
- **Edge Cases**: Raj enters wrong plan price — audit uses inputted value, adds note that official price differs

### Scenario 3: User Shares Audit URL
- **Context**: User wants to share results with their team
- **Steps**:
  1. Completes audit
  2. Clicks "Share this audit"
  3. Copies unique URL
  4. Pastes into Slack
  5. Team sees Open Graph preview with headline savings number
  6. Team members click through and see the public (PII-stripped) version
- **Expected Outcome**: Multiple team members see the tool; some run their own audits
- **Edge Cases**: Shared URL accessed after 90 days — data still available (no expiry)

---

## 9. Dependencies & Constraints

- **Technical Constraints**: Anthropic API required for AI summary (free credits available); Supabase free tier for DB and storage
- **Business Constraints**: 7-day timeline; single developer; must hit Lighthouse scores
- **External Dependencies**: Anthropic API, Resend (or Postmark) for email, Supabase for DB

---

## 10. Timeline & Milestones

- **Day 1–2**: Project setup, design system, form UI
- **Day 3–4**: Audit engine, results page, AI summary
- **Day 5**: Lead capture, DB, email, shareable URL
- **Day 6**: Testing, CI/CD, accessibility fixes
- **Day 7**: Polish, documentation, deploy, submission prep

---

## 11. Risks & Assumptions

### Risks
- Anthropic API rate limits on free tier — mitigated by graceful fallback to templated summary
- Pricing data goes stale — mitigated by citing exact URLs and verification dates in PRICING_DATA.md
- Supabase free tier limits — mitigated by lightweight schema; 500 leads easily fit in free tier

### Assumptions
- Users know their approximate monthly spend per tool (they can check their billing page)
- Users are comfortable entering spend data without a login (no PII required at form stage)
- Credex consultation is the primary conversion event; email is secondary

---

## 12. Non-Functional Requirements

- **Performance**: Lighthouse Performance ≥ 85 on mobile; page load < 2s on 4G
- **Security**: No secrets in repo; env vars for all API keys; honeypot/rate limiting on forms
- **Accessibility**: Lighthouse Accessibility ≥ 90; WCAG 2.1 Level AA target; keyboard-navigable
- **Scalability**: Architecture must handle 10k audits/day (see ARCHITECTURE.md)
- **Browser Support**: Chrome, Firefox, Safari, Edge — last 2 versions each

---

## 13. References & Resources

- Credex assignment brief: `Credex_WebDev_2026_Assignment.pdf`
- Cursor pricing: https://cursor.sh/pricing
- GitHub Copilot pricing: https://github.com/features/copilot
- Anthropic pricing: https://www.anthropic.com/pricing
- OpenAI pricing: https://openai.com/pricing
- Google Gemini pricing: https://ai.google.dev/pricing
- Windsurf pricing: https://windsurf.com/pricing
