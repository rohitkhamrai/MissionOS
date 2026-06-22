# Project Brain

## What This Is

Project Brain is a persistent intelligence layer for AI-powered software development. It continuously builds, maintains, and evolves a compressed understanding of the codebase in the `brain/` directory to act as long-term memory for AI agents, allowing them to follow established patterns, avoid previous mistakes, and maintain architectural consistency across sessions.

## Core Value

Continuously build, maintain, and evolve a compressed, high-fidelity project understanding to reduce token waste by 70-95% and ensure architectural consistency.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Set up directory structure: `brain/`, `skills/`, `workflows/`, `source-code/`
- [ ] Create templates for all `brain/` files: `master-memory.md`, `memory.md`, `architecture.md`, `patterns.md`, `decisions.md`, `mistakes.md`, `roadmap.md`, `glossary.md`, `dependency-graph.md`, `feature-map.md`
- [ ] Implement `Memory Agent` as an Antigravity/Gemini skill (Python script) to parse agent task outputs and auto-update `memory.md`, `patterns.md`, `decisions.md`, `mistakes.md`, and `master-memory.md`
- [ ] Create integration test harness to verify the Python Memory Agent successfully updates memory documents

### Out of Scope

- Phase 2 (Multi-Agent Coordination) — Deferred to later phase
- Phase 3 (Automatic Knowledge Extraction) — Deferred to later phase
- Phase 4 (Autonomous Refactoring) — Deferred to later phase
- Phase 5 (Self-Improving Engineering Teams) — Deferred to later phase

## Context

- Target ecosystem: Google Antigravity / Gemini CLI runtimes
- Executable agents: Python scripts packaged as local skills in `.agents/skills`
- Initial project space is greenfield (located at `c:\Users\rohit\New folder (3)`)

## Constraints

- **Tech Stack**: Python — Must use Python for memory parsing and agent automation scripts
- **Agent Integration**: Antigravity/Gemini Skills — Custom skills structure mapped in `.agents/skills`
- **Master Memory Budget**: Word limit under 5,000 words to optimize token usage

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Python for agent scripting | User preference for core implementation language | — Pending |
| Implement agents as Antigravity/Gemini skills | Integrates natively with the current environment | — Pending |
| Limit Phase 1 to static structure & Memory Agent | Provides the foundational memory layer before multi-agent orchestration | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone**:
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-22 after initialization*
