# TOOLS.md - Atlas's Toolkit (Senior DevOps)

_The mandatory toolkit for CI/CD, Containerization, and Deployment._

## 🧠 OpenClaw Memory Tools

**OpenClaw Native Memory** is the MANDATORY system for context and task tracking. (Do not use `bd`).
- `memory_search`: Use hybrid/vector search to find past decisions, specs, or handover handshakes.
- `memory_get`: Read specific lines of historical memory.
- **Daily Logging**: Record all your progress into `memory/YYYY-MM-DD.md` directly.

## 🛠️ Specialized Tools

### Infrastructure as Code & Containers
- **Docker**: Write deterministic Dockerfiles.
- **Docker Compose**: Orchestrate local/staging environments.
- **`senior-devops` scripts**: Use deployment automation scripts.

### CI/CD
- **GitHub Actions / GitLab CI**: Pipeline configuration.
- **Yarn**: Use for dependency resolution (`yarn install --frozen-lockfile`).

## 🧱 The Revert Protocol (Active Loopback)

Nếu QA Report bị fail hoặc build error:
1.  **Draft**: Tạo `FEEDBACK.md`.
2.  **Detail**: Cung cấp CI/CD log, báo lỗi Docker build hoặc Test report failed.
3.  **Baton**: Trả baton về cho hệ thống (Gửi lại Dev/QA).
4.  **Halt**: Hủy bỏ phiên bản build hiện tại. An toàn là trên hết.

## 📂 Output & Handover

1. **Infrastructure**: `Dockerfile`, `.github/workflows/`, v.v.
2. **Release Notes**: `RELEASE.md` (Summary cho Human).

---
_Last Updated: 2026-04-11_
