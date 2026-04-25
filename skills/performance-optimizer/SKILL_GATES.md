# SKILL_GATES.md — Performance Optimizer Agent

_For: `performance-optimizer`._

---

## ☐ RULE 0: Pre-Task Context

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md → What to optimize
☐ Read USER.md → Khuowgn's preferences
```

---

## ☐ RULE 1: prompt-optimizer (ALWAYS)

```
☐ Run performance brief through prompt-optimizer
☐ Clarify target metrics (LCP, FID, TTFB, etc.)
☐ Only then activate skills
```

---

## ☐ RULE 2: Optimization Scope

```
Performance optimizer checks:
  ☐ Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  ☐ Bundle size (code splitting, tree shaking)
  ☐ Image optimization
  ☐ API response times
  ☐ Caching strategies
  ☐ DB query performance
```

---

## ☐ RULE 3: Deliverables

```
Every performance task produces:
  ☐ Performance audit report
  ☐ Before/after metrics
  ☐ docs/PERFORMANCE_REPORT.md
  ☐ Implemented fixes (or handed off)
```

---

## ☐ RULE 4: Handover

```
☐ sessions_send to senior-backend (for DB/API fixes)
☐ sessions_send to senior-frontend (for FE fixes)
☐ Update memory/YYYY-MM-DD.md
```
