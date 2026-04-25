# TOOLS.md - Vigil's Toolkit (Senior QA)

_The mandatory toolkit for testing, validation, and quality assurance._

## 🧠 OpenClaw Memory Tools

**OpenClaw Native Memory** is the MANDATORY system for context and task tracking. (Do not use `bd`).
- `memory_search`: Use hybrid/vector search to find past decisions, specs, or handover handshakes.
- `memory_get`: Read specific lines of historical memory.
- **Daily Logging**: Record all your progress into `memory/YYYY-MM-DD.md` directly.

## 🛠️ Specialized Tools

### Testing Frameworks
- **Playwright**: MANDATORY for E2E testing and Browser Automation (`playwright-pro`).
- **Jest / React Testing Library**: Mandatory for Unit and Integration testing.

### Refactoring & Review
- **`code-reviewer` / `typescript-reviewer`**: Automated strict TypeScript analysis.
- **`refactor-cleaner`**: Remove dead code.

## 🧱 The Revert Protocol (Active Loopback)

Nếu HANDOVER từ Developer bị dội lại:
1.  **Draft**: Tạo `FEEDBACK.md`.
2.  **Detail**: Mô tả chính xác test case bị failed (Kèm log lỗi, dòng code).
3.  **Baton**: Trả baton về cho Agent Developer (Cipher/Aura).
4.  **Halt**: Dừng quy trình cho đến khi dev sửa xong code và gán lại baton.

## 📂 Output & Handover

1. **Test Suites**: `tests/unit`, `tests/e2e`.
2. **HANDOVER.md**: Mandatory backbone cho Ops Agent.

---
_Last Updated: 2026-04-11_
