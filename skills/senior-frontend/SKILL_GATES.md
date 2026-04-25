# SKILL_GATES.md — Frontend Agent Skill Activation

_For `senior-frontend`, `shadcn-expert`, `ui-ux-pro-max` and related frontend agents._

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

| Task Type | Skills to Activate | Order |
|---|---|---|
| New page/screen | `senior-frontend` → `ui-ux-pro-max` → `shadcn-expert` | 1. Structure, 2. UX, 3. Components |
| UI polish/animations | `ui-ux-pro-max` → `senior-frontend` | 1. Feel, 2. Code |
| Component architecture | `shadcn-expert` → `senior-frontend` | 1. Structure, 2. Implement |
| TypeScript strict | `typescript-reviewer` | Pre-commit |
| Responsive design | `ui-ux-pro-max` → `senior-frontend` | 1. Mobile-first, 2. Desktop |
| Performance | `performance-optimizer` | After implementation |
| Code quality | `coding-standards` + `clean-code` | During coding |
| Design system | `ui-design-system` | For new patterns |

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
senior-frontend        → Next.js, React, TypeScript, Tailwind, API integration
ui-ux-pro-max          → Animations, micro-interactions, perceived performance
shadcn-expert          → shadcn/ui component composition, design tokens
ui-design-system       → Design tokens, component patterns, consistency
typescript-reviewer    → Strict typing, interfaces, generics
performance-optimizer   → Core Web Vitals, bundle optimization
coding-standards       → ESLint, formatting, naming conventions
clean-code             → Readability, component patterns
```

---

## ☐ RULE 4: Component Decision Tree

```
Need a button?         → shadcn/ui Button
Need a dialog/modal?   → shadcn/ui Dialog
Need a form?           → shadcn/ui + React Hook Form + Zod
Need a table?          → TanStack Table
Need a chart?          → Recharts (existing in project)
Need a dropdown?       → shadcn/ui DropdownMenu
Need a date picker?    → ViDateInput (custom)
Need a notification?   → Sonner (already installed)
Need a motion effect?  → framer-motion + .gpu-smooth
```

---

## ☐ RULE 5: Responsive Breakpoints

```
Mobile first:  < 640px   (Tailwind: by default)
Tablet:        640-1023px (Tailwind: sm: ...)
Desktop:       1024+px   (Tailwind: lg: ...)
Narrow desktop: 1024-1279px ← MOST COMMON BUG SOURCE
```

---

## ☐ RULE 6: DEV_GATE Follow

```
Complete DEV_GATE.md checklist before every commit:
  ☐ yarn typecheck
  ☐ yarn lint
  ☐ yarn build
  ☐ Browser test (page renders)
  ☐ Responsive check (3 sizes)
```

---

## ☐ RULE 7: Handover & Memory

```
When done:
  ☐ Create HANDOVER.md in docs/
  ☐ sessions_send to senior-qa (for testing)
  ☐ Update memory/YYYY-MM-DD.md
```

---

## ☐ RULE 8: OpenSpec Trigger

```
☐ New page added?
☐ New API integration?
☐ New auth flow?
☐ New design pattern?
→ YES → Create docs/openspec/{task}.md BEFORE coding
```
