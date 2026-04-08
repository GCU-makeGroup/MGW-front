---
name: bug-triage
description: Use this when diagnosing an error, regression, unexpected behavior, or failing flow. Do not use it for feature ideation or roadmap planning.
---

# Bug Triage

Purpose:
Diagnose a bug against the current implementation and the relevant screen docs, then identify the smallest safe fix.

Workflow:
1. Describe the observed issue.
2. Identify the target screen or flow.
3. Gather the relevant `docs/<screen>/flow.md`, `docs/<screen>/design`, and `docs/<screen>/api` references.
4. Identify how to reproduce the issue.
5. List likely causes in priority order.
6. Identify the smallest coherent fix.
7. Note regression risks and any doc mismatches.
8. Define targeted validation steps.

Output format:
- Observed issue
- Target screen or flow
- Docs used
- Reproduction steps
- Likely causes
- Proposed fix
- Regression risks
- Validation steps
