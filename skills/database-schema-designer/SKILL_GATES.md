# SKILL_GATES.md — Design Agent Skill Activation

_For all design agents: `database-schema-designer`, `database-reviewer`, `ui-design-system`, `ui-ux-pro-max`, `epic-design`, `stitch-design`, `stitch-loop`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Design decisions already made
☐ Read USER.md                  → Khuowgn's preferences
☐ Read HANDOVER.md             → What architect/researcher delivered
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run design brief through prompt-optimizer
☐ Get clarified design scope
☐ Only then activate skills
```

---

## ☐ RULE 2: Skill Activation Matrix

| Agent | Task Types | Lead Skill |
|---|---|---|
| database-schema-designer | Schema design, indexes, migrations | `database-schema-designer` |
| database-reviewer | Schema audit, query optimization | `database-reviewer` |
| ui-design-system | Design tokens, component library | `ui-design-system` |
| ui-ux-pro-max | Animations, micro-interactions | `ui-ux-pro-max` |
| epic-design | Epic-level UI/UX planning | `epic-design` |
| stitch-design | Stitch design system integration | `stitch-design` |
| stitch-loop | Design iteration workflow | `stitch-loop` |

---

## ☐ RULE 3: Design Deliverables

```
Database:
  ☐ Schema diagram (Mermaid or drawSQL)
  ☐ Index strategy documented
  ☐ Migration script ready

UI/UX:
  ☐ Wireframes or designs (Stitch or MD)
  ☐ Component inventory
  ☐ Motion/animation spec (if applicable)
  ☐ Accessibility notes
```

---

## ☐ RULE 4: Handover to Dev

```
Before handing off to senior-backend/senior-frontend:
  ☐ OpenSpec created at docs/openspec/{task}.md
  ☐ All design decisions documented
  ☐ Component specs finalized
  ☐ HANDOVER.md created
```

---

## Design Review Checklist

```
☐ Consistency: no orphan patterns
☐ Accessibility: WCAG 2.1 AA minimum
☐ Performance: no heavy animations on mobile
☐ Scalability: design works at 3+ screen sizes
☐ Accessibility: keyboard nav, screen reader
```
