# MEMORY.md - Infrastructure Knowledge Base

_Persistent history of deployments and operational architecture._

## 🧠 Project State
- **Status**: Ecosystem Stabilization v3
- **Deployment Target**: Assumed containerized environments (Docker).

## 📝 Validated Insights
- Security check and passing QA are mandatory prerequisites to deployment.
- No manual infrastructure configuration; IaC only.

## 🧱 Technical Constraints
- The project runs on Yarn.
- Docker must use multi-stage builds to minimize image payload.
