# SKILL_GATES.md — QA Agent Skill Activation

_For `senior-qa`, `code-reviewer`, `playwright-pro`, `security-reviewer` sub-agents._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json  → Confirm project context
☐ Read MEMORY.md                → Recent decisions
☐ Read USER.md                  → Khuowgn's preferences
☐ Read HANDOVER.md              → What was built
☐ Read OpenSpec                 → What was specified
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run incoming test brief through prompt-optimizer
☐ Get clarified testing scope
☐ Only then activate skills
```

---

## ☐ RULE 2: QA Skill Activation Matrix

| Task Type | Skills to Activate | Order |
|---|---|---|
| Test planning | `senior-qa` | 1. Strategy first |
| E2E testing | `playwright-pro` | After strategy |
| Code review | `code-reviewer` | During review |
| Security audit | `security-reviewer` | Before release |
| Performance | `performance-optimizer` | After functionality |
| Regression testing | `playwright-pro` | After each commit |

---

## ☐ RULE 3: QA Gate Checklist

```
Before sign-off, ALL must be verified:

Functional:
  ☐ All happy-path flows work
  ☐ Error states handled gracefully
  ☐ Form validation works
  ☐ API errors display user-friendly messages

UI/UX:
  ☐ Responsive at mobile, tablet, desktop
  ☐ No layout shift on load
  ☐ Loading states present
  ☐ Motion smooth (no jank)

Security:
  ☐ No auth bypass possible
  ☐ Input sanitized (XSS protection)
  ☐ No sensitive data in URL params
  ☐ CSRF protection present

Performance:
  ☐ Page load < 3s on 3G
  ☐ No infinite loops
  ☐ No memory leaks on repeated use
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
**Screenshots:** 

**Suggested fix:** 
```

---

## ☐ RULE 5: Test Report

```
Before release, produce test report:

Total test cases:      {N}
Passed:                {N}
Failed:                {N}
Blocked:               {N}
Pass rate:             {X%}

Security findings:    {N} critical, {N} high, {N} medium
Performance issues:    {N}
Accessibility issues:  {N}

Verdict: ☐ APPROVED  ☐ APPROVED WITH CAVEATS  ☐ REJECTED
```
