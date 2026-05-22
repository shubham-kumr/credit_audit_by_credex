// ============================================================
// SpendLens — Zustand Form Store with localStorage persistence
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolKey, UseCase } from '../types';

export interface ToolRowState {
  id: string; // client-side unique id for keying
  tool: ToolKey | '';
  plan: string;
  monthly_spend: string; // string for controlled input
  seats: string;
}

interface FormStore {
  rows: ToolRowState[];
  team_size: string;
  use_case: UseCase | '';
  addRow: () => void;
  removeRow: (id: string) => void;
  updateRow: (id: string, updates: Partial<ToolRowState>) => void;
  setTeamSize: (v: string) => void;
  setUseCase: (v: UseCase) => void;
  resetForm: () => void;
}

function newRow(): ToolRowState {
  return { id: crypto.randomUUID(), tool: '', plan: '', monthly_spend: '', seats: '1' };
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      rows: [newRow()],
      team_size: '',
      use_case: '',

      addRow: () => set((s) => ({ rows: [...s.rows, newRow()] })),

      removeRow: (id) =>
        set((s) => ({
          rows: s.rows.length > 1 ? s.rows.filter((r) => r.id !== id) : s.rows,
        })),

      updateRow: (id, updates) =>
        set((s) => ({
          rows: s.rows.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      setTeamSize: (v) => set({ team_size: v }),
      setUseCase: (v) => set({ use_case: v }),

      resetForm: () => set({ rows: [newRow()], team_size: '', use_case: '' }),
    }),
    {
      name: 'spendlens-form',
      // Only persist rows + global fields, not internal form state
    }
  )
);

// Selector: convert store rows to AuditInput-compatible format
export function rowsToAuditInput(rows: ToolRowState[]) {
  return rows
    .filter((r) => r.tool && r.plan)
    .map((r) => ({
      tool: r.tool as ToolKey,
      plan: r.plan,
      monthly_spend: parseFloat(r.monthly_spend) || 0,
      seats: parseInt(r.seats, 10) || 1,
    }));
}
