#!/usr/bin/env python3
"""
Bitcoin-Backed Loans Deep Dive — Math Worksheet (Phase 1 Lock)
================================================================

Source of truth for every number that will appear in the Loans deep dive
(prose, calculator outputs, comparison tables, scenario analyses).

Run: python3 loans-math-worksheet.py

Outputs: loans-math-output.json (consumed by the deep dive's HTML calculator)
"""

import json
import math
from dataclasses import dataclass, asdict
from typing import Optional

# ============================================================
# CONSTANTS — borrower defaults
# ============================================================
DEFAULTS = {
    "btc_price_now": 100_000,           # USD per BTC
    "btc_quantity": 5,                  # BTC owned
    "cost_basis_per_btc": 20_000,       # USD
    "loan_need_usd": 250_000,           # USD borrowed
    "horizon_months": 24,
    "ltcg_combined_rate": 0.25,         # 20% federal + 5% state
    "tbill_yield": 0.045,               # 4.5% annual
    "btc_realized_vol": 0.70,           # 70% annualized (historical BTC)
    "home_appreciation": 0.03,          # 3%/yr (for mortgage comparison context)
}

# ============================================================
# PROVIDER TERMS (synced with providers.json — May 2026)
# ============================================================
PROVIDERS = {
    "lmc": {
        "name": "Loan My Coins",
        "denominator": "BTC",
        "ltv": 0.95,
        "fee_upfront": 0.05,
        "fee_unit": "BTC-denominated",
        "term_months_base": 12,
        "term_months_max": 60,           # rollable to 5 years total
        "minimum_usd_equiv": 100_000,    # 1 BTC at $100K
        "margin_calls": False,
        "rehypothecation": False,
        "custody": "collaborative-multisig (2-of-3)",
    },
    "ledn_custodied": {
        "name": "Ledn — Custodied",
        "denominator": "USD",
        "ltv": 0.50,
        "apr": 0.139,
        "term_months_base": None,        # open-ended
        "minimum_usd_equiv": 1_000,
        "margin_calls": True,
        "rehypothecation": False,
        "custody": "qualified-custodian-ring-fenced",
    },
    "ledn_standard": {
        "name": "Ledn — Standard",
        "denominator": "USD",
        "ltv": 0.50,
        "apr": 0.124,
        "term_months_base": None,
        "minimum_usd_equiv": 1_000,
        "margin_calls": True,
        "rehypothecation": True,
        "custody": "qualified-custodian-with-rehypothecation",
    },
    "unchained": {
        "name": "Unchained Capital",
        "denominator": "USD",
        "ltv": 0.50,
        "apr_tiers": [
            (250_000, 0.1149),
            (1_000_000, 0.1099),
            (2_000_000, 0.1049),
            (float("inf"), 0.0999),
        ],
        "term_months_base": 12,          # term loan, renewable
        "minimum_usd_equiv": 150_000,
        "margin_calls": True,
        "rehypothecation": False,
        "custody": "collaborative-multisig (2-of-3)",
    },
    "lava": {
        "name": "Lava",
        "denominator": "USD",
        "ltv": 0.60,                     # pending verification email
        "apr_month_1": 0.05,
        "apr_month_12": 0.115,
        "step_up": True,
        "term_months_base": None,        # open-ended
        "minimum_usd_equiv": 100,
        "margin_calls": True,
        "rehypothecation": False,
        "custody": "self-custody-dlc",
    },
    "arch": {
        "name": "Arch Lending",
        "denominator": "USD",
        "ltv": 0.60,
        "apr_headline": 0.0725,          # best tier
        "apr_btc_program": 0.125,        # typical BTC effective
        "origination_fee": 0.015,
        "term_months_max": 24,
        "minimum_usd_equiv": 75_000,     # estimated typical
        "margin_calls": True,
        "rehypothecation": False,
        "custody": "qualified-custodian (Anchorage)",
    },
    "salt": {
        "name": "SALT Lending",
        "denominator": "USD",
        "ltv": 0.50,                     # mid-tier choice
        "apr_range": (0.0895, 0.1445),
        "apr_typical": 0.1170,           # mid-range
        "origination_fee": 0.005,        # mid-range 0-1%
        "term_options_years": [1, 3, 5],
        "term_months_base": 12,
        "minimum_usd_equiv": 5_000,
        "margin_calls": True,
        "rehypothecation": True,
        "custody": "qualified-custodian-with-rehypothecation",
    },
    "coinbase_morpho": {
        "name": "Coinbase via Morpho",
        "denominator": "USDC",
        "ltv": 0.75,
        "liquidation_ltv": 0.86,
        "liquidation_penalty": 0.0438,
        "apr_typical": 0.08,             # variable, mid-range estimate for Morpho on Base
        "term_months_base": None,        # open-ended smart contract
        "minimum_usd_equiv": 50,
        "maximum_usd_equiv": 5_000_000,
        "margin_calls": True,
        "rehypothecation": False,        # at loan level
        "custody": "hybrid-wrapped-defi",
    },
    "bitfinex": {
        "name": "Bitfinex Borrow",
        "denominator": "USD",
        "ltv": 0.90,                     # 111.11% margin requirement
        "apr_typical": 0.10,             # midpoint of 5-15% range
        "term_days_max": 120,
        "term_months_base": 1,           # ~30 days typical
        "minimum_usd_equiv": 175,
        "margin_calls": True,
        "rehypothecation": "exchange-pooled",
        "custody": "exchange-custody",
    },
    "debifi": {
        "name": "Debifi",
        "denominator": "USD",
        "ltv": 0.75,                     # alert threshold; liquidation at 90%
        "liquidation_ltv": 0.90,
        "apr_range": (0.10, 0.14),
        "apr_typical": 0.12,
        "origination_fee": 0.015,
        "term_months_max": 60,
        "minimum_usd_equiv": 500_000,   # institutional focus
        "margin_calls": True,
        "rehypothecation": False,
        "custody": "non-custodial-3-of-4-multisig",
    },
}

# ============================================================
# HELPERS
# ============================================================
def get_unchained_apr(loan_size_usd: float) -> float:
    for ceiling, rate in PROVIDERS["unchained"]["apr_tiers"]:
        if loan_size_usd < ceiling:
            return rate
    return PROVIDERS["unchained"]["apr_tiers"][-1][1]


def lava_avg_apr(months: int) -> float:
    """Lava's step-up rate: 5% month 1 → 11.5% month 12. Linear ramp."""
    p = PROVIDERS["lava"]
    apr_per_month = []
    for m in range(1, months + 1):
        if m <= 12:
            # Linear interpolation 5% → 11.5%
            r = p["apr_month_1"] + (p["apr_month_12"] - p["apr_month_1"]) * (m - 1) / 11
        else:
            r = p["apr_month_12"]
        apr_per_month.append(r)
    return sum(apr_per_month) / len(apr_per_month)


def cost_lmc_btc_denominated(btc_pledged: float, periods: int) -> float:
    """LMC cost in BTC over N 12-month periods (rollovers).
    Each period: 5% of pledged BTC. Compounds because each roll uses fresh fee."""
    return btc_pledged * PROVIDERS["lmc"]["fee_upfront"] * periods


def cost_simple_interest(loan_usd: float, apr: float, months: int,
                         origination_fee: float = 0.0) -> dict:
    """Standard fiat loan with simple interest accrual + origination fee."""
    origination = loan_usd * origination_fee
    interest = loan_usd * apr * (months / 12)
    total_cost = origination + interest
    effective_apr = (total_cost / loan_usd) * (12 / months)
    return {
        "origination_fee_usd": origination,
        "interest_usd": interest,
        "total_cost_usd": total_cost,
        "effective_apr": effective_apr,
    }


def margin_threshold_drop(ltv_at_origination: float, liquidation_ltv: float) -> float:
    """BTC price drop % that triggers margin call.
    At origination, LTV = L / (P * Q). At liquidation, LTV = L / (P' * Q) where P' = P * (1 - drop).
    So drop = 1 - LTV_orig / LTV_liq."""
    return 1 - ltv_at_origination / liquidation_ltv


# ============================================================
# COMPARATIVE COST — $250K loan, 24 months
# ============================================================
def comparative_costs(loan_usd: float, months: int, btc_price: float) -> dict:
    """Compute total cost across all providers for given loan size + horizon."""
    results = {}

    # LMC — BTC denominated; need to model how many BTC pledged
    lmc_btc_pledged = (loan_usd / 0.95) / btc_price  # In BTC, pledge enough so 95% LTV gives the loan
    lmc_periods = math.ceil(months / 12)  # number of 12-month rolls
    lmc_btc_cost = cost_lmc_btc_denominated(lmc_btc_pledged, lmc_periods)
    lmc_usd_equivalent = lmc_btc_cost * btc_price  # at origination price
    # Tax deferral benefit (vs. selling the equivalent BTC)
    btc_quantity_sold_equivalent = loan_usd / btc_price  # if borrower sold instead
    avg_cost_basis = DEFAULTS["cost_basis_per_btc"]
    gain_per_btc = btc_price - avg_cost_basis
    tax_avoided = btc_quantity_sold_equivalent * gain_per_btc * DEFAULTS["ltcg_combined_rate"]
    # T-bill yield on cash received (LMC borrower sells received BTC, invests cash)
    tbill_earnings = loan_usd * DEFAULTS["tbill_yield"] * (months / 12)
    results["lmc"] = {
        "btc_pledged": lmc_btc_pledged,
        "btc_received_after_fee": lmc_btc_pledged * 0.95,
        "fee_btc_total": lmc_btc_cost,
        "fee_usd_at_origination": lmc_usd_equivalent,
        "tax_avoided_usd": tax_avoided,
        "tbill_earnings_usd": tbill_earnings,
        "net_cost_usd": lmc_usd_equivalent - tbill_earnings - tax_avoided,
        "margin_call_risk": False,
        "notes": "Cost is in BTC; comparison to USD providers depends on BTC price path. Tax deferral and T-bill yield offset partially or fully.",
    }

    # Ledn Custodied
    ledn_c = cost_simple_interest(loan_usd, PROVIDERS["ledn_custodied"]["apr"], months)
    results["ledn_custodied"] = {
        "btc_pledged": loan_usd / 0.50 / btc_price,
        **ledn_c,
        "margin_call_threshold_drop": margin_threshold_drop(0.50, 0.70),
        "margin_call_risk": True,
    }

    # Ledn Standard
    ledn_s = cost_simple_interest(loan_usd, PROVIDERS["ledn_standard"]["apr"], months)
    results["ledn_standard"] = {
        "btc_pledged": loan_usd / 0.50 / btc_price,
        **ledn_s,
        "margin_call_threshold_drop": margin_threshold_drop(0.50, 0.70),
        "margin_call_risk": True,
        "rehypothecation_risk": True,
    }

    # Unchained
    if loan_usd < PROVIDERS["unchained"]["minimum_usd_equiv"]:
        results["unchained"] = {"applicable": False, "reason": "Loan below $150K minimum"}
    else:
        u_apr = get_unchained_apr(loan_usd)
        u = cost_simple_interest(loan_usd, u_apr, months)
        results["unchained"] = {
            "btc_pledged": loan_usd / 0.50 / btc_price,
            "apr_tier": u_apr,
            **u,
            "margin_call_threshold_drop": margin_threshold_drop(0.50, 0.70),
            "margin_call_risk": True,
            "monthly_interest_only_payment": loan_usd * u_apr / 12,
        }

    # Lava
    lava_apr_avg = lava_avg_apr(months)
    lava = cost_simple_interest(loan_usd, lava_apr_avg, months)
    results["lava"] = {
        "btc_pledged": loan_usd / 0.60 / btc_price,
        "apr_avg": lava_apr_avg,
        **lava,
        "margin_call_threshold_drop": margin_threshold_drop(0.60, 0.80),
        "margin_call_risk": True,
        "notes": "Step-up APR; cost grows over time. Repay quickly for lowest cost.",
    }

    # Arch
    arch_total_apr = PROVIDERS["arch"]["apr_btc_program"]
    arch = cost_simple_interest(loan_usd, arch_total_apr, months,
                                 PROVIDERS["arch"]["origination_fee"])
    results["arch"] = {
        "btc_pledged": loan_usd / 0.60 / btc_price,
        **arch,
        "margin_call_threshold_drop": margin_threshold_drop(0.60, 0.80),
        "margin_call_risk": True,
    }

    # SALT
    salt_apr = PROVIDERS["salt"]["apr_typical"]
    salt = cost_simple_interest(loan_usd, salt_apr, months,
                                 PROVIDERS["salt"]["origination_fee"])
    results["salt"] = {
        "btc_pledged": loan_usd / 0.50 / btc_price,
        **salt,
        "margin_call_threshold_drop": margin_threshold_drop(0.50, 0.70),
        "margin_call_risk": True,
        "rehypothecation_risk": True,
    }

    # Coinbase / Morpho
    cb = cost_simple_interest(loan_usd, PROVIDERS["coinbase_morpho"]["apr_typical"], months)
    results["coinbase_morpho"] = {
        "btc_pledged": loan_usd / 0.75 / btc_price,
        **cb,
        "margin_call_threshold_drop": margin_threshold_drop(0.75, 0.86),
        "margin_call_risk": True,
        "liquidation_penalty_pct": PROVIDERS["coinbase_morpho"]["liquidation_penalty"],
        "notes": "Wrapped BTC (cbBTC) on Base; smart contract custody. Variable APR.",
    }

    # Bitfinex
    bfx = cost_simple_interest(loan_usd, PROVIDERS["bitfinex"]["apr_typical"], months)
    results["bitfinex"] = {
        "btc_pledged": loan_usd / 0.90 / btc_price,
        **bfx,
        "margin_call_threshold_drop": margin_threshold_drop(0.90, 0.95),
        "margin_call_risk": True,
        "notes": "Exchange margin lending; 2-120 day terms. Costs assume rollover at consistent rate.",
    }

    # Debifi
    if loan_usd < PROVIDERS["debifi"]["minimum_usd_equiv"]:
        results["debifi"] = {"applicable": False, "reason": "Below $500K institutional minimum"}
    else:
        debifi = cost_simple_interest(loan_usd, PROVIDERS["debifi"]["apr_typical"], months,
                                       PROVIDERS["debifi"]["origination_fee"])
        results["debifi"] = {
            "btc_pledged": loan_usd / 0.75 / btc_price,
            **debifi,
            "margin_call_threshold_drop": margin_threshold_drop(0.75, 0.90),
            "margin_call_risk": True,
        }

    return results


# ============================================================
# HEDGE MISCONCEPTION — LMC as hedge against Milo margin call
# ============================================================
def hedge_scenario_forward_short(btc_initial: float, btc_pledged_lmc: float,
                                  btc_price_initial: float, btc_price_at_dip: float,
                                  btc_price_at_term: float,
                                  milo_loan: float = 500_000,
                                  milo_collateral_btc: float = 5,
                                  months_to_dip: int = 6,
                                  months_total: int = 12) -> dict:
    """Model: borrower has BTC, pledges some to Milo (Model A mortgage) and some to LMC.
    LMC disbursement (95% of pledged) is sold for cash, invested in T-bills.
    BTC drops at month X; cash used to satisfy Milo margin call.
    At LMC term end, borrower buys back BTC to repay LMC.

    Compare to no-hedge counterfactual: same starting BTC, just hold reserve in cold storage.
    """
    # Setup
    btc_received_from_lmc = btc_pledged_lmc * 0.95
    cash_at_origination = btc_received_from_lmc * btc_price_initial
    tbill_at_dip = cash_at_origination * (1 + DEFAULTS["tbill_yield"] * months_to_dip / 12)
    tbill_at_term = cash_at_origination * (1 + DEFAULTS["tbill_yield"] * months_total / 12)

    # Milo margin call: BTC drops to btc_price_at_dip. Margin threshold = LTV 1/(1-0.65) = 2.857
    # For LTV restoration to safe level (e.g., 1.5), need collateral value = loan / 1.5
    btc_collateral_value_at_dip = milo_collateral_btc * btc_price_at_dip
    target_ltv = 1.5
    needed_collateral_value = milo_loan / target_ltv
    additional_collateral_value_needed = max(0, needed_collateral_value - btc_collateral_value_at_dip)
    additional_btc_needed = additional_collateral_value_needed / btc_price_at_dip
    cost_of_topping_up = additional_btc_needed * btc_price_at_dip

    # Cash position after topping up Milo
    cash_after_topup = tbill_at_dip - cost_of_topping_up
    cash_grown_to_term = cash_after_topup * (1 + DEFAULTS["tbill_yield"] * (months_total - months_to_dip) / 12)

    # Buy BTC to repay LMC at term end
    btc_to_repay = btc_pledged_lmc  # owe original pledged amount
    cost_of_buyback = btc_to_repay * btc_price_at_term
    cash_remaining_or_shortfall = cash_grown_to_term - cost_of_buyback

    # Final BTC position (with hedge)
    milo_final_btc = milo_collateral_btc + additional_btc_needed
    lmc_returned_btc = btc_pledged_lmc  # collateral returned after repayment
    total_btc_with_hedge = milo_final_btc + lmc_returned_btc
    total_value_with_hedge = total_btc_with_hedge * btc_price_at_term + cash_remaining_or_shortfall

    # No-hedge counterfactual: had 10 BTC (5 Milo + 5 reserve). At margin call, sent reserve to Milo.
    btc_reserve_initial = btc_pledged_lmc  # same amount, would be in cold storage
    btc_reserve_remaining = btc_reserve_initial - additional_btc_needed
    milo_no_hedge_btc = milo_collateral_btc + additional_btc_needed
    total_btc_no_hedge = milo_no_hedge_btc + btc_reserve_remaining
    total_value_no_hedge = total_btc_no_hedge * btc_price_at_term

    return {
        "scenario": {
            "btc_price_initial": btc_price_initial,
            "btc_price_at_dip": btc_price_at_dip,
            "btc_price_at_term": btc_price_at_term,
            "months_to_dip": months_to_dip,
            "months_total": months_total,
        },
        "with_hedge": {
            "cash_at_origination": cash_at_origination,
            "tbill_at_dip": tbill_at_dip,
            "milo_topup_cost": cost_of_topping_up,
            "milo_additional_btc": additional_btc_needed,
            "cash_at_term": cash_grown_to_term,
            "lmc_buyback_cost": cost_of_buyback,
            "cash_remaining": cash_remaining_or_shortfall,
            "total_btc_final": total_btc_with_hedge,
            "total_value_final": total_value_with_hedge,
        },
        "no_hedge": {
            "btc_sent_to_milo": additional_btc_needed,
            "btc_reserve_remaining": btc_reserve_remaining,
            "total_btc_final": total_btc_no_hedge,
            "total_value_final": total_value_no_hedge,
        },
        "delta": {
            "btc": total_btc_with_hedge - total_btc_no_hedge,
            "value": total_value_with_hedge - total_value_no_hedge,
            "winner": "hedge" if total_value_with_hedge > total_value_no_hedge else "no_hedge",
        },
    }


# ============================================================
# OPTIONS STRATEGY MATH — comparison hedges
# ============================================================
def black_scholes_put(S: float, K: float, T: float, r: float, vol: float) -> float:
    """Simplified BS put pricing for illustrative options strategy comparison.
    S = spot, K = strike, T = years, r = risk-free, vol = implied vol."""
    from math import log, sqrt, exp
    if T <= 0:
        return max(K - S, 0)
    d1 = (log(S / K) + (r + 0.5 * vol ** 2) * T) / (vol * sqrt(T))
    d2 = d1 - vol * sqrt(T)
    # Normal CDF approximation
    def N(x):
        # Abramowitz-Stegun approximation
        from math import erf, sqrt as _sqrt
        return 0.5 * (1 + erf(x / _sqrt(2)))
    return K * exp(-r * T) * N(-d2) - S * N(-d1)


def options_strategies(btc_price: float, btc_quantity: float, months: int = 12,
                       implied_vol: float = 0.80) -> dict:
    """Compare three options hedges + a forward-short ('loan-as-hedge') equivalent."""
    S = btc_price
    T = months / 12
    r = DEFAULTS["tbill_yield"]
    notional = S * btc_quantity

    # Long put at 35% OTM (strike at 65% of spot — matches Milo margin threshold)
    put_35_otm_strike = S * 0.35
    put_35_otm_premium_per_btc = black_scholes_put(S, put_35_otm_strike, T, r, implied_vol)
    put_35_otm_total = put_35_otm_premium_per_btc * btc_quantity

    # Long put at 50% OTM
    put_50_otm_strike = S * 0.50
    put_50_otm_premium_per_btc = black_scholes_put(S, put_50_otm_strike, T, r, implied_vol)
    put_50_otm_total = put_50_otm_premium_per_btc * btc_quantity

    # Put spread: buy 50% OTM, sell 25% OTM
    put_25_otm_strike = S * 0.25
    put_25_otm_premium_per_btc = black_scholes_put(S, put_25_otm_strike, T, r, implied_vol)
    put_spread_premium_per_btc = put_50_otm_premium_per_btc - put_25_otm_premium_per_btc
    put_spread_total = put_spread_premium_per_btc * btc_quantity

    # Collar: buy 50% OTM put, sell 50% OTM call (approximation: similar premia for symmetric OTM)
    # Call premium estimated via put-call parity: C = P + S - K*exp(-rT)
    from math import exp
    call_50_otm_strike = S * 1.50
    call_50_otm_put = black_scholes_put(S, call_50_otm_strike, T, r, implied_vol)
    call_50_otm_premium_per_btc = call_50_otm_put + S - call_50_otm_strike * exp(-r * T)
    collar_net_premium_per_btc = put_50_otm_premium_per_btc - call_50_otm_premium_per_btc
    collar_total = collar_net_premium_per_btc * btc_quantity

    # LMC forward-short "hedge" cost: 5% upfront on pledged BTC
    forward_short_cost_per_btc = S * 0.05
    forward_short_total = forward_short_cost_per_btc * btc_quantity

    return {
        "assumptions": {
            "btc_price": S,
            "btc_quantity": btc_quantity,
            "horizon_months": months,
            "implied_vol_annualized": implied_vol,
            "risk_free": r,
        },
        "long_put_35_otm": {
            "strike": put_35_otm_strike,
            "premium_per_btc": put_35_otm_premium_per_btc,
            "total_cost_usd": put_35_otm_total,
            "pct_of_notional": put_35_otm_total / notional,
            "pays_off_when": f"BTC drops below ${put_35_otm_strike:,.0f} (65% drop)",
            "max_loss": put_35_otm_total,
            "keeps_upside": True,
        },
        "long_put_50_otm": {
            "strike": put_50_otm_strike,
            "premium_per_btc": put_50_otm_premium_per_btc,
            "total_cost_usd": put_50_otm_total,
            "pct_of_notional": put_50_otm_total / notional,
            "pays_off_when": f"BTC drops below ${put_50_otm_strike:,.0f} (50% drop)",
            "max_loss": put_50_otm_total,
            "keeps_upside": True,
        },
        "put_spread_50_25": {
            "long_strike": put_50_otm_strike,
            "short_strike": put_25_otm_strike,
            "premium_per_btc": put_spread_premium_per_btc,
            "total_cost_usd": put_spread_total,
            "pct_of_notional": put_spread_total / notional,
            "pays_off_when": f"BTC drops below ${put_50_otm_strike:,.0f}; capped at ${put_25_otm_strike:,.0f}",
            "max_loss": put_spread_total,
            "keeps_upside": True,
        },
        "collar_50_50": {
            "put_strike": put_50_otm_strike,
            "call_strike": call_50_otm_strike,
            "net_premium_per_btc": collar_net_premium_per_btc,
            "total_cost_usd": collar_total,
            "pct_of_notional": collar_total / notional,
            "pays_off_when": f"Net zero or low-cost protection below ${put_50_otm_strike:,.0f}; upside capped at ${call_50_otm_strike:,.0f}",
            "max_loss": "spread between strikes",
            "keeps_upside": False,
        },
        "lmc_forward_short": {
            "structure": "Pledge BTC to LMC, sell received BTC for cash",
            "cost_per_btc": forward_short_cost_per_btc,
            "total_cost_usd": forward_short_total,
            "pct_of_notional": 0.05,
            "pays_off_when": "Indirectly — cash buffer at margin call moment",
            "max_loss": "Forfeiture of pledged BTC if BTC moons + can't roll",
            "keeps_upside": False,
            "note": "Not a true hedge — directional bet on BTC drop within term",
        },
    }


# ============================================================
# LMC "OUTPERFORM BTC" STRATEGY — drop/flat/moon scenarios
# ============================================================
def lmc_outperform_btc(btc_quantity: float, btc_price: float,
                       scenarios: dict, term_months: int = 12) -> dict:
    """Model the 'Terminal Bitcoin' strategy:
    Pledge X BTC, receive 0.95X, sell for cash, T-bills, repurchase at favorable price.
    """
    results = {}
    btc_pledged = btc_quantity
    btc_received = btc_pledged * 0.95
    cash_at_origin = btc_received * btc_price
    cash_at_term = cash_at_origin * (1 + DEFAULTS["tbill_yield"] * term_months / 12)

    for scenario_name, btc_price_at_term in scenarios.items():
        # Buy back X BTC at term end price
        cost_to_repay = btc_pledged * btc_price_at_term
        cash_remaining = cash_at_term - cost_to_repay

        # Final position: original pledged BTC returned + cash remaining/shortfall
        # If shortfall > 0, borrower out of pocket
        final_btc = btc_pledged  # collateral returned
        final_cash = cash_remaining

        # vs. just holding (counterfactual)
        counterfactual_btc = btc_quantity
        counterfactual_value = counterfactual_btc * btc_price_at_term

        with_strategy_value = final_btc * btc_price_at_term + final_cash
        delta_value = with_strategy_value - counterfactual_value

        # Convert delta to BTC-equivalent at term price
        delta_btc_equivalent = delta_value / btc_price_at_term

        results[scenario_name] = {
            "btc_price_at_term": btc_price_at_term,
            "cash_at_term": cash_at_term,
            "cost_to_repay_lmc": cost_to_repay,
            "cash_remaining": cash_remaining,
            "final_btc": final_btc,
            "with_strategy_value": with_strategy_value,
            "counterfactual_value": counterfactual_value,
            "delta_value": delta_value,
            "delta_btc_equivalent": delta_btc_equivalent,
            "winner": "strategy" if delta_value > 0 else "hold",
        }

    return results


# ============================================================
# BREAK-EVEN ANALYSES
# ============================================================
def ledn_custodied_vs_standard_breakeven() -> dict:
    """At what counterparty failure probability does Custodied premium pay off?
    Custodied: 13.9% APR, no rehypothecation
    Standard: 12.4% APR, rehypothecation allowed
    Premium: 1.5% APR = ~3% of loan over 2 years
    Expected loss from rehypothecation counterparty failure: P_fail * loss_given_default
    """
    premium_apr = PROVIDERS["ledn_custodied"]["apr"] - PROVIDERS["ledn_standard"]["apr"]
    horizon_years = 2
    premium_pct_of_loan = premium_apr * horizon_years
    # Assume LGD = 50% if rehypothecation counterparty fails (collateral partially recovered)
    lgd = 0.50
    # Break-even probability
    breakeven_prob = premium_pct_of_loan / lgd
    return {
        "premium_apr": premium_apr,
        "premium_pct_over_2yr": premium_pct_of_loan,
        "assumed_loss_given_default": lgd,
        "breakeven_failure_probability": breakeven_prob,
        "interpretation": f"Custodied pays off if you believe rehypothecation counterparty failure probability over 2 years exceeds {breakeven_prob:.1%}",
    }


def lava_optimal_payoff_period() -> dict:
    """Lava's step-up rate creates optimal early-payoff window."""
    monthly_costs = []
    cumulative_cost_pct = 0
    optimal_month = None
    for m in range(1, 13):
        # Linear ramp 5% → 11.5% over 12 months
        apr = PROVIDERS["lava"]["apr_month_1"] + (PROVIDERS["lava"]["apr_month_12"] - PROVIDERS["lava"]["apr_month_1"]) * (m - 1) / 11
        monthly_cost_pct = apr / 12
        cumulative_cost_pct += monthly_cost_pct
        monthly_costs.append({
            "month": m,
            "apr": apr,
            "monthly_cost_pct": monthly_cost_pct,
            "cumulative_cost_pct": cumulative_cost_pct,
        })
    return {
        "month_1_apr": PROVIDERS["lava"]["apr_month_1"],
        "month_12_apr": PROVIDERS["lava"]["apr_month_12"],
        "avg_apr_year_1": lava_avg_apr(12),
        "monthly_costs": monthly_costs,
        "interpretation": "Cost grows as a function of duration. Best used for short-term liquidity (1-3 months) where 5-7% APR window applies.",
    }


def lmc_breakeven_btc_drawdown(btc_quantity: float, btc_price: float,
                                term_months: int = 12) -> dict:
    """What BTC drawdown is needed in the LMC outperform strategy
    for it to break even vs. just holding?"""
    btc_pledged = btc_quantity
    cash_at_origin = btc_pledged * 0.95 * btc_price
    cash_at_term = cash_at_origin * (1 + DEFAULTS["tbill_yield"] * term_months / 12)

    # Strategy breaks even when: btc_pledged * P_term + (cash_at_term - btc_pledged * P_term) = btc_quantity * P_term
    # Simplifying: cash_at_term = btc_pledged * P_term * 0 + ... actually:
    # Final value with strategy = btc_pledged * P_term + (cash_at_term - btc_pledged * P_term)
    # = cash_at_term
    # Counterfactual = btc_quantity * P_term
    # Break-even: cash_at_term = btc_quantity * P_term
    # P_term_breakeven = cash_at_term / btc_quantity
    p_term_breakeven = cash_at_term / btc_quantity
    drawdown_pct = (btc_price - p_term_breakeven) / btc_price

    return {
        "btc_price_at_origin": btc_price,
        "btc_price_at_breakeven": p_term_breakeven,
        "drawdown_required_pct": drawdown_pct,
        "interpretation": f"LMC outperform strategy breaks even if BTC drops below ${p_term_breakeven:,.0f} ({drawdown_pct:.1%} drawdown) at term end",
    }


# ============================================================
# MAIN — run all analyses, save to JSON
# ============================================================
def main():
    output = {
        "metadata": {
            "schemaVersion": "1.0",
            "computedDate": "2026-05-11",
            "scriptVersion": "1.0",
            "defaults": DEFAULTS,
        },
    }

    # 1. Comparative costs at default scenario ($250K / 24 months)
    print("\n=== COMPARATIVE COSTS: $250K loan, 24 months ===")
    costs_default = comparative_costs(
        DEFAULTS["loan_need_usd"],
        DEFAULTS["horizon_months"],
        DEFAULTS["btc_price_now"],
    )
    for provider_id, data in costs_default.items():
        name = PROVIDERS[provider_id]["name"]
        if data.get("applicable") is False:
            print(f"  {name}: N/A ({data['reason']})")
        else:
            btc = data.get("btc_pledged", 0)
            cost = data.get("total_cost_usd") or data.get("net_cost_usd", 0)
            print(f"  {name}: {btc:.2f} BTC pledged, ${cost:,.0f} net cost")
    output["comparative_costs_default"] = costs_default

    # 2. Sensitivity: vary loan size
    print("\n=== SENSITIVITY: loan size at 24 months ===")
    sensitivity_loan_size = {}
    for loan_amt in [50_000, 250_000, 1_000_000, 5_000_000]:
        sensitivity_loan_size[str(loan_amt)] = comparative_costs(
            loan_amt, 24, DEFAULTS["btc_price_now"]
        )
    output["sensitivity_loan_size"] = sensitivity_loan_size

    # 3. Sensitivity: vary horizon
    print("\n=== SENSITIVITY: horizon at $250K ===")
    sensitivity_horizon = {}
    for months in [6, 12, 24, 36, 60]:
        sensitivity_horizon[str(months)] = comparative_costs(
            DEFAULTS["loan_need_usd"], months, DEFAULTS["btc_price_now"]
        )
    output["sensitivity_horizon"] = sensitivity_horizon

    # 4. Hedge misconception scenarios
    print("\n=== HEDGE MISCONCEPTION SCENARIOS ===")
    hedge_scenarios = {}
    hedge_scenarios["drop_v_shape"] = hedge_scenario_forward_short(
        btc_initial=10, btc_pledged_lmc=5,
        btc_price_initial=100_000, btc_price_at_dip=35_000, btc_price_at_term=100_000,
        months_to_dip=6, months_total=12,
    )
    hedge_scenarios["flat"] = hedge_scenario_forward_short(
        btc_initial=10, btc_pledged_lmc=5,
        btc_price_initial=100_000, btc_price_at_dip=100_000, btc_price_at_term=100_000,
        months_to_dip=6, months_total=12,
    )
    hedge_scenarios["moon"] = hedge_scenario_forward_short(
        btc_initial=10, btc_pledged_lmc=5,
        btc_price_initial=100_000, btc_price_at_dip=200_000, btc_price_at_term=200_000,
        months_to_dip=6, months_total=12,
    )
    for name, data in hedge_scenarios.items():
        print(f"  {name}: delta = {data['delta']['btc']:+.2f} BTC, ${data['delta']['value']:+,.0f}, winner: {data['delta']['winner']}")
    output["hedge_scenarios"] = hedge_scenarios

    # 5. Options strategies comparison
    print("\n=== OPTIONS STRATEGIES (5 BTC notional, 12 months) ===")
    options = options_strategies(
        DEFAULTS["btc_price_now"], DEFAULTS["btc_quantity"], 12, 0.80
    )
    for strat, data in options.items():
        if strat == "assumptions":
            continue
        print(f"  {strat}: ${data['total_cost_usd']:,.0f} ({data['pct_of_notional']:.1%} of notional)")
    output["options_strategies"] = options

    # 6. LMC outperform-BTC scenarios
    print("\n=== LMC OUTPERFORM BTC: scenarios ===")
    lmc_scenarios = lmc_outperform_btc(
        btc_quantity=5,
        btc_price=DEFAULTS["btc_price_now"],
        scenarios={
            "drop_50": 50_000,
            "drop_30": 70_000,
            "flat": 100_000,
            "rise_30": 130_000,
            "rise_50": 150_000,
            "moon_100": 200_000,
        },
        term_months=12,
    )
    for s, data in lmc_scenarios.items():
        print(f"  {s}: delta = {data['delta_btc_equivalent']:+.2f} BTC-equiv, winner: {data['winner']}")
    output["lmc_outperform_scenarios"] = lmc_scenarios

    # 7. Break-even analyses
    print("\n=== BREAK-EVEN ANALYSES ===")
    breakevens = {
        "ledn_custodied_vs_standard": ledn_custodied_vs_standard_breakeven(),
        "lava_optimal_payoff": lava_optimal_payoff_period(),
        "lmc_breakeven_drawdown": lmc_breakeven_btc_drawdown(
            DEFAULTS["btc_quantity"], DEFAULTS["btc_price_now"], 12
        ),
    }
    for name, data in breakevens.items():
        print(f"  {name}: {data.get('interpretation', '')}")
    output["breakevens"] = breakevens

    # Save to JSON
    output_path = "/sessions/elegant-bold-clarke/mnt/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/data/loans-math-output.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2, default=str)

    print(f"\n=== Math worksheet complete. Output: {output_path} ===")
    return output


if __name__ == "__main__":
    main()
