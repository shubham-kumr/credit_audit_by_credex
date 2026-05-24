# REFLECTION.md — SpendLens

## 1. The Hardest Bug

The hardest bug was a hydration mismatch on the results page that only appeared in production, not in local dev.

The symptom: the page would render correctly in development, but in production builds it would throw a React hydration error — "Text content did not match. Server: '' Client: '$345'". This crashed the entire results page.

My first hypothesis was that sessionStorage was being accessed during SSR. I added `typeof window !== 'undefined'` guards everywhere I touched sessionStorage. The error persisted.

Second hypothesis: the savings number was being formatted differently on server and client due to locale differences in `toLocaleString()`. I replaced all `toLocaleString()` calls with a manual `$${amount.toFixed(0)}` formatter. Still broken.

Third hypothesis (correct): `crypto.randomUUID()` was being called at module scope to generate the audit slug. In Next.js App Router, server components execute at build time, and `crypto.randomUUID()` returns a different value on server vs. client — causing React to detect a mismatch. The fix was moving slug generation inside a `useEffect(() => { setSlug(crypto.randomUUID()) }, [])`. The component renders with an empty slug on the server, then hydrates with the real slug on the client. Once session storage reads are gated on the slug being set, the cascade resolves.

What made this hard: it only reproduces in production builds because development mode doesn't do the same SSR/hydration split. I had to run `npm run build && npm run start` locally to reproduce it consistently.

---

## 2. A Decision I Reversed

I started with DM Serif Display for headings and DM Sans for body — the original design system in FRONTEND_GUIDELINES.md. This gave the headings a premium editorial feel that I liked at first.

I reversed it on Day 2, after building the first version of the landing page and seeing it rendered.

Three things made me reverse it:

First, the Serif display font felt wrong for a B2B finance tool. When I looked at the page next to Stripe, Linear, and Notion — the tools the target users use every day — the serif felt out of place. It read as "startup marketing" rather than "engineering tool."

Second, Inter at 700 weight in large sizes actually reads as strong and confident without the serif personality. The headings didn't lose visual weight.

Third, loading three separate Google Fonts (DM Serif Display, DM Sans, JetBrains Mono) was adding ~180KB to the initial load. Inter covers all three roles adequately. The Lighthouse performance score improved by 4 points after switching.

The tradeoff is less typographic personality. But personality is less important than credibility for this product, and Inter reads as credible.

---

## 3. What I'd Build in Week 2

Three things, in priority order.

**Supabase Auth + saved audit history.** Right now audits are anonymous and linked by slug only. Week 2 would add Google SSO so engineering leads can log in, see all their past audits, and track savings over time. "You saved $345/month in May. Are your subscriptions up for renewal?" is a reactivation hook that works.

**Streaming AI summary.** The current implementation waits 3-4 seconds for the full Anthropic response. Week 2 replaces this with a streaming response using Vercel AI SDK's `streamText`. The summary would appear word by word as it generates, making the wait feel intentional and the product feel more alive.

**Audit comparison / diff view.** If a team runs an audit in May and again in August, they should be able to see what changed. Did they act on the Copilot redundancy finding? Did a new tool get added? A diff view turns SpendLens from a one-time audit into an ongoing monitoring tool — and gives Credex a reason to follow up with leads monthly.

The second two are product polish. The first is the one that creates retention and gives Credex a CRM for warm leads.

---

## 4. How I Used AI Tools

**Claude (claude.ai):** Used for reasoning through the audit engine logic — specifically how to model the Anthropic API's token-based pricing as a per-seat equivalent. I described the problem, it walked through three approaches, I picked the conservative 1:3 input/output ratio model. I did not trust it to write the final pricing constants — those I sourced from vendor pages directly.

**Cursor (AI autocomplete):** Used heavily for boilerplate — Zod schemas, Zustand store setup, Next.js route handlers. I trusted it for structural patterns but reviewed every line that touched business logic (the audit engine, savings calculations).

**What I didn't trust AI with:** The audit math itself. Cursor autocompleted a redundancy check that flagged Claude and ChatGPT as redundant for all use cases. That's wrong — they're redundant for a writing team but not for a coding team that uses Claude for architecture reasoning and ChatGPT for quick lookups. I caught it because I was testing with realistic inputs, not edge cases. The fix was adding the `use_case` parameter to the redundancy check.

**One specific time AI was wrong:** Claude suggested modeling the Gemini API as "$7/user/month" in a flat-fee equivalent. I pushed back — Gemini's API is entirely usage-based, there's no per-seat construct. The "$7" figure came from Gemini Advanced (the consumer product), not the API. If I'd accepted that suggestion unchecked, the engine would have produced incorrect results for any team using the Gemini API.

---

## 5. Self-Rating

**Discipline: 7/10**
Stuck to the day-by-day build plan and shipped working code each day, but I let Day 2 run to 8 hours when I should have cut scope and rested — the hydration bug on Day 4 might have been caught earlier with fresh eyes.

**Code quality: 8/10**
The audit engine is clean, typed, and pure — I'm proud of it. The component layer has some prop-drilling that should be context or a store. A few API route handlers are longer than they should be and could be split into smaller functions.

**Design sense: 7/10**
The UI is professional and functional. The "How it works" interactive section is genuinely good. The mobile layout needs more attention — the form gets cramped on small screens and the savings number truncates below 375px.

**Problem-solving: 8/10**
The hydration bug required methodical hypothesis testing rather than guessing. The graceful degradation pattern (every service has a fallback) was a proactive decision that saved debugging time later. I lost points for not running production builds locally until Day 4.

**Entrepreneurial thinking: 7/10**
The GTM and economics sections have real numbers and specific channels. The user interviews surfaced one genuine insight that changed the design (the "share with finance lead" framing). I under-invested in the USER_INTERVIEWS until Day 4 — should have started outreach on Day 1 as the plan said.
