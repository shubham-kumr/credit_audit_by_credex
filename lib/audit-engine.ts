// ============================================================
// SpendLens — Audit Engine (Pure Function)
// Runs client-side AND server-side for integrity
// Input: AuditInput → Output: AuditOutput
// No side effects, no network calls, fully deterministic
// ============================================================

import {
  AuditInput,
  AuditOutput,
  ToolEntry,
  ToolResult,
  SavingsTier,
  Verdict,
  UseCase,
  ToolKey,
} from './types';
import {
  PRICING,
  TOOL_DISPLAY_NAMES,
  CODING_TOOLS,
  CODING_CAPABLE_TOOLS,
} from './pricing-data';

// ── Helpers ──────────────────────────────────────────────────

function getSavingsTier(monthly_savings: number): SavingsTier {
  if (monthly_savings > 500) return 'high_intent';
  if (monthly_savings > 100) return 'standard';
  return 'optimal';
}

function formatTool(key: ToolKey): string {
  return TOOL_DISPLAY_NAMES[key] ?? key;
}

function officialPrice(tool: ToolKey, plan: string): number | null {
  const planData = PRICING[tool]?.[plan];
  return planData?.per_seat_monthly ?? null;
}

/** Determine if a tool covers coding use cases */
function isCodingTool(tool: ToolKey, useCase: UseCase): boolean {
  if (CODING_TOOLS.includes(tool)) return true;
  if (CODING_CAPABLE_TOOLS.includes(tool) && (useCase === 'coding' || useCase === 'mixed'))
    return true;
  return false;
}

// ── Step 1: Plan-Fit Check ────────────────────────────────────

function checkPlanFit(entry: ToolEntry, teamSize: number, useCase: UseCase): ToolResult {
  const { tool, plan, monthly_spend, seats } = entry;
  const toolName = formatTool(tool);

  // Claude Team plan minimum is 5 seats
  if (tool === 'claude' && plan === 'team' && seats < 5) {
    const proPricePerSeat = officialPrice('claude', 'pro') ?? 20;
    const recommendedSpend = seats * proPricePerSeat;
    const savings = monthly_spend - recommendedSpend;
    return {
      tool,
      plan,
      current_spend: monthly_spend,
      seats,
      verdict: 'downgrade',
      recommended_action: `Switch to Claude Pro at $${proPricePerSeat}/seat — Team plan requires a minimum of 5 seats and is overkill for ${seats} user${seats === 1 ? '' : 's'}.`,
      recommended_spend: Math.max(0, recommendedSpend),
      monthly_savings: Math.max(0, savings),
      savings_reason: `Claude Pro covers the same functionality at $${proPricePerSeat}/user/mo with no seat minimum.`,
      credex_note:
        savings > 0 ? 'Available through Credex credits at up to 30% off.' : undefined,
    };
  }

  // ChatGPT Team plan is only worthwhile at 2+ seats
  if (tool === 'chatgpt' && plan === 'team' && seats === 1) {
    const plusPrice = officialPrice('chatgpt', 'plus') ?? 20;
    const recommendedSpend = plusPrice;
    const savings = monthly_spend - recommendedSpend;
    return {
      tool,
      plan,
      current_spend: monthly_spend,
      seats,
      verdict: 'downgrade',
      recommended_action: `Downgrade to ChatGPT Plus at $${plusPrice}/mo — Team plan overhead isn't worth it for a single user.`,
      recommended_spend: Math.max(0, recommendedSpend),
      monthly_savings: Math.max(0, savings),
      savings_reason: 'ChatGPT Plus offers the same models for solo users at a lower price.',
      credex_note:
        savings > 0 ? 'Available through Credex credits at up to 30% off.' : undefined,
    };
  }

  // $0 spend — flag as free plan question
  if (monthly_spend === 0) {
    return {
      tool,
      plan,
      current_spend: 0,
      seats,
      verdict: 'optimal',
      recommended_action: `${toolName} — entered as $0/mo. Are you on a free tier?`,
      recommended_spend: 0,
      monthly_savings: 0,
      savings_reason: 'No spend entered — verify if this is on a free plan.',
    };
  }

  // Check if spend is significantly above official pricing (overspending flag)
  const planData = PRICING[tool]?.[plan];
  if (planData?.per_seat_monthly !== null && planData?.per_seat_monthly !== undefined) {
    const officialTotal = planData.per_seat_monthly * seats;
    if (monthly_spend > officialTotal * 1.1) {
      const savings = monthly_spend - officialTotal;
      return {
        tool,
        plan,
        current_spend: monthly_spend,
        seats,
        verdict: 'overspending',
        recommended_action: `Your actual spend ($${monthly_spend}/mo) exceeds the official ${toolName} ${planData.display_name} price of $${officialTotal}/mo for ${seats} seat${seats === 1 ? '' : 's'}.`,
        recommended_spend: officialTotal,
        monthly_savings: savings,
        savings_reason: `Official ${toolName} ${planData.display_name} pricing is $${planData.per_seat_monthly}/seat/mo.`,
        credex_note: 'Credex credits can further reduce this by up to 30%.',
      };
    }
  }

  // Default: optimal
  return {
    tool,
    plan,
    current_spend: monthly_spend,
    seats,
    verdict: 'optimal',
    recommended_action: `${toolName} (${plan}) — your spend looks appropriate for ${seats} seat${seats === 1 ? '' : 's'}.`,
    recommended_spend: monthly_spend,
    monthly_savings: 0,
    savings_reason: 'Plan and seat count appear well-matched to your usage.',
  };
}

// ── Step 2: Cross-Tool Redundancy Check ───────────────────────

function checkRedundancy(results: ToolResult[], useCase: UseCase): void {
  // Find all coding tools in the audit
  const codingResults = results.filter((r) => isCodingTool(r.tool, useCase));

  if (codingResults.length >= 2) {
    // Sort by monthly spend ascending — flag the lowest-value one as redundant
    const sorted = [...codingResults].sort((a, b) => a.current_spend - b.current_spend);
    const redundantEntry = sorted[0];
    const keepEntry = sorted[sorted.length - 1];

    // Find and update the redundant entry in the results array
    const idx = results.findIndex((r) => r.tool === redundantEntry.tool);
    if (idx !== -1) {
      const toolNames = codingResults.map((r) => formatTool(r.tool)).join(' and ');
      results[idx] = {
        ...results[idx],
        verdict: 'redundant',
        recommended_action: `Drop ${formatTool(redundantEntry.tool)} — you're already running ${formatTool(keepEntry.tool)} which covers the same coding use case.`,
        recommended_spend: 0,
        monthly_savings: redundantEntry.current_spend,
        savings_reason: `${toolNames} both serve coding assistance. Running two overlapping tools for the same use case wastes budget.`,
        credex_note: 'The tool you keep may be available through Credex at up to 30% off.',
      };
    }
  }
}

// ── Main Export ───────────────────────────────────────────────

export function runAudit(input: AuditInput): AuditOutput {
  const { tools, team_size, use_case } = input;

  // Step 1: Per-tool plan-fit check
  const results: ToolResult[] = tools.map((tool) =>
    checkPlanFit(tool, team_size, use_case)
  );

  // Step 2: Cross-tool redundancy check (mutates results)
  checkRedundancy(results, use_case);

  // Step 3: Calculate totals
  const total_monthly_savings = results.reduce((sum, r) => sum + r.monthly_savings, 0);
  const total_annual_savings = total_monthly_savings * 12;
  const savings_tier = getSavingsTier(total_monthly_savings);

  return {
    results,
    total_monthly_savings: Math.round(total_monthly_savings * 100) / 100,
    total_annual_savings: Math.round(total_annual_savings * 100) / 100,
    savings_tier,
  };
}

export { getSavingsTier, formatTool };
