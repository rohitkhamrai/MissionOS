# Roadmap: Project Brain

## Overview

Project Brain will be initialized in three progressive MVP phases. We start by seeding the persistent memory filesystem layer, followed by implementing the Python Memory Agent to automate memory updates, and conclude by building an integration test harness to verify correct updates.

## Phases

- [x] **Phase 1: Memory Directory & Document Templates** - Seed folders and 10 memory documents (completed 2026-06-22)
- [ ] **Phase 2: Memory Agent Automation Script** - Write Python Memory Agent and package as a skill
- [ ] **Phase 3: Verification & Integration Testing** - Build test suite to verify automated memory updates

## Phase Details

### Phase 1: Memory Directory & Document Templates

**Goal**: Seed directory structure and all 10 memory documents with clean, descriptive templates
**Mode**: mvp
**Depends on**: Nothing
**Requirements**: DIR-01, DIR-02, DIR-03, DIR-04, DIR-05, DIR-06, DIR-07, DIR-08
**Success Criteria**:

  1. Folders `brain/`, `skills/`, `workflows/`, and `source-code/` exist in repository root
  2. All 10 memory files created in `brain/` with structured templates
  3. `master-memory.md` contains initial architecture summary and pattern snapshots

**Plans**: 1/1 plans complete

Plans:

- [x] 01-01-PLAN.md
- [x] 01-01: Create project structure and seed memory documents

### Phase 2: Memory Agent Automation Script

**Goal**: Implement the Memory Agent in Python and package it as a local Antigravity/Gemini skill
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: AGT-01, AGT-02, AGT-03, AGT-04
**Success Criteria**:

  1. Python script `memory_agent.py` implements parsing of git commits and task outputs
  2. Memory Agent parses walkthrough files to extract decisions, patterns, and mistakes
  3. Skill configuration exists at `.agents/skills/memory-agent/SKILL.md`

**Plans**: 1 plan

Plans:

- [ ] 02-01: Implement Python Memory Agent and register local skill

### Phase 3: Verification & Integration Testing

**Goal**: Build integration test harness to verify the Memory Agent runs correctly
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: TST-01, TST-02
**Success Criteria**:

  1. Test script `test_memory_agent.py` simulates task outputs and validates memory file updates
  2. Memory files pass validation for format and word limits

**Plans**: 1 plan

Plans:

- [ ] 03-01: Create test suite and run verification loop

## Progress

Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Memory Directory & Templates | 1/1 | Complete   | 2026-06-22 |
| 2. Memory Agent Script | 0/1 | Not started | - |
| 3. Verification & Testing | 0/1 | Not started | - |
