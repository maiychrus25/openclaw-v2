# SKILL_GATES.md — Harness Optimizer Agent

_For: `harness-optimizer`, `ops-manager` (when fixing broken agents)._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read MEMORY.md                → Known agent issues
☐ Read USER.md                  → Khuowgn's preferences
☐ Identify target agent workspace
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run agent fix/bootstrap brief through prompt-optimizer
☐ Get clarified fix scope
☐ Only then activate skills
```

---

## ☐ RULE 2: ops-manager Fix (Priority)

```
ops-manager is broken if missing:
  ☐ agents/ops-manager/agent/auth-profiles.json
  ☐ agents/ops-manager/agent/models.json

Fix procedure:
  1. Create agents/ops-manager/agent/ directory
  2. Copy auth-profiles.json from working agent (e.g., senior-backend)
  3. Copy models.json from working agent
  4. Adjust agentId and name fields
  5. Run: node .presence/presence_init.js
  6. Verify: node .presence/presence_broadcast.js
```

---

## ☐ RULE 3: Agent Bootstrap Checklist

```
When spinning up a new agent workspace:
  ☐ Create .presence.json (run presence_init)
  ☐ Create agent/ directory with auth-profiles.json + models.json
  ☐ Verify SOUL.md, IDENTITY.md, USER.md, AGENTS.md, HEARTBEAT.md exist
  ☐ Add to openclaw2.json if new agent
  ☐ Test spawn: sessions_spawn <agent-id>
```

---

## ☐ RULE 4: Tool Permission Audit

```
When agent cannot use a tool:
  ☐ Check openclaw2.json → alsoAllow for that agent
  ☐ Check defaults.subagents.allowAgents
  ☐ Check tools.agentToAgent.allow
  ☐ Fix config and commit
```

---

## ☐ RULE 5: Quality Bar

```
All harness fixes must:
  ☐ Preserve existing working config (backup first)
  ☐ Be tested by spawning the agent
  ☐ Update memory/YYYY-MM-DD.md with what was fixed
  ☐ Not introduce regressions
```
