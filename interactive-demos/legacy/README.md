# Legacy Demos Archive

**Purpose**: This folder contains deprecated versions of interactive demos that have been superseded by enhanced versions.

**Do NOT use these demos** — they are kept for historical reference only.

---

## Archived Demos

### UTXO Visualizers (Deprecated)

**Superseded by**: `/interactive-demos/utxo-visualizer-enhanced.html`

| File | Reason for Deprecation | Date Archived |
|------|------------------------|---------------|
| `utxo-visualizer.html` | Limited features, v1 | 2025-10-20 |
| `utxo-visualizer-v2.html` | Superseded by enhanced version | 2025-10-20 |

**What to use instead**:
- For all paths, use `/interactive-demos/utxo-visualizer-enhanced.html`
- Supports multi-level: `?level=beginner|intermediate|advanced`

---

## Redirects

If old links exist to these demos, add 301 redirects:

```
/interactive-demos/utxo-visualizer.html → /interactive-demos/utxo-visualizer-enhanced.html
/interactive-demos/utxo-visualizer-v2.html → /interactive-demos/utxo-visualizer-enhanced.html
```

---

### Fee/Mempool Tools (Consolidated)

**Superseded by**: `/interactive-demos/fee-master-tool.html`

| File | Reason for Deprecation | Date Archived |
|------|------------------------|---------------|
| `fee-estimator.html` | Consolidated into Fee Master Tool (Tab 1) | 2025-10-22 |
| `fee-timing-helper.html` | Consolidated into Fee Master Tool (Tab 2) | 2025-10-22 |
| `mempool-peace-of-mind.html` | Consolidated into Fee Master Tool (Tab 3) | 2025-10-22 |

**Why consolidate?**
- **Redundancy eliminated**: Three separate demos covering related fee/mempool concepts
- **Better UX**: All fee functionality in one place with tabbed interface
- **Shared state**: Fee rates and mempool data persist across tabs
- **Single API connection**: More efficient data fetching

**What to use instead**:
- For fee estimation: `/interactive-demos/fee-master-tool.html` (Tab 1: Estimate)
- For timing decisions: `/interactive-demos/fee-master-tool.html` (Tab 2: Decide)
- For transaction tracking: `/interactive-demos/fee-master-tool.html` (Tab 3: Track)

**New redirects needed**:
```
/interactive-demos/fee-estimator.html → /interactive-demos/fee-master-tool.html
/interactive-demos/fee-timing-helper.html → /interactive-demos/fee-master-tool.html
/interactive-demos/mempool-peace-of-mind.html → /interactive-demos/fee-master-tool.html
```

---

### Security Dojo (Original - Deprecated)

**Superseded by**: `/interactive-demos/security-dojo-enhanced`

| File | Reason for Deprecation | Date Archived |
|------|------------------------|---------------|
| `security-dojo/` | Enhanced version has better UX, scoring, progressive challenges | 2025-10-23 |

**What to use instead**:
- For all security training, use `/interactive-demos/security-dojo-enhanced`
- Enhanced version includes: improved UI, challenge progression, achievement system

**Redirect needed**:
```
/interactive-demos/security-dojo → /interactive-demos/security-dojo-enhanced
```

---

### Emotional Scenarios (Original - Deprecated)

**Superseded by**: Branching narrative versions with multiple decision paths

| File | Reason for Deprecation | Date Archived |
|------|------------------------|---------------|
| `account-freeze-locked-out/` | Superseded by branching scenario with 7 endings | 2025-10-23 |
| `bitcoin-vs-banking-emergency/` | Superseded by emergency-fifty-scenario with 6 endings | 2025-10-23 |
| `inflation-savings-disappear/` | Superseded by savings-disappear-scenario 10-year journey | 2025-10-23 |

**Why upgrade?**
- **Linear demos → Branching narratives**: Original demos had fixed outcomes
- **Emotional engagement**: New versions have player choices that shape the story
- **Multiple endings**: Each scenario has 6-7 different outcomes based on decisions
- **Educational depth**: Learning insights tailored to each path taken

**What to use instead**:
- Account freeze: `/interactive-demos/account-freeze-scenario.html`
- $50 Emergency: `/interactive-demos/emergency-fifty-scenario.html`
- Savings erosion: `/interactive-demos/savings-disappear-scenario.html`

**Redirects needed**:
```
/interactive-demos/account-freeze-locked-out → /interactive-demos/account-freeze-scenario.html
/interactive-demos/bitcoin-vs-banking-emergency → /interactive-demos/emergency-fifty-scenario.html
/interactive-demos/inflation-savings-disappear → /interactive-demos/savings-disappear-scenario.html
```

---

**Last Updated**: 2025-10-23
