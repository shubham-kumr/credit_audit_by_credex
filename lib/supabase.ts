// ============================================================
// SpendLens — Supabase Client (server-only)
// NEVER import this in client components
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Singleton — reuse across serverless invocations
let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseServiceKey) {
      // Return null when env vars not set — callers handle gracefully
      return null;
    }
    _supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return _supabase;
}

export const supabase = getSupabase();
