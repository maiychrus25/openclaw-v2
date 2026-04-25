# DEV_GATE.md — DevOps Development Process Gate

_For `senior-devops`, `ops-manager`, `harness-optimizer`._

---

## Phase 0: Pre-Implementation

```
☐ Read .openclaw-workspace.json
☐ Read deployment runbook (if exists)
☐ Activate skills: senior-devops
☐ Confirm environment (dev/staging/prod)
☐ Confirm secrets availability
```

---

## Phase 1: Implementation

```
☐ CI/CD:
     └─ GitHub Actions or equivalent
     └─ Stage gates: lint → test → build → deploy
     └─ Environment-specific configs

☐ Infrastructure:
     └─ Docker or equivalent
     └─ Environment variables management
     └─ Database migration scripts
     └─ Health check endpoints

☐ Monitoring:
     └─ Uptime monitoring
     └─ Error tracking (if available)
     └─ Log aggregation
```

---

## Phase 2: Pre-Deploy Gate

**ALL MUST PASS — DO NOT DEPLOY IF ANY FAILS**

```
☐ Backend: yarn build succeeds
☐ Frontend: yarn build succeeds
☐ yarn test passes
☐ yarn lint passes (warnings tolerated)
☐ Secrets: all required .env vars documented
☐ Migration: rollback script tested
☐ Communication: deployment window communicated
```

---

## Phase 3: Deploy

```
☐ Pre-deploy: backup DB (if schema change)
☐ Deploy backend first, verify health
☐ Deploy frontend
☐ Post-deploy: smoke test critical paths
☐ Monitor error rates for 15 min post-deploy
```

---

## Phase 4: Post-Deploy

```
☐ Verify all health endpoints return 200
☐ Check error logs (zero unexpected errors)
☐ Confirm monitoring alerts firing correctly
☐ Update deployment runbook if needed
☐ sessions_send to Khuowgn: deployment complete
☐ Update memory/YYYY-MM-DD.md
```

---

## Emergency Rollback Procedure

```
1. Identify failure (logs, alerts)
2. Confirm rollback needed
3. Run rollback script: rollback.sh {environment}
4. Verify previous version health
5. Notify Khuowgn immediately
6. Post-mortem within 24h
```

---

## Secrets Checklist

```
☐ Never commit secrets to git
☐ Use environment variables or secret manager
☐ Document all required env vars in .env.example
☐ Confirm secrets exist in target environment BEFORE deploy
```
