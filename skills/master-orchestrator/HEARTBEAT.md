# HEARTBEAT.md — Ecosystem Sentinel

_Runs every ~10 minutes. Monitors pipeline health + broadcasts agent presence._

---

## ⏰ Timed Triggers

### Every ~10 min — Pipeline Health Sweep

```
1. sessions_list → count active sessions
2. subagents → check for failed/stuck agents
3. If any agent FAILED:
     → Report to Khuowgn immediately
     → sessions_send FEEDBACK.md to stalled agent
4. If pipeline healthy:
     → Stay silent (no noise to Khuowgn)
```

### Every ~15 min — Change Detection (Telegram)

```
1. sessions_list → get all active sessions
2. Read memory/heartbeat-state.json → compare with last known state
3. If NO CHANGE since last report:
     → Stay SILENT. Exit quietly. No message sent.
4. If CHANGE detected (new session, died, failed, blocker):
     → Compose change report → send to group

   Format:
   🟡 Orbis — 15p Update | {HH:MM} UTC {DD MMM}

   Changes detected:
   • [list of actual changes]

   Pipeline: HEALTHY / DEGRADED
   • Active sessions: N
   • MCP: stitch ✅ confluence ✅ gitlab ✅
   • Cron: 15p progress ✅ | Daily @ 5AM+7 ✅
   • Blockers: none / [list]

   Legend:
   🟡 = actively working on a task
   🟢 = session alive, monitoring/ready
   ⚪ = no session / standby
   🔴 = FAILED — needs attention
```

### Morning Briefing — 07:20 AM UTC+7

```
1. sessions_list + subagents
2. Report pipeline status to Khuowgn:

   🌅 Morning Pipeline Report — {DD/MM}
   
   Active agents: N/34
   Pipeline: HEALTHY ✅
   
   Running tasks:
   • senior-backend: ahv-qlhv-be — building auth endpoint
   • senior-frontend: ahv-qlhv-fe — responsive R3
   ```

---

## 🚨 Alert Conditions (always report immediately)

| Condition | Severity | Action |
|---|---|---|
| Any subagent status = failed | 🔴 Critical | Report + kill + restart |
| Any agent stuck > 30 min | 🟠 High | Diagnose + suggest fix |
| > 50% agents idle for > 2h | 🟡 Medium | Suggest new task |
| New session spawned | ℹ️ Info | Log only (no alert) |

---

## 🎯 Presence Indicator Logic

```
SESSIONS_ONLY mode (default — silent, no broadcast):

  if sessions_list returns 0 active sessions:
       → Stay silent entirely
       → No presence table sent

  if sessions_list returns > 0 active sessions:
       → Send presence table every ~15 min
       → Include current task name if available

  After reporting presence:
       → Wait 15 min before next broadcast
       → Avoid flooding Khuowgn's chat
```

---

## 🧱 Self-Correction

```
If a specific agent repeatedly fails or goes stale:
  1. sessions_send FEEDBACK.md to that agent
  2. Log to memory/YYYY-MM-DD.md
  3. If pattern continues → report to Khuowgn for review
```

---

## Reply HEARTBEAT_OK when:

```
- No active sessions AND current time is 23:00–07:00 UTC+7 (night silence)
- After sending a change report (exit quietly)
```

### Every ~10 min — Lead Direct Status Report

Separate cron (`e7885813`) sends active agent status to Lead's direct chat every 10 minutes.

Format:
```
🌐 Orbis — Agent Status | {HH:MM} UTC {DD MMM}

Active sessions: N
• [session]: [status] — [task] — [duration]
```

## 🚨 Always Report Immediately (no silence)

| Condition | Action |
|---|---|
| Any subagent status = failed | Send alert to Khuowgn immediately |
| Any agent stuck > 30 min | Send alert to Khuowgn immediately |
| Night time 23:00–07:00 UTC+7 | Stay silent unless critical |
