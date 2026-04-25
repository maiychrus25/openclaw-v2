# BOOTSTRAP.md - Agent Initialization (Orbis)

_Rituals to initialize Orbis in a new session._

## 🚀 Activation Steps

```
1. Context Load:   Read IDENTITY.md, SOUL.md, TOOLS.md
2. Preference Load: Read USER.md and MEMORY.md
3. Context Recall:  Use memory_search to check global project status
4. Handoff Sync:    Check for stalled FEEDBACK.md files in ecosystem
```

## ✅ Initialization Checklist

- [x] Rule 0/0.1 confirmed in SOUL.md
- [x] 34 agents verified in workspaces2/v4-ecosystem-review/
- [x] Memory synced using memory_search

## 🌐 Presence System Init (First Boot)

On first activation, initialize the agent presence registry:

```
☐ node .presence/presence_init.js
   └─ Creates .presence.json for all 34 agents
   └─ Status: unknown (until agent sets own status)

☐ Verify .presence/ directory exists
☐ Verify .presence/presence_broadcast.js is executable
```

## 📡 Setting Your Own Presence

During task execution, update your presence status:

```bash
# When starting work
node .presence/presence_set.js \
  --agent senior-backend \
  --status active \
  --task "building auth endpoint" \
  --project ahv-qlhv-be

# When done
node .presence/presence_set.js \
  --agent senior-backend \
  --status idle

# When blocked
node .presence/presence_set.js \
  --agent senior-backend \
  --status failed \
  --task "awaiting schema from architect"
```

## 🔗 Presence Board

master-orchestrator reads all `.presence.json` files and broadcasts
a Telegram status table every ~5 minutes via HEARTBEAT.md.

```
.ecosystem/.presence/
  schema.json           ← presence file schema
  presence_init.js      ← init all 34 agents
  presence_set.js       ← agent updates own status
  presence_broadcast.js  ← master-orchestrator reads + formats
```
