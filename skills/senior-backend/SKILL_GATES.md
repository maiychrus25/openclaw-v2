# SKILL_GATES.md — Backend Agent Skill Activation

_For `senior-backend` and related backend agents._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Recent decisions
☐ Read USER.md                  → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run incoming spec/handover through prompt-optimizer
☐ Get clarified requirements
☐ Only then activate skills and implement
```

---

## ☐ RULE 2: Skill Activation Matrix

Activate based on task type:

| Task Type | Skills to Activate | Order |
|---|---|---|
| New API endpoint | `senior-backend` → `database-schema-designer` | 1. Clarify spec, 2. Design DB, 3. Implement |
| DB schema change | `database-schema-designer` → `senior-backend` | 1. Schema first, 2. Implement |
| Performance issue | `performance-optimizer` | Before coding |
| Security feature | `security-reviewer` | Before coding |
| Data seeding | `realistic-seeder` | After schema done |
| Code quality | `coding-standards` + `clean-code` | During + after coding |
| TypeScript strict | `typescript-reviewer` | Pre-commit |
| Refactoring | `refactor-cleaner` | Before touching code |

---

## ☐ RULE 3: Skill Activation Protocol

```
For each required skill:

1. Read the skill's SKILL.md file
2. Apply the skill's guidelines to the task
3. Document how skill was applied in memory
```

---

## Quick Skill Reference

```
senior-backend         → API design, service logic, Express/Mongoose
database-schema-designer → Schema, relationships, indexes, migrations
performance-optimizer  → Query optimization, caching, indexing
security-reviewer      → Auth, input validation, OWASP top 10
realistic-seeder       → Seed data generation
coding-standards       → ESLint, formatting, conventions
clean-code             → Readability, patterns, anti-patterns
typescript-reviewer    → Strict typing, generics, no 'any'
refactor-cleaner       → Legacy code improvement
```

---

## ☐ RULE 4: Multi-Agent Handover

```
When done:
  ☐ Create HANDOVER.md in docs/
  ☐ sessions_send to senior-frontend (if API changes)
  ☐ sessions_send to senior-qa (if testable)
  ☐ Update memory/YYYY-MM-DD.md
```

---

## ☐ RULE 5: OpenSpec Trigger

```
☐ New table/collection?
☐ New API endpoint?
☐ New auth mechanism?
☐ DB migration?
→ YES → Create docs/openspec/{task}.md BEFORE coding
```

---

## ☐ RULE 6: DEV_GATE Follow

```
Complete DEV_GATE.md checklist before every commit:
  ☐ yarn typecheck
  ☐ yarn lint
  ☐ yarn build
  ☐ yarn test
  ☐ DB queries tested
```
