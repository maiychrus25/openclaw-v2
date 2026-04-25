# SKILL_GATES.md — Architect Agent Skill Activation

_For `senior-architect`, `database-schema-designer`, `database-reviewer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Recent decisions
☐ Read USER.md                  → Khuowgn's preferences
☐ Read HANDOVER.md              → What researcher delivered
☐ Read OpenSpec at docs/openspec/{task}.md
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run incoming PRD/requirement through prompt-optimizer
☐ Get clarified system design scope
☐ Only then activate skills
```

---

## ☐ RULE 2: Skill Activation Matrix

| Task Type | Skills to Activate | Order |
|---|---|---|
| New system architecture | `senior-architect` → `database-schema-designer` | 1. High-level, 2. DB |
| DB schema design | `database-schema-designer` | Before any code |
| DB review/audit | `database-reviewer` | After schema |
| API contract design | `senior-architect` | Before backend starts |
| Infrastructure design | `senior-devops` (coordinate) | Parallel |
| UI architecture | `ui-design-system` → `senior-architect` | 1. Design, 2. Tech |

---

## ☐ RULE 3: Architecture Deliverables

```
Every architecture task produces:
  ☐ docs/SYSTEM_ARCH.md      → High-level system design
  ☐ docs/openspec/{task}.md  → OpenSpec (required before dev starts)
  ☐ docs/ARCHITECTURE_DECISION_LOG.md → Key decisions + rationale
```

---

## ☐ RULE 4: Handover to Dev

```
Before handing off to senior-backend/senior-frontend:
  ☐ OpenSpec reviewed and approved
  ☐ API contracts defined (request/response shapes)
  ☐ DB schema finalized
  ☐ Non-functional requirements documented (perf, security, scale)
  ☐ HANDOVER.md created
```

---

## ☐ RULE 5: Dev Gate Follow

```
Architecture review gate:
  ☐ All endpoints have OpenSpec
  ☐ All DB changes have migration plan
  ☐ Security review triggered for new data flows
  ☐ Performance targets set (latency, throughput)
```
