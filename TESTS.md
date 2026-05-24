# TESTS.md — SpendLens

## How to Run

```bash
npm test
```

All tests run via **Vitest** with a jsdom environment. No external services required — tests are fully offline.

---

## Test File: `__tests__/audit-engine.test.ts`

**What it covers:** The core audit engine (`lib/audit-engine.ts`) — the pure function that takes user input and returns savings recommendations.

| # | Test name | What it verifies |
|---|-----------|-----------------|
| 1 | `returns a result for every tool in the input` | Output has one result per input tool — no tools silently dropped |
| 2 | `total_monthly_spend matches sum of inputs` | Totals are calculated correctly across multiple tools |
| 3 | `total_savings is non-negative` | Savings can never go negative (can't save a negative amount) |
| 4 | `total_annual_savings is 12× monthly savings` | Annual projection formula is correct |
| 5 | `flags Cursor + GitHub Copilot as redundant` | Core redundancy detection — the most valuable audit check |
| 6 | `does not flag two unrelated tools as redundant` | Redundancy check has no false positives for unrelated tools |
| 7 | `marks a tool as optimal when spend matches official pricing` | Optimal verdict returns when spend exactly matches the official rate |
| 8 | `flags overspending when actual spend significantly exceeds official price` | Overspend detection works when a team is paying well above market rate |
| 9 | `handles a single tool with zero spend` | Edge case: $0 spend doesn't crash the engine |
| 10 | `handles large team sizes without error` | Edge case: 10,000 seat count doesn't overflow or error |
| 11 | `handles all supported use cases` | Engine accepts all valid use_case values without throwing |
| 12 | _(implicit via suite setup)_ | `makeInput()` helper produces valid AuditInput conforming to the TypeScript interface |

---

## Coverage Notes

- All tests are pure — no network calls, no file I/O, no external dependencies
- Tests use a `makeInput()` helper to build valid `AuditInput` objects, with `overrides` for specific cases
- The redundancy tests use realistic tool combinations (Cursor + Copilot for coding) not just arbitrary pairs
- Edge case tests verify the engine doesn't throw — they don't assert specific savings values since those depend on pricing constants that may change

---

## Running Individual Tests

```bash
# Run only redundancy tests
npm test -- -t "redundancy"

# Run in watch mode
npm run test:watch

# Run with verbose output
npm test -- --reporter=verbose
```
