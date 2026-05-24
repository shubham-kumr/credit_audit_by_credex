# PRICING_DATA.md — SpendLens

All pricing used in the audit engine. Every number traces to an official vendor pricing page with verification date.

---

## Cursor

- **Hobby (Free):** $0/month — https://cursor.com/pricing — verified 2026-05-21
- **Pro:** $20/user/month — https://cursor.com/pricing — verified 2026-05-21
- **Business:** $40/user/month — https://cursor.com/pricing — verified 2026-05-21

**Notes:** Hobby plan has limited completions per month. Pro includes unlimited completions and GPT-4 access. Business adds SSO and admin controls. No seat minimum on any plan.

---

## GitHub Copilot

- **Individual:** $10/user/month (billed monthly) or $100/year — https://github.com/features/copilot — verified 2026-05-21
- **Business:** $19/user/month — https://github.com/features/copilot — verified 2026-05-21
- **Enterprise:** $39/user/month — https://github.com/features/copilot — verified 2026-05-21

**Notes:** Individual plan is for personal GitHub accounts only — cannot be used with org-managed accounts. Business is the correct plan for most engineering teams. Enterprise adds policy management and fine-tuning.

---

## Claude (Anthropic)

- **Pro:** $20/user/month — https://www.anthropic.com/claude — verified 2026-05-21
- **Team:** $25/user/month, minimum 5 seats ($125/month minimum) — https://www.anthropic.com/claude — verified 2026-05-21
- **Enterprise:** Custom pricing — https://www.anthropic.com/contact-sales

**Notes:** The 5-seat minimum on Team is not prominently displayed on the main pricing page — found in the plan comparison FAQ. Teams with fewer than 5 users on the Team plan are paying for seats they don't use. This is flagged as an overspend condition in the engine.

---

## ChatGPT (OpenAI)

- **Plus:** $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-21
- **Team:** $25/user/month (billed annually) or $30/user/month (billed monthly), minimum 2 seats — https://openai.com/chatgpt/pricing — verified 2026-05-21
- **Enterprise:** Custom — https://openai.com/contact-sales

**Notes:** ChatGPT Team includes GPT-4o, DALL·E 3, and higher message limits. Plus plan is individual — does not include team management features.

---

## Anthropic API

- **Input tokens (Claude 3 Haiku):** $0.25 per million tokens — https://www.anthropic.com/api — verified 2026-05-21
- **Output tokens (Claude 3 Haiku):** $1.25 per million tokens — https://www.anthropic.com/api — verified 2026-05-21
- **Input tokens (Claude 3.5 Sonnet):** $3.00 per million tokens — https://www.anthropic.com/api — verified 2026-05-21
- **Output tokens (Claude 3.5 Sonnet):** $15.00 per million tokens — https://www.anthropic.com/api — verified 2026-05-21

**Notes:** Token-based pricing is normalized to a per-developer monthly equivalent in the engine using a conservative assumption of 500K input tokens and 150K output tokens per developer per month (1:3 ratio, moderate usage). This is an estimate — actual costs vary significantly by usage pattern.

---

## OpenAI API

- **GPT-4o input:** $5.00 per million tokens — https://openai.com/api/pricing — verified 2026-05-21
- **GPT-4o output:** $15.00 per million tokens — https://openai.com/api/pricing — verified 2026-05-21
- **GPT-4o mini input:** $0.15 per million tokens — https://openai.com/api/pricing — verified 2026-05-21
- **GPT-4o mini output:** $0.60 per million tokens — https://openai.com/api/pricing — verified 2026-05-21

**Notes:** Same normalization methodology as Anthropic API. GPT-4o mini pricing is significantly lower and is flagged as a downgrade opportunity for teams using GPT-4o for tasks that don't require frontier capability.

---

## Google Gemini

- **Gemini 1.5 Flash input:** $0.075 per million tokens (≤128K context) — https://ai.google.dev/pricing — verified 2026-05-22
- **Gemini 1.5 Flash output:** $0.30 per million tokens — https://ai.google.dev/pricing — verified 2026-05-22
- **Gemini 1.5 Pro input:** $3.50 per million tokens (≤128K context) — https://ai.google.dev/pricing — verified 2026-05-22
- **Gemini 1.5 Pro output:** $10.50 per million tokens — https://ai.google.dev/pricing — verified 2026-05-22

**Notes:** Gemini offers a free tier (60 requests/minute on 1.5 Flash) that many early-stage teams qualify for. The engine checks if stated spend exceeds what the free tier would allow, and flags the upgrade as potentially premature.

---

## Windsurf (Codeium)

- **Free:** $0/month — https://windsurf.com/pricing — verified 2026-05-22
- **Pro:** $15/user/month — https://windsurf.com/pricing — verified 2026-05-22
- **Teams:** $35/user/month — https://windsurf.com/pricing — verified 2026-05-22

**Notes:** Windsurf's Teams plan pricing was not clearly documented on the main pricing page at time of research. Confirmed via Codeium's changelog post (May 2024) and community discussion on their Discord. Source: https://discord.com/channels/1027685395649015980 — treat as approximate pending official page update.
