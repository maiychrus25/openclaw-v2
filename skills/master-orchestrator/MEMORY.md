# MEMORY.md — master-orchestrator (v4 Ecosystem)

## SESSION RESET NOTE
After migration to 34-agent ecosystem, this session is fresh.
All context below was carried over from previous session.

---

## ⚠️ STORAGE RULES (2026-04-24 by Khuowgn)

| Path | Chỉ dùng cho |
|---|---|
| `/root/` | System config only |
| `/root/.openclaw/` | OpenClaw system config + agent definitions |
| `/data/projects/` | **TẤT CẢ project code — KHÔNG lưu ở đâu khác** |

### Workspace chuẩn:
```
/data/projects/
  ahv-qlhv-be/       ← Backend
  ahv-qlhv-fe/       ← Frontend
  maiy-tech-hub-be/  ← MAIY Hub Backend/API
  maiy-tech-hub-fe/  ← MAIY Hub Frontend (Next.js, systemd: maiy-hub.service)
  ppp-safety/        ← Project khác
```

**⚠️ QUAN TRỌNG:** Không làm việc trực tiếp trong `/root/.openclaw/workspaces2/`. Đó là staging, không phải nơi lưu production code.

---

## Active Projects

### AHV DTLX (Đào Tạo Lái Xe) — DTLX MASTER
**Group:** `-5168104492` (DTLX + QLHV cùng group, 2 hệ thống dùng chung DB)
**GitLab:** ahv-dtlx/* repos (81078323, 81078350, 77055841, 77055851)
**Confluence:** confluence-dtlx → OTLXPA1 (Đào tạo lái xe - Phúc An)
**Workspace:** /root/.openclaw/workspaces/teacher-driving-training-system.bootstrap-backup/
**Role:** Tổng quản lý toàn bộ hệ thống DTLX

### DTLX Current Status (2026-04-14)
| Component | Status | Details |
|---|---|---|
| DTLX BE | ✅ Running | PID 108250, port 5555 |
| DTLX FE | ✅ Running | port 3000 |
| MongoDB | ✅ Running | mongodb://localhost:27017/dtlx |
| Admin account | ✅ Seeded | admin2@gmail.com / Password123@ |
| API endpoints | ✅ 18/18 pass | All core modules tested |
| CORS | ✅ OK | http://localhost:3000 allowed |

### DTLX API Paths (confirmed working)
- `POST /api/v1/auth/signin` — login
- `GET /api/v1/roles` — list roles
- `GET /api/v1/agents` — list agents
- `GET /api/v1/users/role` — list users by role
- `GET /api/v1/users/teachers` — list teachers
- `GET /api/v1/users/students` — list students
- `GET /api/v1/users/sales` — list sales
- `GET /api/v1/courses` — list courses
- `GET /api/v1/lessons` — list lessons
- `GET /api/v1/student-infos` — list student infos
- `GET /api/v1/work-calendars` — list work calendars
- `GET /api/v1/exams` — list exams
- `GET /api/v1/vehicles` — list vehicles
- `GET /api/v1/stadiums` — list stadiums
- `GET /api/v1/payments` — list payments
- `GET /api/v1/notify-configs` — list notify configs
- `GET /api/v1/notify-contents` — list notify contents
- `GET /api/v1/guests` — list guests (public)

### QLHV (Quản lý Học vụ) — Thầy giáo
**Group:** `-5168104492`
**GitLab:** ahv-dtlx/ahv-qlhv-be, ahv-dtlx/ahv-qlhv-fe
**Confluence:** confluence-qlhv → OTLXPA1
**Role:** Dành cho các thầy giáo quản lý học viên

### MAIY Tech Hub
**Frontend (Next.js):** `/data/projects/maiy-tech-hub-fe/` ✅
**Backend:** `/data/projects/maiy-tech-hub-be/`
**Service:** `maiy-hub.service` (systemd, auto-restart)
**Public URL:** http://103.253.21.139 (via nginx port 80)

### AHV Works
**Group:** `-5212380728`
**GitLab:** ahv-works/ahv-hrm/*, ahv-landing-page/*
**Confluence:** confluence → AW (AHV Work)
**Role:** HRM, Landing Pages

### Pet Connect (archived/inactive)
Codebase exists but no active development.

## Pending Tasks

### Git Sync Status (2026-04-14)
- **BE**: Build fixed ✅, all 18 API endpoints passing ✅
- **FE**: Running ✅ (port 3000)
- **MR**: QLHV BE MR !6 vẫn đang chờ Lead review/merge

### DTLX Backend Fix Summary (2026-04-14)
- Root cause: `docs` vs `data` field mismatch across interfaces, services, controllers
- Fixed: `common.interface.ts`, all module interfaces, all services returning `{ docs, meta }`
- Build succeeded, BE running on port 5555
- 18/18 API endpoints verified passing

### Active (as of 2026-04-14)
- **DTLX BE**: Running on port 5555 ✅ (PID 108250)
- **DTLX FE**: Running on port 3000 ✅ (PID 108472)
- **QLHV BE MR !6**: Pending Lead review

### Completed (previously pending)
1. ✅ **Students page filter bug**: đã được fix trong các commit gần đây
2. ✅ **Cron jobs**: 5p progress + daily briefing 5AM UTC+7 đã tạo và chạy thành công
3. ✅ **Duplicate Telegram tokens**: đã xử lý trong config mới
4. ✅ **Exposed tokens**: đã rotate

### Historical (archived)
- ~~Students page filter bug~~
- ~~Responsive QA review~~
- ~~Git push~~

## What Was Built (2026-04-11)

### 34-Agent Ecosystem Infrastructure

| Component | Status | Location |
|---|---|---|
| openclaw2.json | ✅ Done | /root/.openclaw/openclaw2.json |
| 34 workspaces | ✅ Done | /root/.openclaw/workspaces2/v4-ecosystem-review/ |
| Agent configs | ✅ Done | /root/.openclaw/agents/{agent-id}/agent/ |
| Presence system | ✅ Done | .presence/presence_init/set/broadcast.js |
| SKILL_GATES.md | ✅ All 34 | Each agent workspace |
| DEV_GATE.md | ✅ 5 agents | master-orchestrator, senior-{backend,frontend,architect,devops} |
| HANDOVER/FEEDBACK | ✅ master-orch | master-orchestrator workspace |
| OPENSPEC_TRIGGER | ✅ master-orch | master-orchestrator workspace |
| Ecosystem backup | ✅ Done | /root/.openclaw/ecosystem-backup-2026-04-11/ |

### Commit Log (v4-ecosystem-review repo)

| Hash | Message |
|------|---------|
| 5084ce5 | feat(ecosystem): core orchestration docs + workspace restructure |
| 2062235 | feat(ecosystem): agent presence system |
| 292085f | feat(ecosystem): SKILL_GATES.md to all 34 agents |
| 526c43e | fix(ecosystem): complete ops-manager workspace + add docs/memory |

### ahv-qlhv Commits (active project)

| Hash | Message |
|------|---------|
| f264418 | fix: harden startup and add core performance indexes |
| 8060898 | perf: improve perceived frontend responsiveness |
| 7a02688 | perf: smooth heavy UI motion without removing effects |
| 7ad683a | fix: make notification migration dry-run read-only |
| 7779549 | feat(layout): mobile sidebar drawer + hamburger toggle |
| e03e387 | feat(responsive): round 2 hardening across all screen sizes |
| cbd1fa5 | fix(layout): resolve desktop/narrow-desktop sidebar overlap regression |
| cbe45c6 | fix(dashboard): align stat card key with BE status_detail value |
| 4e021c8 | fix: move ViDateInput import to module top level |
| ebac17c | fix: move ViDateInput import to module top level |
| d8f3dc5 | docs(openspec): add notification migration execution record |

## Ecosystem Migration (CRITICAL)

```
Backup: /root/.openclaw/ecosystem-backup-2026-04-11/
  ecosystem-v4-2026-04-11.tar.gz  (13MB)
  RESTORE.sh
  MANIFEST.md

To activate 34-agent ecosystem:
  1. cp /root/.openclaw/openclaw2.json /root/.openclaw/openclaw.json
  2. openclaw gateway restart

After restart:
  - I am master-orchestrator in a fresh session
  - This MEMORY.md is my only context carry-over
  - All other conversation history is GONE
```

## Orchestration Rules (ALWAYS)

```
1. prompt-optimizer FIRST on any raw request
2. SKILL_GATES.md before starting any task
3. DEV_GATE.md before every commit
4. HANDOVER.md at every agent handoff
5. .presence.json update at task start/end
6. memory/YYYY-MM-DD.md updated after every session
7. git fetch origin && git log origin/develop -3 before every task
8. git merge origin/develop before every push
```

## Anti-Patterns (NEVER repeat)

- Do NOT spawn dev agent without fixing model config first
- Do NOT skip prompt-optimizer
- Do NOT skip skills activation
- Do NOT use sessions_send + label together
- Do NOT commit without yarn build/lint/typecheck passing
- Do NOT create OpenSpec for internal pipeline improvements
- Do NOT add agent without Khuowgn's approval

## ⚠️ MR Commit Management (2026-04-25 — Lessons Learned)

**VIOLATION: 2026-04-24 — Cancel Enrollment commits lost**
- Cancel enrollment commits pushed to wrong branch (`feat/mobile-ios-android`)
- MR !74 only merged commits within `fix/dat-session-field-mapping` branch
- Result: develop MISSED all cancel enrollment fixes → had to re-apply in MR !78

**Rule: Tất cả commits liên quan đến 1 MR phải nằm TRÊN cùng source branch của MR đó**
- Tạo branch mới cho feature → commit trên branch đó
- KHÔNG commit sang branch khác khi MR đang open
- Nếu cần cross-branch → REBASE commits vào đúng branch trước khi merge

**Workflow đúng:**
```
1. git checkout -b fix/my-feature origin/develop
2. [work + commit on fix/my-feature]
3. git push origin fix/my-feature
4. Tạo MR từ fix/my-feature → develop
5. MR merged → develop đầy đủ
```

**Workflow SAI (đã gây lỗi):**
```
1. git checkout -b fix/my-feature origin/develop
2. git checkout another-branch  ← VIOLATION
3. commit on another-branch
4. MR merged → commits bị MISSED from develop
```

## Agent List (34)

```
Orchestration:    master-orchestrator, prompt-optimizer
Research/Strat:  agile-product-owner, market-intelligence, product-strategy,
                 content-strategy, ai-seo, seo-audit, product-marketing-context
Architecture:    senior-architect, database-schema-designer, database-reviewer,
                 ui-design-system, ui-ux-pro-max, epic-design, stitch-design, stitch-loop
Development:     senior-backend, senior-frontend, shadcn-expert, clean-code,
                 coding-standards, typescript-reviewer, refactor-cleaner,
                 realistic-seeder, planner
Quality:         senior-qa, code-reviewer, playwright-pro, performance-optimizer,
                 senior-security, security-reviewer
Operations:      senior-devops, harness-optimizer
```

## Session Isolation Convention

`{project-slug}:{agent-id}` as session label.
Example: `ahv-qlhv-be:senior-backend`, `ahv-driving-training:senior-frontend`

**ACTIVE SESSIONS (2026-04-12 — post cleanup):**
- `agent:master-orchestrator:telegram:direct:6053576134` — Lead direct session ✅
- `agent:master-orchestrator:telegram:group:-5212380728` — group session ✅
- `agent:master-orchestrator:cron:ed2d0b5d-fc56-42eb-a8fc-973a48024df7` — 5p progress cron ✅
- All other sessions from old ecosystem agents cleared ✅

## Git Workflow (MANDATORY — 2026-04-13, UPDATED 2026-04-15)

> **Lead yêu cầu: Tất cả các master điều phối phải tuân thủ quy trình NÀY. KHÔNG push thẳng lên develop.**

### Quy Trình Bắt Buộc Cho Mỗi Task:

```
1. git fetch origin && git log origin/develop -3   ← Check commits mới nhất
2. git checkout -b feat/xxx origin/develop        ← Tạo nhánh mới từ develop
3. [Làm việc, code, fix...]
4. git add . && git commit -m "feat|fix|perf: mô tả"
5. yarn lint                                      ← MUST PASS
6. yarn build                                     ← MUST PASS  
7. yarn test                                      ← MUST PASS
8. git push origin feat/xxx                       ← Push nhánh mới
9. Tạo Merge Request → target: develop            ← Lead review
```

### Sau khi Lead merge MR:
```
git checkout develop
git pull origin develop                           ← Cập nhật local develop
```

### Nếu bị reject do conflict:
```
git fetch origin
git merge origin/feat/xxx                         ← Merge remote vào local
[Resolve conflicts]
git add .
git commit -m "merge: resolve conflicts"
git push origin feat/xxx
```

### Naming Convention:
- `feat/xxx` — tính năng mới
- `fix/xxx` — sửa lỗi
- `perf/xxx` — cải thiện hiệu suất
- `refactor/xxx` — tái cấu trúc
- `docs/xxx` — tài liệu

### Nguyên tắc vàng:
- ✅ LUÔN tạo nhánh mới cho mỗi task
- ✅ LUÔN chạy lint + build + test TRƯỚC KHI push
- ✅ LUÔN chờ Lead bảo "push" hoặc "create MR" mới push/MR
- ❌ KHÔNG BAO GIỜ push thẳng lên develop
- ❌ KHÔNG commit khi lint/build/test fail
- ❌ KHÔNG tự động push hoặc tạo MR — chỉ làm khi Lead yêu cầu

### Sync Code Request (Lead nói "fetch/sync code"):
```
1. git fetch origin
2. git merge origin/<branch> — đồng bộ local
3. yarn build — verify
4. Báo Lead: "Code synced ✅, build passed ✅. Ready to push — chờ Lead confirm"
5. ĐỢI Lead bảo push/mr MỚI push
```

---

## 🌍 HỆ THỐNG 45 AGENTS — DANH SÁCH ĐẦY ĐỦ (2026-04-24)

### Orchestration
| Agent | Vai trò |
|---|---|
| `master-orchestrator` | Orbis — Global Orchestrator, điều phối toàn hệ thống |
| `prompt-optimizer` | Làm rõ yêu cầu, tạo SPEC.md — BƯỚC BẮT BUỘC đầu tiên |
| `team-orchestrator` | Team orchestration |
| `main` | Main agent |

### Research / Strategy
| Agent | Vai trò |
|---|---|
| `agile-product-owner` | Backlog, user stories |
| `market-intelligence` | Phân tích thị trường |
| `product-strategy` | Chiến lược sản phẩm |
| `content-strategy` | Chiến lược nội dung |
| `deep-research` | Research sâu |
| `researcher` | Research chung |
| `documentation-lookup` | Tra cứu docs |
| `product-marketing-context` | Marketing context |

### Architecture
| Agent | Vai trò |
|---|---|
| `architect` | Kiến trúc tổng thể |
| `senior-architect` | Thiết kế kiến trúc chi tiết, SYSTEM_ARCH.md |
| `database-schema-designer` | Thiết kế DB Schema |
| `database-reviewer` | Review DB performance/security |
| `epic-design` | Thiết kế Epic/Feature lớn |
| `ui-design-system` | Design System |

### Development
| Agent | Vai trò |
|---|---|
| `developer` | Developer chung |
| `senior-backend` | Node/Express/TS Backend — Services, Repositories, Controllers |
| `senior-frontend` | React/Vue Frontend — Stitch-design, Shadcn, Epic-design |
| `shadcn-expert` | Shadcn/ui components |
| `ui-ux-pro-max` | UI/UX design chi tiết |
| `stitch-design` | Stitch design patterns |
| `stitch-loop` | Loop/stitch execution patterns |
| `clean-code` | Clean code principles |
| `coding-standards` | Enforce coding standards |
| `typescript-reviewer` | TypeScript quality review |
| `refactor-cleaner` | Refactor code smell |
| `realistic-seeder` | Seed data thực tế |
| `planner` | Lập kế hoạch task |

### Quality Assurance
| Agent | Vai trò |
|---|---|
| `senior-qa` | QA strategy + test planning |
| `qa-reviewer` | QA review |
| `code-reviewer` | Review code chung |
| `playwright-pro` | E2E testing Playwright |
| `performance-optimizer` | Tối ưu performance |
| `senior-security` | Security architecture |
| `security-reviewer` | Security code review |

### Content
| Agent | Vai trò |
|---|---|
| `article-writing` | Viết bài |
| `content-engine` | Content engine |
| `ai-seo` | SEO cho nội dung AI |
| `seo-audit` | Audit SEO toàn diện |

### Operations / Meta
| Agent | Vai trò |
|---|---|
| `senior-devops` | DevOps, CI/CD, deployment, server config, systemd |
| `harness-optimizer` | Tối ưu agent HARNESS (hooks, evals, routing, safety) — KHÔNG phải CI/CD |
| `mastering-confluence` | Confluence integration |

---

## 🔄 LUỒNG LÀM VIỆC CHUẨN (5 BƯỚC)

```
1. ORBIS PREPARE   → Đọc USER.md + MEMORY.md
2. CLARIFY          → prompt-optimizer → SPEC.md (BẮT BUỘC)
3. ROUTING          → Orbis đánh giá + chọn agents phù hợp
4. EXECUTE          → Agents làm việc theo HANDOVER.md chain
5. COMPLETION       → RELEASE.md → Lead
```

### Luồng chi tiết:
```
Lead giao task
  ↓
Orbis: Đọc USER.md + MEMORY.md
  ↓
prompt-optimizer: Làm rõ yêu cầu → SPEC.md / Task spec
  ↓
Orbis: Routing — chọn path phù hợp
  ↓
  ├── Research/Strategy  → market-intelligence, product-strategy, deep-research, documentation-lookup
  ├── Architecture       → architect → senior-architect → database-schema-designer → epic-design
  ├── Development        → senior-backend → senior-frontend → shadcn, ui-ux-pro-max, stitch-design
  ├── Content           → article-writing, content-engine, ai-seo, seo-audit
  ├── QA                → senior-qa → code-reviewer → playwright-pro → performance-optimizer
  └── Deploy            → senior-devops
  ↓
HANDOVER.md chuyển giữa các agents
  ↓
⚠️ FEEDBACK.md nếu deadlock → Orbis Arbitration
  ↓
RELEASE.md → Lead
```

### HARNESS OPTIMIZER (LỚP META — KHÔNG trong product pipeline)
`harness-optimizer` KHÔNG phải test harness hay CI/CD.
→ Tối ưu LỚP AGENT CONFIG: hooks, evals, routing, context, safety
→ Trigger khi: audit agent behavior, optimize routing, improve completion quality

### QUY TẮC ORBIS (BẮT BUỘC)
| Rule | Nội dung |
|---|---|
| R0 | Tuân thủ GLOBAL_STANDARDS.md |
| R0.1 | FEEDBACK.md → Orbis Arbitration |
| R1 | Biết đúng agent nào cho task nào |
| R2 | prompt-optimizer BẮT BUỘC trước khi spawn agent |
| R3 | **Orbis là SẾP — KHÔNG tự làm thay nhân viên** |
| R4 | Git: fetch → merge → MR (Lead approve mới merge) |

### CƠ CHẾ HANDOVER
| File | Khi nào | Ai tạo | Ai nhận |
|---|---|---|---|
| `HANDOVER.md` | Agent xong phần mình | Agent đi trước | Agent tiếp theo |
| `FEEDBACK.md` | Handover không rõ / conflict | Agent gặp lỗi | Orbis Arbitration |
| `RELEASE.md` | 100% hoàn thành | Agent cuối | Orbis → Lead |
| `SYSTEM_ARCH.md` | Architecture decision | senior-architect | Toàn team |
| `SPEC.md` | Yêu cầu đã rõ ràng | prompt-optimizer | Toàn team |


---

## 🔥 VPS FIREWALL RULES (UFW) — 2026-04-24

**⚠️ QUAN TRỌNG: Khi deploy project lên port mới, LUÔN check UFW trước.**

### Kiểm tra UFW status
```bash
ufw status
```

### Các port đã open trên VPS này
| Port | Service | Status |
|---|---|---|
| 22 | SSH | ✅ Open |
| 80 | HTTP (nginx) | ✅ Open |
| 443 | HTTPS | ✅ Open |
| 3000 | MAIY Tech Hub | ✅ Open (nginx proxy) |
| 3001 | QLHV Frontend | ✅ Open |
| 5002 | QLHV Backend | ✅ Open |
| 5555 | DTLX Backend | ✅ Open |
| 8790 | Agent Docs Portal | ✅ Open |

### Khi gặp lỗi "connection refused" từ bên ngoài
1. Kiểm tra process có đang chạy không: `ss -tlnp | grep PORT`
2. Kiểm tra UFW: `ufw status`
3. Nếu port chưa open → `ufw allow PORT/tcp`
4. Nếu dùng nginx proxy → KHÔNG cần open port (nginx đã listen 80/443)

### Mở port nhanh
```bash
ufw allow 3001/tcp    # Mở port 3001
ufw reload            # Áp dụng thay đổi
```

### Nginx proxy thay vì mở port mới
```bash
# Thêm location vào /etc/nginx/sites-available/project-config
location /project/ {
    proxy_pass http://127.0.0.1:PORT/;
    # ...
}
nginx -t && nginx -s reload
```
→ Dùng cách này KHÔNG cần open thêm port mới.

---

## 📋 PENDING TASKS (2026-04-24)

### Bug: Enrollment Update Not Persisting
**Mô tả:** Khi cập nhật học viên thành "chưa vào khoá" → báo thành công nhưng DB không lưu
**Root cause:** Đang investigate — BE trả response thành công nhưng không gọi save/update vào DB
**Status:** ⏸️ Tạm dừng — chưa tìm ra solution
**Cần:** Investigate sâu hơn BE controller/service để tìm chỗ không persist data
