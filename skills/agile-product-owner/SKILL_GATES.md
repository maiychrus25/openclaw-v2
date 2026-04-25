# SKILL_GATES.md — Research Agent Skill Activation

_For all research and strategy agents: `agile-product-owner`, `market-intelligence`, `product-strategy`, `content-strategy`, `ai-seo`, `seo-audit`, `product-marketing-context`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Previous research findings
☐ Read USER.md                  → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run incoming brief through prompt-optimizer
☐ Get clarified requirements
☐ Only then research
```

---

## ☐ RULE 2: Skill Activation Matrix

| Agent | Task Types | Lead Skill |
|---|---|---|
| agile-product-owner | PRD, user stories, sprint planning | `agile-product-owner` |
| market-intelligence | Competitor analysis, market research | `market-intelligence` |
| product-strategy | Vision, roadmap, positioning | `product-strategy` |
| content-strategy | Content planning, CMS strategy | `content-strategy` |
| ai-seo | AI SEO optimization, structured data | `ai-seo` |
| seo-audit | Technical SEO audit, crawl analysis | `seo-audit` |
| product-marketing-context | Positioning, messaging, GTM | `product-marketing-context` |

---

## ☐ RULE 3: PRD Gate

```
Every PRD delivers:
  ☐ docs/PROJECT_PRD.md (or named variant)
  ☐ docs/HANDOVER.md to architect
  ☐ OpenSpec triggered at docs/openspec/{task}.md
  ☐ User stories with acceptance criteria
  ☐ Success metrics defined
```

---

## ☐ RULE 4: Handover to Architect

```
Before closing research phase:
  ☐ sessions_send to senior-architect with PRD
  ☐ PRD reviewed by Khuowgn (if major feature)
  ☐ HANDOVER.md created
  ☐ Update memory/YYYY-MM-DD.md
```

---

## Research Quality Checklist

```
☐ All claims sourced (no hallucinations)
☐ Data has date/staleness noted
☐ Alternatives analyzed (not just one approach)
☐ Risks and mitigations identified
☐ Scope clearly bounded (what's NOT included)
```
