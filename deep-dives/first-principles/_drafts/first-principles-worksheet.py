#!/usr/bin/env python3
"""
First-Principles deep-dive math worksheet, single source of truth.

Reproducible math behind the two interactives:
  1. Bitcoin issuance + stock-to-flow schedule (digital-scarcity.html)
  2. Purchasing-power erosion under debasement/inflation (why-money-fails.html)
  3. Roman denarius silver-content decay (why-money-fails.html supporting visual)

Run:  python3 first-principles-worksheet.py
Emits: ../data/first-principles-math.json

All numeric claims rendered by the interactives MUST reconcile with the JSON this
script writes. If a page shows a number this script does not produce, the page is
wrong, not the worksheet. Historical *facts* (hyperinflation rates, confiscation
events) are NOT computed here, they live in first-principles-facts.json with sources.
"""

import json
import os
from datetime import date

# ---------------------------------------------------------------------------
# 1. BITCOIN ISSUANCE + STOCK-TO-FLOW SCHEDULE
# ---------------------------------------------------------------------------
# First principles, all derived, nothing hand-typed:
#   - Genesis subsidy            = 50 BTC/block
#   - Halving interval           = 210,000 blocks
#   - Target block time          = 10 minutes  -> 52,560 blocks/year (365 days)
#   - Subsidy halves each epoch until it rounds to 0 sat (satoshi-truncated)
# Bitcoin Core truncates the subsidy in satoshis; after 33 halvings it is 0.
SATS_PER_BTC = 100_000_000
GENESIS_SUBSIDY_SATS = 50 * SATS_PER_BTC
HALVING_INTERVAL = 210_000
BLOCKS_PER_YEAR = 6 * 24 * 365            # 52,560 (10-min blocks)
# Approx wall-clock year each epoch began (epoch 0 = 2009). Halvings have landed
# ~every 4 years; these are the realized/projected start years for labelling only.
EPOCH_START_YEAR = {0: 2009, 1: 2012, 2: 2016, 3: 2020, 4: 2024,
                    5: 2028, 6: 2032, 7: 2036, 8: 2040, 9: 2044, 10: 2048}


def subsidy_sats(epoch: int) -> int:
    """Satoshi-truncated block subsidy for a given halving epoch."""
    return GENESIS_SUBSIDY_SATS >> epoch          # integer right-shift = floor(/2^epoch)


def build_issuance_schedule(max_epoch: int = 10):
    rows = []
    cumulative_sats = 0
    for epoch in range(0, max_epoch + 1):
        sub = subsidy_sats(epoch)
        epoch_total_sats = sub * HALVING_INTERVAL
        stock_before = cumulative_sats                    # stock entering the epoch
        cumulative_sats += epoch_total_sats               # stock after epoch fully mined
        annual_flow_sats = sub * BLOCKS_PER_YEAR          # new coins minted per year in-epoch
        # Stock-to-flow measured at the START of the epoch (stock already mined / annual new flow)
        s2f = (stock_before / annual_flow_sats) if annual_flow_sats else None
        annual_inflation_pct = (annual_flow_sats / stock_before * 100) if stock_before else None
        rows.append({
            "epoch": epoch,
            "approx_start_year": EPOCH_START_YEAR.get(epoch),
            "block_subsidy_btc": round(sub / SATS_PER_BTC, 8),
            "stock_at_epoch_start_btc": round(stock_before / SATS_PER_BTC, 4),
            "annual_new_supply_btc": round(annual_flow_sats / SATS_PER_BTC, 4),
            "annual_inflation_pct": round(annual_inflation_pct, 4) if annual_inflation_pct is not None else None,
            "stock_to_flow": round(s2f, 2) if s2f is not None else None,
            "cumulative_supply_btc": round(cumulative_sats / SATS_PER_BTC, 4),
        })
    return rows


def terminal_supply_btc():
    """Sum of all subsidies across all non-zero epochs = the real hard cap."""
    total = 0
    epoch = 0
    while subsidy_sats(epoch) > 0:
        total += subsidy_sats(epoch) * HALVING_INTERVAL
        epoch += 1
    return total / SATS_PER_BTC, epoch


# ---------------------------------------------------------------------------
# 2. PURCHASING-POWER EROSION (why-money-fails simulator)
# ---------------------------------------------------------------------------
# Given a constant annual inflation rate r (%), the purchasing power of one unit
# of money after n years is (1 / (1 + r/100))^n. Doubling time of prices uses the
# exact log formula (the "rule of 70" is the approximation; we use the exact one).
import math


def purchasing_power_curve(annual_rate_pct: float, years: int):
    r = annual_rate_pct / 100.0
    return [round((1.0 / (1.0 + r)) ** y * 100, 4) for y in range(0, years + 1)]  # % of original


def price_doubling_time_years(annual_rate_pct: float):
    r = annual_rate_pct / 100.0
    if r <= 0:
        return None
    return round(math.log(2) / math.log(1 + r), 3)


# Reference scenarios the simulator ships with (presets). Rates are illustrative
# anchors, not forecasts, labelled as such in the UI.
PP_PRESETS = {
    "us_dollar_2_pct_target":   {"rate": 2.0, "label": "2%/yr (Fed long-run target)"},
    "us_dollar_avg_since_1971": {"rate": 4.0, "label": "~4%/yr (US CPI avg since 1971)"},
    "high_inflation_10_pct":    {"rate": 10.0, "label": "10%/yr (elevated)"},
    "argentina_recent":         {"rate": 100.0,"label": "~100%/yr (recent Argentina order-of-magnitude)"},
}


# ---------------------------------------------------------------------------
# 3. ROMAN DENARIUS SILVER-CONTENT DECAY (supporting visual)
# ---------------------------------------------------------------------------
# Approximate silver fineness of the denarius by emperor (historical estimates;
# sourced in first-principles-facts.json). We also compute the implied compound
# annual debasement rate from Augustus (27 BCE, ~95%) to Aurelian (274 CE, ~2%).
DENARIUS = [
    {"year_label": "27 BCE", "year_num": -27, "emperor": "Augustus",         "silver_pct": 95},
    {"year_label": "64 CE", "year_num": 64, "emperor": "Nero",             "silver_pct": 80},
    {"year_label": "96 CE", "year_num": 96, "emperor": "Domitian",         "silver_pct": 72},
    {"year_label": "150 CE", "year_num": 150, "emperor": "Antoninus Pius",   "silver_pct": 65},
    {"year_label": "200 CE", "year_num": 200, "emperor": "Septimius Severus", "silver_pct": 50},
    {"year_label": "220 CE", "year_num": 220, "emperor": "Elagabalus",       "silver_pct": 35},
    {"year_label": "260 CE", "year_num": 260, "emperor": "Gallienus",        "silver_pct": 15},
    {"year_label": "274 CE", "year_num": 274, "emperor": "Aurelian",         "silver_pct": 2},
]


def denarius_compound_rate():
    start, end = DENARIUS[0], DENARIUS[-1]
    span_years = end["year_num"] - start["year_num"]          # ~301 years
    ratio = end["silver_pct"] / start["silver_pct"]
    annual = (ratio ** (1.0 / span_years)) - 1.0              # negative = decline
    return {
        "span_years": span_years,
        "start_silver_pct": start["silver_pct"],
        "end_silver_pct": end["silver_pct"],
        "compound_annual_decline_pct": round(annual * 100, 3),
    }


# ---------------------------------------------------------------------------
# BUILD + EMIT
# ---------------------------------------------------------------------------
def main():
    term_supply, term_epoch = terminal_supply_btc()
    schedule = build_issuance_schedule(10)

    out = {
        "_meta": {
            "generated": date.today().isoformat(),
            "generator": "first-principles-worksheet.py",
            "note": "Source of truth for first-principles interactives. Re-run to regenerate.",
        },
        "bitcoin_issuance": {
            "genesis_subsidy_btc": 50,
            "halving_interval_blocks": HALVING_INTERVAL,
            "blocks_per_year_assumed": BLOCKS_PER_YEAR,
            "terminal_supply_btc": round(term_supply, 8),
            "halvings_until_zero_subsidy": term_epoch,
            "schedule": schedule,
        },
        "stock_to_flow_comparison": {
            # BTC value is DERIVED from the schedule above (epoch 4, the post-2024 era).
            "note": ("S2F is a scarcity descriptor (stock / annual new flow), NOT a price model. "
                     "Gold/silver/USD figures are widely-cited estimates with wide error bars; "
                     "see facts file for sourcing. The PlanB S2F *price* model is excluded on "
                     "purpose, it diverged from realized price by >500% after 2023."),
            "bitcoin_post_2024_epoch4": next(r["stock_to_flow"] for r in schedule if r["epoch"] == 4),
            "bitcoin_post_2028_epoch5": next(r["stock_to_flow"] for r in schedule if r["epoch"] == 5),
            "gold_estimate": 60,
            "silver_estimate": 22,
            "us_dollar_estimate": 4,
        },
        "purchasing_power": {
            "formula": "PP(n) = (1 / (1 + r))^n, r = annual inflation as decimal",
            "presets": {
                k: {
                    "rate_pct": v["rate"],
                    "label": v["label"],
                    "price_doubling_years": price_doubling_time_years(v["rate"]),
                    "pp_after_10y_pct": purchasing_power_curve(v["rate"], 10)[-1],
                    "pp_after_30y_pct": purchasing_power_curve(v["rate"], 30)[-1],
                    "curve_30y_pct": purchasing_power_curve(v["rate"], 30),
                }
                for k, v in PP_PRESETS.items()
            },
        },
        "roman_denarius": {
            "series": DENARIUS,
            "decay": denarius_compound_rate(),
        },
    }

    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "first-principles-math.json")
    out_path = os.path.abspath(out_path)
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)

    # ---- console spot-checks (printed for the verification step) ----
    print(f"Wrote {out_path}")
    print(f"Terminal supply: {term_supply:,.8f} BTC over {term_epoch} non-zero halving epochs")
    print("Epoch | start yr | subsidy | stock@start |  annual new | infl% |   S2F")
    for r in schedule[:7]:
        print(f"  {r['epoch']:>2}  |  {r['approx_start_year']}   | {r['block_subsidy_btc']:>7} | "
              f"{r['stock_at_epoch_start_btc']:>11,.0f} | {r['annual_new_supply_btc']:>10,.0f} | "
              f"{(r['annual_inflation_pct'] or 0):>5.2f} | {r['stock_to_flow']}")
    print("\nPurchasing power after 30y:")
    for k, v in PP_PRESETS.items():
        c = purchasing_power_curve(v["rate"], 30)[-1]
        dt = price_doubling_time_years(v["rate"])
        print(f"  {v['label']:<38} -> {c:6.2f}% left, prices double every {dt} yr")
    print("\nDenarius decay:", denarius_compound_rate())


if __name__ == "__main__":
    main()
