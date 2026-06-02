# Disclosure & Methodology

### Who wrote this, what data it draws on, what limitations it carries, and what conflicts of interest the reader should know.

*The Sovereign Academy · v4 · May 2026*

---

## About the author and publisher

**Author.** Dalia, founder of The Sovereign Academy and Bitcoin Sovereign Academy. Bitcoin educator, researcher, and curriculum architect. Authored the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin). Advises at The Bitcoin Adviser. Runs Financially Sovereign Academy as a sister project.

**Publisher.** **The Sovereign Academy** — the publication entity at `thesovereign.academy`.

**Bitcoin Sovereign Academy (BSA)** — the Bitcoin-focused content area at `bitcoinsovereign.academy`. This deep dive is published under BSA's `/deep-dives/foundational-layer-thesis/` path.

[FILL IN: any additional credentials, affiliations, or institutional roles relevant to the reader's assessment.]

---

## Conflicts of interest

The reader is owed a clear statement of conflicts. Where placeholders appear, complete them before publishing.

**Bitcoin holdings.** [FILL IN: do you hold BTC personally? Approximate threshold ("none," "<$10K," ">$10K," etc.) is enough — exact figures are not required.]

**Affiliations with protocols mentioned in this deep dive.** [FILL IN: any equity, advisory, paid relationships, or material connection with: Lightning Labs, Tether, Boltz, Strike, Lightspark, Blockstream, Citrea, Botanix, Stacks, Ark Labs, Fedimint, Spark, Anchorage, Coinbase, BlackRock, or any other entity discussed. List "none" if none apply.]

**Commercial relationships.** [FILL IN: paid speaking, consulting, advisory, or sponsorship relationships with any party that could be affected by the thesis. List "none" if none apply.]

**The Bitcoin Adviser.** Dalia advises at The Bitcoin Adviser (collaborative 2-of-3 multisig service). This is disclosed because the deep dive's "for individual savers" guidance touches on custody architecture relevant to that service's offering.

**Financially Sovereign Academy.** Dalia's sister project, mission-driven and not monetized. No commercial conflict applies.

**No paid sponsorship for this deep dive.** This deep dive was not commissioned, funded, or reviewed by any third party prior to publication.

---

## Methodology

### Source tier system

Every claim in the deep dive is tagged inline by source tier so readers can judge the evidence quality independently:

- **`[DEV]`** — primary developer source. GitHub repositories, project blogs, BIPs, Optech newsletters, official documentation, conference talks by core developers, mailing-list archives. Highest tier of evidence for technical claims.
- **`[DATA]`** — on-chain or public-dashboard data. mempool.space, Bitcoin Visuals, DefiLlama, CoinGecko, Glassnode, 1ML, Hashrate Index. Highest tier of evidence for adoption claims.
- **`[INST]`** — institutional research. Messari, Galaxy, Coinbase Institutional Research, Chainalysis, Coin Metrics, Spark Money research. Mid-high tier; institutional analysts have access to data + relationships that retail analysts lack.
- **`[PRESS]`** — reputable secondary press. Bitcoin Magazine, The Block, Decrypt, CoinDesk, Blockworks. Mid tier; useful for narrative context, less authoritative for technical or adoption claims.
- **`[PROJ]`** — project communication. Founder threads, press releases, announcement posts. Useful for product/launch status; biased toward the project's framing.
- **`[ANEC]`** — community report. Podcasts, community blogs, anecdotal observations. Weakest tier; flagged inline when used.

When a single claim has multiple sources at different tiers, the strongest tier is listed first.

### Data freshness

This v3 deep dive draws on data as recent as May 17, 2026. Older data points are dated explicitly. Where 2025 data is used (e.g., Tron's $7.9T USDT volume in 2025), the calendar period is identified.

### Limitations

**Where the analysis is weak:**

- **Lightning private-channel volume** is estimated using public methodologies (Lightning Labs, Bitcoin Visuals) but the actual private flow is not directly observable. Public capacity (5,637 BTC, December 2025 high) is firm; total network volume is estimated.
- **Botanix and Spark TVL** are not consistently reported on DefiLlama at the granularity Ethereum L2s use. Their volume claims rely more heavily on `[PROJ]` and `[PRESS]` than the analyst would prefer.
- **Boltz and Liquid USDT swap volumes** at the corridor level are unavailable; aggregate volumes are available.
- **Tron corridor-level USDT flow data** is similarly imperfect; Chainalysis country reports provide the strongest public estimates.
- **Quantum probability bands** are wide and inherently speculative. They draw on IBM, Google, and academic estimates of quantum hardware progress, plus Bitcoin community estimates of soft-fork timing. They should be read as analytical ranges, not predictions.
- **Regulatory deep-dive** relies on published regulatory text (GENIUS Act, MiCA, FinCEN proposed rules) plus secondary legal analysis. Enforcement actions and case-law are still evolving in 2026.

**Where the analysis is strong:**

- The six-layer Bitcoin stack ontology is a structural argument that does not depend on volatile data points.
- The three-patterns-of-connection frame (settlement anchor, dollar access carrier, settlement reference where exit rights are real) is architecture-level reasoning.
- The five-front Counter-Map names specific incumbents and specific structural advantages — these are stable claims that survive short-term volatility.
- The 17-falsifier framework is the discipline that makes the rest of the thesis testable.

---

## Review cadence

**Quarterly falsifier reviews.** Public post on The Sovereign Academy in March, June, September, December. Each review covers all 17 falsifiers with current data, methodology notes, and any threshold changes.

**Annual deep review.** Long-form post in January each year reassessing whether the thesis still holds, what has surprised us, what new evidence has emerged.

**Triggered reviews.** Any single falsifier firing triggers an out-of-cycle post within 14 days explaining what happened and what it means for the rest of the framework.

**Methodology immutability rule.** Once a falsifier's measurement source and threshold are committed in a quarterly update, they cannot be revised downward to save the thesis. Methodology revisions must be conservative (tightening) and disclosed.

**Version history.** All quarterly snapshots are kept in a versioned public registry. v1, v2, v2.1, and v3 of the deep dive are all retained — superseded versions are archived but not deleted, so the evolution of the thesis is auditable.

---

## What this document is NOT

**Not financial advice.** This deep dive is research and analysis, not a recommendation to buy, sell, or hold Bitcoin or any of the protocols discussed. Readers are responsible for their own investment, custody, and risk decisions.

**Not legal advice.** The regulatory deep-dive companion describes the current and emerging regulatory landscape. It is not legal counsel. Readers in any jurisdiction discussed should consult qualified counsel before relying on regulatory interpretations.

**Not tax advice.** Cross-border crypto activities trigger complex tax obligations that vary by jurisdiction. This deep dive does not address tax. Consult a qualified tax professional.

**Not technical-security advice for high-value custody.** The Field Guide describes the trust models of various protocols. For high-value self-custody (>$50K or >5% of net worth), engage a qualified Bitcoin security advisor before configuring any wallet or multisig setup.

**Not maximalism.** This deep dive explicitly cedes six of nine major fronts to other chains over a 5-year horizon. Readers seeking Bitcoin-or-nothing arguments are pointed to the [Cypherpunk Maximalist thesis](competing-theses.md#cypherpunk-maximalist) as the more honest representation of that position.

---

## Corrections, criticism, and feedback

This deep dive will improve faster if readers find errors and weak arguments and report them. To submit:

- **Factual errors:** [FILL IN: email or form link, e.g., `corrections@thesovereign.academy`]
- **Methodological challenges:** [FILL IN: same channel or separate]
- **Source disputes (claim X cites source Y, but source Y actually says Z):** [FILL IN: same channel]

All corrections received before the next quarterly review will be considered and, where validated, integrated into the next version with attribution to the reporting reader (unless the reader requests anonymity).

The strongest critiques of any earlier version are logged in the methodology trail. v3 specifically incorporates red-team feedback that flagged: the original v1 thesis underweighted Tron, overstated Citrea adoption, treated Solana as a single competitor when the landscape is five-front, omitted regulatory and quantum risk, and lacked correlated-failure analysis. Future versions will integrate analogous corrections as they arrive.

---

## License and republication

[FILL IN: chosen license, e.g., Creative Commons BY-SA 4.0, all rights reserved, etc.]

Republication of excerpts with attribution is encouraged. Republication of the full deep dive without attribution or with material edits is not permitted unless agreed in writing.

---

*Published May 2026 as part of v3 of "Bitcoin Is No Longer Just the Foundational Layer." Disclosure version 1.0. Last updated [FILL IN: date]. Conflicts and methodology will be re-reviewed at each quarterly falsifier review.*
