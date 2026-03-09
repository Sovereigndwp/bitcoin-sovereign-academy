---
name: build-lesson-page
description: Build a new educational lesson page for the platform. Use when creating a lesson, module page, or concept page from scratch and you want strong structure, reusable sections, and learner friendly flow.
---

# Purpose

Use this skill to create a new lesson page that is clear, practical, structured, and aligned with the platform's educational standards.

# Inputs

Use the arguments if provided.

Topic: $0
Audience: $1
Goal: $2

If arguments are missing, infer them from the user's prompt and ask only if absolutely necessary.

# What to do

1. First identify:
   - who the lesson is for
   - what concept it teaches
   - what the learner should understand or do by the end

2. Propose the lesson structure before implementation.

3. Build the page using a logical teaching flow:
   - headline
   - simple orientation
   - core problem or concept
   - why it matters
   - practical example
   - tradeoffs or common mistake
   - clear next step

4. Prefer reusable components over one off sections.

5. Keep the page beginner friendly, skimmable, and mobile aware.

6. If this is for Bitcoin Sovereign Academy:
   - stay Bitcoin specific
   - avoid generic crypto framing
   - use practical real world examples

7. If this is for Financially Sovereign Academy:
   - prioritize real life money decisions
   - avoid shame, preachy language, or abstract finance theory

# Output requirements

Return:
- proposed section structure
- files to create or edit
- implementation notes
- final page copy or component plan as requested

# Quality bar

The result should be:
- clear
- non repetitive
- practical
- reusable
- aligned with project rules
