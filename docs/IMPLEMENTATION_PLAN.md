 # Implementation Plan — SpendLens

**Project**: SpendLens — AI Tool Spend Auditor  
**MVP Target**: 4 days from assignment start  
**Approach**: Documentation-first. Every line of code traces to a doc section.

---

## Build Philosophy

- **Client-side first**: Audit engine runs in the browser. No server dependency for core UX.
- **Ship a working slice daily**: Each day ends with something deployable.
- **Test the audit math first**: Wrong numbers = zero trust from users. Engine tests before UI.
- **Never block on AI**: If OpenRouter is down, the app still works.

---

## Phase 1: Foundation (Day 1)

### Step 1.1 — Initialize Next.js Project
**Duration**: 45 min  
**Goal**: Running dev server with TypeScript + Tailwind

```bash
npx create-next-app@14.2.3 spendlens \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd spendlens
git init
git add .
git commit -m "chore: init Next.js 14 project with TypeScript and Tailwind"
```

**Success Criteria**:
- [ ] `pnpm dev` runs without errors at `localhost:3000`
- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] Tailwind CSS processing a test class

**Reference**: TECH_STACK.md §2

---

### Step 1.2 — Install Dependencies
**Duration**: 30 min  
**Goal**: All dependencies installed at exact versions

```bash
pnpm add \
  framer-motion@11.1.9 \
  react-hook-form@7.51.3 \
  zod@3.23.4 \
  zustand@4.5.2 \
  lucide-react@0.378.0 \
  @supabase/supabase-js@2.43.1 \
  @anthropic-ai/sdk@0.20.9 \
  resend@3.2.0 \
  @upstash/ratelimit@1.2.1 \
  @upstash/redis@1.28.3 \
  @sentry/nextjs@8.7.0

pnpm add -D \
  vitest@1.6.0 \
  @testing-library/react@16.0.0 \
  @testing-library/jest-dom@6.4.2 \
  @vitejs/plugin-react@4.2.1 \
  prettier@3.2.5 \
  husky@9.0.11

pnpm husky init
git commit -m "chore: install all dependencies and setup husky"
```

**Success Criteria**:
- [ ] `pnpm list` shows all packages at correct versions
- [ ] No peer dependency errors
- [ ] Husky pre-commit hook file exists at `.husky/pre-commit`

**Reference**: TECH_STACK.md §8

---

### Step 1.3 — Configure Tailwind Design Tokens
**Duration**: 1 hour  
**Goal**: Tailwind extended with all custom tokens from FRONTEND_GUIDELINES

Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faf4', 100: '#dcf2e6', 200: '#bbe5ce', 300: '#89d1ae',
          400: '#55b588', 500: '#2e9967', 600: '#1f7f52', 700: '#1a6643',
          800: '#175237', 900: '#14432e',
        },
        accent: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        neutral: {
          50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
          400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c',
          800: '#292524', 900: '#1c1917',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        colored: '0 4px 14px -2px rgba(46, 153, 103, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
```

Add Google Fonts to `app/layout.tsx`:
```typescript
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
```

**Success Criteria**:
- [ ] Custom color classes work in a test component (e.g. `bg-primary-500`)
- [ ] Custom fonts load in browser
- [ ] No Tailwind build errors

**Reference**: FRONTEND_GUIDELINES.md §2, TECH_STACK.md §2

---

### Step 1.4 — Setup Environment Variables
**Duration**: 20 min  
**Goal**: All env vars configured, `.env.example` committed

```bash
cp .env.example .env.local
# Fill in real values from Supabase, Upstash, Resend, Anthropic dashboards
```

**Success Criteria**:
- [ ] `.env.local` present with all required keys
- [ ] `.env.local` in `.gitignore`
- [ ] `.env.example` committed with placeholder values

**Reference**: TECH_STACK.md §6

---

### Step 1.5 — Initialize Supabase + Create Tables
**Duration**: 45 min  
**Goal**: Database ready with correct schema

1. Create Supabase project at supabase.com
2. Run SQL from BACKEND_STRUCTURE.md §10 in Supabase SQL editor
3. Test connection:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**Success Criteria**:
- [ ] Both tables (`audits`, `leads`) visible in Supabase table editor
- [ ] All indexes created
- [ ] Test insert + select works from a scratch script

**Reference**: BACKEND_STRUCTURE.md §3, §10

---

### Step 1.6 — Setup CI/CD
**Duration**: 30 min  
**Goal**: GitHub Actions workflow runs on push

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9.1.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
```

**Success Criteria**:
- [ ] Workflow file exists at correct path
- [ ] First push to `main` triggers workflow
- [ ] Green check on GitHub

**Reference**: TECH_STACK.md §4

---

## Phase 2: Audit Engine (Day 2)

### Step 2.1 — Build Pricing Data Module
**Duration**: 2 hours  
**Goal**: Typed pricing constants for all 8 tools, all plans, with official prices

Create `lib/pricing-data.ts`:
- Define `ToolKey`, `PlanKey`, `PlanPricing` TypeScript types
- Export `PRICING` constant with all tool/plan/pricing data
- Source all prices from official vendor pages (document in PRICING_DATA.md simultaneously)

```typescript
export type ToolKey = 
  | 'cursor' | 'github_copilot' | 'claude' 
  | 'chatgpt' | 'anthropic_api' | 'openai_api' 
  | 'gemini' | 'windsurf';

export interface PlanPricing {
  per_seat_monthly: number | null;  // null = custom/enterprise
  min_seats: number;
  display_name: string;
  notes: string;
  source_url: string;
}
```

**Success Criteria**:
- [ ] All 8 tools defined
- [ ] All plans per tool defined
- [ ] TypeScript has no errors
- [ ] Each price entry has a `source_url`

**Reference**: BACKEND_STRUCTURE.md §5, PRICING_DATA.md (write simultaneously)

---

### Step 2.2 — Build Audit Engine Core
**Duration**: 3 hours  
**Goal**: Pure function that takes `AuditInput` and returns `AuditResult[]`

Create `lib/audit-engine.ts`:

```typescript
export function runAudit(input: AuditInput): AuditOutput {
  const results: ToolResult[] = [];
  
  // Step 1: Per-tool plan-fit check
  for (const tool of input.tools) {
    results.push(checkPlanFit(tool, input.team_size, input.use_case));
  }
  
  // Step 2: Cross-tool redundancy check
  checkRedundancy(results, input.use_case);
  
  // Step 3: Calculate totals
  const total_monthly_savings = results.reduce((sum, r) => sum + r.monthly_savings, 0);
  
  return {
    results,
    total_monthly_savings,
    total_annual_savings: total_monthly_savings * 12,
    savings_tier: getSavingsTier(total_monthly_savings),
  };
}
```

Logic to implement per BACKEND_STRUCTURE.md §5:
- `checkPlanFit()` — plan-fit check per tool
- `checkRedundancy()` — cross-tool redundancy detection
- `getSavingsTier()` — high_intent / standard / optimal classification
- All pricing lookups use `PRICING` constants from Step 2.1

**Success Criteria**:
- [ ] Function is pure (no side effects)
- [ ] TypeScript strict mode — no `any`
- [ ] Returns correct results for 5 test cases

**Reference**: BACKEND_STRUCTURE.md §5, PRD.md §6 (Audit Engine feature)

---

### Step 2.3 — Write Audit Engine Tests
**Duration**: 2 hours  
**Goal**: ≥ 5 passing tests covering audit engine (required by assignment)

Create `__tests__/audit-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { runAudit } from '@/lib/audit-engine';

describe('Audit Engine', () => {
  it('flags Cursor + Copilot as redundant for coding use case', () => { ... });
  it('flags Claude Team plan as overkill for 2 users', () => { ... });
  it('returns optimal verdict for correctly-sized solo Claude Pro user', () => { ... });
  it('calculates total_monthly_savings correctly across multiple tools', () => { ... });
  it('returns high_intent tier for audits saving more than $500/mo', () => { ... });
  it('handles empty spend ($0) for a tool gracefully', () => { ... });
  it('handles single tool with optimal plan correctly', () => { ... });
});
```

Run: `pnpm test`

**Success Criteria**:
- [ ] All tests pass
- [ ] No test relies on network calls
- [ ] Tests match the evaluation criteria in PRD.md
- [ ] `pnpm test` exits with code 0

**Reference**: BACKEND_STRUCTURE.md §5, PRD.md §6

---

## Phase 3: API Routes (Day 3)

### Step 3.1 — POST `/api/audit` Route
**Duration**: 2 hours  
**Goal**: Audit data saved to Supabase; AI summary triggered async

Create `app/api/audit/route.ts` per BACKEND_STRUCTURE.md §4:
- Zod validation
- Rate limiting (Upstash)
- Run audit engine server-side
- Insert into `audits` table
- Trigger AI summary generation (async, non-blocking)
- Return 201 with audit data

**Success Criteria**:
- [ ] `curl -X POST /api/audit` with valid body returns 201
- [ ] Row appears in Supabase `audits` table
- [ ] `curl` with invalid body returns 400 with error details
- [ ] Rate limit returns 429 after 20 requests

**Reference**: BACKEND_STRUCTURE.md §4

---

### Step 3.2 — GET `/api/audit/[slug]` Route
**Duration**: 1 hour  
**Goal**: Retrieve audit by UUID slug

Create `app/api/audit/[slug]/route.ts`:
- Fetch from Supabase by `id`
- Return 404 if not found
- Increment `share_count` (fire-and-forget)
- Return audit data (no PII)

**Success Criteria**:
- [ ] Valid slug returns 200 with full audit data
- [ ] Invalid slug returns 404
- [ ] `share_count` increments on each fetch

**Reference**: BACKEND_STRUCTURE.md §4

---

### Step 3.3 — POST `/api/leads` Route
**Duration**: 1.5 hours  
**Goal**: Email lead captured, confirmation email sent

Create `app/api/leads/route.ts`:
- Honeypot check (silent 200 if triggered)
- Zod validation
- Rate limiting (5/hour)
- Insert into `leads` table
- Send confirmation email via Resend
- Different email template for high-intent leads

**Success Criteria**:
- [ ] Valid submission returns 201
- [ ] Row in `leads` table with correct `tier`
- [ ] Email arrives in test inbox (use your own email)
- [ ] Honeypot field filled → 200 but nothing saved
- [ ] Rate limit enforced

**Reference**: BACKEND_STRUCTURE.md §4, §9

---

### Step 3.4 — AI Summary Generation
**Duration**: 1.5 hours  
**Goal**: OpenRouter API generates personalized 100-word summary using DeepSeek V4 Flash; fallback on failure

Create `lib/generate-summary.ts`:

```typescript
export async function generateAISummary(auditData: AuditOutput): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return generateFallbackSummary(auditData);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-v4-flash:free',
      messages: [{ role: 'user', content: buildSummaryPrompt(auditData) }],
      max_tokens: 1000,
    }),
  });
  
  if (!response.ok) return generateFallbackSummary(auditData);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || generateFallbackSummary(auditData);
}

export function generateFallbackSummary(auditData: AuditOutput): string {
  // Template-based fallback — always works
  const { total_monthly_savings, results } = auditData;
  const topTool = results.find(r => r.monthly_savings > 0);
  return `Your team's AI stack has optimization opportunities. ...`;
}
```

**Success Criteria**:
- [ ] Anthropic API call succeeds and returns valid text
- [ ] Fallback triggers correctly when API key is invalid (test with wrong key)
- [ ] Summary is 80–150 words
- [ ] No unhandled exceptions

**Reference**: BACKEND_STRUCTURE.md §7, PROMPTS.md (write simultaneously)

---

## Phase 4: Frontend (Day 4–5)

### Step 4.1 — Landing Page
**Duration**: 2 hours  
**Goal**: Credible, screenshot-worthy landing page that converts to form

Create `app/page.tsx`:
- Hero: headline, sub-headline, primary CTA → `/audit/new`
- How it works: 3-step visual
- FAQ accordion (5 Q&As)
- Footer with Credex link

Apply FRONTEND_GUIDELINES design system throughout.

**Success Criteria**:
- [ ] Page renders correctly on mobile (375px) and desktop (1280px)
- [ ] CTA button navigates to form
- [ ] No layout shift on load (no images without dimensions)
- [ ] Lighthouse Accessibility score ≥ 90 on this page alone

**Reference**: FRONTEND_GUIDELINES.md §3–4, PRD.md §3

---

### Step 4.2 — Spend Input Form
**Duration**: 4 hours  
**Goal**: Dynamic multi-tool form with localStorage persistence

Create `app/audit/new/page.tsx` + `components/SpendForm.tsx`:

1. Zustand store for form state (`lib/stores/form-store.ts`)
2. localStorage sync (rehydrate on mount)
3. Dynamic tool rows (add/remove)
4. Tool + Plan dropdowns (populated from `PRICING` constants)
5. Spend + Seats inputs with validation
6. Team size + Use case global fields
7. Client-side Zod validation on submit
8. On submit: call `POST /api/audit`, navigate to `/audit/[slug]`
9. Loading state during API call

**Success Criteria**:
- [ ] Can add 8 tools, fill all fields, submit
- [ ] localStorage saves on every change; restores on page reload
- [ ] Validation errors show inline for each field
- [ ] Submit triggers loading state (spinner, disabled button)
- [ ] Successful submit navigates to results page
- [ ] Form is keyboard-navigable (Tab through all fields)
- [ ] All tool names and plan names match PRICING data

**Reference**: APP_FLOW.md §2 Flow 1, FRONTEND_GUIDELINES.md §4, BACKEND_STRUCTURE.md §4

---

### Step 4.3 — Audit Results Page
**Duration**: 4 hours  
**Goal**: Compelling results page with per-tool cards and hero savings block

Create `app/audit/[slug]/page.tsx`:

1. Fetch audit data from `GET /api/audit/[slug]`
2. Hero savings block (count-up animation for savings number)
3. AI summary paragraph (skeleton while loading; templated if `summary_generated: false`)
4. Per-tool result cards with verdict badges
5. Conditional CTA section (high-intent vs optimal vs standard)
6. Share button (copy URL to clipboard + Web Share API on mobile)
7. Email capture section

For shared views (no session ownership):
- Show "Run Your Own Audit" CTA instead of email capture
- Strip email/company from display (they're not in the API response anyway)

**Success Criteria**:
- [ ] Savings number counts up from 0 on page load
- [ ] All per-tool cards render with correct verdict badges
- [ ] High-savings (>$500) shows Credex CTA
- [ ] Low-savings shows "You're spending well" message
- [ ] Share button copies URL + shows "Copied!" feedback
- [ ] Page renders correctly without AI summary (fallback shown)
- [ ] OG meta tags present (verified with opengraph.xyz)

**Reference**: APP_FLOW.md §4, FRONTEND_GUIDELINES.md §4, PRD.md §6 (Results page)

---

### Step 4.4 — Email Capture Integration
**Duration**: 1.5 hours  
**Goal**: Lead form submits correctly with feedback states

Add inline email capture section to results page:
- React Hook Form for email capture form
- POST to `/api/leads`
- Success state: "Check your inbox!" message
- Error state: inline error
- Skip link (skip without capturing)

**Success Criteria**:
- [ ] Valid email submits, shows success, check real inbox
- [ ] Invalid email shows inline error
- [ ] Honeypot field present in DOM (visually hidden)
- [ ] Skip link works (no error, just closes section)

**Reference**: APP_FLOW.md §2 Flow 3, BACKEND_STRUCTURE.md §4

---

### Step 4.5 — Open Graph / Share Metadata
**Duration**: 1 hour  
**Goal**: Clean link previews when shared on Slack, Twitter, iMessage

Update `app/audit/[slug]/page.tsx` to generate dynamic metadata:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const audit = await fetchAudit(params.slug);
  return {
    title: `AI Spend Audit — Save $${audit.total_monthly_savings}/mo`,
    description: `This team could save $${audit.total_annual_savings}/year on AI tools. Run your own free audit.`,
    openGraph: {
      title: `Save $${audit.total_monthly_savings}/month on AI tools`,
      description: `Free AI spend audit by SpendLens`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/audit/${params.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Save $${audit.total_monthly_savings}/month on AI tools`,
      description: `Free audit — takes 2 minutes`,
    },
  };
}
```

**Success Criteria**:
- [ ] OG preview shows savings number in title
- [ ] Validate with https://opengraph.xyz or Twitter Card Validator
- [ ] Preview looks good on Slack (paste URL into Slack to test)

**Reference**: PRD.md §6 (Shareable URL feature)

---

## Phase 5: Polish + Accessibility (Day 6)

### Step 5.1 — Responsive Design Pass
**Duration**: 2 hours  
**Goal**: App works well on iPhone 14 (375px) and desktop (1280px)

Test and fix:
- Form rows stack correctly on mobile
- Hero savings number readable on small screens
- Touch targets ≥ 44px
- Native share sheet triggered on mobile (Web Share API)
- Modals/overlays don't overflow viewport

**Success Criteria**:
- [ ] Chrome DevTools mobile simulation (iPhone 14 Pro) — no overflow, no tiny targets
- [ ] Share works on mobile (tested on real device if possible)

---

### Step 5.2 — Accessibility Audit
**Duration**: 1.5 hours  
**Goal**: Lighthouse Accessibility ≥ 90 on deployed URL

Run Lighthouse on each page. Fix issues in order:
1. Missing `aria-label` on icon buttons
2. Color contrast failures
3. Missing `<label>` associations
4. Focus indicator visibility
5. `alt` text on any images

**Success Criteria**:
- [ ] Lighthouse Accessibility ≥ 90 on `/audit/new`
- [ ] Lighthouse Accessibility ≥ 90 on `/audit/[slug]`
- [ ] All form inputs have associated labels
- [ ] No `outline: none` without replacement

**Reference**: FRONTEND_GUIDELINES.md §5

---

### Step 5.3 — Performance Pass
**Duration**: 1 hour  
**Goal**: Lighthouse Performance ≥ 85 on mobile

Common fixes:
- Verify fonts load with `display: swap`
- No unused CSS from Tailwind (purge config correct)
- Dynamic import for Framer Motion on results page only
- No render-blocking scripts

**Success Criteria**:
- [ ] Lighthouse Performance ≥ 85 on deployed URL (mobile simulation)
- [ ] LCP < 2.5s
- [ ] CLS = 0

---

## Phase 6: Documentation + Deployment (Day 7)

### Step 6.1 — Write Assignment Documentation Files
**Duration**: 3 hours  
**Goal**: All required assignment files complete and committed

Files to write:
- `README.md` — screenshots, quick start, decisions section
- `ARCHITECTURE.md` — Mermaid diagram, data flow, stack justification, 10k scale notes
- `PRICING_DATA.md` — all sources cited (accumulated from Step 2.1)
- `PROMPTS.md` — full prompts used, rationale, what didn't work
- `TESTS.md` — list of all tests with coverage
- `GTM.md`, `ECONOMICS.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`, `METRICS.md` — entrepreneurial files
- `DEVLOG.md` — ensure all 7 daily entries are complete and honest
- `REFLECTION.md` — 5 questions answered at depth

**Success Criteria**:
- [ ] All files present at repo root
- [ ] `git log --pretty=format:"%ad" --date=short | sort -u | wc -l` returns ≥ 5
- [ ] DEVLOG has 7 dated entries (one per day)
- [ ] PRICING_DATA.md has source URL for every pricing number

---

### Step 6.2 — Final Deploy + Smoke Test
**Duration**: 1 hour  
**Goal**: Live URL works end-to-end

```bash
# Verify CI is green on main
# Set all env vars in Vercel dashboard
# Deploy via git push to main (Vercel auto-deploy)
```

Smoke test checklist:
- [ ] Landing page loads
- [ ] Form accepts input and submits
- [ ] Results page shows correct savings
- [ ] Share URL works (test on phone)
- [ ] Email capture submits (check inbox)
- [ ] Lighthouse scores meet targets on deployed URL
- [ ] CI shows green check on latest commit

**Reference**: TECH_STACK.md §4

---

## Milestones

### Milestone 1 — Foundation (End of Day 1)
- [ ] Project running locally
- [ ] Supabase tables created
- [ ] CI green
- [ ] Design tokens configured

### Milestone 2 — Audit Engine Complete (End of Day 2)
- [ ] Audit engine pure function complete
- [ ] All tests passing
- [ ] Pricing data sourced and typed

### Milestone 3 — API Complete (End of Day 3)
- [ ] All 3 API routes working
- [ ] Lead capture saving to DB
- [ ] Confirmation email sending
- [ ] AI summary generating + fallback working

### Milestone 4 — Frontend Complete (End of Day 5)
- [ ] All 3 pages implemented
- [ ] Form persists to localStorage
- [ ] Results page visually shareable
- [ ] OG tags set

### Milestone 5 — MVP Launch (End of Day 7)
- [ ] All 6 required features working
- [ ] Lighthouse scores met
- [ ] All documentation files written
- [ ] Commits on ≥ 5 distinct days
- [ ] Submitted via Google Form

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenRouter API unavailable / rate limited | Medium | Fallback to template summary — audit still works |
| Supabase free tier connection limits | Low | Lightweight schema; well under limits for MVP |
| Lighthouse score below 85 | High | Performance pass on Day 4; use Next.js font display:swap from Day 1 |
| Audit math contested by reviewer | Critical | All prices cited with URLs; logic documented in BACKEND_STRUCTURE.md; tests prove determinism |
| Git history < 4 days | Critical (auto-reject) | Commit working code daily, even small changes; run `git log` verification on Day 4 |
| User interviews (3 required) | High | Start outreach on Day 1; DM 10 founders on X/LinkedIn; college network as fallback |
| Scope creep into bonus features | Medium | Build MVP fully before touching bonus; DEVLOG notes any scope decisions |

---

## Overall Success Criteria

MVP is complete when:
1. ✅ All 6 required features (form, engine, results, AI summary, leads, shareable URL) work end-to-end
2. ✅ Audit math is defensible — a finance person reads it and agrees
3. ✅ Lighthouse: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
4. ✅ All required repo files present with correct format
5. ✅ Commits on ≥ 5 distinct calendar days
6. ✅ DEVLOG has 7 honest daily entries
7. ✅ ≥ 5 audit engine tests passing in CI
8. ✅ Deployed live URL accessible
9. ✅ 3 real user interviews documented
10. ✅ Entrepreneurial files (GTM, ECONOMICS, etc.) written with real numbers and specificity
