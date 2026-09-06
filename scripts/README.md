# Ops scripts

Internal tooling for tracking credit burn and revenue. Nothing here publishes
products, changes prices, or moves money — it is reporting only.

## `report.py` — credit-burn & revenue report

```bash
python3 scripts/report.py            # print the burn-down from accounting.json
python3 scripts/report.py --sync     # also pull live Gumroad revenue (READ-ONLY) and save it
python3 scripts/report.py --log-tokens 120000 15000   # add estimated token usage (IN OUT) and recompute cost
```

What it shows:
- **Capital** — the $100 USD API-spend ceiling, estimated token spend, infra
  costs, amount spent, and remaining (with a burn bar).
- **Revenue** — gross/refunds/sales count from Gumroad (`--sync` refreshes this
  read-only; without it the last saved figures are shown).
- **Net surplus & split** — costs converted to CAD, net surplus, and the
  90% payout / 10% reinvest split (applied only when surplus is positive).

### Notes
- `--sync` needs `GUMROAD_ACCESS_TOKEN` in the environment. The token is never
  printed or logged. The only network call is a read-only `GET /v2/sales`.
- Token figures are **estimates** — the runtime doesn't expose exact per-session
  counts. Set your real plan rates in `accounting.json → pricing_assumptions`.
- Profit-sweep automation is intentionally **not** wired. The 90% payout is
  reported as a number to move manually until the executive authorizes an
  automated processor.
