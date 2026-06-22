# Requirements: Project Brain

**Defined:** 2026-06-22
**Core Value:** Continuously build, maintain, and evolve a compressed, high-fidelity project understanding to reduce token waste by 70-95% and ensure architectural consistency.

## v1 Requirements

### Directory & Templates

- [x] **DIR-01**: Initialize directory structure (`brain/`, `skills/`, `workflows/`, `source-code/`)
- [x] **DIR-02**: Seed `master-memory.md` with high-level architecture, decisions, and patterns snapshots
- [x] **DIR-03**: Seed `memory.md` with core project metadata, goals, and active work statuses
- [x] **DIR-04**: Seed `architecture.md` with design system, backend/frontend layouts, and data flows
- [x] **DIR-05**: Seed `patterns.md` with standard implementation patterns and code templates
- [x] **DIR-06**: Seed `decisions.md` with log table of architecture and tooling decisions
- [x] **DIR-07**: Seed `mistakes.md` with logs of resolved/prevented pitfalls and lessons learned
- [x] **DIR-08**: Seed remaining files (`roadmap.md`, `glossary.md`, `dependency-graph.md`, `feature-map.md`)

### Memory Agent

- [x] **AGT-01**: Implement Python script `memory_agent.py` to parse task outputs and execute memory updates
- [x] **AGT-02**: Memory Agent automatically extracts decisions, patterns, and mistakes from git commit messages and walkthrough files
- [x] **AGT-03**: Memory Agent compresses updated state into `master-memory.md` under 5,000 words limit
- [x] **AGT-04**: Package the Memory Agent as a local Antigravity/Gemini skill in `.agents/skills/memory-agent` with valid `SKILL.md`

### Test Harness

- [x] **TST-01**: Implement Python integration test script `test_memory_agent.py` to run automated verification of memory updates
- [x] **TST-02**: Test harness validates all updated files comply with markdown schemas and budget limits

## v2 Requirements

### Multi-Agent Integration

- **MA-01**: Implement Architect Agent skill to analyze requirements and generate implementation plans
- **MA-02**: Implement Developer Agent skill to execute plans and verify code
- **MA-03**: Implement Reviewer Agent skill to enforce quality and architectural compliance
- **MA-04**: Implement QA Agent skill to run automated tests and build validation
- **MA-05**: Build central orchestration pipeline to run multi-agent coordination loop

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-agent loop orchestration | Deferred to Phase 2 to focus on memory correctness first |
| Automatic codebase refactoring | Phase 4 roadmap target |
| Self-improving codebase loops | Phase 5 roadmap target |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DIR-01 | Phase 1 | Complete |
| DIR-02 | Phase 1 | Complete |
| DIR-03 | Phase 1 | Complete |
| DIR-04 | Phase 1 | Complete |
| DIR-05 | Phase 1 | Complete |
| DIR-06 | Phase 1 | Complete |
| DIR-07 | Phase 1 | Complete |
| DIR-08 | Phase 1 | Complete |
| AGT-01 | Phase 2 | Complete |
| AGT-02 | Phase 2 | Complete |
| AGT-03 | Phase 2 | Complete |
| AGT-04 | Phase 2 | Complete |
| TST-01 | Phase 3 | Complete |
| TST-02 | Phase 3 | Complete |

**Coverage:**

- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-22*
*Last updated: 2026-06-22 after initial definition*
