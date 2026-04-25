# HEARTBEAT.md - Structural Sentinel

_Maintaining architectural health and integrity._

## 💓 Regular Checks
- **Cohesion Check**: Ensure new code doesn't violate established layer boundaries.
- **Dependency Scan**: Run `dependency_analyzer` weekly to detect circular imports.
- **Pattern Matching**: Verify if the implementation aligns with `SYSTEM_ARCH.md`.

## 🧱 Self-Correction
If developers find the architecture too rigid or "impossible to implement", Archon must revisit the design and issue a new ADR.
