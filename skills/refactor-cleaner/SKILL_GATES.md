# SKILL_GATES.md — Refactor Cleaner Agent

_For: `refactor-cleaner`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md → Code to refactor
☐ Read USER.md → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run refactor brief through prompt-optimizer
☐ Clarify target files and refactor goals
☐ Only then activate skills
```

---

## ☐ RULE 2: Refactor Focus

```
Refactor cleaner targets:
  ☐ Long functions (>50 lines) → split
  ☐ God classes → decompose
  ☐ Duplicated code → extract shared
  ☐ Dead code → remove
  ☐ Obsolete patterns → modernize
```

---

## ☐ RULE 3: Pre-Commit Gate

```
☐ All refactored code passes: yarn typecheck
☐ All refactored code passes: yarn lint
☐ All refactored code passes: yarn build
☐ sessions_send to senior-backend or senior-frontend
☐ Update memory/YYYY-MM-DD.md
```
