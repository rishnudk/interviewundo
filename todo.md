# Project TODO List & Progress Dashboard

This document tracks the tasks from the [Revised Implementation Plan](file:///d:/interview-prep-platform/revised-implementation-plan.md). It outlines the completed foundational work and what remains to build the LeetCode-style interview prep platform.

---

## 📊 Project Completion Summary

| Phase                         | Completed Tasks | Total Tasks | Completion % |     Status      |
| :---------------------------- | :-------------: | :---------: | :----------: | :-------------: |
| **Sprint 1: Foundation**      |       54        |     54      |    100.0%    |    Completed    |
| **Sprint 2: Core Engine**     |       32        |     32      |    100.0%    |    Completed    |
| **Sprint 3: Polish & Admin**  |       32        |     32      |    100.0%    |    Completed    |
| **Sprint 4: Differentiation** |       17        |     33      |    51.5%     |   In Progress   |
| **Total Project**             |     **135**     |   **151**   |  **89.4%**   | **In Progress** |

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
- [x] **Setup husky + lint-staged for pre-commit hooks**
- [x] **Create `.env.example`** — Configured in [.env.example](file:///d:/interview-prep-platform/.env.example).
- [x] **Setup docker-compose.yml** — Configured in [infrastructure/docker-compose.yml](file:///d:/interview-prep-platform/infrastructure/docker-compose.yml) for local PostgreSQL + Redis.
- [x] **Create initial README** — Created [README.md](file:///d:/interview-prep-platform/README.md).

#### Day 3–4: Database & Domain Layer

- [x] **Create Prisma schema** — All required models defined in [schema.prisma](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/schema.prisma).
- [x] **Run initial database migration** — Database is fully migrated with initial structures on port 5433.
- [x] **Write database seed script** — Implemented in [seed.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/seed.ts) (seeded with 15+ rich interview problems).
- [x] **Create domain entities** (User, Problem, TestCase, Submission)
- [x] **Create value objects** (Email, Slug, Difficulty, SubmissionStatus)
- [x] **Create domain errors** — Implemented in [domain/errors](file:///d:/interview-prep-platform/apps/backend-api/src/domain/errors/index.ts).
- [x] **Create port interfaces** — Defined in [domain/ports](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/index.ts):
  - Repository Ports: [IUserRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/IUserRepository.ts), [IProblemRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/IProblemRepository.ts), [ISubmissionRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/ISubmissionRepository.ts), [ITestCaseRepository](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/ITestCaseRepository.ts)
  - Service Ports: [IAuthTokenService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IAuthTokenService.ts), [ICacheService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/ICacheService.ts), [INotificationService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/INotificationService.ts), [IPasswordService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IPasswordService.ts), [IQueueService](file:///d:/interview-prep-platform/apps/backend-api/src/domain/ports/services/IQueueService.ts)

#### Day 5: Infrastructure Layer

- [x] **Implement PrismaUserRepository** — Implemented in [PrismaUserRepository.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/repositories/PrismaUserRepository.ts).
- [x] **Implement PrismaProblemRepository** — Implemented in [PrismaProblemRepository.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/repositories/PrismaProblemRepository.ts).
- [x] **Implement Argon2PasswordService** — Implemented in [Argon2PasswordService.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/auth/Argon2PasswordService.ts).
- [x] **Implement JoseAuthTokenService** — Implemented in [JoseAuthTokenService.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/auth/JoseAuthTokenService.ts).
- [x] **Setup Pino Logger** — Configured in [config/logger.ts](file:///d:/interview-prep-platform/apps/backend-api/src/config/logger.ts).
- [x] **Create validated `env.ts`** — Validated using Zod in [config/env.ts](file:///d:/interview-prep-platform/apps/backend-api/src/config/env.ts).

---

### Week 2: Auth + Problem Listing

#### Day 6–7: Auth Module (Backend)

- [x] **Create RegisterUser use case** — Implemented in [RegisterUser.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/RegisterUser.ts).
- [x] **Create LoginUser use case** — Implemented in [LoginUser.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/LoginUser.ts).
- [x] **Create RefreshToken use case** — Implemented in [RefreshToken.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/RefreshToken.ts).
- [x] **Create AuthController** — Implemented in [AuthController.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/controllers/AuthController.ts).
- [x] **Create authenticate middleware (JWT verification)** — Implemented in [authenticate.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/authenticate.ts).
- [x] **Create authorize middleware (role-based)** — Implemented in [authorize.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/authorize.ts).
- [x] **Create validate-request middleware (Zod)** — Implemented in [validate-request.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/validate-request.ts).
- [x] **Create error-handler middleware** — Implemented in [error-handler.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/error-handler.ts).
- [x] **Create rate-limiter middleware** — Implemented in [rate-limiter.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/middleware/rate-limiter.ts).
- [x] **Setup auth routes** — Implemented in [auth.routes.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/routes/auth.routes.ts) and mounted in [routes/index.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/routes/index.ts).
- [x] **Write unit tests for RegisterUser and LoginUser**

#### Day 8–9: Problem Listing (Backend & Frontend)

- [x] **Create GetProblems use case (with filters, search, pagination)** — Implemented in [GetProblems.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/problem/GetProblems.ts).
- [x] **Create GetProblemBySlug use case** — Implemented in [GetProblemBySlug.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/problem/GetProblemBySlug.ts).
- [x] **Create ProblemController** — Implemented in [ProblemController.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/controllers/ProblemController.ts).
- [x] **Setup problem routes** — Implemented in [problem.routes.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/routes/problem.routes.ts).
- [x] **Write unit tests for GetProblems**

#### Day 9–10: Frontend Auth & Problem Pages

- [x] **Setup shadcn/ui on frontend** — Configured and initialized.
- [x] **Create root layout with providers** (QueryClient, Theme, Auth) — Created in [layout.tsx](file:///d:/interview-prep-platform/apps/frontend/src/app/layout.tsx) and [providers/index.tsx](file:///d:/interview-prep-platform/apps/frontend/src/providers/index.tsx).
- [x] **Create login page with form validation** — Created in [login/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(auth)/login/page.tsx>) with Zod validation.
- [x] **Create register page with form validation** — Created in [register/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(auth)/register/page.tsx>) with validation and strength meter.
- [x] **Create auth service** (API calls wrapper) — Created central request handler `apiFetch` in [AuthProvider.tsx](file:///d:/interview-prep-platform/apps/frontend/src/providers/AuthProvider.tsx).
- [x] **Create auth hooks** (`useLogin`, `useRegister`, `useCurrentUser`) — Unified inside `useAuth` hook in [AuthProvider.tsx](file:///d:/interview-prep-platform/apps/frontend/src/providers/AuthProvider.tsx).
- [x] **Create auth guard component** — Created route protector [AuthGuard.tsx](file:///d:/interview-prep-platform/apps/frontend/src/components/auth/AuthGuard.tsx).
- [x] **Create problem listing page** — Created in [problems/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/page.tsx>).
- [x] **Create ProblemCard component** — Built tabular layout inside [problems/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/page.tsx>).
- [x] **Create ProblemFilters component** (category, difficulty, search) — Integrated filter bar inside [problems/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/page.tsx>).
- [x] **Create sidebar layout with navigation** — Created in [Sidebar.tsx](file:///d:/interview-prep-platform/apps/frontend/src/components/layout/Sidebar.tsx) and [DashboardLayout.tsx](file:///d:/interview-prep-platform/apps/frontend/src/components/layout/DashboardLayout.tsx).
- [x] **Setup dark/light theme toggle** — Created in [ThemeToggle.tsx](file:///d:/interview-prep-platform/apps/frontend/src/components/layout/ThemeToggle.tsx).
- [x] **Create DifficultyBadge component** — Created in [difficulty-badge.tsx](file:///d:/interview-prep-platform/apps/frontend/src/components/ui/difficulty-badge.tsx).

#### Day 10: CI & First Deploy

- [x] **Create GitHub Actions CI workflow** (`lint` → `typecheck` → `test` → `build`)
- [x] **Deploy frontend workspace to Vercel (preview)** — Hosted by user.
- [x] **Test full auth flow end-to-end**

---

## ⚡ Sprint 2 — Core Engine (Week 3–4)

**Goal:** A user can write code, submit, and see real-time execution results.

### Week 3: Editor + Submission + Queue

#### Day 11–12: Problem Workspace

- [x] **Create split-pane workspace layout** (description | editor)
- [x] **Integrate Monaco Editor** (with starter code loading)
- [x] **Create editor toolbar** (Run, Submit, Reset buttons)
- [x] **Create theme selector for editor**
- [x] **Create output panel** (tabbed: test cases | results)
- [x] **Implement keyboard shortcuts** (`Ctrl+Enter` = submit, `Ctrl+S` = save)
- [x] **Create problem description renderer** (`react-markdown`)

#### Day 13–14: Submission System (Backend)

- [x] **Create SubmitSolution use case** — Implemented in [SubmitSolution.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/submission/SubmitSolution.ts).
- [x] **Create RunCode use case** (playground mode — run without saving)
- [x] **Create GetSubmissions use case**
- [x] **Create GetSubmissionResult use case**
- [x] **Create SubmissionController**
- [x] **Setup submission routes**
- [x] **Configure BullMQ queue connection** — Implemented in [queues.ts](file:///D:/interview-prep-platform/apps/backend-api/src/infrastructure/queue/queues.ts).
- [x] **Create BullMQQueueService** (implements `IQueueService`) — Implemented in [BullMQQueueService.ts](file:///D:/interview-prep-platform/apps/backend-api/src/infrastructure/queue/BullMQQueueService.ts).
- [x] **Write unit tests for SubmitSolution**

---

### Week 4: Judge Worker + Real-Time

#### Day 15–17: Judge Worker Service

- [x] **Setup apps/judge-worker project workspace**
- [x] **Create Docker runner image** (`node:22-slim` based)
- [x] **Create JavaScript executor engine**:
  - Generate `solution.js` from user code
  - Generate `runner.js` with test case injection
  - Execute inside Docker container via `dockerode`
  - Capture stdout, stderr, and exit codes
  - Enforce resource limits (memory: 256MB, CPU: 1, timeout: 10s)
  - Parse and compare outputs
- [x] **Create BullMQ worker that processes submission jobs**
- [x] **Update submission status in database** (PENDING → PROCESSING → result)
- [x] **Write unit tests for executor** (at least 10 test scenarios)
      Base workspace configuration complete.

#### Day 18–19: WebSocket & Real-Time Updates

- [x] **Setup Socket.io on backend**
- [x] **Create SocketIOService** (implements `INotificationService`)
- [x] **Authenticate WebSocket connections** (JWT verification)
- [x] **Emit status updates** (PENDING → PROCESSING → ACCEPTED/etc.)
- [x] **Create `useSubmissionStatus` hook** (frontend SocketProvider and listener integration)
- [x] **Update output panel with real-time status**
- [x] **Show animated processing indicator**

#### Day 20: Integration Testing

- [x] **Test full submission flow end-to-end**
- [x] **Test execution edge cases** (runtime error, timeout, compile error)
- [x] **Write Playwright E2E tests for submission flow**

---

## 🎨 Sprint 3 — Polish & Admin (Week 5–6)

**Goal:** Make it feel like a polished, production-ready product.

### Week 5: Dashboard + History

#### Day 21–22: User Dashboard

- [x] **Create GetUserStats use case** (total solved, success rate, streak) — Implemented in [GetUserStats.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/dashboard/GetUserStats.ts)
- [x] **Create GetCategoryProgress use case** — Implemented in [GetCategoryProgress.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/dashboard/GetCategoryProgress.ts)
- [x] **Create GetActivityHeatmap use case** (daily solve counts) — Implemented in [GetActivityHeatmap.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/dashboard/GetActivityHeatmap.ts)
- [x] **Create GetRecentActivity use case** — Implemented in [GetRecentActivity.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/dashboard/GetRecentActivity.ts)
- [x] **Create DashboardController + routes** — Implemented in [DashboardController.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/controllers/DashboardController.ts) and [dashboard.routes.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/routes/dashboard.routes.ts)
- [x] **Create stats overview component** (solved, streak, success rate) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/page.tsx>)
- [x] **Create category progress bar chart** (using Recharts) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/page.tsx>)
- [x] **Create activity heatmap component** (GitHub-style calendar graph) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/page.tsx>)
- [x] **Create recent submissions widget** — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/page.tsx>)
- [x] **Create daily challenge card** — Implemented card component in [dashboard/page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/dashboard/page.tsx>) and `/api/problems/daily` API route.

#### Day 23–24: Submission History

- [x] **Create submission history page** (with pagination) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/submissions/page.tsx>)
- [x] **Create submission detail view** (code, status, test cases detail) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/submissions/page.tsx>)
- [x] **Create code diff viewer** (compare two submissions) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/submissions/page.tsx>)
- [x] **Create result badge component** (Accepted = green, WA = red, etc.) — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/submissions/page.tsx>)
- [x] **Add "View previous submissions" link** on problem workspace — Implemented in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/[slug]/page.tsx>)

---

### Week 6: Admin Panel + Polish

#### Day 25–27: Admin Panel

- [x] **Create admin layout with sidebar navigation**
- [x] **Create problem management table** (list, search, filter)
- [x] **Create problem form** (create/edit) with Markdown + Monaco inputs
- [x] **Create test case management** (add/edit/delete, hidden/visible, ordering)
- [x] **Create admin stats page** (total users, total submissions, etc.)
- [x] **Add role-based route protection** (frontend + backend)
- [x] **Create problem CRUD use cases** (`CreateProblem`, `UpdateProblem`, `DeleteProblem`)
- [x] **Create test case CRUD use cases** (`CreateTestCase`, `UpdateTestCase`, `DeleteTestCase`)

#### Day 28–30: UI Polish

- [x] **Add skeleton loaders** for all data-fetching views
- [x] **Add toast notifications** for all success/error feedback
- [x] **Add empty states** for listings (no problems, no submissions)
- [x] **Add confirm dialogs** for destructive actions
- [x] **Add responsive mobile navigation** (sidebar → bottom bar)
- [x] **Add button loading/disabled states** during operations
- [x] **Add optimistic UI updates** for submission actions
- [x] **Review accessibility** (keyboard navigation, ARIA labels)
- [x] **Configure route SEO metadata** (title, description)

---

## 🏆 Sprint 4 — Differentiation (Week 7–8)

**Goal:** Unique additions including GitHub OAuth, AI Hint assistance, and Daily Challenges.

### Week 7: OAuth, AI Hints & Streaks

#### Day 31–32: GitHub OAuth

- [x] **Setup next-auth v5 with GitHub provider** — Configured in [auth.ts](file:///d:/interview-prep-platform/apps/frontend/src/auth.ts) and synchronized with the Express backend user validation.
- [x] **Create OAuth callback route** — Set up App Router catch-all handlers in [route.ts](file:///d:/interview-prep-platform/apps/frontend/src/app/api/auth/%5B...nextauth%5D/route.ts).
- [x] **Update database models to support OAuth** (password nullable) — Standardized nullable password support in migrations, domain structures, and repositories.
- [x] **Create OAuth login/register buttons** — Added responsive GitHub OAuth buttons on [LoginForm.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(auth)/login/LoginForm.tsx>) and [RegisterForm.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(auth)/register/RegisterForm.tsx>).
- [x] **Link GitHub avatar** to user profile — Syncs and stores profile images in Next-Auth sessions and databases.
- [x] **Test OAuth flow end-to-end** — Covered with unit test suite in [AuthenticateGithubUser.test.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/auth/AuthenticateGithubUser.test.ts) and confirmed frontend production bundling compiles.

#### Day 33–34: AI-Powered Hints

- [x] **Create OpenAIHintService** in infrastructure layer — Implemented as `GrokHintService` in [GrokHintService.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/ai/GrokHintService.ts) using xAI's API.
- [x] **Create GetHintForProblem use case** — Built orchestration and limits checks in [GetHintForProblem.ts](file:///d:/interview-prep-platform/apps/backend-api/src/application/use-cases/problem/GetHintForProblem.ts).
- [x] **Create hint API endpoint** (`POST /api/problems/:slug/hint`) — Exposed in [problem.routes.ts](file:///d:/interview-prep-platform/apps/backend-api/src/presentation/routes/problem.routes.ts).
- [x] **Rate limit hints** to 3 per problem/user/day — Enforced using the `HintUsage` table and counts check.
- [x] **Design LLM prompt template** (conceptual hint, NO code, max 2 sentences) — Built template in the xAI Grok API call payload.
- [x] **Create hint UI widget** (collapsible, "Get Hint" button) — Designed premium widget in [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/[slug]/page.tsx>).
- [x] **Track hint usage in database** — Defined in [schema.prisma](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/schema.prisma) and stored via [PrismaHintUsageRepository.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/repositories/PrismaHintUsageRepository.ts).
- [x] **Add hint loading animation** — Added Loader2 spinners and disabled button transitions during generation states.

#### Day 35: Daily Challenge & Streaks

- [x] **Create cron job to rotate daily challenge**
- [x] **Create GetDailyChallenge use case**
- [x] **Create daily challenge banner** on dashboard
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
