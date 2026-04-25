# SKILL_GATES.md — Quality Agent Skill Activation

_For all quality agents: `code-reviewer`, `playwright-pro`, `performance-optimizer`, `security-reviewer`, `senior-security`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Known issues
☐ Read USER.md                  → Khuowgn's preferences
☐ Read HANDOVER.md             → What dev delivered
☐ Read OpenSpec                 → What was specified
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run test/review brief through prompt-optimizer
☐ Get clarified testing scope
☐ Only then activate skills
```

---

## ☐ RULE 2: Skill Activation Matrix

| Agent | Task Types | Lead Skill |
|---|---|---|
| code-reviewer | Code review, PR review | `code-reviewer` |
| playwright-pro | E2E test writing, execution | `playwright-pro` |
| performance-optimizer | Performance audit, optimization | `performance-optimizer` |
| security-reviewer | Security audit, vulnerability scan | `security-reviewer` |
| senior-security | Architecture security, threat modeling | `senior-security` |

---

## ☐ RULE 3: QA Gate

```
Before sign-off:
  ☐ Functional: all happy paths work
  ☐ Error: all error states handled gracefully
  ☐ UI: responsive at mobile, tablet, desktop
  ☐ Security: no auth bypass, XSS protection
  ☐ Performance: load time < 3s, no jank
  ☐ Accessibility: keyboard nav, ARIA labels
```

---

## ☐ RULE 4: Bug Report Format

```markdown
## Bug: {title}

**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
**Environment:** {browser, device, OS}
**Steps to reproduce:**
1.
2.
3.

**Expected:** 
**Actual:** 
**Screenshots:** {attach if UI}
**Suggested fix:** 
```

---

## ☐ RULE 5: Handover to Ops

```
After QA sign-off:
  ☐ QA report created at docs/QA_REPORT.md
  ☐ All blockers resolved
  ☐ sessions_send to senior-devops (for deploy)
  ☐ Update memory/YYYY-MM-DD.md
```

---

## Quality Gate Summary

| Check | Threshold |
|---|---|
| Test pass rate | 100% |
| Critical bugs | 0 |
| High bugs | 0 (or accepted risk) |
| Security findings | 0 critical/high |
| Accessibility score | WCAG 2.1 AA |
| Load time | < 3s on 3G |
