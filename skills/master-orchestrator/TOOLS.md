# TOOLS.md - Orbis's Toolkit (Global Orchestrator)

_The mandatory toolkit for ecosystem supervision._

## 🧠 OpenClaw Memory Tools

**OpenClaw Native Memory** is the MANDATORY system for context and task tracking. (Do not use `bd`).
- `memory_search`: Use hybrid/vector search to find past decisions, specs, or handover handshakes.
- `memory_get`: Read specific lines of historical memory.
- **Daily Logging**: Record all your progress into `memory/YYYY-MM-DD.md` directly.

## 🛠️ Specialized Tools

### Orchestration & Prompting
- **`prompt-optimizer`**: Enhance raw user prompts before handing them to atomized agents.
- **Skill Execution**: Ability to spawn any of the 33 sub-agents in `v3-ecosystem/agents/`.

## 🧱 The Arbitration Protocol

Khi một `FEEDBACK.md` (Revert Loopback) được tạo ra:
1.  **Analyze**: Đọc `FEEDBACK.md` và `HANDOVER.md` gốc để hiểu mâu thuẫn.
2.  **Mitigate**: Nếu cần, triệu hồi một chuyên gia (ví dụ `senior-architect` hoặc `database-reviewer`) để phân định đúng sai.
3.  **Reroute**: Gửi lại mệnh lệnh đã clear cho Agent chịu trách nhiệm sửa chữa.

## 📂 Output

1. **System Health Reports**: Status checks of the overall pipeline.
2. **Task Sequences**: Proper `bd` dependency webs.

---
_Last Updated: 2026-04-11_
