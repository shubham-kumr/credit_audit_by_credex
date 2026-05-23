# Backend Architecture & Database Structure — SpendLens

---

## 1. Architecture Overview

### System Architecture
- **Pattern**: Next.js API Routes (serverless functions on Vercel)
- **Authentication**: None required for MVP (public tool)
- **Data Flow**: `Client form → POST /api/audit → Audit engine → Supabase → OpenRouter API → Response`
- **Caching Strategy**: No cache for MVP (audits are user-specific, one-time); add Redis caching post-MVP if needed

### Architecture Decisions
- **No separate backend server**: Next.js API routes run as Vercel serverless functions. Zero infra to manage.
- **Client-side audit math**: The core pricing logic runs in the browser (TypeScript). Server only handles persistence + AI summary. This means results are instant (no network wait for the audit itself).
- **Supabase over raw Postgres**: Provides managed Postgres + auto-generated REST API + free SSL + backups on free tier.

---

## 2. Database Schema

**Database**: PostgreSQL 15 (Supabase managed)  
**ORM/Client**: Supabase JS Client (parameterized queries internally — no raw SQL injection risk)  
**Naming Convention**: `snake_case` for all tables and columns  
**Timestamps**: All tables include `created_at`; mutable tables include `updated_at`

---

## 3. Tables & Relationships

### Table: `audits`

**Purpose**: Stores each completed audit with full input data and computed results

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique audit identifier (used as slug) |
| tools_input | JSONB | NOT NULL | Array of tool entries as submitted by user |
| team_size | INTEGER | NOT NULL, CHECK (team_size >= 1) | User's team size |
| use_case | VARCHAR(20) | NOT NULL | One of: coding, writing, data, research, mixed |
| audit_results | JSONB | NOT NULL | Computed per-tool results from audit engine |
| total_monthly_savings | NUMERIC(10,2) | NOT NULL, DEFAULT 0 | Sum of all monthly savings |
| total_annual_savings | NUMERIC(10,2) | NOT NULL, DEFAULT 0 | total_monthly_savings * 12 |
| savings_tier | VARCHAR(20) | NOT NULL | 'high_intent' (>$500/mo), 'standard', 'optimal' |
| ai_summary | TEXT | NULL | AI-generated summary paragraph; NULL until generated |
| summary_generated | BOOLEAN | DEFAULT FALSE | Whether AI summary was successfully generated |
| share_count | INTEGER | DEFAULT 0 | Number of times unique URL was accessed |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Audit creation timestamp |

**Indexes**:
- `PRIMARY KEY ON (id)` — UUID is the public slug
- `idx_audits_created_at ON (created_at DESC)` — for admin queries sorted by recency
- `idx_audits_savings_tier ON (savings_tier)` — for filtering high-intent audits

**JSONB Structure for `tools_input`**:
```json
[
  {
    "tool": "cursor",
    "plan": "business",
    "monthly_spend": 320.00,
    "seats": 8
  }
]
```

**JSONB Structure for `audit_results`**:
```json
[
  {
    "tool": "cursor",
    "plan": "business",
    "current_spend": 320.00,
    "verdict": "redundant",
    "recommended_action": "Switch to Claude Code or drop Copilot — running both for coding is redundant",
    "recommended_spend": 0,
    "monthly_savings": 320.00,
    "savings_reason": "GitHub Copilot covers the same coding use case at $19/user/mo"
  }
]
```

---

### Table: `leads`

**Purpose**: Stores email captures with optional company context; linked to an audit

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique lead identifier |
| audit_id | UUID | FOREIGN KEY → audits(id) ON DELETE SET NULL, NULL | Associated audit (NULL if audit deleted) |
| email | VARCHAR(255) | NOT NULL | Lead email address |
| company_name | VARCHAR(255) | NULL | Optional company name |
| role | VARCHAR(100) | NULL | Optional job title |
| team_size | INTEGER | NULL | Optional team size (may differ from audit) |
| savings_at_capture | NUMERIC(10,2) | NULL | Audit savings at time of capture (for segmentation) |
| tier | VARCHAR(20) | NOT NULL, DEFAULT 'standard' | 'high_intent', 'standard', 'nurture', 'optimal' |
| email_sent | BOOLEAN | DEFAULT FALSE | Whether confirmation email was sent |
| ip_hash | VARCHAR(64) | NULL | SHA-256 of IP address (for rate limit audit, not stored in plain text) |
| honeypot_triggered | BOOLEAN | DEFAULT FALSE | Whether honeypot field was filled (should never be TRUE in clean data) |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Lead capture timestamp |

**Indexes**:
- `PRIMARY KEY ON (id)`
- `idx_leads_email ON (email)` — for deduplication checks
- `idx_leads_audit_id ON (audit_id)` — for joining with audits
- `idx_leads_tier ON (tier)` — for sales team filtering
- `idx_leads_created_at ON (created_at DESC)` — for CRM view

**Constraints**:
- Email format validated at application layer (Zod regex), not DB constraint
- Unique constraint NOT enforced at DB level (same email can submit multiple times for different audits)

---

### Table: `rate_limit_log` (optional / Upstash handles this)

> **Note**: Rate limiting is handled by Upstash Redis, not Postgres. This table is not needed for MVP. Upstash tracks sliding window counts by IP. See `TECH_STACK.md` section 3.

---

## 4. API Endpoints

### POST `/api/audit`

**Purpose**: Save a completed audit to the database and trigger AI summary generation  
**Authentication**: None  
**Rate Limit**: 20 requests per IP per hour

**Request Body**:
```json
{
  "tools": [
    {
      "tool": "cursor",
      "plan": "business",
      "monthly_spend": 320.00,
      "seats": 8
    },
    {
      "tool": "github_copilot",
      "plan": "business",
      "monthly_spend": 152.00,
      "seats": 8
    }
  ],
  "team_size": 8,
  "use_case": "coding"
}
```

**Validation** (Zod schema):
```typescript
const AuditRequestSchema = z.object({
  tools: z.array(z.object({
    tool: z.enum(['cursor', 'github_copilot', 'claude', 'chatgpt', 'anthropic_api', 'openai_api', 'gemini', 'windsurf']),
    plan: z.string().min(1).max(50),
    monthly_spend: z.number().min(0).max(100000),
    seats: z.number().int().min(1).max(10000),
  })).min(1).max(20),
  team_size: z.number().int().min(1).max(100000),
  use_case: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
});
```

**Server-side Logic**:
1. Validate request body with Zod
2. Run audit engine (same logic as client — server runs it again for integrity)
3. Insert row into `audits` table
4. Trigger AI summary generation (async — don't block response)
5. Return audit slug + results immediately

**Response (201)**:
```json
{
  "slug": "550e8400-e29b-41d4-a716-446655440000",
  "audit_results": [...],
  "total_monthly_savings": 472.00,
  "total_annual_savings": 5664.00,
  "savings_tier": "standard",
  "ai_summary": null
}
```
> `ai_summary` is `null` initially. Client polls `GET /api/audit/[slug]` or waits for the summary to be generated server-side and returned in a follow-up call.

**Errors**:
- 400: Validation failed (returns Zod errors)
- 429: Rate limit exceeded
- 500: Database insert failed

**Side Effects**:
- Row inserted into `audits`
- Async AI summary generation triggered (updates row when complete)

---

### GET `/api/audit/[slug]`

**Purpose**: Retrieve a saved audit by UUID slug  
**Authentication**: None  
**Rate Limit**: 60 requests per IP per minute (generous — needed for share functionality)

**Response (200)**:
```json
{
  "slug": "550e8400-e29b-41d4-a716-446655440000",
  "tools_input": [...],
  "audit_results": [...],
  "total_monthly_savings": 472.00,
  "total_annual_savings": 5664.00,
  "savings_tier": "standard",
  "ai_summary": "Your team of 8 is running two overlapping coding tools...",
  "summary_generated": true,
  "created_at": "2025-05-21T10:00:00Z"
}
```

**Note on PII**: This endpoint does NOT return email or company name from the `leads` table. Those are decoupled. The audit itself contains no PII.

**Errors**:
- 404: Audit not found for slug
- 500: Database query failed

**Side Effects**:
- Increments `share_count` on the audit row (non-blocking, fire-and-forget)

---

### POST `/api/leads`

**Purpose**: Capture an email lead after audit results are shown  
**Authentication**: None  
**Rate Limit**: 5 requests per IP per hour (strict — abuse protection)

**Request Body**:
```json
{
  "audit_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "maya@startup.com",
  "company_name": "Acme Corp",
  "role": "Engineering Manager",
  "team_size": 8,
  "_hp": ""
}
```
> `_hp` is the honeypot field. If non-empty, request is silently accepted (200 returned) but NOT saved to DB and NOT logged.

**Validation** (Zod schema):
```typescript
const LeadRequestSchema = z.object({
  audit_id: z.string().uuid(),
  email: z.string().email().max(255),
  company_name: z.string().max(255).optional(),
  role: z.string().max(100).optional(),
  team_size: z.number().int().min(1).max(100000).optional(),
  _hp: z.string().max(0),  // Must be empty
});
```

**Server-side Logic**:
1. Check honeypot — if filled, return 200 silently and exit
2. Validate with Zod
3. Fetch associated audit to get `savings_at_capture` and `tier`
4. Insert row into `leads` table
5. Send confirmation email via Resend (async)
6. Return 201

**Response (201)**:
```json
{
  "message": "Report sent! Check your inbox.",
  "tier": "standard"
}
```

**Errors**:
- 400: Validation failed
- 404: audit_id not found
- 429: Rate limit exceeded
- 500: DB insert failed (email still attempted)

**Side Effects**:
- Row inserted into `leads`
- Confirmation email sent via Resend:
  - Standard tier: audit summary + tool recommendations
  - High-intent tier: audit summary + Credex consultation CTA + advisor note

---

## 5. Audit Engine Logic

The audit engine is TypeScript, runs **client-side** and is also run **server-side** for data integrity. It lives in `/lib/audit-engine.ts`.

### Input
```typescript
interface AuditInput {
  tools: ToolEntry[];
  team_size: number;
  use_case: UseCase;
}

interface ToolEntry {
  tool: ToolKey;
  plan: string;
  monthly_spend: number;
  seats: number;
}
```

### Evaluation Logic (per tool)

#### Step 1: Plan-Fit Check
```
IF tool === 'claude' AND plan === 'team' AND seats <= 2
  THEN verdict = 'downgrade'
  THEN recommendation = 'Claude Pro (individual) at $20/seat covers this use case — Team plan minimum is 5 seats'
  THEN savings = current_spend - (seats * 20)
```

#### Step 2: Redundancy Check
```
coding_tools = tools.filter(t => t covers coding use case)
IF coding_tools.length > 1
  THEN flag lowest-value tool as 'redundant'
  THEN reasoning = 'You have [X] and [Y] — both serve coding. Pick the better fit.'
```
Coding coverage map:
- `cursor` → covers coding ✓
- `github_copilot` → covers coding ✓
- `claude` (if use_case === coding) → covers coding ✓
- `chatgpt` (if use_case === coding) → covers coding ✓

#### Step 3: Cheaper Alternative Check
```
IF tool === 'github_copilot' AND plan === 'business' AND use_case === 'coding'
  THEN check if cursor is already in the audit
  IF cursor is present AND copilot is present
    THEN flag copilot as redundant (Cursor has superset features)
```

#### Step 4: Credex Credit Opportunity
```
IF verdict is NOT 'optimal'
  THEN add note: "This tool is available through Credex at up to 30% off"
```

### Pricing Reference (see PRICING_DATA.md for all values and URLs)

All pricing values are imported from `/lib/pricing-data.ts` — a typed constant object. Never hardcoded inline.

```typescript
// Example structure
export const PRICING: Record<ToolKey, Record<string, PlanPricing>> = {
  cursor: {
    hobby:      { per_seat: 0,   min_seats: 1, notes: 'Free tier' },
    pro:        { per_seat: 20,  min_seats: 1, notes: '$20/user/mo' },
    business:   { per_seat: 40,  min_seats: 1, notes: '$40/user/mo' },
    enterprise: { per_seat: null, min_seats: 20, notes: 'Custom pricing' },
  },
  // ...
};
```

---

## 6. Data Validation Rules

### Email
```typescript
const emailSchema = z.string()
  .email('Enter a valid email address')
  .max(255, 'Email too long')
  .toLowerCase();
```

### Spend Amount
```typescript
const spendSchema = z.coerce
  .number({ invalid_type_error: 'Enter a valid dollar amount' })
  .min(0, 'Spend cannot be negative')
  .max(100000, 'Enter a realistic monthly spend');
```

### Seats
```typescript
const seatsSchema = z.coerce
  .number({ invalid_type_error: 'Enter a valid number' })
  .int('Seats must be a whole number')
  .min(1, 'Minimum 1 seat')
  .max(10000, 'Enter a realistic seat count');
```

### Content Sanitization
- All text inputs (company name, role) run through `.trim()` before storage
- No markdown or HTML rendering from user text inputs — displayed as plain text only
- JSONB fields validated at application layer before storage

---

## 7. Error Handling

### Error Response Format (all API routes)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Enter a valid email address" }
    ]
  }
}
```

### Error Codes
| Code | HTTP Status | When |
|------|-------------|------|
| `VALIDATION_ERROR` | 400 | Zod schema fails |
| `NOT_FOUND` | 404 | Audit slug not found |
| `RATE_LIMITED` | 429 | Upstash rate limit exceeded |
| `EXTERNAL_SERVICE_ERROR` | 503 | OpenRouter or Resend unavailable |
| `SERVER_ERROR` | 500 | Unexpected DB or runtime error |

### OpenRouter API Failure Handling
```typescript
try {
  const summary = await generateAISummary(auditData);
  await supabase.from('audits').update({ ai_summary: summary, summary_generated: true }).eq('id', slug);
} catch (error) {
  // Do NOT throw — AI summary is optional
  // Log to Sentry
  // Audit row remains with summary_generated: false
  // Client falls back to templated summary
  console.error('[AI Summary] Generation failed:', error);
}
```

---

## 8. Rate Limiting Implementation

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const auditRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: 'rl:audit',
});

export const leadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'rl:lead',
});

// In API route:
const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
const { success, reset } = await leadRateLimit.limit(ip);
if (!success) {
  return NextResponse.json(
    { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } },
    { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
  );
}
```

---

## 9. Email Templates (Resend)

### Confirmation Email — Standard Tier

**Subject**: `Your AI spend audit from SpendLens`

**Body structure**:
- Personalized greeting
- Total savings summary
- Per-tool recommendations (plain text list)
- Link to full audit: `https://spendlens.app/audit/[slug]`
- Footer: SpendLens branding + unsubscribe link

### Confirmation Email — High-Intent Tier (>$500/mo savings)

**Subject**: `Your AI spend audit — you could save $[X]/month`

**Body structure** (same as standard, plus):
- Prominent Credex section: "Want to capture even more savings?"
- CTA: "Book a free 20-min Credex consultation"
- Button linking to Calendly / credex.rocks

---

## 10. Supabase Setup Notes

### Row Level Security (RLS)
- **MVP**: RLS disabled on `audits` (public read, server-only write via service role key)
- **MVP**: RLS disabled on `leads` (server-only read/write via service role key)
- `SUPABASE_SERVICE_ROLE_KEY` never exposed to client; all writes go through Next.js API routes

### SQL to initialize tables
```sql
-- Run in Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tools_input JSONB NOT NULL,
  team_size INTEGER NOT NULL CHECK (team_size >= 1),
  use_case VARCHAR(20) NOT NULL,
  audit_results JSONB NOT NULL,
  total_monthly_savings NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_annual_savings NUMERIC(10,2) NOT NULL DEFAULT 0,
  savings_tier VARCHAR(20) NOT NULL DEFAULT 'standard',
  ai_summary TEXT,
  summary_generated BOOLEAN DEFAULT FALSE,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audits_created_at ON audits (created_at DESC);
CREATE INDEX idx_audits_savings_tier ON audits (savings_tier);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(100),
  team_size INTEGER,
  savings_at_capture NUMERIC(10,2),
  tier VARCHAR(20) NOT NULL DEFAULT 'standard',
  email_sent BOOLEAN DEFAULT FALSE,
  ip_hash VARCHAR(64),
  honeypot_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads (email);
CREATE INDEX idx_leads_audit_id ON leads (audit_id);
CREATE INDEX idx_leads_tier ON leads (tier);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
```

---

## 11. Backup & Recovery

### Supabase Free Tier Backups
- **Frequency**: Daily automated backups (Supabase managed)
- **Retention**: 7 days on free tier
- **Recovery**: Supabase dashboard → Database → Backups → Restore
- **Manual export**: Run `pg_dump` via Supabase DB connection string weekly

---

## 12. Scalability Notes (for ARCHITECTURE.md 10k audits/day scenario)

At 10k audits/day:
- Add Redis caching for `GET /api/audit/[slug]` (most reads are repeat views of shared URLs)
- Move AI summary to a background job queue (BullMQ or Inngest)
- Add read replica for Supabase
- Rate limits become more important — tighten per-IP limits
- Consider CDN-cached OG images per audit slug (Vercel OG image generation)
- Move from Supabase free to Pro tier (~$25/mo) for connection pooling (PgBouncer)
