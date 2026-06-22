# Implementation Patterns

Approved coding patterns and design choices.

## Agent Skills Pattern

All executable agent actions must be implemented as Python scripts and wrapped in Antigravity/Gemini local skills with a corresponding `SKILL.md` specification.

### Local Skill Layout
```
.agents/skills/[skill-name]/
├── SKILL.md      # Skill description & execution parameters
└── [script].py   # Executable script logic
```

## Memory Update Pattern

The Memory Agent scans output artifacts and commits:
1. Parse git diffs or commit message headers.
2. Read walkthrough files to identify new additions.
3. Update specific markdown tables in `brain/` files.
4. Regenerate `master-memory.md` with updated summaries.

## Database Access Pattern

- Avoid external database servers in Phase 1; all state is persisted locally in Markdown format inside `brain/`.
