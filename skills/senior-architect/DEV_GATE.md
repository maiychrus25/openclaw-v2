# DEV_GATE.md — Architect Development Process Gate

_For `senior-architect` and architecture sub-agents._

---

## Phase 0: Pre-Implementation

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md from researcher
☐ Read OpenSpec (create if doesn't exist)
☐ Activate skills: senior-architect, database-schema-designer
☐ Confirm project scope and constraints
```

---

## Phase 1: Architecture Design

```
☐ System Context Diagram:
     └─ Actors, systems, external dependencies
     └─ Trust boundaries

☐ Data Architecture:
     └─ Domain models (UML or Mermaid)
     └─ Relationships and cardinality
     └─ Index strategy
     └─ Migration path

☐ API Contract:
     └─ RESTful endpoints with request/response shapes
     └─ Error codes
     └─ Auth requirements

☐ Non-Functional:
     └─ Performance targets (latency, throughput)
     └─ Security requirements
     └─ Scalability notes
```

---

## Phase 2: Pre-Handover Gate

**ALL MUST PASS BEFORE HANDING TO DEV**

```
☐ docs/SYSTEM_ARCH.md exists and reviewed
☐ docs/openspec/{task}.md created (for every new endpoint/feature)
☐ DB schema reviewed (no N+1, proper indexes planned)
☐ API contracts stable (no mid-development breaking changes)
☐ Security boundary review done
☐ Migration plan documented (if schema change)
```

---

## Phase 3: Post-Handover

```
☐ HANDOVER.md created in docs/
☐ sessions_send to senior-backend (if BE work)
☐ sessions_send to senior-frontend (if FE work)
☐ sessions_send to senior-qa (if testable now)
☐ Update memory/YYYY-MM-DD.md
```

---

## Architecture Decision Record (ADR) Format

```markdown
## ADR-{N}: {Title}

**Status:** Proposed | Accepted | Deprecated
**Date:** {YYYY-MM-DD}

**Context:**
{problem or decision being made}

**Decision:**
{what was decided}

**Consequences:**
- Positive: ...
- Negative: ...
- Neutral: ...

**Alternatives Considered:**
1. {alternative}: {reason for rejection}
```
