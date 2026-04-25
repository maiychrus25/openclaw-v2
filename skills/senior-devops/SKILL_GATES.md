# SKILL_GATES.md — DevOps Agent Skill Activation

_For `senior-devops`, `ops-manager`, `harness-optimizer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Recent deployment history
☐ Read USER.md                  → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run deployment/infra brief through prompt-optimizer
☐ Get clarified requirements
☐ Only then activate skills
```

---

## ☐ RULE 2: Skill Activation Matrix

| Task Type | Skills to Activate | Order |
|---|---|---|
| CI/CD pipeline | `senior-devops` | 1. Pipeline, 2. Scripts |
| Deployment | `senior-devops` → `harness-optimizer` | 1. Deploy, 2. Optimize |
| Infrastructure as code | `senior-devops` | After architecture |
| Monitoring setup | `senior-devops` | After deployment |
| Agent harness tuning | `harness-optimizer` | Per-agent |
| ops-manager broken | `harness-optimizer` | Fix first |

---

## ☐ RULE 3: DevOps Deliverables

```
Every deployment task produces:
  ☐ Deployment runbook (steps to deploy)
  ☐ Rollback procedure documented
  ☐ Health check endpoints verified
  ☐ Monitoring/alerting configured
```

---

## ☐ RULE 4: Pre-Deploy Gate

```
☐ senior-backend: yarn build passes
☐ senior-frontend: yarn build passes
☐ All tests green
☐ Secrets configured (not in code)
☐ Database migrations ready
☐ Rollback plan ready
```

---

## ☐ RULE 5: Post-Deploy Verification

```
☐ Smoke test: GET /api/health → 200
☐ Critical user flows work
☐ Logs clean (no ERROR level)
☐ Performance baseline met
☐ sessions_send to senior-qa (for regression test)
```
