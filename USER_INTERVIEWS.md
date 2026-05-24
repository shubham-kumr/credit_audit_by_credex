# USER_INTERVIEWS.md — SpendLens

Three conversations with potential users conducted during the build week. 10-15 minutes each.

---

## Interview 1 — R.M., Engineering Manager, B2B SaaS (Series A, ~35 people)

**Date:** 2026-05-22
**How found:** LinkedIn DM — mutual connection at a Delhi startup community event

**Background:** R.M. manages a 12-person engineering team. The company has been growing quickly and AI tools were adopted bottom-up — individual engineers expensed what they needed, the stack was never audited.

**Direct quotes:**

> "We have Cursor, Copilot, and ChatGPT Team all running simultaneously. I genuinely don't know who uses what. The finance team asked me last quarter and I said 'we're evaluating' which was a lie — we just haven't gotten around to it."

> "I don't care about saving $100 a month as much as I care about having a clean answer when the CFO asks. That's the actual value — it's the justification, not just the savings."

> "I'd use something like this but I'd want to be able to share it with my finance lead directly. Not copy-paste a screenshot. An actual link they can open."

**Most surprising thing:** He said the savings number was secondary to having a shareable, credible-looking output. He used the phrase "defensible number" — the audit is as much a communication tool as a cost-saving tool.

**What it changed:** Added the shareable URL as a primary feature, not a nice-to-have. The copy on the results page changed from "Save this" to "Share with your finance team" — this is the actual job to be done for the decision-maker.

---

## Interview 2 — P.S., Founder/CTO, Developer Tools startup (bootstrapped, 4 people)

**Date:** 2026-05-23
**How found:** College network — friend who runs a developer tools company in Bangalore

**Background:** P.S. wears both the CTO and finance hat. At 4 people, every $50/month is felt. They have Cursor (2 seats), Claude Pro (personal plan, 2 people), and are evaluating the Anthropic API for a product feature.

**Direct quotes:**

> "Claude Pro for two people — we literally share an account. I know we shouldn't but the Team plan is $125/month minimum and there's only two of us."

> "My problem isn't that I don't know we're overpaying. It's that I don't have time to go through the pricing pages and calculate what we should switch to. I know it needs to happen. I just don't do it."

> "If you could tell me 'switch from Claude Team to this specific plan and save exactly $75/month', I'd do it in 20 minutes. Vague advice I ignore."

**Most surprising thing:** He mentioned sharing accounts explicitly and unashamedly. This is almost certainly common and represents a genuine audit finding category — teams trying to avoid per-seat costs by sharing credentials. The tool doesn't currently detect this (it has no way to), but the interview surfaced it as a real user behavior.

**What it changed:** The audit result copy became more specific — "Switch from Claude Team to 2× Claude Pro and save $85/month" rather than "Downgrade your Claude plan." The verb and the exact target plan matter.

---

## Interview 3 — A.K., VP Engineering, FinTech startup (Series B, ~80 people)

**Date:** 2026-05-24
**How found:** Twitter/X DM — responded to a tweet about AI tool costs at Series B companies

**Background:** A.K. manages a large engineering org with significant AI tooling spend. Has a dedicated IT/ops function that handles software procurement, but AI tools have been adopted so quickly that procurement hasn't caught up. There are tools being paid for by both the IT budget and individual team expensing.

**Direct quotes:**

> "The problem at our size isn't which plan to be on. It's that we're paying for things twice — once through IT and once through engineering expense reports. Nobody has a single view."

> "I would not enter our actual spend numbers into a third-party tool without knowing where that data goes. That's a non-starter for our security team."

> "What I actually want is an Excel template with the right formulas, not a web app. I can fill in the numbers myself. I just need to know what to compare against."

**Most surprising thing:** He was explicitly concerned about data privacy in a way the first two weren't at all. Entering real spend figures into an unknown tool — even for a free audit — is a security question at his company size.

**What it changed:** Added "No data is stored — your numbers never leave your browser" to the form page explainer text. This directly addresses the concern and is true (the engine runs client-side before the API call). Also reconsidered whether to offer a CSV/export mode for larger companies — not built for MVP but noted as a high-value feature for Series B+ targets.
