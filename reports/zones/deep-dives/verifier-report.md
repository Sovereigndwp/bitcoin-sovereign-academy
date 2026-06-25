# Verifier report — zone: `deep-dives/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

- Proposed patch: `reports/zones/deep-dives/proposed.patch`
- Files in patch: 11
- Diff-integrity: **PASS** (only added line allowed: the canonical link; no removed lines)
- Screenshot QA: REQUIRED (zone has data-* or is high-risk) — run before any apply
- Apply gate: **BLOCKED — high-risk zone; contains data-* pages**

## Gates (human checkpoints)
1. Approve this patch before it is applied.
2. Approval required before any shared-CSS change (not in this zone).
3. Approval required for high-risk/data-* pages (deferred above).
4. Approval required before commit/merge.

## Next step
Apply is blocked (high-risk zone; contains data-* pages). Produce a dedicated scoped report for the gated items first.
