---
name: prompt-optimizer
description: >-
  Analyze raw prompts, identify intent and gaps, match ECC components
  (skills/commands/agents/hooks), and output a ready-to-paste optimized
  prompt. Advisory role only — never executes the task itself.
  TRIGGER when: user says "optimize prompt", "improve my prompt",
  "how to write a prompt for", "help me prompt", "rewrite this prompt",
  or explicitly asks to enhance prompt quality. Also triggers on Vietnamese
  equivalents: "tối ưu prompt", "cải thiện prompt", "cách viết prompt",
  "giúp tôi tối ưu chỉ thị này".
  DO NOT TRIGGER when: user wants the task executed directly, or says
  "just do it" / "cứ làm đi". DO NOT TRIGGER when user says "tối ưu code",
  "tối ưu hiệu năng", "optimize performance", "optimize this code" — those
  are refactoring/performance tasks, not prompt optimization.
interface:
  display_name: "Prompt Optimizer"
  short_description: "AI instruction and prompt refinement"
  brand_color: "#EC4899"
  default_prompt: "Optimize this agent prompt..."
policy:
  allow_implicit_invocation: true
origin: community
metadata:
  author: YannJY02
  adapted_by: setup-gemini
  version: "1.1.0"
---

# Prompt Optimizer

Analyze a draft prompt, critique it, match it to this project's agent ecosystem
(`.agents/skills/`, `.agents/workflows/`), and output a complete optimized prompt
the user can paste and run.

## When to Use

- User says "optimize this prompt", "improve my prompt", "rewrite this prompt"
- User says "help me write a better prompt for…"
- User says "what's the best way to ask the agent to…"
- User says "tối ưu prompt", "cải thiện prompt", "cách viết prompt", "giúp tôi tối ưu chỉ thị này"
- User pastes a draft prompt and asks for feedback or enhancement
- User says "I don't know how to prompt for this"
- User says "how should I use this setup for…"
- User explicitly invokes `/prompt-optimize`

### Do Not Use When

- User wants the task done directly (just execute it)
- User says "tối ưu code", "optimize this code", "optimize performance" — these are refactoring tasks, not prompt optimization
- User is asking about agent harness configuration (use `@harness-optimizer` instead)
- User says "just do it" or "cứ làm đi"

---

## How It Works

**Advisory only — do not execute the user's task.**

Do NOT write code, create files, run commands, or take any implementation
action. Your ONLY output is an analysis plus an optimized prompt.

Run this 6-phase pipeline sequentially. Present results using the Output Format below.

---

## Analysis Pipeline

### Phase 0: Project Detection

Before analyzing the prompt, detect the current project context:

1. Check if `GEMINI.md` / `AGENTS.md` / `CLAUDE.md` exist — read for project conventions and active skills.
2. Detect tech stack from project files:
   - `server/package.json` → Node.js / Express / TypeScript (backend)
   - `client/package.json` → React / Next.js / Vite (frontend)
   - `server/tsconfig.json` → TypeScript strict mode
   - `openspec/` → feature spec + tasks.md workflow in use
   - `.beads/config.yaml` → bd (beads) issue tracking active
3. Note the available skills from `.agents/skills/` directory for Phase 3 matching.

If no project files are found, flag "tech stack unknown" and proceed with generic recommendations.

### Phase 1: Intent Detection

Classify the task into one or more categories:

| Category | Signal Words | Example |
|----------|-------------|---------|
| New Feature | build, create, add, implement, tạo, thêm, xây dựng | "Build a login page" |
| Bug Fix | fix, broken, not working, error, sửa, lỗi | "Fix the auth flow" |
| Refactor | refactor, clean up, restructure, tái cấu trúc | "Refactor the API layer" |
| Research | how to, what is, explore, investigate, cách nào, làm sao | "How to add SSO" |
| Testing | test, coverage, verify, kiểm thử, độ bao phủ | "Add tests for the cart" |
| Review | review, audit, check, đánh giá, kiểm tra | "Review my PR" |
| Documentation | document, update docs, tài liệu | "Update the API docs" |
| Infrastructure | deploy, CI, docker, database, triển khai, cơ sở dữ liệu | "Set up CI/CD pipeline" |
| Design | design, architecture, plan, thiết kế, kiến trúc | "Design the data model" |
| Prompt Optimization | optimize prompt, tối ưu prompt | (this skill itself) |

### Phase 2: Scope Assessment

| Scope | Heuristic | Orchestration |
|-------|-----------|---------------|
| TRIVIAL | Single file, < 50 lines | Direct execution |
| LOW | Single component or module | Single skill activation |
| MEDIUM | Multiple components, same domain | Skill chain + verify |
| HIGH | Cross-domain, 5+ files | `/software-development-lifecycle` first, then phased |
| EPIC | Multi-session, multi-PR, architectural shift | openspec + tasks.md + bd issues |

### Phase 3: Agent Ecosystem Component Matching

Map intent + scope + detected tech stack to this project's specific components.

#### Available Skills (`.agents/skills/`)

| Skill | Use When |
|-------|----------|
| `@agile-product-owner` | PRD, backlog, user stories, sprint planning |
| `@ui-design-system` | Design tokens, component hierarchy, visual specs |
| `@epic-design` | Cinematic UI, scroll animations, 2.5D effects |
| `@database-schema-designer` | MongoDB schema, ERD, embedding vs referencing |
| `@senior-backend` | Express API, TypeScript controllers/services/repos |
| `@senior-frontend` | React/Next.js components, routing, bundle optimization |
| `@senior-qa` | Unit tests, integration tests, coverage analysis |
| `@playwright-pro` | E2E tests, browser automation |
| `@senior-security` | OWASP audits, auth hardening, vulnerability analysis |
| `@senior-devops` | Docker, CI/CD pipelines, deployment strategies |
| `@senior-architect` | System design, ADRs, tech stack evaluation |
| `@coding-standards` | Naming conventions, DRY, KISS, error handling |
| `@harness-optimizer` | Agent config audits, eval coverage, hook tuning |
| `@prompt-optimizer` | Prompt analysis and improvement (this skill) |
| `@master-orchestrator` | Cross-domain strategy, persona coordination |

#### Available Workflows (`.agents/workflows/`)

| Workflow | Use When |
|----------|----------|
| `/software-development-lifecycle` | Full SDLC, multi-phase feature delivery |
| `/backend-feature` | New API endpoint or backend module |
| `/frontend-feature` | New UI component or page |
| `/security-audit` | Pre-release security scan |
| `/senior-devops` | Infrastructure provisioning and deployment |

#### By Intent Type

| Intent | Workflow | Primary Skill | Support Skills |
|--------|----------|---------------|----------------|
| New Feature (MEDIUM+) | `/software-development-lifecycle` | `@senior-backend` or `@senior-frontend` | `@coding-standards`, `@senior-qa` |
| New Feature (LOW) | `/backend-feature` or `/frontend-feature` | domain skill | — |
| Bug Fix | — | domain skill | `@senior-qa` |
| Refactor | — | `@coding-standards` | domain skill, `@senior-qa` |
| Research | — | `@senior-architect` | domain skill |
| Testing | — | `@senior-qa` | `@playwright-pro` for E2E |
| Review | — | `@coding-standards` | `@senior-security` |
| Infrastructure | `/senior-devops` | `@senior-devops` | — |
| Design | `/software-development-lifecycle` | `@senior-architect` + `@database-schema-designer` | domain skills |
| EPIC | openspec + `tasks.md` + `bd issues` | `@master-orchestrator` | all relevant skills |

### Phase 4: Missing Context Detection

Scan the prompt for missing critical information:

- [ ] **Tech stack** — Detected in Phase 0, or must user specify?
- [ ] **Target scope** — Files, directories, or modules mentioned?
- [ ] **Acceptance criteria** — How to know the task is done?
- [ ] **3-layer architecture** — Controller → Service → Repository respected?
- [ ] **Error handling** — Edge cases and failure modes addressed?
- [ ] **Security requirements** — Auth, input validation, secrets?
- [ ] **Testing expectations** — Unit, integration, E2E?
- [ ] **Database changes** — MongoDB schema, migrations, indexes?
- [ ] **Existing patterns** — Reference files or conventions to follow?
- [ ] **Scope boundaries** — What NOT to do?
- [ ] **openspec** — Should a spec + tasks.md be created first?
- [ ] **bd issues** — Should bd issues be created for this work?

**If 3+ critical items are missing**, ask the user up to 3 clarification
questions before generating the optimized prompt.

### Phase 5: Workflow & Model Recommendation

Determine where this prompt sits in the development lifecycle:

```
openspec (plan) → bd issues → Implement (persona) → Review → Verify → Commit + bd close + push
```

For MEDIUM+ tasks, always start with an openspec spec. For EPIC tasks:
1. Create `openspec/changes/<feature>/` with `tasks.md`
2. Run `bd create` for each task and `bd dep add` for ordering
3. Run `bd ready` before picking up work

**Model recommendation:**

| Scope | Recommended |
|-------|-------------|
| TRIVIAL–LOW | Fast model (Sonnet-class) |
| MEDIUM | Standard model (Sonnet-class) |
| HIGH | Planning with larger model + execution with standard |
| EPIC | `@master-orchestrator` for coordination |

---

## Output Format

Present your analysis in this exact structure. Respond in the same language as the user's input.

### Section 1: Prompt Diagnosis

**Strengths:** List what the original prompt does well.

**Issues:**

| Issue | Impact | Suggested Fix |
|-------|--------|---------------|
| (problem) | (consequence) | (how to fix) |

**Needs Clarification:** Numbered list of up to 3 questions. If Phase 0 auto-detected the answer, state it instead of asking.

### Section 2: Recommended Components

| Type | Component | Purpose |
|------|-----------|---------|
| Workflow | `/backend-feature` | Orchestrates the full backend development flow |
| Skill | `@senior-backend` | Implements API with 3-layer architecture |
| Skill | `@senior-qa` | Writes unit and integration tests |
| Skill | `@coding-standards` | Validates naming and patterns |

### Section 3: Optimized Prompt — Full Version

Present the complete optimized prompt inside a single fenced code block. The prompt must be self-contained and ready to copy-paste. Include:
- Clear task description with project context
- Tech stack (detected or specified)
- Persona/workflow invocations at the right stages
- Acceptance criteria with bd workflow
- Verification steps
- Scope boundaries (what NOT to do)

**Template:**
```
[Context: project, tech stack, architecture style]

[Task description with specifics]

Workflow:
1. [Persona/workflow] — [what to do]
2. [Persona/workflow] — [implementation step]
3. Verify: [how to confirm it works]
4. Close bd issue + push

Architecture constraints:
- Controller → Service → Repository (3-layer, no DB access in controllers)
- Yarn only (no npm/pnpm)
- ESLint + Prettier must pass

Acceptance criteria:
- [bullet list]

Do NOT:
- [scope boundary]
```

### Section 4: Optimized Prompt — Quick Version

A compact version for experienced users:

| Intent | Quick Pattern |
|--------|--------------|
| New Feature | `@[persona] — [feature]. 3-layer arch. Verify + bd close + push.` |
| Bug Fix | `@[persona] — reproduce [bug] with a test. Fix to green. Verify.` |
| Refactor | `@coding-standards + @[persona] — refactor [scope]. No behavior change. Tests must pass.` |
| EPIC | `Create openspec/changes/[feature]/tasks.md. bd create + dep add for each task. bd ready to start.` |

### Section 5: Enhancement Rationale

| Enhancement | Reason |
|-------------|--------|
| (what was added) | (why it matters) |

### Footer

> Not what you need? Tell me what to adjust, or make a normal task request if you want execution instead of prompt optimization.

---

## Examples

### Example 1: Vague Vietnamese Prompt

**User input:** `tạo trang đăng nhập cho người dùng`

**Phase 0 detects:** `client/package.json` with React + TypeScript, `server/package.json` with Express + MongoDB

**Optimized Prompt (Full):**
```
Sử dụng stack hiện tại của dự án (React + TypeScript frontend, Express + MongoDB backend).

Task: Implement luồng đăng nhập người dùng end-to-end.

Workflow:
1. @senior-backend — implement POST /auth/login: nhận email/password, validate với Zod,
   kiểm tra trong UserRepository, trả về JWT + refresh token trong httpOnly cookie.
   Theo 3-layer: Controller → AuthService → UserRepository.
2. @senior-frontend — implement trang LoginPage: form có email/password,
   gọi POST /auth/login, xử lý lỗi, redirect sau khi thành công.
3. @senior-qa — viết unit test cho AuthService (mock UserRepository),
   integration test cho POST /auth/login.
4. Verify: yarn lint, yarn test đều pass, thử login với credentials hợp lệ và không hợp lệ.
5. bd close <issue-id> + git push.

Ràng buộc kiến trúc:
- Logic nằm trong Service, Controller chỉ parse request và trả response.
- Password không expose trong response.
- Rate limit trên route /auth/login (tối đa 10 req/phút/IP).

Không làm:
- Không implement đăng ký hoặc quên mật khẩu.
- Không thay đổi schema User hiện tại.
- Không dùng npm hay pnpm.
```

### Example 2: EPIC Scope

**User input:** `migrate toàn bộ backend sang clean architecture`

**Optimized Prompt (Full):**
```
Task EPIC: Migrate backend sang Clean Architecture (Domain → Use Cases → Adapters → Infrastructure).

Bước 1 — Tạo openspec:
  mkdir -p openspec/changes/clean-arch
  Tạo openspec/changes/clean-arch/tasks.md với từng module cần migrate.

Bước 2 — Tạo bd issues và dependencies:
  bd create "Setup domain layer + base interfaces"   # ISS-1
  bd create "Migrate Auth module"                    # ISS-2
  bd create "Migrate User module"                    # ISS-3
  bd dep add ISS-2 ISS-1
  bd dep add ISS-3 ISS-1
  bd ready   # xác nhận ISS-1 là task đầu tiên

Bước 3 — Thực hiện từng task:
  @master-orchestrator điều phối, @senior-architect thiết kế layer boundaries,
  @senior-backend implement từng module.

Sau mỗi module: yarn test + yarn lint + bd close <id> + git push.
```

---

## Persistent Agent Memory & Task Tracking

We use **bd (beads)** for all task tracking and persistent memory. **DO NOT use local `MEMORY.md` files or markdown TODO lists.**

### Task Tracking (Using `bd`)

1. **Find Work**: Run `bd ready` to see available tasks.
2. **Claim & Update**: Run `bd update <id> --claim` to claim a task.
3. **Complete Work**: Run `bd close <id>` when finished.
4. **Push Automatically**: Work is never complete until you push! Ensure you follow the workflow:
   - `git pull --rebase`
   - `bd dolt push`
   - `git push`
   - `git status` (MUST show "up to date with origin")

### 🗂️ openspec `tasks.md` → bd Issues Workflow (MANDATORY)

Whenever a `tasks.md` is created or updated inside `openspec/` (or any spec folder), you **MUST** synchronize it with **bd** immediately:

```bash
bd create "Task title here"      # note returned ID, e.g. ISS-1, ISS-2 …
bd dep add ISS-2 ISS-1           # ISS-2 is blocked until ISS-1 is closed
bd ready                         # authoritative queue: only shows unblocked tasks
```

**Rules:**
- Every task in `tasks.md` MUST map to exactly one `bd` issue — no orphaned tasks.
- Sequential relationships MUST be encoded as `bd dep add` — no undeclared ordering.
- `bd ready` is the single source of truth for what to work on next.

### Memory Guidelines (Using `bd remember`)

1. **Remember Important Context**: Use `bd remember <memory-text>` to store persistent knowledge.
2. **Review Memory**: Run `bd prime` at the start of sessions to load the project's persistent memory.
3. **Store Baseline Scores**: After running `/harness-audit`, save the score with `bd remember` for future comparisons.
