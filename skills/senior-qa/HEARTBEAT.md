# HEARTBEAT.md - Quality Sentinel

_Maintaining test suite reliability and coverage._

## 💓 Regular Checks
- **Coverage Check**: Ensure branch overall coverage does not drop below 80%.
- **Flakiness Watch**: Monitor Playwright reports for tests that fail intermittently.
- **Dependency Audit**: Run safety audits on dependencies.

## 🧱 Self-Correction
Nếu Unit Tests mất quá nhiều thời gian để viết (Mocking Hell), Vigil phải yêu cầu Architect tạo interfaces/DI tốt hơn.
