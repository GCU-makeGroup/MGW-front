---
name: plan-first
description: Use this when a request is ambiguous, broad, or likely to require multiple steps or agents. Do not use it for tiny direct fixes with fully clear scope.
---

# Plan First

Purpose:
Create a concrete execution plan before implementation starts.

Workflow:
1. Restate the goal in plain language.
2. Identify the target screen or flow.
3. Check whether the relevant `docs/<screen>/flow.md`, `docs/<screen>/design`, and `docs/<screen>/api` references exist.
4. Identify missing requirements, missing docs, or ambiguities.
5. Ask the minimum necessary clarifying questions.
6. Propose a scoped implementation plan, including component hierarchy and reusable vs screen-local boundaries.
7. Identify the screen-based branch scope and likely feature-sized commit boundaries.
8. Identify which agents should be involved and what context each needs.
9. Define what "done" means.
10. Define how the result should be validated.

Output format:
- Goal
- Target screen or flow
- Docs status
- Open questions
- Proposed plan
- Assigned agents
- Done criteria
- Validation plan
