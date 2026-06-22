# Engineering Decisions

Log of architectural, framework, and tooling decisions.

## Decision Log

| Decision | Rationale | Alternatives | Date | Status |
|----------|-----------|--------------|------|--------|
| Use Python for scripts | User preference, easy string and file parsing, fast execution | Node.js, Go, Bash | 2026-06-22 | Approved |
| Direct local skills | Simplifies setup, uses native Antigravity skill architecture | MCP server, separate API | 2026-06-22 | Approved |
| Keep database in markdown | Simple file manipulation, zero infrastructure setup, direct version control | SQLite, Supabase | 2026-06-22 | Approved |
