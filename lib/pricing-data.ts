// ============================================================
// SpendLens — Pricing Data
// All prices sourced from official vendor pages (May 2025)
// See docs/PRICING_DATA.md for full citation list
// ============================================================

import type { ToolKey, PlanPricing } from './types';

export const PRICING: Record<ToolKey, Record<string, PlanPricing>> = {
  cursor: {
    hobby: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Hobby (Free)',
      notes: 'Free tier — limited completions',
      source_url: 'https://cursor.sh/pricing',
    },
    pro: {
      per_seat_monthly: 20,
      min_seats: 1,
      display_name: 'Pro',
      notes: '$20/user/month — unlimited completions',
      source_url: 'https://cursor.sh/pricing',
    },
    business: {
      per_seat_monthly: 40,
      min_seats: 1,
      display_name: 'Business',
      notes: '$40/user/month — SSO, admin, privacy mode',
      source_url: 'https://cursor.sh/pricing',
    },
    enterprise: {
      per_seat_monthly: null,
      min_seats: 20,
      display_name: 'Enterprise',
      notes: 'Custom pricing — contact sales',
      source_url: 'https://cursor.sh/pricing',
    },
  },

  github_copilot: {
    individual: {
      per_seat_monthly: 10,
      min_seats: 1,
      display_name: 'Individual',
      notes: '$10/user/month (or $100/year)',
      source_url: 'https://github.com/features/copilot',
    },
    business: {
      per_seat_monthly: 19,
      min_seats: 1,
      display_name: 'Business',
      notes: '$19/user/month — organization management',
      source_url: 'https://github.com/features/copilot',
    },
    enterprise: {
      per_seat_monthly: 39,
      min_seats: 1,
      display_name: 'Enterprise',
      notes: '$39/user/month — custom models, security',
      source_url: 'https://github.com/features/copilot',
    },
  },

  claude: {
    free: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Free',
      notes: 'Limited usage, Claude 3.5 Haiku',
      source_url: 'https://www.anthropic.com/pricing',
    },
    pro: {
      per_seat_monthly: 20,
      min_seats: 1,
      display_name: 'Pro',
      notes: '$20/user/month — 5× usage, all models',
      source_url: 'https://www.anthropic.com/pricing',
    },
    max: {
      per_seat_monthly: 100,
      min_seats: 1,
      display_name: 'Max',
      notes: '$100/user/month — highest usage limits',
      source_url: 'https://www.anthropic.com/pricing',
    },
    team: {
      per_seat_monthly: 30,
      min_seats: 5,
      display_name: 'Team',
      notes: '$30/user/month — min 5 seats, admin tools',
      source_url: 'https://www.anthropic.com/pricing',
    },
    enterprise: {
      per_seat_monthly: null,
      min_seats: 10,
      display_name: 'Enterprise',
      notes: 'Custom pricing — SSO, extended context',
      source_url: 'https://www.anthropic.com/pricing',
    },
  },

  chatgpt: {
    plus: {
      per_seat_monthly: 20,
      min_seats: 1,
      display_name: 'Plus',
      notes: '$20/user/month — GPT-4o, image gen',
      source_url: 'https://openai.com/chatgpt/pricing',
    },
    team: {
      per_seat_monthly: 25,
      min_seats: 2,
      display_name: 'Team',
      notes: '$25/user/month — admin console, higher limits',
      source_url: 'https://openai.com/chatgpt/pricing',
    },
    enterprise: {
      per_seat_monthly: null,
      min_seats: 10,
      display_name: 'Enterprise',
      notes: 'Custom pricing — SSO, unlimited context',
      source_url: 'https://openai.com/chatgpt/pricing',
    },
  },

  anthropic_api: {
    pay_as_you_go: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Pay-as-you-go',
      notes: 'Billed per token — no seat cost',
      source_url: 'https://www.anthropic.com/pricing',
    },
  },

  openai_api: {
    pay_as_you_go: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Pay-as-you-go',
      notes: 'Billed per token — no seat cost',
      source_url: 'https://openai.com/pricing',
    },
  },

  gemini: {
    free: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Free',
      notes: 'Gemini 1.5 Flash, limited usage',
      source_url: 'https://ai.google.dev/pricing',
    },
    advanced: {
      per_seat_monthly: 20,
      min_seats: 1,
      display_name: 'Advanced (One AI Premium)',
      notes: '$20/user/month — Gemini Ultra, 2TB Drive',
      source_url: 'https://ai.google.dev/pricing',
    },
    business: {
      per_seat_monthly: 24,
      min_seats: 1,
      display_name: 'Business (Workspace)',
      notes: '$24/user/month — Gemini for Workspace',
      source_url: 'https://workspace.google.com/intl/en/pricing',
    },
    api: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'API (Pay-as-you-go)',
      notes: 'Billed per token',
      source_url: 'https://ai.google.dev/pricing',
    },
  },

  windsurf: {
    free: {
      per_seat_monthly: 0,
      min_seats: 1,
      display_name: 'Free',
      notes: 'Limited credits per month',
      source_url: 'https://windsurf.com/pricing',
    },
    pro: {
      per_seat_monthly: 15,
      min_seats: 1,
      display_name: 'Pro',
      notes: '$15/user/month — unlimited flows',
      source_url: 'https://windsurf.com/pricing',
    },
    teams: {
      per_seat_monthly: 35,
      min_seats: 2,
      display_name: 'Teams',
      notes: '$35/user/month — team management',
      source_url: 'https://windsurf.com/pricing',
    },
  },
};

// Tool display names for UI
export const TOOL_DISPLAY_NAMES: Record<ToolKey, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Google Gemini',
  windsurf: 'Windsurf',
};

// Tools that serve coding use case
export const CODING_TOOLS: ToolKey[] = ['cursor', 'github_copilot', 'windsurf'];
// Tools that can serve coding depending on use case
export const CODING_CAPABLE_TOOLS: ToolKey[] = ['claude', 'chatgpt', 'anthropic_api', 'openai_api'];

export const ALL_TOOL_KEYS: ToolKey[] = [
  'cursor',
  'github_copilot',
  'claude',
  'chatgpt',
  'anthropic_api',
  'openai_api',
  'gemini',
  'windsurf',
];
