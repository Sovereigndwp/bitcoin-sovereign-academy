# Bitcoin Sovereign Academy — Module Template

**Purpose**: Every module should follow this structure for consistency, scannability, and clear learning progressions.

Copy this template when creating new modules or refactoring existing ones.

---

## Template (Markdown)

```markdown
---
title: "Module Title (Clear, Active)"
stage: 3
reading_time: "12 min"
difficulty: "intermediate"
type: "canonical | bridge | demo-companion"
prerequisites:
  - title: "Prerequisite Module 1"
    link: "/path/to/prereq1.html"
  - title: "Prerequisite Module 2"
    link: "/path/to/prereq2.html"
next_steps:
  - title: "Next Module (Practical)"
    link: "/path/to/next-practical.html"
    type: "hands-on"
  - title: "Next Module (Conceptual)"
    link: "/path/to/next-concept.html"
    type: "conceptual"
demo_link: "/interactive-demos/relevant-demo.html"
canonical_for:
  - "UTXO model"
  - "Transaction structure"
updated: "2025-10-20"
---

# Module Title

**What you'll learn**: [1-sentence summary of what the learner will walk away with]

**Reading time**: 12 min
**Stage**: 3 — Bitcoin Mechanics
**Difficulty**: Intermediate

---

## Prerequisites

Before starting, you should understand:
- [Prerequisite 1](link) — Why it's needed
- [Prerequisite 2](link) — Why it's needed

Not ready yet? Start with [Suggested Starting Point](link).

---

## Overview

[2-3 paragraphs explaining the *why* before diving into the *what*.]

- What problem does this concept solve?
- Why does it matter for Bitcoin?
- Where does it fit in the bigger picture?

---

## Core Concept 1: [Descriptive Heading]

[Explanation with short paragraphs, clear examples, minimal jargon.]

### Example

[If applicable, include a concrete example or analogy.]

---

## Core Concept 2: [Descriptive Heading]

[Continue with logical flow. Build on the previous section.]

---

## 🎯 Try It: [Interactive Demo Name]

**Time**: 3–5 min

[Embed or link to relevant interactive demo. Frame it as a hands-on challenge, not passive consumption.]

**Your challenge**:
1. [Action step 1]
2. [Action step 2]
3. [Action step 3]

**Launch the demo** → [Demo Link](link)

---

## Common Misconceptions

[Address 2-3 common misunderstandings or pitfalls. Use bold statements like:]

**❌ "Bitcoin uses account balances like a bank."**
**✅ Bitcoin uses UTXOs—discrete chunks of bitcoin locked to specific conditions.**

---

## Key Takeaways

- **Takeaway 1**: [Short, declarative statement]
- **Takeaway 2**: [Short, declarative statement]
- **Takeaway 3**: [Short, declarative statement]

---

## Checkpoint: Test Your Understanding

[3-5 Socratic questions—NOT trivia, but prompts to deepen thinking.]

1. **Why does Bitcoin use UTXOs instead of account balances?**
   *Hint: Think about privacy and parallel validation.*

2. **What happens if you try to spend the same UTXO twice?**
   *Hint: Consider how nodes validate transactions.*

3. **If Alice sends 0.5 BTC to Bob from a 1 BTC UTXO, where does the remaining 0.5 BTC go?**
   *Hint: Bitcoin doesn't make change automatically.*

[Optional: Link to answers or discussion forum]

---

## What's Next?

You now understand [concept]. Here are two paths forward:

### 🔨 Hands-on
**[Next Practical Module](link)**
Put this into practice. Build, experiment, break things.

### 🧠 Conceptual
**[Next Conceptual Module](link)**
Deepen your understanding of how this fits into the larger system.

---

## Further Reading (Optional)

- [Bitcoin Whitepaper Section X](link)
- [BIP-XXX: Relevant BIP](link)
- [Technical Resource](link)

*These are optional rabbit holes for the curious. Don't feel obligated.*

---

## Feedback

Found something unclear? Have a suggestion? [Open an issue](link) or [submit a PR](link).

---

**Last updated**: 2025-10-20
**Canonical for**: [List concepts from concepts.md that this module is the single source of truth for]
```

---

## Template Fields Explained

### Front Matter (YAML or JSON)

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Clear, active title | "How UTXOs Work" (not "Understanding UTXOs") |
| `stage` | Learning stage (0–8) | `3` |
| `reading_time` | Estimated time to complete | `"12 min"` |
| `difficulty` | Learner level | `"beginner" | "intermediate" | "advanced"` |
| `type` | Module category | `"canonical"` (single source of truth), `"bridge"` (connective), `"demo-companion"` (supports interactive) |
| `prerequisites` | Required prior knowledge | Array of `{title, link}` |
| `next_steps` | Suggested follow-ups | Array of `{title, link, type}` where `type` is `"hands-on"` or `"conceptual"` |
| `demo_link` | Relevant interactive demo | `"/interactive-demos/utxo-visualizer.html"` |
| `canonical_for` | Concepts this is the SSoT for | Array of strings matching `concepts.md` |
| `updated` | Last revision date | `"2025-10-20"` |

---

## Section Breakdown

### 1. **Prerequisites**
- Lists what learners should know before starting.
- Links to canonical modules for each prerequisite.
- Offers an escape hatch if they're not ready.

### 2. **Overview**
- Frames the *why* before the *what*.
- Motivates the concept with a problem or gap.
- Sets expectations for what's ahead.

### 3. **Core Concepts** (1–3 sections)
- Logical, sequential explanations.
- Short paragraphs, active voice, minimal jargon.
- Examples and analogies where helpful.

### 4. **Try It** (Interactive Demo)
- Direct link to a relevant demo.
- Framed as a challenge or experiment, not passive reading.
- 3–5 min max.

### 5. **Common Misconceptions**
- Preemptively addresses confusion.
- Uses ❌/✅ format for clarity.

### 6. **Key Takeaways**
- 3-5 bullet points summarizing the module.
- Declarative, confident statements.

### 7. **Checkpoint**
- 3-5 Socratic questions to test understanding.
- Not trivia—prompts that require synthesis.
- Optional link to answers or discussion.

### 8. **What's Next?**
- Two paths: one practical, one conceptual.
- Gives learners agency to choose their trajectory.

### 9. **Further Reading** (Optional)
- Links to whitepapers, BIPs, or technical resources.
- Clearly marked as optional deep dives.

### 10. **Feedback**
- Encourages contributions and corrections.
- Links to GitHub issues or PR workflow.

---

## Style Guidelines

### Voice & Tone
- **Direct, conversational, zero fluff.**
- **No jargon without immediate definition.**
- **Humor is fine; sarcasm is fine—but never at the expense of clarity.**

### Length
- **Canonical modules**: 10–15 min (800–1200 words)
- **Bridge modules**: 5–10 min (500–800 words)
- **Demo companions**: 5–8 min (400–600 words)

### Formatting
- **Short paragraphs** (2–4 sentences max).
- **Bold** for key terms on first use.
- **Code blocks** for technical examples (transactions, scripts, CLI commands).
- **Lists** over long prose when enumerating items.

### Links
- **Always link to canonical modules** instead of re-explaining.
- **Use descriptive link text** ("Learn about UTXOs" not "Click here").
- **Validate links quarterly** to prevent dead ends.

---

## When to Deviate

You can break this template if:
1. The module is experimental or exploratory (e.g., AI-agent-generated narratives).
2. The content is inherently non-linear (e.g., a choose-your-own-adventure scenario).
3. You have a compelling reason and document it in the module's front matter.

Otherwise, **stick to the template**. Consistency reduces cognitive load.

---

## Implementation Checklist

When creating or refactoring a module, verify:

- [ ] Front matter is complete and accurate
- [ ] Prerequisites link to canonical modules
- [ ] Next steps offer both practical and conceptual paths
- [ ] Interactive demo (if relevant) is linked prominently
- [ ] Common misconceptions section is present
- [ ] Checkpoint questions are Socratic, not trivial
- [ ] Reading time matches actual content length
- [ ] All links are valid
- [ ] Module is listed in `concepts.md` if it's canonical

---

## Example Modules

### Good Examples (to emulate)
- **Canonical**: Clear SSoT, well-structured, interactive demo integrated
- **Bridge**: Short, motivational, smooth transition between stages

### Bad Examples (to avoid)
- **Wall of text**: No headings, no breathing room
- **Jargon overload**: Assumes too much prior knowledge
- **No hands-on**: Pure theory with no way to experiment
- **Dead ends**: No clear "what's next"

---

**Last updated**: 2025-10-20
**Status**: v1.0 — Use for all new modules and refactors
