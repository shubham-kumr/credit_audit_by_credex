# METRICS.md — SpendLens

## North Star Metric

**Audits completed per week that surface ≥$100/month in savings.**

Not just "audits completed" — that measures traffic, not value delivered. The qualifier (≥$100/month in savings) filters for audits where the tool actually found something. A team that runs an audit and gets "You're spending optimally" is a good outcome for them but not a signal that the product is working as a lead-generation tool.

This metric matters because:
1. It directly correlates with the quality of leads entering the Credex funnel — teams saving >$100/month are large enough to be worth a consultation
2. It measures the audit engine's accuracy (if savings are systematically zero, the engine may be too conservative)
3. It's the denominator for the email capture conversion rate — the most important downstream metric

---

## Three Input Metrics

### 1. Landing page → audit started conversion rate (target: ≥8%)
If this is low, the landing page copy or CTA isn't working. Tests: headline variants, CTA button copy, removing friction from the form (reducing required fields).

### 2. Audit started → audit completed rate (target: ≥70%)
If this is low, the form is too long or confusing. The drop-off point matters: if users add one tool and quit, the form UI needs work; if they quit on the submit step, there may be a loading state or error issue.

### 3. High-savings audit → email captured rate (target: ≥35%)
Of audits that surface >$200/month in savings, what percentage result in an email capture? This is the pipeline fill rate for Credex consultations. Low rate suggests the email capture copy or timing is wrong (too early, too aggressive).

---

## What to Instrument First

1. **Segment or PostHog event on audit completion** with `savings_amount`, `tools_count`, `savings_tier` properties. This is the most important event — everything else is secondary.
2. **Email capture success event** with the associated `audit_slug` so conversion rates can be tracked per audit cohort.
3. **Share button click** — tracks virality. If this is high, the tool is being used as a communication tool (as Interview 1 suggested).
4. **Results page scroll depth** — if users aren't scrolling past the first verdict card, the layout or information hierarchy needs work.

What NOT to instrument first: individual form field interactions, mouse movements, time-on-page. These are premature optimizations before the core funnel is validated.

---

## Pivot Trigger Number

**If fewer than 20% of completed audits surface ≥$100/month in savings after 200 audits, reconsider the pricing data or engine logic.**

This would suggest one of:
- The pricing data is stale (vendor prices dropped, making our "official price" baseline too low)
- The engine is too conservative in flagging redundancy (the overlap detection is missing cases)
- The target user is already well-optimized (unlikely for Series A companies, but possible for indie developers)

A secondary pivot trigger: **if the email capture rate drops below 15%** even among high-savings users, the lead capture mechanism isn't working and needs to be redesigned (different placement, different copy, different incentive).

The current offering — free audit with optional consultation — doesn't need to change unless both metrics fail simultaneously. If the audit finds savings but leads don't convert, the consultation offer positioning needs work. If the audit doesn't find savings, the engine needs to be rethought.
