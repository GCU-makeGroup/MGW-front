# AGENTS.md

## Core rule

* This repository is for the Gachon Group frontend.
* The user communicates primarily with the `pm-tech-lead` agent.
* `pm-tech-lead` owns clarification, planning, delegation, integration, validation coordination, and final synthesis.
* Implement from project docs, not from agent interpretation.

## Source of truth

* Screen work is organized under `docs/<screen>/`.
* Use these files in this order:
  * `docs/<screen>/flow.md`
  * `docs/<screen>/design`
  * `docs/<screen>/api`
* `flow.md` defines the intended screen flow.
* The PNG order inside `docs/<screen>/design` is part of the flow context and must be read together with `flow.md`.
* `docs/<screen>/design` is the visual source of truth for layout, spacing, typography, hierarchy, section order, and responsive intent.
* `docs/<screen>/api` is the contract source of truth for request and response structure, loading states, empty states, success states, and error handling.
* If required docs are missing or contradictory, stop and escalate instead of guessing.

## Working method

* Start by identifying the target screen or flow.
* Gather the matching doc paths before implementation or delegation.
* Every delegated task should include:
  * target screen or feature
  * relevant doc paths
  * current implementation context
  * assumptions or open questions
  * done criteria
  * validation targets
* Use sub-agents actively when scopes are independent.
* Keep changes focused on the requested screen, flow, or bug.
* Preserve existing working behavior unless the docs or request explicitly require change.

## Git and delivery rules

* Branch by screen.
* Commit by feature-sized logical unit.
* A screen branch may contain multiple focused commits when the work naturally breaks into UI, behavior, docs, or fix slices.
* Follow the repository commit format from `README.md`: `[#이슈번호] <커밋 유형> : <커밋 메세지>`.
* Use Korean for the commit summary and lowercase English for the commit type.
* Allowed commit types: `feat`, `fix`, `style`, `docs`, `refactor`, `chore`.
* Before opening a PR for a screen, get user confirmation first.
* PRs are created per screen, after implementation, review, and validation are ready.

## Implementation rules

* UI work must follow `docs/<screen>/design` closely and must not invent a new visual direction without explicit instruction.
* API work must follow `docs/<screen>/api`, but be implemented with future backend wiring in mind because response shapes may change.
* Prefer integration points that are easy to adapt later:
  * keep API access isolated
  * avoid scattering response-shape assumptions across many components
  * surface contract mismatches clearly
* When UI depends on API states, cover loading, empty, success, and error behavior explicitly.
* If responsive behavior is unclear, derive the closest reasonable behavior from the docs and call out the assumption.

## Code convention

* Follow the React Clean Component Convention defined in `README.md`.
* Break each screen into a clear component hierarchy before implementation.
* Keep render pure and keep side effects out of render.
* Each piece of shared state must have a single owner.
* Define components at module top-level, not inside other components.
* Separate screen orchestration from reusable UI.
* Isolate API response mapping near the API layer so backend response changes do not ripple through the UI.
* Use explicit TypeScript contracts for props, API DTOs, and view models. Avoid `any` unless there is a temporary migration reason.

## Validation rules

* Do not mark work complete without a validation summary.
* Run or describe relevant validation for every change.
* Run `pnpm lint` before calling implementation complete when code changed.
* For UI changes, validate against `docs/<screen>/flow.md` and `docs/<screen>/design`, including responsive behavior and remaining visual gaps.
* For behavior or API changes, validate against `docs/<screen>/api` and call out anything still assumed or unverified.
* Every completion summary should include:
  * what changed
  * which docs were used
  * how it was validated
  * known gaps, risks, or follow-up items

## Agent roles

* `pm-tech-lead`: map the request to screen docs, plan the work, enforce the code convention, delegate, integrate results, and ask for PR approval.
* `ui-builder`: implement UI from `flow.md` and `design` while extracting reusable pure components cleanly.
* `feature-builder`: implement behavior and API integration from `flow.md` and `api`, with future backend response changes in mind.
* `reviewer`: check correctness, regression risk, code convention violations, and mismatches between implementation and docs.
* `qa-tester`: verify the implemented flow against `flow.md`, `design`, and `api`.
* `docs-writer`: keep README, AGENTS, and workflow docs aligned with the current project process.
