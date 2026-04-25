# DEV_GATE.md — Backend Development Process Gate

_For `senior-backend` and `senior-backend` sub-agents._

---

## Phase 0: Pre-Implementation

```
☐ Read .openclaw-workspace.json
☐ Read HANDOVER.md (if any)
☐ Read OpenSpec at docs/openspec/{task}.md (if exists)
☐ Activate skills: senior-backend, database-schema-designer
☐ Check existing schema for integration points
☐ yarn install
```

---

## Phase 1: Implementation

```
☐ Follow repository structure:
     src/
       application/services/   ← Business logic
       domain/                ← Entities, interfaces
       infrastructure/         ← DB, external APIs
       interface/             ← Controllers, routes, middleware

☐ Type Safety:
     └─ Define interfaces for all request/response bodies
     └─ No 'any' in function signatures
     └─ Use Zod for runtime validation

☐ Error Handling:
     └─ All async wrapped: try/catch with catchAsync
     └─ Winston logger: info, warn, error with context

☐ Security:
     └─ No secrets in code — use process.env
     └─ Input validation on all endpoints
     └─ Auth middleware on protected routes

☐ API Design:
     └─ RESTful conventions
     └─ Consistent response envelope: { success, data, error }
     └─ Proper HTTP status codes
```

---

## Phase 2: Pre-Commit Gate

**ALL MUST PASS — DO NOT COMMIT IF ANY FAILS**

```
☐ yarn typecheck          → 0 errors
☐ yarn lint              → 0 errors  
☐ yarn build             → Build succeeds
     └─ tsc && tsc-alias
☐ yarn test              → All tests pass
☐ Manual DB check         → New queries tested in MongoDB
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
☐ sessions_send to senior-frontend (if API changes)
☐ sessions_send to senior-qa (if testable)
☐ Update memory/YYYY-MM-DD.md
```

---

## Database-Specific Checks

```
☐ New indexes created and documented
☐ Slow query log checked (if modifying queries)
☐ Migration script written (if schema change)
☐ Seed data updated (if needed)
```

---

## API Verification

```
Base URL: {from .openclaw-workspace.json baseUrl}
Port:    {from .openclaw-workspace.json port}

Test each new endpoint:
  POST /api/{resource}     → 201 Created
  GET  /api/{resource}     → 200 OK + array
  GET  /api/{resource}/:id → 200 OK + object
  PUT  /api/{resource}/:id → 200 OK
  DEL  /api/{resource}/:id → 204 No Content
  GET  /api/{resource}?page=1&limit=10 → pagination works
```

---

## Error Response Format

```typescript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: { code: "VALIDATION_ERROR", message: "..." } }
```
