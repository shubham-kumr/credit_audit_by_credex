# DEVLOG — SpendLens

**Project**: SpendLens — AI Tool Spend Auditor
**Developer**: Shubham Kumar
**Start Date**: 2026-05-21
**Target**: 4 days to MVP

---

## Day 1 — 2026-05-21

**Hours worked:** 6

**What I did:**
Initialized the Next.js 14 project using TypeScript, Vanilla TailwindCSS, and ESLint. Set up the design token framework (warm neutral grays, forest greens, alert warnings) inside `tailwind.config.ts`. Researched the pricing rules, licensing limits, and seat tiers for 8 top engineering AI tools: Cursor, GitHub Copilot, Claude, ChatGPT, Windsurf, Gemini, Anthropic API, and OpenAI API. Modeled usage-based and seat-based cost calculations inside `lib/pricing-data.ts`. Wrote initial types (`lib/types.ts`) and configured global styles in `globals.css` with performance-optimized Inter font configurations.

**What I learned:**
Discovered that Claude Team has a strict, hard-coded 5-seat minimum in its policy terms (unlike individual Pro), which is a key savings finding for smaller teams. Sourcing and normalizing token-based developer APIs (Anthropic/OpenAI) to monthly user averages is best modeled with a standard 1:3 input/output token ratio.

**Blockers / what I'm stuck on:**
Gemini's corporate API vs Advanced personal pricing was highly ambiguous. Resolved by matching official Google Workspace add-on pricing to match direct seat-based comparisons.

**Plan for tomorrow:**
Build the core audit engine, Zustand state stores, local rate-limiters, Next.js API endpoints, and database connection.

---

## Day 2 — 2026-05-22

**Hours worked:** 6

**What I did:**
Wrote the core calculation engine (`lib/audit-engine.ts`) supporting plan-fit evaluation, tool redundancy checking (e.g. Cursor + Copilot), and overspend calculation. Implemented `lib/supabase.ts` server client with soft-failure flags when DB variables are unset to keep local development running seamlessly. Wired Zustand (`lib/stores/form-store.ts`) with custom local storage persistence and mount hooks to prevent hydration flickers. Built REST endpoints: `POST /api/audit` (saving calculations and invoking background AI runs) and `GET /api/audit/[slug]` (for link sharing). Added rate-limiting via Upstash Redis (`lib/rate-limit.ts`).

**What I learned:**
Zustand's state persistence is asynchronous on first mount. Introducing a `hasHydrated` state guard prevents Next.js from pre-rendering empty fields, completely avoiding client-side UI layout jumps.

**Blockers / what I'm stuck on:**
Background AI summaries can take 3-4 seconds over networks. I resolved this by keeping calculations pure client-side for instant feedback, and triggering AI summaries asynchronously (fire-and-forget) to write to the DB in the background.

**Plan for tomorrow:**
Design and implement the entire user interface. Connect form submission, audit verdict cards, leads email submission, and full sharing layout.

---

## Day 3 — 2026-05-23

**Hours worked:** 6

**What I did:**
Built the SpendLens user interface: the landing page (`app/page.tsx`), the interactive form (`app/audit/new/page.tsx`), and the results overview (`app/audit/[slug]/page.tsx`). Implemented dynamic pricing selectors that populate plans automatically depending on selected tools. Switched OpenRouter summary calling to use `deepseek/deepseek-v4-flash:free` with `max_tokens: 1000` to prevent token limits from truncating text when reasoning models are selected by the router. Fixed a console warning by changing dynamic HTML elements to use deterministic index-based IDs in `components/ToolRow.tsx`. Refactored `app/api/leads/route.ts` to automatically format sender addresses to `onboarding@resend.dev` and override recipients to `shubhamkr6758@gmail.com` under Resend sandbox modes so that offline email tests never fail with 403. Added detailed error logging to Supabase queries.

**What I learned:**
Free models like DeepSeek v4 Flash on OpenRouter are occasionally rate-limited upstream. Added clean warning handshakes in code for status codes like `429` and `402` to automatically fall back to highly optimized local summary templates instead of breaking the page experience.

**Blockers / what I'm stuck on:**
Spent time tracing a 404 database error when loading slug URLs. Discovered that `.env.local` had `/rest/v1/` appended to the Supabase endpoint URL, breaking SDK paths. Removed the postfix to completely fix connectivity.

**Plan for tomorrow:**
Write the Vitest verification test suite, audit accessibility, create developer documentations, and deploy the live Vercel app.


