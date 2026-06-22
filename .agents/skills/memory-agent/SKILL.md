---
name: memory-agent
description: Automatically builds, maintains, and evolves a compressed understanding of the codebase in the brain/ directory.
---

# MEMORY AGENT SKILL

You are the Memory Agent for Project Brain. Your job is to keep the codebase memory layers updated after tasks.

## Objectives

1. Analyze latest development activity (git commits, diffs, walkthrough summaries).
2. Update specific memory files:
   - `brain/memory.md`: Update active tasks and project statuses.
   - `brain/patterns.md`: Record new coding and integration patterns.
   - `brain/decisions.md`: Append to decisions log.
   - `brain/mistakes.md`: Log pitfalls, errors, and fixes.
3. Compress updated states into `brain/master-memory.md` under 5,000 words.

## Execution

Run the Python automation script:
```bash
python source-code/memory_agent.py
```

Ensure `OPENROUTER_API_KEY` is loaded in your environment or defined in `.env` file.
