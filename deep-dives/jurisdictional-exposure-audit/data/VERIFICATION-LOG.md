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
