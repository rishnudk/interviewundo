# Project TODO List & Progress Dashboard

This document tracks the tasks from the [Revised Implementation Plan](file:///d:/interview-prep-platform/revised-implementation-plan.md). It outlines the completed foundational work and what remains to build the LeetCode-style interview prep platform.

---

## 📊 Project Completion Summary

| Phase | Completed Tasks | Total Tasks | Completion % | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Sprint 1: Foundation** | 18 | 49 | 36.7% | In Progress |
| **Sprint 2: Core Engine** | 1 | 31 | 3.2% | Not Started |
| **Sprint 3: Polish & Admin** | 0 | 39 | 0.0% | Not Started |
| **Sprint 4: Differentiation**| 0 | 33 | 0.0% | Not Started |
| **Total Project** | **19** | **152** | **12.5%** | **In Progress** |

---

## 🛠️ Sprint 1 — Foundation (Week 1–2)
**Goal:** A user can register, log in, and browse problems with filtering.

### Week 1: Setup & Backend Foundation
#### Day 1-2: Project Setup
- [x] **Initialize monorepo with Turborepo** — Configured in [package.json](file:///d:/interview-prep-platform/package.json) and [turbo.json](file:///d:/interview-prep-platform/turbo.json).
- [x] **Setup frontend workspace** — Next.js template in [apps/frontend](file:///d:/interview-prep-platform/apps/frontend).
- [x] **Setup backend-api workspace** — Express + TS template in [apps/backend-api](file:///d:/interview-prep-platform/apps/backend-api).
- [x] **Setup shared-types package** — Configured in [packages/shared-types](file:///d:/interview-prep-platform/packages/shared-types).
- [x] **Configure Prettier, ESLint & TypeScript** — Main configs created at root [tsconfig.json](file:///d:/interview-prep-platform/tsconfig.json) and [.prettierrc](file:///d:/interview-prep-platform/.prettierrc).
- [ ] **Setup husky + lint-staged for pre-commit hooks**
- [x] **Create `.env.example`** — Configured in [.env.example](file:///d:/interview-prep-platform/.env.example).
- [x] **Setup docker-compose.yml** — Configured in [infrastructure/docker-compose.yml](file:///d:/interview-prep-platform/infrastructure/docker-compose.yml) for local PostgreSQL + Redis.
- [x] **Create initial README** — Created [README.md](file:///d:/interview-prep-platform/README.md).

#### Day 3–4: Database & Domain Layer
- [x] **Create Prisma schema** — All required models defined in [schema.prisma](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/schema.prisma).
- [ ] **Run initial database migration**
- [ ] **Write database seed script** (with 15+ real JS interview problems)
- [ ] **Create domain entities** (User, Problem, TestCase, Submission)
- [ ] **Create value objects** (Email, Slug, Difficulty, SubmissionStatus)
- [x] **Create domain errors** — Implemented in [domain/errors](file:///d:/interview-prep-platform/apps/backend-api/src/domain/errors/index.ts).
- [x] **Create port interfaces** — Defined in [domain/ports](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/index.ts):
  - Repository Ports: [IUserRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/IUserRepository.ts), [IProblemRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/IProblemRepository.ts), [ISubmissionRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/ISubmissionRepository.ts), [ITestCaseRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/ITestCaseRepository.ts)
  - Service Ports: [IAuthTokenService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IAuthTokenService.ts), [ICacheService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/ICacheService.ts), [INotificationService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/INotificationService.ts), [IPasswordService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IPasswordService.ts), [IQueueService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IQueueService.ts)

#### Day 5: Infrastructure Layer
- [ ] **Implement PrismaUserRepository**
- [ ] **Implement PrismaProblemRepository**
- [ ] **Implement Argon2PasswordService**
- [ ] **Implement JoseAuthTokenService**
- [x] **Setup Pino Logger** — Configured in [config/logger.ts](file:///d:/interview-prep-platform/apps/backend-api/src/config/logger.ts).
- [x] **Create validated `env.ts`** — Validated using Zod in [config/env.ts](file:///d:/interview-prep-platform/apps/backend-api/src/config/env.ts).

---

### Week 2: Auth + Problem Listing
#### Day 6–7: Auth Module (Backend)
- [x] **Create RegisterUser use case** — Implemented in [RegisterUser.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/RegisterUser.ts).
- [x] **Create LoginUser use case** — Implemented in [LoginUser.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/LoginUser.ts).
- [ ] **Create RefreshToken use case**
- [ ] **Create AuthController**
- [ ] **Create authenticate middleware (JWT verification)**
- [ ] **Create authorize middleware (role-based)**
- [x] **Create validate-request middleware (Zod)** — Implemented in [validate-request.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/validate-request.ts).
- [x] **Create error-handler middleware** — Implemented in [error-handler.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/error-handler.ts).
- [ ] **Create rate-limiter middleware**
- [ ] **Setup auth routes**
- [ ] **Write unit tests for RegisterUser and LoginUser**

#### Day 8–9: Problem Listing (Backend & Frontend)
- [x] **Create GetProblems use case (with filters, search, pagination)** — Implemented in [GetProblems.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/problem/GetProblems.ts).
- [ ] **Create GetProblemBySlug use case**
- [ ] **Create ProblemController**
- [ ] **Setup problem routes**
- [ ] **Write unit tests for GetProblems**

#### Day 9–10: Frontend Auth & Problem Pages
- [ ] **Setup shadcn/ui on frontend**
- [ ] **Create root layout with providers** (QueryClient, Theme, Auth)
- [ ] **Create login page with form validation**
- [ ] **Create register page with form validation**
- [ ] **Create auth service** (API calls wrapper)
- [ ] **Create auth hooks** (`useLogin`, `useRegister`, `useCurrentUser`)
- [ ] **Create auth guard component**
- [ ] **Create problem listing page**
- [ ] **Create ProblemCard component**
- [ ] **Create ProblemFilters component** (category, difficulty, search)
- [ ] **Create sidebar layout with navigation**
- [ ] **Setup dark/light theme toggle**
- [ ] **Create DifficultyBadge component**

#### Day 10: CI & First Deploy
- [ ] **Create GitHub Actions CI workflow** (`lint` → `typecheck` → `test` → `build`)
- [ ] **Deploy frontend workspace to Vercel (preview)**
- [ ] **Test full auth flow end-to-end**

---

## ⚡ Sprint 2 — Core Engine (Week 3–4)
**Goal:** A user can write code, submit, and see real-time execution results.

### Week 3: Editor + Submission + Queue
#### Day 11–12: Problem Workspace
- [ ] **Create split-pane workspace layout** (description | editor)
- [ ] **Integrate Monaco Editor** (with starter code loading)
- [ ] **Create editor toolbar** (Run, Submit, Reset buttons)
- [ ] **Create theme selector for editor**
- [ ] **Create output panel** (tabbed: test cases | results)
- [ ] **Implement keyboard shortcuts** (`Ctrl+Enter` = submit, `Ctrl+S` = save)
- [ ] **Create problem description renderer** (`react-markdown`)

#### Day 13–14: Submission System (Backend)
- [x] **Create SubmitSolution use case** — Implemented in [SubmitSolution.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/submission/SubmitSolution.ts).
- [ ] **Create RunCode use case** (playground mode — run without saving)
- [ ] **Create GetSubmissions use case**
- [ ] **Create GetSubmissionResult use case**
- [ ] **Create SubmissionController**
- [ ] **Setup submission routes**
- [ ] **Configure BullMQ queue connection**
- [ ] **Create BullMQQueueService** (implements `IQueueService`)
- [ ] **Write unit tests for SubmitSolution**

---

### Week 4: Judge Worker + Real-Time
#### Day 15–17: Judge Worker Service
- [ ] **Setup apps/judge-worker project workspace**
- [ ] **Create Docker runner image** (`node:22-slim` based)
- [ ] **Create JavaScript executor engine**:
  - Generate `solution.js` from user code
  - Generate `runner.js` with test case injection
  - Execute inside Docker container via `dockerode`
  - Capture stdout, stderr, and exit codes
  - Enforce resource limits (memory: 256MB, CPU: 1, timeout: 10s)
  - Parse and compare outputs
- [ ] **Create BullMQ worker that processes submission jobs**
- [ ] **Update submission status in database** (PENDING → PROCESSING → result)
- [ ] **Write unit tests for executor** (at least 10 test scenarios)

#### Day 18–19: WebSocket & Real-Time Updates
- [ ] **Setup Socket.io on backend**
- [ ] **Create SocketIOService** (implements `INotificationService`)
- [ ] **Authenticate WebSocket connections** (JWT verification)
- [ ] **Emit status updates** (PENDING → PROCESSING → ACCEPTED/etc.)
- [ ] **Create `useSubmissionStatus` hook** (frontend WebSocket listener)
- [ ] **Update output panel with real-time status**
- [ ] **Show animated processing indicator**

#### Day 20: Integration Testing
- [ ] **Test full submission flow end-to-end**
- [ ] **Test execution edge cases** (runtime error, timeout, compile error)
- [ ] **Write Playwright E2E tests for submission flow**

---

## 🎨 Sprint 3 — Polish & Admin (Week 5–6)
**Goal:** Make it feel like a polished, production-ready product.

### Week 5: Dashboard + History
#### Day 21–22: User Dashboard
- [ ] **Create GetUserStats use case** (total solved, success rate, streak)
- [ ] **Create GetCategoryProgress use case**
- [ ] **Create GetActivityHeatmap use case** (daily solve counts)
- [ ] **Create GetRecentActivity use case**
- [ ] **Create DashboardController + routes**
- [ ] **Create stats overview component** (solved, streak, success rate)
- [ ] **Create category progress bar chart** (using Recharts)
- [ ] **Create activity heatmap component** (GitHub-style calendar graph)
- [ ] **Create recent submissions widget**
- [ ] **Create daily challenge card**

#### Day 23–24: Submission History
- [ ] **Create submission history page** (with pagination)
- [ ] **Create submission detail view** (code, status, test cases detail)
- [ ] **Create code diff viewer** (compare two submissions)
- [ ] **Create result badge component** (Accepted = green, WA = red, etc.)
- [ ] **Add "View previous submissions" link** on problem workspace

---

### Week 6: Admin Panel + Polish
#### Day 25–27: Admin Panel
- [ ] **Create admin layout with sidebar navigation**
- [ ] **Create problem management table** (list, search, filter)
- [ ] **Create problem form** (create/edit) with Markdown + Monaco inputs
- [ ] **Create test case management** (add/edit/delete, hidden/visible, ordering)
- [ ] **Create admin stats page** (total users, total submissions, etc.)
- [ ] **Add role-based route protection** (frontend + backend)
- [ ] **Create problem CRUD use cases** (`CreateProblem`, `UpdateProblem`, `DeleteProblem`)
- [ ] **Create test case CRUD use cases** (`CreateTestCase`, `UpdateTestCase`, `DeleteTestCase`)

#### Day 28–30: UI Polish
- [ ] **Add skeleton loaders** for all data-fetching views
- [ ] **Add toast notifications** for all success/error feedback
- [ ] **Add empty states** for listings (no problems, no submissions)
- [ ] **Add confirm dialogs** for destructive actions
- [ ] **Add responsive mobile navigation** (sidebar → bottom bar)
- [ ] **Add button loading/disabled states** during operations
- [ ] **Add optimistic UI updates** for submission actions
- [ ] **Review accessibility** (keyboard navigation, ARIA labels)
- [ ] **Configure route SEO metadata** (title, description)

---

## 🏆 Sprint 4 — Differentiation (Week 7–8)
**Goal:** Unique additions including GitHub OAuth, AI Hint assistance, and Daily Challenges.

### Week 7: OAuth, AI Hints & Streaks
#### Day 31–32: GitHub OAuth
- [ ] **Setup next-auth v5 with GitHub provider**
- [ ] **Create OAuth callback route**
- [ ] **Update database models to support OAuth** (password nullable)
- [ ] **Create OAuth login/register buttons**
- [ ] **Link GitHub avatar** to user profile
- [ ] **Test OAuth flow end-to-end**

#### Day 33–34: AI-Powered Hints
- [ ] **Create OpenAIHintService** in infrastructure layer
- [ ] **Create GetHintForProblem use case**
- [ ] **Create hint API endpoint** (`POST /api/problems/:slug/hint`)
- [ ] **Rate limit hints** to 3 per problem/user/day
- [ ] **Design LLM prompt template** (conceptual hint, NO code, max 2 sentences)
- [ ] **Create hint UI widget** (collapsible, "Get Hint" button)
- [ ] **Track hint usage in database**
- [ ] **Add hint loading animation**

#### Day 35: Daily Challenge & Streaks
- [ ] **Create cron job to rotate daily challenge**
- [ ] **Create GetDailyChallenge use case**
- [ ] **Create daily challenge banner** on dashboard
- [ ] **Implement streak calculation logic**
- [ ] **Show streak counter in header**
- [ ] **Create streak milestone notifications**

---

### Week 8: Quality, Docs & Deployment
#### Day 36–37: Testing Suite
- [ ] **Unit tests for all use cases** (Vitest)
- [ ] **Integration tests for API endpoints** (Vitest + supertest)
- [ ] **E2E tests for core user paths** (Playwright)

#### Day 38–39: Documentation
- [ ] **Setup Swagger/OpenAPI** with `swagger-jsdoc`
- [ ] **Document all API endpoints** (schemas, request/response, errors)
- [ ] **Expose interactive Swagger UI** at `/api-docs`
- [ ] **Write professional README.md** (with Mermaid architecture diagram)

#### Day 40: Production Deployment
- [ ] **Deploy frontend to Vercel (production)**
- [ ] **Deploy backend to VPS** (Docker Compose, nginx reverse proxy, SSL certs, PM2)
- [ ] **Database deployment to Supabase PostgreSQL**
- [ ] **Setup Sentry monitoring** for error tracking
- [ ] **Setup health and readiness checks** (`/health`, `/ready`)
- [ ] **Perform final production smoke testing**
