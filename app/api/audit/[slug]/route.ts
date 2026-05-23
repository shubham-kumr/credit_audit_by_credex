import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(slug)) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Audit not found' } },
      { status: 404 }
    );
  }

  const { supabase } = await import('@/lib/supabase');
  if (!supabase) {
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Database not configured' } },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from('audits')
    .select('id, tools_input, audit_results, total_monthly_savings, total_annual_savings, savings_tier, ai_summary, summary_generated, created_at')
    .eq('id', slug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Audit not found' } },
      { status: 404 }
    );
  }

  // Increment share_count (fire and forget)
  Promise.resolve(
    supabase.from('audits').update({ share_count: ((data as any).share_count || 0) + 1 }).eq('id', slug)
  ).catch(() => {});

  return NextResponse.json({
    slug: data.id,
    tools_input: data.tools_input,
    audit_results: data.audit_results,
    results: data.audit_results, // alias for client compatibility
    total_monthly_savings: data.total_monthly_savings,
    total_annual_savings: data.total_annual_savings,
    savings_tier: data.savings_tier,
    ai_summary: data.ai_summary,
    summary_generated: data.summary_generated,
    created_at: data.created_at,
  });
}
