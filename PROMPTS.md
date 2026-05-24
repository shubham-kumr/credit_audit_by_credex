# PROMPTS.md — SpendLens

## Prompt 1: AI Audit Summary

### Location
`lib/generate-summary.ts` → `buildSummaryPrompt()`

### Full Prompt

```
You are an AI spend analyst. Write a concise, direct 80-120 word summary of this AI tool audit for an engineering team. Be specific about numbers. No marketing fluff.

Total monthly savings: ${{total_monthly_savings}}
Annual savings: ${{total_annual_savings}}
Tier: {{savings_tier}}

Findings:
- {{tool_name}}: {{verdict}} — saves ${{monthly_savings}}/mo
- {{tool_name}}: {{verdict}} — saves ${{monthly_savings}}/mo
...

Write as a single paragraph to "your team". No bullets, no headers.
```

### Why I Wrote It This Way

**"No marketing fluff"** — without this instruction, Claude defaults to a positive, encouraging tone that softens findings. "You're doing great but could save a bit!" is useless to a CTO who needs to justify budget decisions to a finance lead. The explicit instruction keeps it direct.

**"Be specific about numbers"** — models tend to paraphrase numbers ("significant savings") unless told to reproduce them. The audit's value is in the specificity.

**"Write as a single paragraph to 'your team'"** — without format instructions, Claude produces headers and bullet points. The results page already has structured cards; the summary should read as a human paragraph, not a duplicate of the card data.

**"80-120 words"** — a hard word count in the instruction, not the `max_tokens` param. max_tokens truncates mid-sentence. The word count instruction produces complete paragraphs.

### What I Tried That Didn't Work

**Attempt 1 — Role as "finance analyst":**
> "You are a senior finance analyst reviewing AI software costs..."

Produced overly formal, jargon-heavy output ("per-unit cost optimization opportunities"). Not appropriate for an engineering audience.

**Attempt 2 — Asking for bullet points:**
> "Summarize the top 3 findings as bullet points..."

Redundant with the verdict cards already on the page. The summary adds value as a narrative that connects the findings, not as a list.

**Attempt 3 — No word count constraint:**
Output varied from 40 words (too short, felt dismissive) to 200+ words (too long for an inline summary card). The 80-120 word range produces consistently scannable output.

### Model Choice

`deepseek/deepseek-v4-flash:free` via **OpenRouter** — chosen because it's a high-performance free-tier model on OpenRouter, offers exceptional speed, low latency, and has strong instruction-following for structured summary tasks. No SDK dependency is needed since OpenRouter provides an OpenAI-compatible REST API, letting us use a native `fetch` call. Per-audit cost: $0 on the free tier.
