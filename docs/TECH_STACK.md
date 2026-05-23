# Technology Stack Documentation — SpendLens

**Last Updated**: 2025-05-21  
**Version**: 1.0

---

## 1. Stack Overview

### Architecture Pattern
- **Type**: Monolithic Next.js app (frontend + API routes in one repo)
- **Pattern**: JAMstack with serverless API routes
- **Deployment**: Vercel (frontend + API), Supabase (DB + optional storage)
- **Rationale**: Single repo keeps the 4-day build manageable. Next.js API routes replace a separate Express server — no infra complexity, instant deploy. Supabase provides Postgres + REST API out of the box on a free tier.

---

## 2. Frontend Stack

### Core Framework
- **Framework**: Next.js
- **Version**: 14.2.3
- **Reason**: App Router supports server components + API routes in one project; built-in image optimization; Vercel deploys zero-config; strong TypeScript support
- **Documentation**: https://nextjs.org/docs
- **License**: MIT

### Language
- **Language**: TypeScript
- **Version**: 5.4.5
- **tsconfig**: Strict mode enabled (`"strict": true`)
- **Reason**: Type safety catches bugs in audit engine logic; better DX with IDE autocomplete for complex rule objects
- **Documentation**: https://www.typescriptlang.org/docs

### UI / Styling
- **Framework**: Tailwind CSS
- **Version**: 3.4.3
- **Configuration**: `tailwind.config.ts` with custom color tokens and font families
- **Reason**: Utility-first enables fast iteration; no context-switching to CSS files; consistent spacing scale
- **Documentation**: https://tailwindcss.com/docs
- **License**: MIT

### Component Primitives
- **Library**: shadcn/ui (not a dependency — copy-paste components)
- **Version**: Latest as of 2025-05-21 (components copied into `/components/ui`)
- **Reason**: Headless, accessible primitives (Radix UI under the hood) without opinionated styling. We style them ourselves. No version lock-in.
- **Documentation**: https://ui.shadcn.com

### Animation
- **Library**: Framer Motion
- **Version**: 11.1.9
- **Reason**: Declarative animations for staggered card reveals, number count-up, and page transitions. Respects `prefers-reduced-motion` natively.
- **Documentation**: https://www.framer.com/motion
- **License**: MIT

### Form Handling
- **Library**: React Hook Form
- **Version**: 7.51.3
- **Validation**: Zod 3.23.4
- **Reason**: Uncontrolled inputs = no re-render on every keystroke; critical for form with dynamic rows. Zod schemas double as TypeScript types.
- **Documentation**: https://react-hook-form.com / https://zod.dev
- **License**: MIT

### State Management
- **Library**: Zustand
- **Version**: 4.5.2
- **Reason**: Lightweight global state for form data and audit results between pages. No boilerplate. Works with Next.js App Router without context provider hell.
- **Documentation**: https://github.com/pmndrs/zustand
- **License**: MIT

### HTTP Client
- **Built-in**: Native `fetch` (no external client)
- **Reason**: Next.js 14 extends fetch natively with caching. For a handful of API calls in this app, axios overhead is unnecessary.

### Icons
- **Library**: Lucide React
- **Version**: 0.378.0
- **Reason**: Consistent stroke-width icons; tree-shakeable; TypeScript types included
- **Documentation**: https://lucide.dev
- **License**: ISC

### Number Formatting
- **Built-in**: `Intl.NumberFormat` (browser native)
- **Reason**: Correct currency formatting ($1,200.00) without a library

---

## 3. Backend Stack

### Runtime
- **Platform**: Node.js (via Next.js API routes on Vercel Edge/Serverless)
- **Version**: 20.x LTS (Vercel runtime)
- **Package Manager**: pnpm 9.1.0
- **Reason**: pnpm is faster than npm, deduplicates packages, works well with monorepo if needed later

### API Layer
- **Framework**: Next.js API Routes (App Router `route.ts` handlers)
- **Version**: 14.2.3 (same as frontend)
- **Reason**: No separate Express server needed. Reduces infra surface. Deploys as Vercel serverless functions automatically.

### Database
- **Primary**: PostgreSQL (via Supabase)
- **Version**: PostgreSQL 15 (Supabase managed)
- **Client**: Supabase JS Client (`@supabase/supabase-js` 2.43.1)
- **Reason**: Supabase free tier is generous (500MB, 50k rows). Built-in REST API. Row Level Security for future auth. No migration tooling needed for simple MVP schema.
- **Documentation**: https://supabase.com/docs
- **License**: Apache 2.0

### AI Integration
- **Provider**: OpenRouter
- **Client**: Native `fetch` (no external SDK dependency)
- **Model**: `deepseek/deepseek-v4-flash:free` (fast, lightweight, highly capable summary model)
- **Reason**: DeepSeek V4 Flash on OpenRouter free tier offers exceptional speed, low latency, zero prompt cost, and strong instruction-following for structured audit summaries
- **Documentation**: https://openrouter.ai/models/deepseek/deepseek-v4-flash:free
- **License**: Commercial (free tier)

### Email Service
- **Provider**: Resend
- **Library**: `resend` 3.2.0
- **Reason**: Developer-friendly; generous free tier (3k emails/month); React Email templates; excellent deliverability
- **Documentation**: https://resend.com/docs
- **License**: Commercial (free tier)

### Rate Limiting
- **Library**: `@upstash/ratelimit` 1.2.1 + `@upstash/redis` 1.28.3
- **Reason**: Upstash Redis is serverless-native; works perfectly with Vercel edge/serverless functions; free tier covers MVP volume
- **Documentation**: https://upstash.com/docs/redis/sdks/ratelimit/overview
- **License**: MIT

### Input Validation (Server-side)
- **Library**: Zod 3.23.4 (same as frontend)
- **Reason**: Shared schema definitions between client and server; single source of truth for validation rules

---

## 4. DevOps & Infrastructure

### Version Control
- **System**: Git
- **Platform**: GitHub (public repo)
- **Branch Strategy**:
  - `main` — production; deploys automatically to Vercel
  - `dev` — working branch for daily commits
  - `feature/*` — feature branches merged into dev
- **Commit Convention**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`)

### CI/CD
- **Platform**: GitHub Actions
- **Workflow file**: `.github/workflows/ci.yml`
- **Triggers**: Push to `main`, pull requests to `main`
- **Steps**:
  1. `pnpm install`
  2. `pnpm lint`
  3. `pnpm type-check`
  4. `pnpm test`
- **Deploy**: Vercel GitHub integration (auto-deploy on push to main)

### Hosting
- **Frontend + API**: Vercel (free Hobby tier)
- **Database**: Supabase (free tier)
- **Redis (rate limiting)**: Upstash (free tier — 10k commands/day)
- **Email**: Resend (free tier — 3k/month)

### Monitoring & Logging
- **Error Tracking**: Sentry (`@sentry/nextjs` 8.7.0) — free tier
- **Analytics**: Vercel Analytics (built-in, zero config)
- **API Logging**: `console.error` to Vercel function logs for MVP; structured logging post-MVP

### Testing
- **Unit Tests**: Vitest 1.6.0
- **Test Utilities**: `@testing-library/react` 16.0.0, `@testing-library/jest-dom` 6.4.2
- **Coverage Target**: ≥ 80% on audit engine; ≥ 5 tests required per assignment
- **E2E**: Not required for MVP (time constraint); noted in TESTS.md

---

## 5. Development Tools

### Code Quality
- **Linter**: ESLint 8.57.0
  - Config: `eslint-config-next` 14.2.3
  - Additional: `eslint-plugin-@typescript-eslint` 7.9.0
- **Formatter**: Prettier 3.2.5
  - Config: `.prettierrc` (see below)
- **Git Hooks**: Husky 9.0.11
  - Pre-commit: `pnpm lint && pnpm format`
- **Type Check**: `tsc --noEmit` (run in CI)

### Prettier Config
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### IDE Recommendations
- **Editor**: VS Code
- **Extensions**:
  - ESLint (`dbaeumer.vscode-eslint`)
  - Prettier (`esbenp.prettier-vscode`)
  - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
  - TypeScript Vue Plugin (optional)
  - Error Lens (`usernamehw.errorlens`)

---

## 6. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1..."  # Server-only — never expose to client

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."  # Server-only

# Resend (email)
RESEND_API_KEY="re_..."  # Server-only
FROM_EMAIL="audit@spendlens.app"

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxx..."

# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://xxxx@sentry.io/xxxx"

# App
NEXT_PUBLIC_APP_URL="https://spendlens.vercel.app"  # or custom domain
NODE_ENV="development"
```

---

## 7. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  }
}
```

---

## 8. Dependencies Lock

### Frontend + Shared Dependencies
```json
{
  "next": "14.2.3",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "typescript": "5.4.5",
  "tailwindcss": "3.4.3",
  "framer-motion": "11.1.9",
  "react-hook-form": "7.51.3",
  "zod": "3.23.4",
  "zustand": "4.5.2",
  "lucide-react": "0.378.0",
  "@supabase/supabase-js": "2.43.1"
}
```

### Backend / API Route Dependencies
```json
{
  "@anthropic-ai/sdk": "0.20.9",
  "resend": "3.2.0",
  "@upstash/ratelimit": "1.2.1",
  "@upstash/redis": "1.28.3",
  "@sentry/nextjs": "8.7.0"
}
```

### Dev Dependencies
```json
{
  "vitest": "1.6.0",
  "@testing-library/react": "16.0.0",
  "@testing-library/jest-dom": "6.4.2",
  "@vitejs/plugin-react": "4.2.1",
  "eslint": "8.57.0",
  "eslint-config-next": "14.2.3",
  "prettier": "3.2.5",
  "husky": "9.0.11",
  "autoprefixer": "10.4.19",
  "postcss": "8.4.38"
}
```

---

## 9. Security Considerations

### API Keys
- All API keys in environment variables; never committed to repo
- `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` server-only (no `NEXT_PUBLIC_` prefix)
- `.env.local` in `.gitignore`; `.env.example` committed with placeholder values

### Input Sanitization
- All user inputs validated with Zod on both client (React Hook Form) and server (API routes)
- No SQL injection risk — using Supabase JS client (parameterized queries internally)
- Spend values coerced to numbers; string fields max length enforced

### Rate Limiting
- `/api/leads` endpoint: 5 requests per IP per hour (Upstash Redis sliding window)
- `/api/audit` endpoint: 20 requests per IP per hour
- Response on limit hit: 429 with `Retry-After` header

### Bot Protection
- Honeypot field on email capture form (hidden via CSS, bot-visible in HTML)
- If honeypot field is filled: request rejected silently (200 returned to fool bots)

### CORS
- Next.js API routes only accept same-origin requests by default
- No custom CORS config needed for MVP (no third-party API consumers)

### Content Security Policy
- Set via `next.config.ts` headers:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 10. Version Upgrade Policy

### Major Version Updates
- Quarterly review after MVP launch
- Test on `dev` branch before merging to `main`
- Check Next.js upgrade guide for breaking changes

### Security Patches
- Apply immediately when Dependabot alerts fire
- Review diff before merging auto-PRs

### Breaking Changes
- Document in `CHANGELOG.md` (to be added post-MVP)
- No external API consumers in MVP, so breaking changes only affect internal code

---

## 11. Stack Justification Summary (for ARCHITECTURE.md reference)

| Decision | Choice | Why Not Alternatives |
|----------|--------|----------------------|
| Framework | Next.js 14 | Remix: less ecosystem; Vue: less TS tooling for internship assessment; Svelte: smaller community |
| DB | Supabase/Postgres | Firebase: NoSQL harder for relational audit+leads schema; PlanetScale: paid tier required |
| AI Summary | DeepSeek V4 Flash | GPT-3.5: more expensive; Gemini: less stable; minimax: upstream rate limits |
| Email | Resend | SendGrid: complex onboarding; Postmark: no free tier; Nodemailer: requires SMTP server |
| Rate Limiting | Upstash | Vercel KV: same product, slightly higher price; local Redis: doesn't work serverless |
| Styling | Tailwind | CSS Modules: slower iteration; Emotion: SSR complexity; MUI: too opinionated |
