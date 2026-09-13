# CLAUDE.md — Bitcoin Sovereign Academy

Bitcoin Sovereign Academy (BSA) is a sibling academy under The Sovereign Academy (TSA). This repository owns BSA's live Bitcoin education product and its domain-specific implementation.

## Authority

TSA-wide governance lives in the TSA Core repository. Read `TSA-CANONICAL.md` there first when institutional authority matters.

When instructions conflict, use this order:

1. Dalia's current explicit instruction.
2. Product- or project-specific BSA rules.
3. BSA-specific rules in this repository.
4. TSA-wide rules.
5. Historical or archive material.

BSA may specialize TSA-wide rules where Bitcoin education genuinely requires it. Overrides must be deliberate, narrow, and documented. Historical material never creates a current instruction merely because it exists.

## What BSA is

BSA teaches Bitcoin understanding, decision-making, security, custody, inheritance, and related Bitcoin-specific topics.

BSA is not the definition of TSA. Bitcoin-specific rules do not automatically govern FSA, ESA, or future academies.

BSA should help learners understand Bitcoin systems, tradeoffs, risks, verification, custody choices, and implementation boundaries without turning Bitcoin into a predetermined conclusion.

## Educational and commercial boundaries

Core understanding should remain freely accessible.

BSA may charge for implementation, tools, kits, diagnostics, templates, workshops, specialized analysis, training, convenience, professional services, and other value beyond the freely accessible core understanding.

Do not present educational content as personalized legal, tax, investment, custody, estate, or other professional advice. When a learner needs individualized professional judgment or implementation, make that boundary clear.

Bitcoin-versus-crypto clarity is BSA-specific. Do not silently export that domain rule into other TSA academies.

## Product and repo behavior

This repository is the live BSA development repository. Keep BSA-specific product rules, code, tests, content, deployment configuration, and active implementation context here.

Do not assume BSA must share one engine, pedagogy, workflow, funnel, ontology, monetization model, or technology stack with other TSA academies.

Use the simplest process capable of producing a trustworthy result at the appropriate level of risk. Quality controls should be proportional to risk, consequence, uncertainty, and audience.

Important claims should be sourced appropriately. Collect and store only information genuinely necessary for the product or service.

## Design

BSA inherits TSA's shared design principles while retaining its established Bitcoin-specific visual identity, including its existing color language and domain imagery.

Do not redesign BSA merely to make it visually identical to another academy. Shared family principles and academy identity should coexist.

## Current technical orientation

- Live site: `bitcoinsovereign.academy`
- Frontend: primarily static HTML/CSS/JS
- Serverless functions: `api/`
- Deployment: Vercel from the production branch
- Tests and repo-specific commands: follow `package.json`, current test files, and active technical documentation in this repository

Before claiming something is shipped, verify the remote production branch and the live result rather than relying on local state alone.

## Active-work rule

Do not treat old plans, phase notes, archived specs, previous funnels, prior monetization assumptions, or historical project context as current merely because they remain in the repository.

For current work, prefer the active product specification, current code, current branch state, and Dalia's latest instruction.
