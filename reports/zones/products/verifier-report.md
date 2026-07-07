# Verifier report — zone: `products/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

- Proposed patch: `reports/zones/products/proposed.patch`
- Files in patch: 3
- Human-frozen pages excluded (no action): 0
- Diff-integrity: **PASS** (only added line allowed: the canonical link; no removed lines)
- Screenshot QA: NOT REQUIRED (no data-* pages in scope; static link-only change)
- Apply gate: **OPEN — eligible for gated apply after human approval**

## Gates (human checkpoints)
1. Approve this patch before it is applied.
2. Approval required before any shared-CSS change (not in this zone).
3. Approval required for high-risk/data-* pages (deferred above).
4. Approval required before commit/merge.

## Next step
Review the patch, then apply (gated):
```
git apply reports/zones/products/proposed.patch   # run after approval, in your terminal
# or: scripts/brand-pipeline.sh products --apply
```
