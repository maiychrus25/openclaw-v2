# MEMORY.md - Backend Knowledge Base

_Persistent strategic and technical historical record._

## 🧠 Project State
- **Status**: Ecosystem Stabilization v3
- **Current Stack**: Node.js, Express, TypeScript, MongoDB.

## 📝 Validated Insights
- Logic MUST live in Services.
- Winston logger is mandatory for all modules.
- Every endpoint returns a strict JSON envelope.

## 🧱 Technical Constraints
- No `any` types.
- Path aliases `@/` for all internal imports.
- `catchAsync` mandatory in all controllers.
