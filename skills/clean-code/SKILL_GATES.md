# SKILL_GATES.md — Dev Helper Agent Skill Activation

_For: `clean-code`, `coding-standards`, `typescript-reviewer`, `refactor-cleaner`, `realistic-seeder`, `planner`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md or task brief
☐ Read USER.md                  → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run any raw brief through prompt-optimizer
☐ Get clarified task before coding
```

---

## ☐ RULE 2: Skill Per Agent

| Agent | Activates When |
|---|---|
| clean-code | Reading messy code, needs refactor |
| coding-standards | Linting issues, style inconsistencies |
| typescript-reviewer | 'any' types, missing interfaces, strict mode |
| refactor-cleaner | Legacy code, long functions, god classes |
| realistic-seeder | Need fake data for testing/development |
| planner | Breaking down large tasks into steps |

---

## ☐ RULE 3: Dev Gate Follow

```
Helper agents do NOT commit directly.
They enhance code and hand back to the calling dev agent.
  ☐ Code improvements applied
  ☐ Dev agent runs yarn build/lint/test
  ☐ Dev agent commits
```

---

## ☐ RULE 4: When Called by Dev Agent

```
When senior-backend or senior-frontend calls a helper agent:
  1. Helper reads target code
  2. Helper applies skill guidelines
  3. Helper writes improved code
  4. Helper runs self-check (typecheck/lint if applicable)
  5. Helper reports back to calling agent
```

---

## ☐ RULE 5: Quality Bar

```
All output must:
  ☐ TypeScript: zero 'any' in function signatures
  ☐ Naming: self-documenting (no var1, tmp)
  ☐ Functions: single responsibility, < 50 lines
  ☐ No commented-out dead code
  ☐ No console.log in production code
```
