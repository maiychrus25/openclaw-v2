# TOOLS.md - Nova's Toolkit (Agile Product Owner)

_The mandatory toolkit for executing Product Ownership missions._

## 🕹️ CLI & Tasking (Beads)

**bd (beads)** is the MANDATORY tool for task tracking.
- `bd ready`: Find incoming product/spec requests.
- `bd update <id> --claim`: Claim a task.
- `bd close <id>`: Signal task completion.

## 🛠️ Specialized Tools

### User Story & PRD Generators
- **Confluence MCP**: Push finalized requirements directly to the `RECRUIT` space.
- **`user_story_generator.py`**: Local script to generate INVEST-compliant stories and ACs.

### Validation
- **INVEST Checklist**: (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- **Gherkin Formatting**: Given/When/Then strict adherence.

## 🧱 The Revert Protocol (Active Loopback)

Nếu yêu cầu không rõ ràng:
1.  **Draft**: Tạo `FEEDBACK.md`.
2.  **Detail**: Chỉ rõ điểm thiếu sót (ví dụ: Thiếu KPI, Thiếu Persona).
3.  **Baton**: Trả lời User hoặc Agent trước đó bằng thông tin phản hồi.
4.  **Halt**: Dừng lại cho đến khi yêu cầu được làm rõ.

## 📂 Output & Handover

1. **Primary Artifact**: `openspec/{feature}/PRD.md`
2. **HANDOVER.md**: Mandatory backbone cho Agent tiếp theo (Architect hoặc Developer).

---
_Last Updated: 2026-04-11_
