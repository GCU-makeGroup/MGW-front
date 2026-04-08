---
name: feature-delivery
description: Use this when implementing a new feature or meaningful behavior change that should go through planning, implementation, review, testing, and documentation. Do not use it for docs-only or trivial one-line edits.
---

# Feature Delivery

Purpose:
Deliver a feature from requirement to implementation-ready summary without losing screen-level documentation context.

Workflow:
1. Clarify the requested behavior.
2. Identify the target screen or flow.
3. Gather `docs/<screen>/flow.md`, `docs/<screen>/design`, and `docs/<screen>/api` references.
4. Break the work into UI, logic, reusable component boundaries, validation, and documentation needs.
5. Delegate to the appropriate agents with explicit doc paths and done criteria.
6. Plan work on a screen-based branch and commit in feature-sized slices.
7. Keep backend response changes in mind when wiring API-related behavior.
8. Review for correctness, regressions, and doc alignment.
9. Validate the changed flow.
10. Update docs if behavior or workflow changed.
11. Get user confirmation before recommending PR creation for the screen.
12. Produce a final delivery summary.

Final summary format:
- What changed
- Target screen or flow
- Docs used
- Changed files
- Validation performed
- Remaining risks
- PR readiness
