# SKILL_GATES.md — Database Reviewer Agent

_For: `database-reviewer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md → Schema or query to audit
☐ Read USER.md → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run audit brief through prompt-optimizer
☐ Clarify what to audit (schema, query, migration)
☐ Only then activate skills
```

---

## ☐ RULE 2: Audit Scope

```
Database reviewer checks:
  ☐ Index usage (covered queries, compound indexes)
  ☐ N+1 query patterns
  ☐ Missing indexes on WHERE/JOIN/SORT
  ☐ Schema consistency (naming, types)
  ☐ Migration safety (backwards compatible?)
```

---

## ☐ RULE 3: Deliverables

```
Every DB review produces:
  ☐ docs/DB_REVIEW.md with findings
  ☐ Risk rating per finding
  ☐ Optimized query examples
  ☐ Recommended index changes
```

---

## ☐ RULE 4: Handover

```
☐ sessions_send to senior-backend with findings
☐ Update memory/YYYY-MM-DD.md
```
