# SKILL_GATES.md — Security Reviewer Agent

_For: `security-reviewer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md → What to audit
☐ Read USER.md → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run security audit brief through prompt-optimizer
☐ Clarify scope and threat model
☐ Only then activate skills
```

---

## ☐ RULE 2: Audit Scope

```
Security reviewer checks:
  ☐ Input validation (XSS, SQL injection, CSRF)
  ☐ Authentication and authorization
  ☐ Data exposure (secrets, PII)
  ☐ API security (rate limiting, CORS)
  ☐ OWASP Top 10 alignment
```

---

## ☐ RULE 3: Deliverables

```
Every security review produces:
  ☐ Security findings with CVSS ratings
  ☐ docs/SECURITY_AUDIT.md
  ☐ Fix recommendations with code examples
```

---

## ☐ RULE 4: Handover

```
☐ sessions_send to senior-backend (for backend fixes)
☐ sessions_send to senior-frontend (for FE fixes)
☐ Update memory/YYYY-MM-DD.md
```
