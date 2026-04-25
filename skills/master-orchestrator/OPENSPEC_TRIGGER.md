# OPENSPEC_TRIGGER.md — When to Create an OpenSpec

_OpenSpec is the living document of a change. Not every change needs one — but missing one on a complex change is a costly mistake._

---

## MUST Create OpenSpec (Non-Negotiable)

Create `docs/openspec/{task-slug}.md` when ANY of these conditions are true:

### Architecture & Schema
```
☐ New database table or collection
☐ New relationship between entities (1:1, 1:N, N:N)
☐ New index or query optimization
☐ Schema migration
☐ New microservice or API boundary
```

### Feature Implementation
```
☐ New user-facing feature (pages, flows, screens)
☐ New API endpoint (REST, GraphQL, WebSocket)
☐ New authentication / authorization mechanism
☐ New payment or billing integration
☐ New notification system
```

### Security & Compliance
```
☐ New data storage (file upload, external API)
☐ New user role or permission
☐ New third-party integration
☐ GDPR / compliance-related change
☐ API key or secret management
```

### Performance & Scale
```
☐ New caching layer
☐ New background job / queue
☐ New search infrastructure
☐ Database sharding or partitioning
```

---

## MAY Create OpenSpec (Recommended)

Consider creating one when:
```
☐ Complex multi-step feature (>1 day estimate)
☐ Affects multiple teams or services
☐ Requires rollback plan
☐ Has external dependencies
☐ Is a breaking change
```

---

## SKIP OpenSpec (Not Needed)

```
☐ Hotfix (create after the fact, document what was done)
☐ Trivial bug fix (<30 min, no schema change)
☐ UI copy/text change only
☐ Dependency update (patch/minor)
☐ Test file update only
☐ Documentation update only
```

---

## OpenSpec Structure Template

```markdown
# OpenSpec: {task-slug}

## Metadata
- **Author**: {agent-id}
- **Created**: {YYYY-MM-DD}
- **Status**: Draft | In Review | Approved | Implemented
- **Project**: {project-slug}

## Summary
{Brief one-line description}

## Motivation
{Why is this change needed?}

## Proposed Solution
{Detailed technical approach}

## Schema Changes
{If any DB changes — tables, fields, indexes}

## API Changes
{If any API changes — endpoints, request/response shapes}

## Implementation Plan
1. Step 1
2. Step 2
3. Step 3

## Rollback Plan
{How to revert if this goes wrong}

## Verification
- [ ] Dev gate passed
- [ ] QA signed off
- [ ] Deployed to {env}

## Status History
| Date | Status | Notes |
|---|---|---|
| YYYY-MM-DD | Draft | Initial |
| YYYY-MM-DD | Approved | {who approved} |
| YYYY-MM-DD | Implemented | {commit hash} |
```

---

## Workflow

```
Task identified
     ↓
Trigger check → YES? → Create openspec
     ↓                   ↓
                  Draft → Review (senior-architect)
     ↓                   ↓
               Approved? ← NO → Revise
     ↓                   ↓
      NO           YES → Implement
      (skip)            ↓
                   DEV_GATE passed?
                        ↓
                   Ship → Update status = Implemented
```

---

## Naming Convention

```
docs/openspec/{short-description}.md

Examples:
  docs/openspec/user-notification-system.md
  docs/openspec/student-dashboard-redesign.md
  docs/openspec/payment-gateway-integration.md
  docs/openspec/database-index-optimization.md
```
