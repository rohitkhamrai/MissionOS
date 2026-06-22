# Project Architecture

Complete architectural understanding and technical map.

## Overview

Project Brain operates as a local filesystem memory layer combined with custom Python-based executable skills.

```
+----------------------------------------+
|           Google Antigravity           |
+-------------------+--------------------+
                    | (Executes skills)
                    v
+-------------------+--------------------+
|            Local Skills                |
|      (Python / .agents/skills)         |
+-------------------+--------------------+
                    | (Reads & Writes)
                    v
+-------------------+--------------------+
|           Memory Layer                 |
|             (brain/)                   |
+----------------------------------------+
```

## Subsystems

### Frontend / Client
- None (currently CLI / Agent workflow focus).

### Backend / Scripts
- **Language**: Python 3.x
- **Components**:
  - `memory_agent.py`: Script responsible for parsing logs/commits and updating memory files.

### Database / Storage
- **Format**: Plain text Markdown documents under the `brain/` directory.

### Integrations
- Integrates with Google Antigravity / Gemini CLI post-task hooks and local skill loading mechanisms.
