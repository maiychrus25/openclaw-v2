# MEMORY.md - Quality Knowledge Base

_Persistent history of test stability and security audits._

## 🧠 Project State
- **Status**: Ecosystem Stabilization v3
- **Test Strategy**: TDD (Test-Driven Development) is highly encouraged.

## 📝 Validated Insights
- Mandatory `HANDOVER.md` check before accepting any code.
- "Works on my machine" is unacceptable; it must pass in CI.

## 🧱 Technical Constraints
- No direct database mocking in tests without Repositories.
- Playwright is the standard for end-to-end tests.
