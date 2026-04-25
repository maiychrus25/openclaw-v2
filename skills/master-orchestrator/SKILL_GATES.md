# SKILL_GATES.md — Skill Activation Checklist

_Every agent MUST complete this checklist before starting any task. Skip at your own risk of producing sub-standard output._

---

## ☐ RULE 0: Read Workspace Context

Before anything else:

```
1. Read .openclaw-workspace.json  → Know which project you are in
2. Read MEMORY.md                → Know recent history
3. Read USER.md                  → Know Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS — No Exceptions)

For EVERY incoming request:

```
1. Run the request through prompt-optimizer skill
2. Wait for optimized output
3. Only then proceed to task execution
```

**When:** Any time a human or another agent sends you a raw prompt.

---

## ☐ RULE 2: Route to Correct Specialized Agent

After optimization, determine who handles the task:

| Task Type | Agent |
|---|---|
| Backend API / DB / Server | `senior-backend` |
| Frontend UI / Components | `senior-frontend` |
| Architecture / DB Schema | `senior-architect` |
| QA / Testing | `senior-qa` |
| Deployment / CI-CD | `senior-devops` |
| Market Research / Positioning | `market-intelligence` |
| Product Strategy / Roadmap | `product-strategy` |
| SEO Audit | `seo-audit` |
| Security Audit | `security-reviewer` |
| Code Review | `code-reviewer` |
| Design System | `ui-design-system` |

Use `sessions_spawn` or `sessions_send` to route.

---

## ☐ RULE 3: Track Task in Memory

After each significant action:

```
1. Update memory/YYYY-MM-DD.md with progress
2. Record decisions made
3. Record blockers if any
```

---

## ☐ RULE 4: Handover Protocol

When passing work to another agent:

```
1. Create HANDOVER.md in docs/
2. Include: what was done, what remains, key decisions, known issues
3. sessions_send the HANDOVER.md content to receiving agent
4. Do NOT close your session until confirmed received
```

---

## ☐ RULE 5: OpenSpec for Non-Trivial Tasks

Create `docs/openspec/{task-name}.md` when:

```
☐ New feature implementation
☐ Database schema changes
☐ New API endpoints
☐ Architecture decisions
☐ Security-sensitive changes
```

Template triggers:
- New feature → epic-design → openspec
- Schema change → database-schema-designer → openspec
- API design → senior-architect → openspec

---

## ☐ RULE 6: Feedback Loop — FEEDBACK.md

When handover is unclear or contradictory:

```
1. Create FEEDBACK.md in docs/
2. Detail: what is unclear, what contradicts what
3. sessions_send to the agent who sent the unclear handover
4. HALT work until clarified
5. Alert master-orchestrator if unresolved after 2 attempts
```

---

## Quick Reference

```
prompt-optimizer → sessions_spawn → sessions_send → HANDOVER.md → memory update
                          ↓
                   [BLOCKED?]
                          ↓
                    FEEDBACK.md → Alert master-orchestrator
```
