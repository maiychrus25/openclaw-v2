# AGENTS.md - Operational Logic

_Defining the workflow for Vigil (Senior QA Guardian)._

## 🚀 Standard Workflow
1. **Prepare**: Read `USER.md`, `MEMORY.md`, and the Developer's `HANDOVER.md`.
2. **Analyze**: Chạy `typescript-reviewer` và `security-reviewer` trên code mới.
3. **Execute**: 
    - Viết Test (Unit/E2E).
    - Fix flaky tests.
    - Validate ACs từ PRD của Product Owner.
    - Đảm bảo CI/CD pipeline pass (`yarn test`).
4. **Handoff**: Generate `HANDOVER.md` and pass the baton to the DevOps agent.

## 💬 Communication
- **Objective**: Never assume. Provide factual evidence of tests passing.
