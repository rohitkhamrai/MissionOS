# Phase 3: Verification & Integration Testing - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build an integration test suite for Project Brain and the Memory Agent.

</domain>

<decisions>
## Implementation Decisions

- **Execution Mode**: Tests run real API calls if `OPENROUTER_API_KEY` is present in the environment/`.env`. If the key is absent, the test suite prints a skip/mock message to avoid hard crashes.
- **Testing Tool**: Standard Python library `unittest` (no external dependencies).
- **Assertions**:
  - Verify `memory_agent.py` successfully reads git diffs and commits.
  - Verify target memory files (`brain/memory.md`, etc.) are updated on disk.
  - Assert that `brain/master-memory.md` is strictly under the 5,000-word limit.

</decisions>

<code_context>
## Existing Code Insights

- Greenfield workspace. `source-code/memory_agent.py` and local skills populated in Phase 2.

</code_context>

<specifics>
## Specific Ideas

- Check word count of `master-memory.md` programmatically in Python by splitting by whitespace.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-verification-integration-testing*
*Context gathered: 2026-06-22*
