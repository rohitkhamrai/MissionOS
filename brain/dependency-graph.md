# Dependency Graph

Map of file relationships and execution flows in Project Brain.

## Architectural Flow

```
[Antigravity / Gemini Runtime]
       | (PostTask Hooks)
       v
[.agents/skills/memory-agent/SKILL.md]
       | (Invokes)
       v
[source-code/memory_agent.py]
       | (Reads & updates)
       +---> [brain/master-memory.md]
       +---> [brain/memory.md]
       +---> [brain/architecture.md]
       +---> [brain/patterns.md]
       +---> [brain/decisions.md]
       +---> [brain/mistakes.md]
```
