# Bitcoin Sovereign Academy — Restructure Checklist

**Purpose**: Step-by-step workflow to transform the current content into a coherent, de-duplicated, interactive learning system.

**Owner**: [Your name/team]
**Started**: 2025-10-20
**Target Completion**: [Set date]

---

## Phase 0: Preparation (Week 1)

### Setup
- [ ] Create a `restructure` branch in git
- [ ] Back up current site to `/archive/pre-restructure-2025-10-20/`
- [ ] Set up project management board (GitHub Projects, Notion, Trello, etc.)
- [ ] Assign owners for each phase (if team-based)

### Foundational Documents
- [x] Review `docs/concepts.md` — canonical concept index
- [x] Review `docs/bridges.md` — bridge module skeletons
- [x] Review `docs/module-template.md` — standardized structure
- [x] Review `docs/audit-template.csv` — content inventory

### Inventory
- [ ] Complete `docs/audit-template.csv` for ALL existing content
  - [ ] `/curriculum/` modules
  - [ ] `/modules/` content
  - [ ] `/educational-modules/` files
  - [ ] `/interactive-demos/` demos
  - [ ] `/paths/` learning paths
  - [ ] `/ai-agents/` narrative content
- [ ] Flag ALL redundancies in CSV
- [ ] Identify missing concepts (gaps in `concepts.md`)

---

## Phase 1: Canonicalization (Weeks 2-3)

### Goal
Establish single source of truth for each concept. Eliminate duplicates.

### Tasks

#### 1.1 Appoint Canonical Modules
- [ ] For each concept in `concepts.md`, identify the best existing module
- [ ] Mark chosen modules as `type: canonical` in front matter
- [ ] Update `concepts.md` with correct paths to canonical modules

#### 1.2 Merge or Delete Duplicates
- [ ] For each redundant module flagged in audit CSV:
  - [ ] Compare quality, clarity, and integration with demos
  - [ ] Keep the best; delete or archive the rest
  - [ ] Add redirects (301) for deleted URLs if site is already live
  - [ ] Update all internal links pointing to deleted modules

#### 1.3 Add Front Matter to Canonical Modules
- [ ] For each canonical module, add complete YAML/JSON front matter:
  - [ ] `title`, `stage`, `reading_time`, `difficulty`, `type`
  - [ ] `prerequisites` (with links)
  - [ ] `next_steps` (with links, both practical and conceptual)
  - [ ] `demo_link` (if relevant)
  - [ ] `canonical_for` (list of concepts)
  - [ ] `updated` (today's date)

#### 1.4 Create Missing Canonical Modules
- [ ] Identify concepts in `concepts.md` marked TBD (no existing module)
- [ ] Create new modules using `docs/module-template.md`
- [ ] Prioritize high-impact concepts first (e.g., UTXO, hashing, consensus)

---

## Phase 2: Bridge Building (Week 4)

### Goal
Fill conceptual gaps between stages with short, motivational bridges.

### Tasks

#### 2.1 Flesh Out Bridge Skeletons
- [ ] Bridge 0→1: Money to Math
- [ ] Bridge 1→2: Cryptography to Consensus
- [ ] Bridge 2→3: Consensus to Mechanics
- [ ] Bridge 3→4: Mechanics to Network Security
- [ ] Bridge 4→5: L1 to L2 (Lightning)
- [ ] Bridge 5→6: Protocol to Practice (Self-Custody)
- [ ] Bridge 6→7: User to Builder (optional)
- [ ] Bridge 7→8: Tech to Philosophy

#### 2.2 Test Bridge Flow
- [ ] Walk through each stage progression yourself
- [ ] Ask: "Does the jump feel smooth? Or jarring?"
- [ ] Revise bridges based on feedback
- [ ] Ensure each bridge is 5-10 min max

---

## Phase 3: Demo Integration (Week 5)

### Goal
Wire every interactive demo directly into the curriculum flow.

### Tasks

#### 3.1 Audit Existing Demos
- [ ] List all demos from `/interactive-demos/`
- [ ] Note which are standalone vs. curriculum-integrated
- [ ] Identify demos that need companion modules

#### 3.2 Create Demo Companion Modules
- [ ] For each demo without a companion:
  - [ ] Create a short (5-8 min) module using `module-template.md`
  - [ ] Explain what the demo shows and why it matters
  - [ ] Add a "Try It" section with 3-5 challenge prompts
  - [ ] Link demo → module and module → demo (bidirectional)

#### 3.3 Embed Demos in Canonical Modules
- [ ] For each canonical module:
  - [ ] Identify relevant demo (if any)
  - [ ] Add "🎯 Try It" section near the inflection point
  - [ ] Frame as a challenge, not passive viewing
  - [ ] Ensure demo link is prominent (button or callout)

#### 3.4 Deprecate Obsolete Demos
- [ ] Archive old demo versions (e.g., `utxo-visualizer.html` → archive)
- [ ] Add redirects to enhanced versions
- [ ] Update all links pointing to old demos

---

## Phase 4: Redundancy Elimination (Week 6)

### Goal
Cut duplicated explanations. Replace with short recaps + links to canonical.

### Tasks

#### 4.1 Identify Duplicated Text
- [ ] Use grep/search to find repeated phrases (e.g., "UTXO stands for")
- [ ] Flag modules that re-explain concepts covered elsewhere

#### 4.2 Replace Duplicates with Recaps
- [ ] For each duplicate:
  - [ ] Replace with 1-sentence recap
  - [ ] Link to canonical module
  - [ ] Format as blockquote or callout for visibility

**Example**:
```markdown
> **Quick recap**: UTXOs are Bitcoin's "coin" model—discrete outputs locked to specific conditions. [Read the full explanation →](/stage-3/utxo-model.html)
```

#### 4.3 Add "In Short" Summaries to Canonical Modules
- [ ] At the top of each canonical module, add a 1-2 sentence "In short" summary
- [ ] This makes it easy for other modules to link to without repeating

---

## Phase 5: Structure & Navigation (Week 7)

### Goal
Ensure every module has clear prerequisites, next steps, and stage context.

### Tasks

#### 5.1 Add Prerequisites to All Modules
- [ ] For each module, identify required prior knowledge
- [ ] List prerequisites with links at the top
- [ ] Offer escape hatch: "Not ready? Start with [X]"

#### 5.2 Add Next Steps to All Modules
- [ ] For each module, identify 2 next steps:
  - [ ] One practical (hands-on, demo, or tool)
  - [ ] One conceptual (deeper theory or related topic)
- [ ] Format as clear CTAs at the bottom

#### 5.3 Create Stage Overviews
- [ ] For each stage (0-8), create a landing page:
  - [ ] Stage goal (1 sentence)
  - [ ] What you'll learn (3-5 bullets)
  - [ ] Time to complete (estimated)
  - [ ] List of modules in stage (with links)
  - [ ] Completion badge/milestone

#### 5.4 Build Navigation Menus
- [ ] Update main navigation to reflect stages
- [ ] Add breadcrumbs: Stage X > Module Y
- [ ] Add progress indicators (optional: X% complete)

---

## Phase 6: Editorial Pass (Week 8)

### Goal
Polish tone, clarity, and consistency across all modules.

### Tasks

#### 6.1 Apply Style Guidelines
- [ ] Short sentences (no walls of text)
- [ ] Active voice
- [ ] Define jargon immediately
- [ ] Replace "you should understand" with "you now understand"
- [ ] Remove unnecessary adverbs, hedging, and fluff

#### 6.2 Add Socratic Prompts
- [ ] For each module, add 1-2 Socratic questions mid-content
- [ ] Format as blockquotes or callouts
- [ ] Not trivia—prompts that deepen understanding

**Example**:
> 🤔 **Think about this**: If fees go to zero, what economic incentive do miners have to secure blocks?

#### 6.3 Normalize Formatting
- [ ] Consistent heading hierarchy (H1 for title, H2 for sections, H3 for subsections)
- [ ] Bold key terms on first use
- [ ] Code blocks for technical examples (transactions, scripts, CLI)
- [ ] Lists over long prose when enumerating

#### 6.4 Add Reading-Time Badges
- [ ] Calculate reading time for each module (use tool or manual estimate)
- [ ] Add badge at top: "⏱️ 12 min"

---

## Phase 7: Testing & QA (Week 9)

### Goal
Validate links, test flow, gather feedback from fresh learners.

### Tasks

#### 7.1 Link Validation
- [ ] Run automated link checker on all modules
- [ ] Fix broken links
- [ ] Add redirects for moved content

#### 7.2 Flow Testing
- [ ] Walk through each learning path (Curious, Builder, Sovereign)
- [ ] Test: Can a beginner navigate without getting lost?
- [ ] Test: Are bridges smooth? Or do they feel forced?
- [ ] Test: Do demos load and function correctly?

#### 7.3 User Testing
- [ ] Recruit 3-5 fresh learners (no prior Bitcoin knowledge)
- [ ] Ask them to complete Stage 0 → Stage 1
- [ ] Note where they get stuck, confused, or bored
- [ ] Revise modules based on feedback

#### 7.4 Analytics Setup (Optional)
- [ ] Add light tracking: page views, time on page, exit points
- [ ] Identify drop-off points (candidates for bridges or simplification)
- [ ] Set up heatmaps or session recordings (optional)

---

## Phase 8: Launch Prep (Week 10)

### Goal
Finalize, merge, and deploy the restructured curriculum.

### Tasks

#### 8.1 Final Review
- [ ] Re-read `concepts.md` — is every concept mapped?
- [ ] Re-read `bridges.md` — are all bridges implemented?
- [ ] Re-check module front matter — complete and accurate?
- [ ] Spot-check 5 random modules for quality

#### 8.2 Merge to Main
- [ ] Run final tests on `restructure` branch
- [ ] Create pull request with detailed summary
- [ ] Request reviews from team/stakeholders (if applicable)
- [ ] Merge to `main`

#### 8.3 Deploy
- [ ] Deploy to staging environment
- [ ] Test on staging (full QA pass)
- [ ] Deploy to production
- [ ] Monitor for errors (404s, broken demos, etc.)

#### 8.4 Announce
- [ ] Write launch announcement (blog post, social media, newsletter)
- [ ] Highlight new features: stage progression, interactive demos, bridges
- [ ] Encourage feedback and contributions

---

## Phase 9: Maintenance & Iteration (Ongoing)

### Goal
Keep content fresh, accurate, and aligned with curriculum goals.

### Tasks

#### 9.1 Quarterly Reviews
- [ ] Every 3 months: review `concepts.md` for drift
- [ ] Update stale modules (Bitcoin upgrades, new tools, etc.)
- [ ] Re-validate all links

#### 9.2 Analytics Review
- [ ] Monthly: check drop-off points
- [ ] Investigate high-exit modules (consider adding bridges or simplifying)
- [ ] Celebrate high-engagement modules (promote them more)

#### 9.3 Community Contributions
- [ ] Set up contribution guidelines (`CONTRIBUTING.md`)
- [ ] Triage issues and PRs regularly
- [ ] Reward high-quality contributions (acknowledgments, certificates, etc.)

#### 9.4 Add New Content
- [ ] As Bitcoin evolves (new BIPs, tools, scaling solutions):
  - [ ] Add new canonical modules
  - [ ] Update existing modules
  - [ ] Create new demos or update existing ones

---

## Progress Tracker

| Phase | Status | Owner | Start Date | End Date | Notes |
|-------|--------|-------|------------|----------|-------|
| 0: Preparation | Not Started | | | | |
| 1: Canonicalization | Not Started | | | | |
| 2: Bridge Building | Not Started | | | | |
| 3: Demo Integration | Not Started | | | | |
| 4: Redundancy Elimination | Not Started | | | | |
| 5: Structure & Navigation | Not Started | | | | |
| 6: Editorial Pass | Not Started | | | | |
| 7: Testing & QA | Not Started | | | | |
| 8: Launch Prep | Not Started | | | | |
| 9: Maintenance (Ongoing) | Not Started | | | | |

---

## Using Claude to Implement

You can delegate mechanical tasks to Claude (or other AI assistants) to speed up execution:

### What Claude Can Do
1. **Add front matter to modules**:
   - Provide Claude with the module file and `module-template.md`
   - Ask Claude to add complete YAML/JSON front matter
2. **Replace duplicated text with recaps**:
   - Identify duplicates via grep or manual flagging
   - Ask Claude to replace with 1-sentence recap + link
3. **Normalize formatting**:
   - Pass a module to Claude with style guidelines
   - Ask Claude to reformat (headings, lists, bold key terms, etc.)
4. **Validate links**:
   - Pass list of links to Claude
   - Ask Claude to identify dead or broken links
5. **Generate bridge content**:
   - Provide Claude with bridge skeleton from `bridges.md`
   - Ask Claude to flesh out with 500-800 words

### What You Should Do
1. **Strategic decisions**:
   - Which module is canonical?
   - What concepts are missing?
   - How should stages be structured?
2. **Quality control**:
   - Review Claude's output before committing
   - Ensure voice and tone match your style
   - Test links, demos, and flows yourself
3. **User feedback**:
   - Recruit fresh learners for testing
   - Interpret analytics and drop-off data
   - Prioritize improvements based on real usage

### Suggested PR Template
When using Claude to implement changes, use this PR template:

```markdown
## Summary
- Module(s) touched: [list]
- Action: keep / merge / split / delete / rewrite
- Concepts covered (canonical links): [list]

## Structure
- Prerequisites added: [Yes/No + links]
- Next steps added: [Yes/No + links]
- "Try It" demo link: [Yes/No + link]

## Redundancy Removal
- Replaced duplicated text in: [list modules]
- Added recap+link lines: [Yes/No]

## QA
- Links validated: [Yes/No]
- Reading-time badge present: [Yes/No]
- Socratic prompts (count): [X]

## Notes
[Any context, decisions, or open questions]
```

---

## Communication Plan

### Weekly Standups (if team-based)
- [ ] What was completed this week?
- [ ] What's blocked or delayed?
- [ ] What's the focus for next week?

### Stakeholder Updates (if applicable)
- [ ] After Phase 1: Share canonicalization progress
- [ ] After Phase 3: Demo integration preview
- [ ] After Phase 7: QA results and launch timeline

### Community Updates (if public)
- [ ] Announce restructure project and timeline
- [ ] Share progress updates (e.g., "Stage 0-2 now live!")
- [ ] Invite feedback on beta/staging site

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep (adding too much new content) | High | Stick to restructure goals; defer new features to Phase 9 |
| Breaking existing links (if site is live) | High | Add 301 redirects; test thoroughly before deploying |
| Losing team momentum | Medium | Set realistic deadlines; celebrate milestones |
| Poor user feedback (confusing flow) | Medium | Test early (Phase 7); iterate quickly |
| Claude introduces errors in bulk edits | Medium | Review all AI-generated changes before committing |

---

## Success Metrics

After launch, track these to measure success:

- [ ] **Completion rate**: % of learners who finish Stage 0 → Stage 3
- [ ] **Drop-off points**: Where learners exit (should decrease post-restructure)
- [ ] **Demo engagement**: % of learners who click "Try It" buttons
- [ ] **Feedback sentiment**: Positive vs. negative user comments
- [ ] **Link health**: 0 broken links after 1 month
- [ ] **Content duplication**: Reduced by 50%+

---

## Resources

- [Bitcoin Sovereign Academy GitHub](your-repo-link)
- [docs/concepts.md](./concepts.md)
- [docs/bridges.md](./bridges.md)
- [docs/module-template.md](./module-template.md)
- [docs/audit-template.csv](./audit-template.csv)

---

**Last updated**: 2025-10-20
**Status**: Ready for execution
**Owner**: [Your name]
