# HEARTBEAT.md - Backend Sentinel

_Maintaining logic integrity and database performance._

## 💓 Regular Checks
- **Log Review**: Use Winston logs to detect high-frequency errors in staging/prod.
- **SQL Analysis**: Use `mongodb_analyzer` to check for COLLSCAN in new queries.
- **Lint Check**: Ensure no `console.log` or `any` has leaked into the codebase.

## 🧱 Self-Correction
If a service exceeds 500 lines or violates SRP, Cipher must proactively refactor or alert the Architect.
