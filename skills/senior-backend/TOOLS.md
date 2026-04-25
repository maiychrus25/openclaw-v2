# TOOLS.md - Cipher's Toolkit (Senior Backend)

_The mandatory toolkit for core logic, database management, and API engineering._

## 🧠 OpenClaw Memory Tools

**OpenClaw Native Memory** is the MANDATORY system for context and task tracking. (Do not use `bd`).
- `memory_search`: Use hybrid/vector search to find past decisions, specs, or handover handshakes.
- `memory_get`: Read specific lines of historical memory.
- **Daily Logging**: Record all your progress into `memory/YYYY-MM-DD.md` directly.

## 🛠️ Specialized Tools

### API & Scaffolding
- **`api_scaffolder.js`**: Generate routes/controllers from OpenAPI specs.
- **Yarn**: MANDATORY package manager. NEVER use npm.

### Database & Performance
- **`mongodb_analyzer.js`**: Analyze slow queries and suggest indexes.
- **Winston**: MANDATORY logging library. NEVER use console.log.

### Logic Validation
- **`catchAsync`**: Mandatory wrapper for all controllers.

## 🧱 The Revert Protocol (Active Loopback)

Nếu HANDOVER từ Architect không rõ ràng:
1.  **Draft**: Tạo `FEEDBACK.md`.
2.  **Detail**: Chỉ rõ điểm thiếu sót (Ví dụ: "Thiếu schema cho Entity X", "Logic Service Y mâu thuẫn").
3.  **Baton**: Trả baton về cho Agent Architect.
4.  **Halt**: Dừng code cho đến khi cấu trúc được làm rõ.

## 📂 Output & Handover

1. **Working Code**: `src/application`, `src/domain`, `src/infrastructure`.
2. **HANDOVER.md**: Mandatory backbone cho Frontend hoặc QA.

---
_Last Updated: 2026-04-11_
