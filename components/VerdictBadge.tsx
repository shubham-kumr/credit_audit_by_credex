'use client';

import { Verdict } from '@/lib/types';

const CONFIG: Record<Verdict, { label: string; className: string }> = {
  optimal:     { label: 'Optimal',     className: 'bg-green-100 text-green-700 border-green-200' },
  downgrade:   { label: 'Downgrade',   className: 'bg-amber-100 text-amber-700 border-amber-200' },
  switch:      { label: 'Switch',      className: 'bg-blue-100 text-blue-700 border-blue-200' },
  redundant:   { label: 'Redundant',   className: 'bg-red-100 text-red-700 border-red-200' },
  overspending:{ label: 'Overspending',className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { label, className } = CONFIG[verdict] ?? CONFIG.optimal;
  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
