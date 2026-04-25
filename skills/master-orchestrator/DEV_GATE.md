# DEV_GATE.md — Development Process Gate

_Every code change MUST pass through this gate before commit. No exceptions._

---

## Phase 1: Pre-Implementation Gate

Before writing any code:

```
☐ 1. Read .openclaw-workspace.json  → Confirm project context
☐ 2. Read HANDOVER.md (if any)      → Know what to build
☐ 3. Activate relevant skills       → senior-backend / senior-frontend
☐ 4. OpenSpec created (if needed)   → docs/openspec/{task}.md
☐ 5. yarn install                   → Dependencies up to date
```

---

## Phase 2: Implementation Gate

While coding:

```
☐ 6. Type-safe first                  → No 'any' without reason
☐ 7. Error handling                  → All async wrapped in try/catch
☐ 8. Logging                         → Winston (backend), console (frontend debug)
☐ 9. Environment variables            → Never hardcode secrets
☐ 10. Commit message format           → type(scope): description
```

Commit format:
```
feat(scope): description
fix(scope): description  
docs(scope): description
refactor(scope): description
perf(scope): description
test(scope): description
chore(scope): description
```

---

## Phase 3: Pre-Commit Gate (MUST PASS ALL)

Before every `git commit`:

```
☐ 11. yarn typecheck                 → 0 errors
         └─ tsconfig.json configured
         └─ No 'any' leakage

☐ 12. yarn lint                      → 0 errors (warnings acceptable)
         └─ ESLint passing
         └─ Prettier formatted

☐ 13. yarn build                     → Build succeeds
         └─ Next.js: yarn build
         └─ Backend: tsc && tsc-alias

☐ 14. yarn test                      → All tests pass
         └─ Unit tests green
         └─ Integration tests green (if exist)
```

**If any step fails → DO NOT COMMIT → Fix first.**

---

## Phase 4: Post-Commit Gate

After commit:

```
☐ 15. Push to correct branch          → Match project branch convention
☐ 16. Open MR/PR if needed           → With description + links to OpenSpec
☐ 17. Update HANDOVER.md             → Document what was done
☐ 18. Update memory/YYYY-MM-DD.md    → Log progress
☐ 19. sessions_send to next agent    → Handover if task complete
```

---

## Git Workflow (MANDATORY — 2026-04-13)

> **Applies to ALL OpenClaw agents. Human devs excluded.**

```bash
# 1. Sync + tạo nhánh mới từ develop
git fetch origin && git log origin/develop -3
git checkout -b feat/xxx origin/develop

# 2. Làm việc trên nhánh mới

# 3. Commit
git add .
git commit -m "type(scope): description"

# 4. Kiểm tra CHẶT CHẼ trước khi push
#    (xem Phase 3 ở trên)

# 5. Push nhánh mới
git push origin feat/xxx

# 6. Tạo Merge Request (MR)
#    Target: develop
#    Assignee: Lead (khuowgn)
#    Title: feat|fix|perf: mô tả
#    Sau khi tạo MR → Lead review và Lead merge
```

### Nguyên tắc vàng:
- ✅ LUÔN tạo nhánh mới cho mỗi task
- ✅ LUÔN lint + build + test TRƯỚC KHI push
- ✅ LUÔN tạo MR cho Lead review
- ❌ KHÔNG BAO GIỜ push thẳng lên develop
- ❌ KHÔNG commit khi lint/build/test fail

---

## Quick Reference

```
Pre-impl: workspace → handover → skills → openspec → install
Coding:   type-safe → error-handling → logging → commit-format
Pre-commit: typecheck → lint → build → test
Post-commit: push → MR → handover → memory
```

---

## Gate Failure Protocol

| Step Failed | Action |
|---|---|
| typecheck error | Fix type errors before proceeding |
| lint error | Fix lint violations |
| build error | Fix compilation errors |
| test fail | Write or fix tests, then re-run |
| HANDOVER unclear | Create FEEDBACK.md, halt until clarified |

**Golden Rule: If it doesn't build, it doesn't ship.**
