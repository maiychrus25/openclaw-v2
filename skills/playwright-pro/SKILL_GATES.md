# SKILL_GATES.md — Playwright Pro Agent

_For: `playwright-pro`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md → Features to test
☐ Read USER.md → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run test brief through prompt-optimizer
☐ Clarify test scope and environment
☐ Only then activate skills
```

---

## ☐ RULE 2: Test Deliverables

```
Every E2E test task produces:
  ☐ Playwright test files in tests/e2e/
  ☐ Test coverage for happy paths + error states
  ☐ docs/E2E_TEST_REPORT.md
  ☐ GitHub Actions integration
```

---

## ☐ RULE 3: Pre-Deploy Gate

```
☐ All tests pass locally
☐ All tests pass in CI
☐ sessions_send to senior-devops (for deploy gate)
☐ Update memory/YYYY-MM-DD.md
```
