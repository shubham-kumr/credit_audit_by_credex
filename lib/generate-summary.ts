// ============================================================
// SpendLens — AI Summary Generator
// Calls OpenRouter API (minimax-m2.5); falls back to template on failure
// ============================================================

import { AuditOutput } from './types';
import { TOOL_DISPLAY_NAMES } from './pricing-data';

const OPENROUTER_MODEL = 'openrouter/owl-alpha';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function buildSummaryPrompt(audit: AuditOutput): string {
  const { results, total_monthly_savings, total_annual_savings, savings_tier } = audit;
  const toolLines = results
    .map((r) => `- ${TOOL_DISPLAY_NAMES[r.tool]}: ${r.verdict} — saves $${r.monthly_savings}/mo`)
    .join('\n');
  return `You are an AI spend analyst. Write a concise, direct 80-120 word summary of this AI tool audit for an engineering team. Be specific about numbers. No marketing fluff.\n\nTotal monthly savings: $${total_monthly_savings}\nAnnual savings: $${total_annual_savings}\nTier: ${savings_tier}\n\nFindings:\n${toolLines}\n\nWrite as a single paragraph to "your team". No bullets, no headers.`;
}

export function generateFallbackSummary(audit: AuditOutput): string {
  const { results, total_monthly_savings, total_annual_savings } = audit;
  if (total_monthly_savings === 0) {
    return 'Your AI tool stack is well-optimized. Each tool is correctly sized with no significant redundancies detected. Keep an eye on usage as your team grows.';
  }
  const top = results.reduce((a, b) => (b.monthly_savings > a.monthly_savings ? b : a), results[0]);
  const redundancies = results.filter((r) => r.verdict === 'redundant').length;
  let s = `Your AI stack has ${results.length} tool${results.length > 1 ? 's' : ''} under review — we found $${total_monthly_savings.toFixed(0)}/month ($${total_annual_savings.toFixed(0)}/year) in savings. `;
  if (top?.monthly_savings > 0) s += `The biggest win is ${TOOL_DISPLAY_NAMES[top.tool]}, saving $${top.monthly_savings.toFixed(0)}/mo. `;
  if (redundancies > 0) s += `You're running ${redundancies} overlapping tool${redundancies > 1 ? 's' : ''} covering the same use case. `;
  s += 'Acting on these recommendations reduces AI spend without disrupting your workflow.';
  return s;
}

export async function generateAISummary(audit: AuditOutput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) return generateFallbackSummary(audit);

  // If the key starts with 'AIzaSy', it is a native Google Gemini API key!
  if (apiKey.startsWith('AIzaSy')) {
    try {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildSummaryPrompt(audit),
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[AI Summary] Gemini direct API non-200 (Status: ${response.status}):`, errorText);
        return generateFallbackSummary(audit);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return text || generateFallbackSummary(audit);
    } catch (err) {
      console.warn('[AI Summary] Gemini direct API failed:', err);
      return generateFallbackSummary(audit);
    }
  }

  // Fallback to standard OpenRouter pipeline
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'SpendLens',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: buildSummaryPrompt(audit) }],
        max_tokens: 1000,
      }),
    });

    // 429 = rate limited on free tier — silently fall back, no spam
    if (response.status === 429) {
      return generateFallbackSummary(audit);
    }

    if (response.status === 402) {
      console.warn('[AI Summary] OpenRouter key has exceeded its free quota or has 0 balance (402 Payment Required). Falling back to template. | Fix: top up or create a new key at openrouter.ai/keys');
      return generateFallbackSummary(audit);
    }

    if (!response.ok) {
      console.warn('[AI Summary] OpenRouter non-200:', response.status);
      return generateFallbackSummary(audit);
    }

    const data = await response.json();
    const text: string | undefined = data.choices?.[0]?.message?.content?.trim();
    return text || generateFallbackSummary(audit);
  } catch (err) {
    console.warn('[AI Summary] fetch failed:', err);
    return generateFallbackSummary(audit);
  }
}
