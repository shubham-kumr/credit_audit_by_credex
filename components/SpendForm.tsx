'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, AlertCircle, BarChart3, ChevronDown } from 'lucide-react';
import { useFormStore, rowsToAuditInput, ToolRowState } from '@/lib/stores/form-store';
import { runAudit } from '@/lib/audit-engine';
import { UseCase } from '@/lib/types';
import ToolRow from './ToolRow';

type RowErrors = Record<string, { tool?: string; plan?: string; spend?: string; seats?: string }>;

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding',   label: 'Coding / Engineering' },
  { value: 'writing',  label: 'Writing / Content' },
  { value: 'data',     label: 'Data / Analytics' },
  { value: 'research', label: 'Research' },
  { value: 'mixed',    label: 'Mixed / General' },
];

export default function SpendForm() {
  const router = useRouter();
  const { rows, team_size, use_case, addRow, setTeamSize, setUseCase } = useFormStore();
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [rowErrors, setRowErrors] = useState<RowErrors>({});
  const [teamError, setTeamError] = useState('');
  const [useCaseError, setUseCaseError] = useState('');

  function validateForm(): boolean {
    const newRowErrors: RowErrors = {};
    let valid = true;

    // Validate each row
    rows.forEach((row) => {
      const errs: RowErrors[string] = {};
      if (!row.tool) { errs.tool = 'Select a tool'; valid = false; }
      if (!row.plan) { errs.plan = 'Select a plan'; valid = false; }
      if (row.monthly_spend === '' || isNaN(parseFloat(row.monthly_spend)) || parseFloat(row.monthly_spend) < 0) {
        errs.spend = 'Enter a valid dollar amount'; valid = false;
      }
      if (!row.seats || isNaN(parseInt(row.seats)) || parseInt(row.seats) < 1) {
        errs.seats = 'Minimum 1 seat'; valid = false;
      }
      if (Object.keys(errs).length > 0) newRowErrors[row.id] = errs;
    });

    setRowErrors(newRowErrors);

    // Validate global fields
    if (!team_size || isNaN(parseInt(team_size)) || parseInt(team_size) < 1) {
      setTeamError('Enter your team size'); valid = false;
    } else {
      setTeamError('');
    }

    if (!use_case) {
      setUseCaseError('Select a primary use case'); valid = false;
    } else {
      setUseCaseError('');
    }

    if (rows.length === 0) {
      setGlobalError('Add at least one AI tool to audit');
      valid = false;
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) {
      // Scroll to first error
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    const tools = rowsToAuditInput(rows);
    const auditInput = {
      tools,
      team_size: parseInt(team_size, 10),
      use_case: use_case as UseCase,
    };

    // Run audit engine client-side immediately (instant, no network)
    const auditOutput = runAudit(auditInput);

    // Generate a client-side UUID for the slug
    const slug = crypto.randomUUID();

    // Store results in sessionStorage so the results page can read them
    sessionStorage.setItem(
      `audit_${slug}`,
      JSON.stringify({ slug, input: auditInput, ...auditOutput, ai_summary: null, summary_generated: false })
    );

    let aiSummary = null;
    let summaryGenerated = false;

    // Await database write & AI generation before redirecting to prevent 404 race conditions
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...auditInput, client_slug: slug }),
      });
      if (res.ok) {
        const resData = await res.json();
        aiSummary = resData.ai_summary;
        summaryGenerated = !!resData.ai_summary;
      }
    } catch (err) {
      console.warn('[SpendForm] DB persist failed:', err);
    }

    // Store completed results in sessionStorage
    sessionStorage.setItem(
      `audit_${slug}`,
      JSON.stringify({ slug, input: auditInput, ...auditOutput, ai_summary: aiSummary, summary_generated: summaryGenerated })
    );

    setSubmitting(false);
    // Navigate only after the audit is fully saved
    router.push(`/audit/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate id="spend-form">
      {/* Global fields — shown first so context is set before adding tools */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white border border-neutral-200 rounded-md">
        <fieldset>
          <legend className="block text-sm font-semibold text-neutral-800 mb-3">Team size</legend>
          <div className="space-y-1.5">
            <label htmlFor="team-size-input" className="block text-xs font-medium text-neutral-600">
              Total people on the team <span className="text-danger">*</span>
            </label>
            <input
              id="team-size-input"
              type="number"
              value={team_size}
              onChange={(e) => { setTeamSize(e.target.value); setTeamError(''); }}
              placeholder="e.g. 8"
              min="1"
              max="100000"
              className={`input-base font-mono w-full ${teamError ? 'input-error' : ''}`}
              aria-invalid={!!teamError}
              aria-describedby={teamError ? 'team-error' : undefined}
              required
            />
            {teamError && (
              <p id="team-error" className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {teamError}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-sm font-semibold text-neutral-800 mb-3">
            Primary use case <span className="text-danger">*</span>
          </legend>
          <div className="space-y-1.5">
            <label htmlFor="use-case-select" className="block text-xs font-medium text-neutral-600">
              What does your team primarily use AI for? <span className="text-danger">*</span>
            </label>
            <select
              id="use-case-select"
              value={use_case}
              onChange={(e) => { setUseCase(e.target.value as UseCase); setUseCaseError(''); }}
              className={`input-base ${useCaseError ? 'input-error' : ''}`}
              aria-invalid={!!useCaseError}
              aria-describedby={useCaseError ? 'use-case-error' : undefined}
              required
            >
              <option value="">Select use case...</option>
              {USE_CASES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {useCaseError && (
              <p id="use-case-error" className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {useCaseError}
              </p>
            )}
          </div>
        </fieldset>
      </div>

      {/* Tool rows */}
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-lg">
            <BarChart3 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">Add your first AI tool to get started</p>
          </div>
        ) : (
          rows.map((row, i) => (
            <ToolRow
              key={row.id}
              row={row}
              index={i}
              canRemove={rows.length > 1}
              errors={rowErrors[row.id]}
            />
          ))
        )}
      </div>

      {/* Add tool button */}
      {rows.length < 8 && (
        <button
          type="button"
          onClick={addRow}
          className="btn-secondary mt-3 w-full sm:w-auto"
          id="add-tool-btn"
        >
          <Plus className="w-4 h-4" />
          Add another tool
        </button>
      )}

      {/* Global error */}
      {globalError && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-danger">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {globalError}
        </div>
      )}

      {/* Submit */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-lg px-8 py-4"
          id="run-audit-btn"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Crunching your numbers…
            </>
          ) : (
            'Run My Audit →'
          )}
        </button>
        <p className="text-xs text-neutral-400">Free · No login required · Takes 2 min</p>
      </div>
    </form>
  );
}
