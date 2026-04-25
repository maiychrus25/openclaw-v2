# DEV_GATE.md — Frontend Development Process Gate

_For `senior-frontend`, `shadcn-expert`, `ui-ux-pro-max` sub-agents._

---

## Phase 0: Pre-Implementation

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md (if any)
☐ Read OpenSpec at docs/openspec/{task}.md (if exists)
☐ Activate skills: senior-frontend, ui-ux-pro-max, shadcn-expert
☐ yarn install
☐ yarn dev (verify app starts)
```

---

## Phase 1: Implementation

```
☐ Component Structure:
     app/              ← Next.js App Router pages
     components/       ← Reusable UI components
     services/        ← API calls
     contexts/        ← React contexts
     hooks/           ← Custom hooks

☐ Component Rules:
     └─ 'use client' on all interactive components
     └─ Props typed with interfaces (no 'any')
     └─ Memoized with useMemo/useCallback where needed
     └─ Loading + error states for all async operations

☐ shadcn/ui:
     └─ Use existing shadcn components first
     └─ Extend only if absolutely needed
     └─ Follow shadcn naming conventions

☐ Styling:
     └─ Tailwind CSS utility classes
     └─ CSS variables for design tokens
     └─ gpu-smooth class for animated elements
     └─ useReducedMotion() for accessibility

☐ API Integration:
     └─ Services in src/services/
     └─ Centralized error handling
     └─ Response cache for GET requests
     └─ Auth token from context
```

---

## Phase 2: Pre-Commit Gate

**ALL MUST PASS — DO NOT COMMIT IF ANY FAILS**

```
☐ yarn typecheck          → 0 errors
☐ yarn lint              → 0 errors
☐ yarn build             → Build succeeds
     └─ next build
☐ yarn test              → All tests pass (if exist)
☐ Browser test           → Page renders correctly
☐ Responsive check       → Mobile, tablet, desktop layouts OK
```

---

## Phase 3: Git Workflow (MANDATORY — 2026-04-13)

> **Lead yêu cầu: KHÔNG push thẳng lên develop. Mỗi task = 1 nhánh mới.**

```
# 1. Sync + tạo nhánh mới từ develop
git fetch origin && git log origin/develop -3
git checkout -b feat/xxx origin/develop

# 2. Làm việc trên nhánh mới

# 3. Commit
git add .
git commit -m "type(scope): description"

# 4. Kiểm tra CHẶT CHẼ trước khi push (Phase 2 đã pass ở trên)

# 5. Push nhánh mới
git push origin feat/xxx

# 6. Tạo Merge Request (MR)
#    Target: develop
#    Assignee: Lead (khuowgn)
#    Title: feat|fix|perf: mô tả
#    Sau khi tạo MR → Lead review và Lead merge
```

### Nếu bị conflict khi push:
```
git fetch origin
git merge origin/feat/xxx
# Resolve conflicts
git add . && git commit -m "merge: resolve conflicts"
git push origin feat/xxx
```

### Sau khi Lead merge MR:
```
git checkout develop
git pull origin develop
```

### Naming Convention:
| Prefix | Usage |
|---|---|
| `feat/xxx` | Tính năng mới |
| `fix/xxx` | Sửa lỗi |
| `perf/xxx` | Cải thiện hiệu suất |
| `refactor/xxx` | Tái cấu trúc |
| `docs/xxx` | Tài liệu |

### Nguyên tắc vàng:
- ✅ LUÔN tạo nhánh mới cho mỗi task
- ✅ LUÔN chạy lint + build + test TRƯỚC KHI push
- ✅ LUÔN tạo MR cho Lead review
- ❌ KHÔNG BAO GIỜ push thẳng lên develop
- ❌ KHÔNG commit khi lint/build/test fail

## Phase 4: Post-Commit

```
☐ Update HANDOVER.md in docs/
☐ sessions_send to senior-qa (for testing)
☐ Update memory/YYYY-MM-DD.md
```

---

## UI Quality Checklist

```
☐ Page loads < 2s (perceived)
☐ No layout shift on load
☐ Interactive elements have loading states
☐ Error messages are user-friendly (not raw error)
☐ Forms have validation feedback
☐ Mobile responsive at 375px, 768px, 1024px
☐ Motion is smooth (check DevTools Performance)
☐ No console errors
☐ Accessibility: alt text, aria labels, keyboard nav
```

---

## Performance Targets

```
☐ First Contentful Paint: < 1.5s
☐ Largest Contentful Paint: < 2.5s
☐ Cumulative Layout Shift: < 0.1
☐ Bundle size: No new large bundle added without reason
```

---

## Motion Guidelines

```
☐ Spring physics: duration < 0.3s, low mass, minimal overshoot
☐ Reduced motion: respect useReducedMotion()
☐ gpu-smooth: for opacity + transform only
☐ Avoid: layout-triggering properties in animations
☐ Motion classes: .gpu-smooth, .motion-safe-transition
```
