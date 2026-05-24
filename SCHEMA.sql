-- SpendLens — Supabase Schema
-- Run this in your Supabase project's SQL Editor

-- Audits table
create table if not exists audits (
  id             uuid primary key default gen_random_uuid(),
  tools_input    jsonb not null,
  team_size      integer not null,
  use_case       text not null,
  audit_results  jsonb not null,
  total_monthly_savings  numeric not null default 0,
  total_annual_savings   numeric not null default 0,
  savings_tier   text not null default 'optimal',
  ai_summary     text,
  summary_generated boolean not null default false,
  share_count    integer not null default 0,
  created_at     timestamptz not null default now()
);

-- Leads table
create table if not exists leads (
  id             uuid primary key default gen_random_uuid(),
  audit_id       uuid references audits(id) on delete set null,
  email          text not null,
  company_name   text,
  role           text,
  team_size      integer,
  monthly_savings numeric,
  created_at     timestamptz not null default now()
);

-- Indexes
create index if not exists audits_created_at_idx on audits(created_at desc);
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_audit_id_idx on leads(audit_id);
