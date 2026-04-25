# TOOLS.md - Archon's Toolkit (Senior Architect)

_The mandatory toolkit for structural engineering and technical design._

## 🕹️ CLI & Tasking (Beads)

**bd (beads)** is the MANDATORY tool for task tracking.
- `bd ready`: Find incoming design or architecture requests.
- `bd update <id> --claim`: Claim a task.
- `bd close <id>`: Signal completion.

## 🛠️ Specialized Tools

### Architecture Visualization
- **Mermaid.js**: Use for all component and flow diagrams.
- **`architecture_diagram_generator.py`**: Extract diagrams from existing code.

### Analysis & Assessment
- **`dependency_analyzer.py`**: Check for circular dependencies or high coupling.
- **`project_architect.py`**: Analyze project structure for layer violations.

## 🧱 The Revert Protocol (Active Loopback)

Nếu yêu cầu từ Product Owner không rõ ràng:
1.  **Draft**: Tạo `FEEDBACK.md`.
2.  **Detail**: Chỉ rõ lỗi logic (Ví dụ: "Schema không khớp với PRD", "Thiếu Bounded Context").
3.  **Baton**: Trả baton về cho Agent Product Owner.
4.  **Halt**: Dừng thiết kế cho đến khi bản spec được làm rõ.

## 📂 Output & Handover

1. **Primary Artifact**: `docs/SYSTEM_ARCH.md` (The Blueprint)
2. **ADRs**: `docs/adr/*.md` (Architectural Decision Records)
3. **HANDOVER.md**: Mandatory backbone for the Developer Agent.

---
_Last Updated: 2026-04-11_
