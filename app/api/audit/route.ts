import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAudit } from '@/lib/audit-engine';
import { generateAISummary } from '@/lib/generate-summary';
import { checkAuditRateLimit } from '@/lib/rate-limit';

const AuditRequestSchema = z.object({
  tools: z.array(
    z.object({
      tool: z.enum(['cursor', 'github_copilot', 'claude', 'chatgpt', 'anthropic_api', 'openai_api', 'gemini', 'windsurf']),
      plan: z.string().min(1).max(50),
      monthly_spend: z.number().min(0).max(100000),
      seats: z.number().int().min(1).max(10000),
    })
  ).min(1).max(20),
  team_size: z.number().int().min(1).max(100000),
  use_case: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  client_slug: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { allowed, retryAfter } = await checkAuditRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  // Parse & validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON' } }, { status: 400 });
  }

  const parsed = AuditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: parsed.error.errors } },
      { status: 400 }
    );
  }

  const { tools, team_size, use_case, client_slug } = parsed.data;
  const auditOutput = runAudit({ tools, team_size, use_case });
  const slug = client_slug ?? crypto.randomUUID();

  // Attempt DB save (non-blocking — don't fail the response if Supabase isn't configured)
  const { supabase } = await import('@/lib/supabase');
  if (supabase) {
    try {
      const { error } = await supabase.from('audits').upsert({
        id: slug,
        tools_input: tools,
        team_size,
        use_case,
        audit_results: auditOutput.results,
        total_monthly_savings: auditOutput.total_monthly_savings,
        total_annual_savings: auditOutput.total_annual_savings,
        savings_tier: auditOutput.savings_tier,
      });

      if (error) {
        console.error('[POST /api/audit] DB save error details:', error);
      } else {
        // AI summary async (fire and forget)
        generateAISummary(auditOutput).then(async (summary) => {
          const { error: updateErr } = await supabase!.from('audits').update({ ai_summary: summary, summary_generated: true }).eq('id', slug);
          if (updateErr) {
            console.error('[POST /api/audit] DB AI summary update error:', updateErr);
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[POST /api/audit] DB save failed:', err);
      // Don't fail — client has the data already
    }
  }

  return NextResponse.json(
    {
      slug,
      audit_results: auditOutput.results,
      total_monthly_savings: auditOutput.total_monthly_savings,
      total_annual_savings: auditOutput.total_annual_savings,
      savings_tier: auditOutput.savings_tier,
      ai_summary: null,
    },
    { status: 201 }
  );
}
