#!/usr/bin/env python3
"""
Credit-burn + revenue reporting for The Kinesiology of Climbing.

Reads accounting.json and prints a burn-down: capital ceiling, estimated token
spend, infrastructure costs, Gumroad revenue, and the 90/10 net-surplus split.

READ-ONLY with respect to money. This script never publishes, never changes a
price, and never calls a mutating Gumroad endpoint. The only network call is an
optional read-only GET of Gumroad sales when you pass --sync.

Usage:
    python3 scripts/report.py                 # report from accounting.json as-is
    python3 scripts/report.py --sync          # also pull live Gumroad revenue (read-only) and save it
    python3 scripts/report.py --log-tokens IN OUT
                                              # add an estimated-token usage entry and recompute cost

Environment:
    GUMROAD_ACCESS_TOKEN   required only for --sync. Never printed or logged.
"""

import json
import os
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = ROOT / "accounting.json"


def load():
    with open(LEDGER) as f:
        return json.load(f)


def save(data):
    data["meta"]["last_updated"] = date.today().isoformat()
    with open(LEDGER, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def money(x, cur):
    return f"{cur}${x:,.2f}"


# --------------------------------------------------------------------------- #
# Gumroad read-only sales sync
# --------------------------------------------------------------------------- #
def gumroad_get(path):
    """GET a Gumroad API v2 path via curl. Returns parsed JSON or None."""
    token = os.environ.get("GUMROAD_ACCESS_TOKEN", "").strip()
    if not token:
        print("  (GUMROAD_ACCESS_TOKEN not set — skipping live sync)")
        return None
    url = f"https://api.gumroad.com/v2/{path.lstrip('/')}"
    sep = "&" if "?" in url else "?"
    full = f"{url}{sep}access_token={token}"
    try:
        out = subprocess.run(
            ["curl", "-sS", "--max-time", "30", full],
            capture_output=True, text=True, timeout=45,
        )
    except Exception as e:                       # curl missing / timeout
        print(f"  (sync failed: {e})")
        return None
    if out.returncode != 0:
        print("  (sync failed: curl returned non-zero)")
        return None
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        print("  (sync failed: could not parse Gumroad response)")
        return None


def sync_revenue(data):
    """Sum all non-refunded Gumroad sales (read-only). Updates data in place."""
    print("Syncing revenue from Gumroad (read-only)…")
    gross_cents = 0
    refund_cents = 0
    count = 0
    path = "sales"
    pages = 0
    while path and pages < 100:          # hard cap so a bad cursor can't loop forever
        resp = gumroad_get(path)
        pages += 1
        if not resp or not resp.get("success"):
            if pages == 1:
                return                    # nothing synced; leave prior values untouched
            break
        for s in resp.get("sales", []):
            price = int(s.get("price", 0) or 0)
            if s.get("refunded") or s.get("chargedback"):
                refund_cents += price
            else:
                gross_cents += price
                count += 1
        nxt = resp.get("next_page_url")
        path = nxt if nxt else None
    data["revenue"]["gross_revenue_cad"] = round(gross_cents / 100.0, 2)
    data["revenue"]["refunds_cad"] = round(refund_cents / 100.0, 2)
    data["revenue"]["sales_count"] = count
    data["revenue"]["last_synced"] = datetime.now().isoformat(timespec="seconds")
    print(f"  synced: {count} sale(s), gross {money(gross_cents/100, 'CAD')}")


def log_tokens(data, tin, tout):
    tu = data["token_usage"]
    tu["estimated_total_input_tokens"] += tin
    tu["estimated_total_output_tokens"] += tout
    pa = data["pricing_assumptions"]
    cost = (tu["estimated_total_input_tokens"] / 1_000_000 * pa["input_usd_per_mtok"]
            + tu["estimated_total_output_tokens"] / 1_000_000 * pa["output_usd_per_mtok"])
    tu["estimated_cost_usd"] = round(cost, 2)
    data["ledger"].append({
        "date": date.today().isoformat(),
        "type": "token_usage",
        "description": f"Logged estimated tokens: +{tin:,} in / +{tout:,} out",
        "amount_usd": 0.00,
    })
    print(f"Logged tokens. New estimated token cost: {money(tu['estimated_cost_usd'], 'USD')}")


# --------------------------------------------------------------------------- #
# Report
# --------------------------------------------------------------------------- #
def report(data):
    cap = data["capital"]
    pa = data["pricing_assumptions"]
    tu = data["token_usage"]
    fx = pa.get("fx_usd_to_cad", 1.37)

    infra_usd = sum(i.get("amount_usd", 0) for i in data["infrastructure_costs_usd"])
    token_usd = tu.get("estimated_cost_usd", 0)
    spent_usd = infra_usd + token_usd
    ceiling = cap["starting_credit_ceiling_usd"]
    remaining = ceiling - spent_usd
    pct_burned = (spent_usd / ceiling * 100) if ceiling else 0

    rev = data["revenue"]
    gross = rev.get("gross_revenue_cad", 0)
    refunds = rev.get("refunds_cad", 0)
    costs_cad = spent_usd * fx
    net_surplus = gross - refunds - costs_cad
    reinvest = payout = 0.0
    if net_surplus > 0:
        reinvest = net_surplus * cap["reinvestment_rate"]
        payout = net_surplus * cap["payout_rate"]

    data["distribution"]["net_surplus_cad"] = round(net_surplus, 2)
    data["distribution"]["reinvest_10pct_cad"] = round(reinvest, 2)
    data["distribution"]["payout_90pct_cad"] = round(payout, 2)

    bar_w = 30
    filled = min(bar_w, int(round(pct_burned / 100 * bar_w)))
    bar = "█" * filled + "░" * (bar_w - filled)

    print()
    print("=" * 58)
    print(f"  {data['meta']['venture']} — burn & revenue report")
    print(f"  {date.today().isoformat()}")
    print("=" * 58)
    print()
    print("  CAPITAL (USD API-spend ceiling)")
    print(f"    Ceiling ............ {money(ceiling, 'USD')}")
    print(f"    Est. token spend ... {money(token_usd, 'USD')}")
    print(f"    Infrastructure ..... {money(infra_usd, 'USD')}")
    print(f"    Spent .............. {money(spent_usd, 'USD')}")
    print(f"    Remaining .......... {money(remaining, 'USD')}")
    print(f"    [{bar}] {pct_burned:5.1f}% burned")
    print()
    print("  REVENUE (Gumroad, CAD)")
    synced = rev.get("last_synced") or "never (run --sync)"
    print(f"    Gross .............. {money(gross, 'CAD')}")
    print(f"    Refunds ............ {money(refunds, 'CAD')}")
    print(f"    Sales count ........ {rev.get('sales_count', 0)}")
    print(f"    Last synced ........ {synced}")
    print()
    print("  NET SURPLUS & SPLIT (CAD)")
    print(f"    Costs (CAD @ {fx}) .. {money(costs_cad, 'CAD')}")
    print(f"    Net surplus ........ {money(net_surplus, 'CAD')}")
    if net_surplus > 0:
        print(f"    → Payout (90%) ..... {money(payout, 'CAD')}")
        print(f"    → Reinvest (10%) ... {money(reinvest, 'CAD')}")
    else:
        print("    → No positive surplus yet; no split applied.")
    print()
    print("=" * 58)
    if remaining < ceiling * 0.15:
        print("  ⚠  Under 15% of the credit ceiling remains — review burn.")
    if not cap.get("payout_account_configured"):
        print("  ℹ  Profit-sweep automation is NOT configured (attended step).")
    print()


def main():
    args = sys.argv[1:]
    data = load()
    dirty = False

    if "--log-tokens" in args:
        i = args.index("--log-tokens")
        try:
            tin, tout = int(args[i + 1]), int(args[i + 2])
        except (IndexError, ValueError):
            print("usage: --log-tokens IN OUT   (integers)")
            sys.exit(2)
        log_tokens(data, tin, tout)
        dirty = True

    if "--sync" in args:
        sync_revenue(data)
        dirty = True

    report(data)          # report() fills distribution fields
    if dirty or True:
        save(data)        # persist recomputed distribution every run


if __name__ == "__main__":
    main()
