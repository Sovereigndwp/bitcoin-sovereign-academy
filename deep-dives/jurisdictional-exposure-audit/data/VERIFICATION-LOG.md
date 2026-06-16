# Verification Log

Provenance record for the Source Verification Rule (see `docs/superpowers/specs/2026-06-16-jea-research-integrity-system.md` §9b). Each entry: what was checked, the source confirmed against, and the outcome. "Confirmed" means a reviewer opened a source that directly supports the claim. Re-run on each profile's review cadence.

## 2026-06-16 — initial verification pass

### United States (verified during build)
- Bitcoin = property, taxable on disposal (IRS) — **confirmed** [src-irs-vc-faq].
- Form 1099-DA phase-in + Notice 2025-33 relief (IRS + RSM) — **confirmed** [src-irs-da-final].
- FBAR crypto-only-account status + pending FinCEN amendment — **confirmed** [src-fincen-fbar-vc].
- §877A covered-expatriate tests / 2025 thresholds (IRS) — **confirmed** [src-irs-8854].
- 2026 estate/gift exemption $15M / $19k (IRS Rev. Proc. 2025-32) — **confirmed** [src-irs-revproc-2026].
- Self-custody / FinCEN FIN-2019-G001 — **confirmed** [src-fincen-2019-g001].
- US not a CRS participant (OECD) — **confirmed** [src-oecd-crs].

### Australia (verified during build + this pass)
- Bitcoin = CGT asset; 50% discount >12 months; personal-use-asset cost <= AUD 10,000 (ATO) — **confirmed** [src-au-ato-cgt-crypto, src-au-ato-personaluse].
- SMSF custody rules (ATO) — **confirmed** [src-au-ato-smsf].
- AUSTRAC registration; Digital Assets Framework (Royal Assent Apr 2026, obligations Apr 2027) — **confirmed** [src-au-austrac-dce, src-au-aph-dap].
- **Correction this pass:** ceasing residency triggers CGT event I1 (deemed disposal of crypto), election to defer available — **confirmed and upgraded** from unknown to high [src-au-ato-changing-residency]. Top marginal CGT ~47% incl. Medicare levy — confirmed.

### El Salvador
- Bitcoin legal-tender status repealed 29 Jan 2025 (55-2 vote), acceptance now voluntary, IMF-driven, taxes no longer payable in BTC — **confirmed** (IMF program docs + multiple reports incl. Reason, Global Finance, Digital Watch) [src-sv-imf-pr, src-sv-reform-jan2025].
- Bitcoin capital-gains exemption survival post-amendment — **NOT confirmed**; remains an open question pending a Tier-1 Hacienda source (kept `public_safe: false`).

### Panama
- 2022 crypto law declared unconstitutional July 2023; no general crypto law in force — **confirmed** [src-pa-centralbanking-cryptolaw].
- No inheritance, estate, gift, or wealth tax — **confirmed** (PwC + multiple corroborating) [src-pa-pwc-othertaxes].
- Off the FATF grey list since Oct 2023 / EU AML list — **confirmed** [src-pa-mef-eu].
- Crypto tax treatment under territoriality — **NOT confirmed** (no DGI ruling found); remains open question.

### Colombia
- Crypto treated as intangible asset for tax (DIAN Oficio 30470/2019) — **confirmed** [src-co-dian-30470].
- DIAN crypto reporting rules for 2026 (CARF-aligned) — **confirmed** (multiple 2026 reports) [src-co-kpmg-carf].
- **Downgraded this pass:** wealth-tax THRESHOLD — sources conflict (statutory 72,000 UVT vs secondary ~40,000 UVT / ~172M COP). Existence of the tax is solid; the threshold is downgraded to low and stated as a conflict, no single figure asserted [src-co-ley2277].

### Switzerland
- Private-investor capital-gains exemption on movable assets incl. Bitcoin (DBG art. 16(3)) — **confirmed** (FTA + multiple corroborating) [src-ch-estv-crypto].
- 2023 inheritance reform: descendants' reserved portion 3/4 → 1/2, parents' compulsory portion abolished — **confirmed** (UBS, PBM Avocats, Swiss Life) [src-ch-baerkarrer-succession].
- No federal inheritance/gift tax; cantonal — **confirmed** [src-ch-chch-inheritance].

## Still requiring verification before relied upon (carried as open questions)
- El Salvador: Bitcoin capital-gains exemption persistence; LEAD incentive status post-IMF; Freedom Visa terms; 90-day residency decree.
- Panama: crypto tax under territoriality (DGI); self-custody/VASP confirmation; forced-heirship vs intestate equal-share; marital-property regime.
- Colombia: current-year wealth-tax threshold; exit tax existence; self-custody registration; foreign-trust recognition.
- Switzerland: exact FTA Circular 36 criteria; per-canton inheritance/wealth rates; 2026 AML/UBO register scope.
- All: asset-protection/seizure sections (Low everywhere; not yet sourced).

## 2026-06-16 — human-review reclassification pass (owner two-pass review)

Owner reviewed the 23-item needs-review queue. Dispositions applied to the ledger + profiles verbatim:

**Cleared to verified (4):**
- `us-tax-005` — Bitcoin↔stablecoin = exchange/disposition of digital-asset property, may create gain/loss (cautious wording) [src-irs-vc-faq].
- `us-btc-004` — **corrected** "advanced" → GENIUS Act enacted 18 Jul 2025 (PL 119-27), federal payment-stablecoin framework [src-us-genius-act].
- `co-tax-004` — Colombia permanent wealth tax exists; use 72,000 UVT; **40,000 UVT figure dropped** absent a primary source [src-co-ley2277].
- `ch-tax-003` — Bitcoin subject to cantonal/communal net-wealth tax (no federal); FTA year-end valuation rate split out to new `ch-tax-005` (needs-review) [src-ch-estv-crypto].

**Reworded to avoid overstatement, kept needs-review:** `us-basic-001` (no Colombia-style exchange controls, but sanctions/AML/BSA/tax apply); `us-rep-003` (1099-DA implemented; CARF status to confirm — not "instead of CARF"); `us-est-001`; `co-tax-003`; `co-est-002`; `pa-est-002` (foundation forced-heirship protection is a counsel conclusion); `ch-rep-002` (CARF date kept fluid); `ch-est-003` (Hague-trust override softened).

**Split:** `sv-est-001` → intestate order (needs-review, public-safe) + new `sv-est-002` testate forced-heirship reserve (conflicted, public_safe false).

**Kept unsupported / not published:** `us-tax-007` (Lightning), `co-tax-005` (exit tax), `pa-tax-002` (crypto territoriality), `sv-tax-002` (BTC CGT exemption persistence), plus `pa-rep-002` and `sv-rep-001` CARF status (needs-review, not scored).

**Likely-clear once primary attached (still needs-review):** `co-basic-001` (Banco de la República), `co-btc-002` (SFC Circular 29/2014), `sv-btc-001` (LEAD/CNAD law text).

Result: queue reduced to 4 cleared this pass + the rest held open/counsel-only. Suite green (19/19).

## 2026-06-16 — quick-win primary attachments (3 cleared)

The three "likely-clear once primary attached" items were confirmed against the named regulators' own materials and moved needs-review → verified:
- `co-basic-001` — Banco de la República concepto: crypto is not a *divisa*, not legal tender, cannot be channeled through the FX market; FX-market intermediaries cannot transact in it [src-co-banrep-divisa].
- `co-btc-002` — SFC **Circular Externa 029/2014**: virtual currencies not regulated/supervised by the SFC; supervised entities not authorized to custody/invest/intermediate [src-co-sfc-circ029].
- `sv-btc-001` — El Salvador **LEAD (DL 643)** hosted by the regulator + the CNAD public PSAD registry [src-sv-lead-cnad].

Ledger after this pass: 69 claims — verified 51 · needs-review 14 · unsupported 4. Open queue 18.
