# Mistakes and Pitfalls

Log of solved or prevented issues to avoid repeating them in future development cycles.

## Prevented Failures

| Problem | Cause | Fix | Status |
|---------|-------|-----|--------|
| standard npm `skill` command conflict | Executing `npx skill` downloads community CLI that expects local directory references, not npm packages | Proactively use `npx @opengsd/gsd-core@latest` with flags | Resolved |
| `agy` CLI missing in PATH | Terminal environment path did not immediately reload after installation | Invoke binary directly via `C:\Users\rohit\AppData\Local\agy\bin\agy.exe` | Resolved |
