// ============================================================
// SpendLens — Shared TypeScript Types
// ============================================================

export type ToolKey =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type SavingsTier = 'high_intent' | 'standard' | 'optimal';

export type Verdict = 'optimal' | 'downgrade' | 'switch' | 'redundant' | 'overspending';

export interface ToolEntry {
  tool: ToolKey;
  plan: string;
  monthly_spend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  team_size: number;
  use_case: UseCase;
}

export interface ToolResult {
  tool: ToolKey;
  plan: string;
  current_spend: number;
  seats: number;
  verdict: Verdict;
  recommended_action: string;
  recommended_spend: number;
  monthly_savings: number;
  savings_reason: string;
  credex_note?: string;
}

export interface AuditOutput {
  results: ToolResult[];
  total_monthly_savings: number;
  total_annual_savings: number;
  savings_tier: SavingsTier;
}

export interface LeadInput {
  audit_id: string;
  email: string;
  company_name?: string;
  role?: string;
  team_size?: number;
  _hp: string; // honeypot — must be empty
}

export interface PlanPricing {
  per_seat_monthly: number | null; // null = custom/enterprise
  min_seats: number;
  display_name: string;
  notes: string;
  source_url: string;
}
