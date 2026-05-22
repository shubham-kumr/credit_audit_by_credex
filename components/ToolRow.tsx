'use client';

import { PRICING, TOOL_DISPLAY_NAMES, ALL_TOOL_KEYS } from '@/lib/pricing-data';
import { ToolKey } from '@/lib/types';
import { useFormStore, ToolRowState } from '@/lib/stores/form-store';
import { X, AlertCircle } from 'lucide-react';

interface Props {
  row: ToolRowState;
  index: number;
  canRemove: boolean;
  errors?: { tool?: string; plan?: string; spend?: string; seats?: string };
}

export default function ToolRow({ row, index, canRemove, errors = {} }: Props) {
  const { updateRow, removeRow } = useFormStore();

  const plans = row.tool ? Object.entries(PRICING[row.tool as ToolKey] ?? {}) : [];

  function handleToolChange(tool: string) {
    updateRow(row.id, { tool: tool as ToolKey, plan: '' });
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-md p-4 group hover:border-neutral-300 transition-colors duration-150 animate-fade-in-up relative">
      {/* Row header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
          Tool {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-danger transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger rounded"
            aria-label={`Remove tool ${index + 1}`}
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tool selector */}
        <div className="sm:col-span-2 lg:col-span-1 space-y-1.5">
          <label htmlFor={`tool-${index}`} className="block text-xs font-medium text-neutral-600">
            AI Tool <span className="text-danger">*</span>
          </label>
          <select
            id={`tool-${index}`}
            value={row.tool}
            onChange={(e) => handleToolChange(e.target.value)}
            className={`input-base ${errors.tool ? 'input-error' : ''}`}
            aria-invalid={!!errors.tool}
          >
            <option value="">Select tool...</option>
            {ALL_TOOL_KEYS.map((key) => (
              <option key={key} value={key}>
                {TOOL_DISPLAY_NAMES[key]}
              </option>
            ))}
          </select>
          {errors.tool && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.tool}
            </p>
          )}
        </div>

        {/* Plan selector */}
        <div className="space-y-1.5">
          <label htmlFor={`plan-${index}`} className="block text-xs font-medium text-neutral-600">
            Plan <span className="text-danger">*</span>
          </label>
          <select
            id={`plan-${index}`}
            value={row.plan}
            onChange={(e) => updateRow(row.id, { plan: e.target.value })}
            disabled={!row.tool}
            className={`input-base disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed ${errors.plan ? 'input-error' : ''}`}
            aria-invalid={!!errors.plan}
          >
            <option value="">Select plan...</option>
            {plans.map(([key, data]) => (
              <option key={key} value={key}>
                {data.display_name}
                {data.per_seat_monthly !== null ? ` — $${data.per_seat_monthly}/seat` : ' — Custom'}
              </option>
            ))}
          </select>
          {errors.plan && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.plan}
            </p>
          )}
        </div>

        {/* Monthly spend */}
        <div className="space-y-1.5">
          <label htmlFor={`spend-${index}`} className="block text-xs font-medium text-neutral-600">
            Monthly Spend <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">
              $
            </span>
            <input
              id={`spend-${index}`}
              type="number"
              value={row.monthly_spend}
              onChange={(e) => updateRow(row.id, { monthly_spend: e.target.value })}
              placeholder="0"
              min="0"
              max="100000"
              className={`input-base pl-7 font-mono ${errors.spend ? 'input-error' : ''}`}
              aria-invalid={!!errors.spend}
            />
          </div>
          {errors.spend ? (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.spend}
            </p>
          ) : row.tool && row.plan && PRICING[row.tool as ToolKey]?.[row.plan]?.per_seat_monthly !== null ? (
            <p className="text-xs text-neutral-400">
              Official: ${PRICING[row.tool as ToolKey]?.[row.plan]?.per_seat_monthly}/seat
            </p>
          ) : null}
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <label htmlFor={`seats-${index}`} className="block text-xs font-medium text-neutral-600">
            Seats <span className="text-danger">*</span>
          </label>
          <input
            id={`seats-${index}`}
            type="number"
            value={row.seats}
            onChange={(e) => updateRow(row.id, { seats: e.target.value })}
            placeholder="1"
            min="1"
            max="10000"
            className={`input-base font-mono ${errors.seats ? 'input-error' : ''}`}
            aria-invalid={!!errors.seats}
          />
          {errors.seats && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.seats}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
