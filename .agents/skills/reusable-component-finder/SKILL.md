---
name: reusable-component-finder
description: Check whether an existing component can be reused or extended before creating a new one. Use before building new UI sections or page components.
---

# Purpose

Use this skill to reduce duplication and protect system consistency.

# Inputs

Requested component or feature: $0

# What to do

1. Search the codebase for existing components that solve a similar need.
2. Compare:
   - current purpose
   - props and flexibility
   - visual similarity
   - extension effort versus creating new

3. Recommend one of these:
   - reuse as is
   - extend existing component
   - create a new component

4. If extending is best, explain how.
5. If creating new is best, explain why reuse would be wrong.

# Output requirements

Return:
- candidate components
- recommendation
- reasoning
- implementation path

# Quality bar

Favor clean reuse, but do not force it when it would make the system worse.
