'use client';

import { ToolResult } from '@/lib/types';
import { TOOL_DISPLAY_NAMES } from '@/lib/pricing-data';
import VerdictBadge from './VerdictBadge';
import { ArrowRight } from 'lucide-react';

interface Props {
  result: ToolResult;
  index: number;
}

const verdictBg: Record<string, string> = {
  overspending: 'border-red-200 bg-red-50/40',
  redundant:    'border-red-200 bg-red-50/40',
  optimal:      'border-green-200 bg-green-50/20',
  downgrade:    'border-amber-200 bg-amber-50/20',
  switch:       'border-blue-200 bg-blue-50/20',
};

export default function AuditResultCard({ result, index }: Props) {
  const {
    tool, plan, current_spend, recommended_spend, monthly_savings,
    verdict, recommended_action, savings_reason, credex_note, seats,
  } = result;

  const borderClass = verdictBg[verdict] ?? 'border-neutral-200';
  const delay = `${index * 80}ms`;

  return (
    <div
      className={`card p-5 space-y-3 border animate-fade-in-up ${borderClass}`}
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-800 text-base leading-snug">
            {TOOL_DISPLAY_NAMES[tool]}
          </h3>
          <p className="text-sm text-neutral-500 mt-0.5 capitalize">
            {plan} plan · {seats} seat{seats !== 1 ? 's' : ''}
          </p>
        </div>
        <VerdictBadge verdict={verdict} />
      </div>

      {/* Spend comparison */}
      {monthly_savings > 0 && (
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-mono text-neutral-400 line-through">
            ${current_spend.toFixed(0)}/mo
          </span>
          <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />
          <span className="font-mono font-semibold text-success">
            ${recommended_spend.toFixed(0)}/mo
          </span>
          <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-semibold border border-accent-200">
            Save ${monthly_savings.toFixed(0)}/mo
          </span>
        </div>
      )}

      {/* Recommendation */}
      <p className="text-sm text-neutral-600 leading-relaxed">{recommended_action}</p>

      {/* Reason */}
      {savings_reason && verdict !== 'optimal' && (
        <p className="text-xs text-neutral-400 leading-relaxed">{savings_reason}</p>
      )}

      {/* Credex note */}
      {credex_note && (
        <p className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded px-3 py-1.5">
          💳 {credex_note}
        </p>
      )}
    </div>
  );
}
