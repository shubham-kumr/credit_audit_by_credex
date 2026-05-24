# ECONOMICS.md — SpendLens Unit Economics

## What a Converted Lead Is Worth to Credex

Credex offers AI credits and consulting. A converted lead (audit → consultation booked → credit purchase) represents:

- **Average credit purchase:** $3,000 (conservative estimate based on typical Credex engagement size)
- **Gross margin on credits:** ~60% (credits have low marginal cost; the value is in the advisory layer)
- **Contribution per conversion:** $1,800

So a converted lead is worth approximately **$1,800 in gross profit** to Credex.

This is a conservative floor. High-value customers (50+ person engineering orgs) represent $10,000–$30,000 in potential credit purchases. The tool filters for those by showing a "High savings detected — book a free Credex consultation" CTA only to teams saving >$500/month, which correlates with larger teams and larger potential credit purchases.

---

## Customer Acquisition Cost (CAC) by Channel

| Channel | Estimated CAC | Reasoning |
|---------|--------------|-----------|
| Credex warm list email | $0 | Existing relationship, no spend. Time cost only (~2 hours to write and send) |
| Rands Leadership Slack post | $0 | Free community. Time cost ~30 minutes |
| HackerNews Show HN | $0 | Free. Time cost ~1 hour to write. High variance. |
| LinkedIn DM outreach | $0–$15 | LinkedIn premium at ~$60/month ÷ ~4 qualified convos/month = $15/lead generated. No guaranteed conversion |
| Developer newsletter sponsorship | $200–$500/audit completed | TLDR sponsorship ~$1,000/send, ~2-5 audits expected per send from a targeted newsletter |

**Blended CAC estimate for first 100 users:** ~$5–$20 per audit completed (all-in, assuming primarily community channels and 20 hours of founder time valued at $100/hour).

**CAC for paid channels** (if we run them): ~$150–$300 per consultation booked, based on B2B SaaS benchmarks for LinkedIn Ads in the developer tools category.

---

## Conversion Funnel Math

```
Landing page visits            1,000
Audits completed (5%)             50
Email captured (40% of completers) 20
Consultation booked (30% of leads)  6
Credit purchased (50% of bookings)  3

Revenue per cohort: 3 × $3,000 = $9,000
Gross profit per cohort: 3 × $1,800 = $5,400
```

**Key conversion rate that makes this profitable:**
At $0 CAC (community channels), any conversion is profitable. The tool breaks even on Vercel hosting (~$20/month) after the first consultation is booked.

At paid CAC of $250/consultation booked:
- Break-even: $250 CAC ÷ $1,800 margin = 14% conversion from consultation to credit purchase
- Current estimate: 50% conversion from consultation to purchase (warm leads who self-qualified via the audit)
- This math works comfortably.

---

## Path to $1M ARR in 18 Months

Gross profit target: $1M ARR ÷ 60% margin = ~$1.67M revenue from credits.

**Required:** $1.67M ÷ $3,000 avg purchase = ~556 credit purchases in 18 months = ~31 purchases/month.

**What has to be true:**

1. **The audit-to-consultation funnel converts at ≥30%** — meaning 1 in 3 people who book a consultation buys credits. Credex's existing close rate on warm leads is the key variable here. If it's 20%, we need 50% more audit volume.

2. **The tool drives 200+ audits/month by month 6** — requiring consistent community-driven growth or one high-volume channel (HN, a newsletter with 50k+ dev managers). At 5% audit completion rate from landing page visits, this requires 4,000 visits/month — achievable from SEO + one recurring newsletter mention.

3. **Average credit purchase holds at $3,000** — this is the most fragile assumption. If SpendLens primarily attracts smaller teams (5-10 people), average purchase may be closer to $1,500. In that scenario the ARR target requires double the volume.

4. **The unfair channel (Credex warm list) activates quickly** — the first 50 audits should come from existing relationships. This seeds the testimonials and case studies that make cold outreach credible.

**Rough monthly model by month 18:**
- 400 audits/month
- 160 emails captured (40%)
- 48 consultations booked (30%)
- 24 credit purchases (50%)
- Revenue: 24 × $3,000 = $72,000/month → $864,000 ARR by month 18

Getting to $1M ARR requires either pushing average purchase to $3,500 or hitting 30 purchases/month, which means ~530 audits/month. Achievable if the tool gets one significant organic moment (viral HN post, mention in a major newsletter).
