# SKILL_GATES.md — Senior Security Agent

_For: `senior-security`, `security-reviewer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md or task brief
☐ Read USER.md                  → Khuowgn's preferences
☐ Read OpenSpec                 → Security requirements
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run security brief through prompt-optimizer
☐ Get clarified threat model scope
☐ Only then activate skills
```

---

## ☐ RULE 2: Security Review Triggers

```
☐ New authentication mechanism → Security review REQUIRED
☐ New payment/data flow → Security review REQUIRED
☐ File upload feature → Security review REQUIRED
☐ External API integration → Security review REQUIRED
☐ Any user input → Input sanitization review REQUIRED
```

---

## ☐ RULE 3: OWASP Top 10 Checklist

```
For every feature:
  ☐ Broken Access Control → Are auth checks in place?
  ☐ Cryptographic Failures → Are secrets properly handled?
  ☐ Injection → Is user input validated/sanitized?
  ☐ Insecure Design → Are there abuse cases?
  ☐ Security Misconfiguration → Are defaults secure?
  ☐ XSS → Is output escaped?
  ☐ IDOR → Are resources scoped to user?
  ☐ SSRF → Are URLs validated before fetching?
```

---

## ☐ RULE 4: Security Deliverables

```
Every security review produces:
  ☐ docs/SECURITY_AUDIT.md with findings
  ☐ Risk rating per finding (Critical/High/Medium/Low)
  ☐ Suggested fixes with code examples
  ☐ Sign-off or blockers documented
```

---

## ☐ RULE 5: Handover to Dev

```
After security review:
  ☐ All critical/high issues fixed or accepted with risk
  ☐ Medium issues tracked
  ☐ sessions_send to senior-backend/senior-frontend with fixes
  ☐ Update memory/YYYY-MM-DD.md
```

---

## Security Gate Summary

| Finding | Blocker? |
|---|---|
| Critical | YES — must fix before deploy |
| High | YES — must fix or formally accept risk |
| Medium | Track — fix in next sprint |
| Low | Track — fix when time allows |
