import { describe, it, expect } from 'vitest';
import { runAudit } from '../lib/audit-engine';
import { AuditInput } from '../lib/types';

// ─── helpers ────────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    tools: [
      { tool: 'cursor', plan: 'pro', monthly_spend: 20, seats: 1 },
    ],
    team_size: 5,
    use_case: 'coding',
    ...overrides,
  };
}

// ─── basic sanity ────────────────────────────────────────────────────────────

describe('runAudit — basic output shape', () => {
  it('returns a result for every tool in the input', () => {
    const input = makeInput({
      tools: [
        { tool: 'cursor', plan: 'pro', monthly_spend: 20, seats: 1 },
        { tool: 'chatgpt', plan: 'plus', monthly_spend: 20, seats: 1 },
      ],
    });
    const output = runAudit(input);
    expect(output.results).toHaveLength(2);
  });

  it('total_monthly_spend matches sum of inputs', () => {
    const input = makeInput({
      tools: [
        { tool: 'cursor', plan: 'pro', monthly_spend: 40, seats: 2 },
        { tool: 'chatgpt', plan: 'plus', monthly_spend: 20, seats: 1 },
      ],
    });
    const output = runAudit(input);
    const totalSpend = output.results.reduce((sum, r) => sum + r.current_spend, 0);
    expect(totalSpend).toBe(60);
  });

  it('total_savings is non-negative', () => {
    const output = runAudit(makeInput());
    expect(output.total_monthly_savings).toBeGreaterThanOrEqual(0);
  });

  it('total_annual_savings is 12× monthly savings', () => {
    const output = runAudit(makeInput());
    expect(output.total_annual_savings).toBe(output.total_monthly_savings * 12);
  });
});

// ─── redundancy detection ─────────────────────────────────────────────────────

describe('runAudit — redundancy detection', () => {
  it('flags Cursor + GitHub Copilot as redundant', () => {
    const input = makeInput({
      tools: [
        { tool: 'cursor', plan: 'pro', monthly_spend: 20, seats: 1 },
        { tool: 'github_copilot', plan: 'individual', monthly_spend: 10, seats: 1 },
      ],
    });
    const output = runAudit(input);
    const verdicts = output.results.map((r) => r.verdict);
    expect(verdicts).toContain('redundant');
  });

  it('does not flag two unrelated tools as redundant', () => {
    const input = makeInput({
      tools: [
        { tool: 'cursor', plan: 'pro', monthly_spend: 20, seats: 1 },
        { tool: 'gemini', plan: 'business', monthly_spend: 30, seats: 1 },
      ],
    });
    const output = runAudit(input);
    const verdicts = output.results.map((r) => r.verdict);
    expect(verdicts).not.toContain('redundant');
  });
});

// ─── plan-fit check ───────────────────────────────────────────────────────────

describe('runAudit — plan-fit checks', () => {
  it('marks a tool as optimal when spend matches official pricing', () => {
    // Cursor Pro is $20/seat — 1 seat should be optimal at $20
    const input = makeInput({
      tools: [{ tool: 'cursor', plan: 'pro', monthly_spend: 20, seats: 1 }],
    });
    const output = runAudit(input);
    expect(output.results[0].verdict).toBe('optimal');
  });

  it('flags overspending when actual spend significantly exceeds official price', () => {
    const input = makeInput({
      tools: [{ tool: 'cursor', plan: 'pro', monthly_spend: 200, seats: 1 }],
    });
    const output = runAudit(input);
    expect(output.results[0].verdict).toBe('overspending');
  });
});

// ─── edge cases ───────────────────────────────────────────────────────────────

describe('runAudit — edge cases', () => {
  it('handles a single tool with zero spend', () => {
    const input = makeInput({
      tools: [{ tool: 'cursor', plan: 'pro', monthly_spend: 0, seats: 1 }],
    });
    expect(() => runAudit(input)).not.toThrow();
  });

  it('handles large team sizes without error', () => {
    const input = makeInput({
      team_size: 10000,
      tools: [{ tool: 'chatgpt', plan: 'team', monthly_spend: 300, seats: 30 }],
    });
    expect(() => runAudit(input)).not.toThrow();
  });

  it('handles all supported use cases', () => {
    const useCases = ['coding', 'writing', 'data', 'research', 'mixed'] as const;
    useCases.forEach((use_case) => {
      expect(() => runAudit(makeInput({ use_case }))).not.toThrow();
    });
  });
});
