# InterviewPrep Platform — Revised Implementation Plan

## Version: v2.0

## Author: Rishnu DK

## Architecture: Clean Architecture (Hexagonal / Ports & Adapters)

## Status: Ready to Build

---

# Table of Contents

1. [Tech Stack (Revised)](#1-tech-stack-revised)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Clean Architecture — Backend](#3-clean-architecture--backend)
4. [Clean Architecture — Frontend](#4-clean-architecture--frontend)
5. [Database Schema (Revised)](#5-database-schema-revised)
6. [Sprint 1 — Foundation](#6-sprint-1--foundation-week-12)
7. [Sprint 2 — Core Engine](#7-sprint-2--core-engine-week-34)
8. [Sprint 3 — Polish & Admin](#8-sprint-3--polish--admin-week-56)
9. [Sprint 4 — Differentiation](#9-sprint-4--differentiation-week-78)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Testing Strategy](#11-testing-strategy)
12. [API Documentation](#12-api-documentation)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Naming Conventions](#14-naming-conventions)
15. [Environment Variables](#15-environment-variables)
16. [MVP Completion Criteria (Revised)](#16-mvp-completion-criteria-revised)

---

# 1. Tech Stack (Revised)

## Frontend

| Category | Library | Version | Why |
|---|---|---|---|
| Framework | Next.js (App Router) | 15+ | SSR, file-based routing, React Server Components |
| Language | TypeScript | 5.5+ | Type safety end-to-end |
| Styling | Tailwind CSS | v4+ | Utility-first, fast development |
| UI Components | shadcn/ui | latest | Owned, customizable, accessible components |
| State (Client) | Zustand | 5+ | Lightweight client-only state (theme, sidebar, UI) |
| State (Server) | TanStack Query | v5+ | Server state caching, mutations, optimistic updates |
| Forms | React Hook Form | 7+ | Performant, uncontrolled forms |
| Validation | Zod | 3+ | Shared schemas with backend |
| Code Editor | Monaco Editor (@monaco-editor/react) | latest | VS Code-grade editor |
| Icons | Lucide React | latest | Clean, consistent icon set |
| Charts | Recharts | 2+ | Dashboard analytics visualizations |
| Markdown | react-markdown + rehype-highlight | latest | Rich problem descriptions |
| Auth | next-auth (Auth.js) v5 | 5+ | GitHub OAuth + credentials provider |
| HTTP Client | Native fetch (thin wrapper) | — | No Axios — Next.js extends fetch with caching |
| Date | date-fns | 4+ | Lightweight date formatting |
| Env Validation | @t3-oss/env-nextjs | latest | Type-safe environment variables |

## Backend

| Category | Library | Version | Why |
|---|---|---|---|
| Runtime | Node.js | 22+ | Native --env-file, stable ES modules |
| Framework | Express.js | 5+ | Mature ecosystem (or Fastify if preferred) |
| Language | TypeScript | 5.5+ | Shared types with frontend |
| ORM | Prisma | 6+ | Best TypeScript DX for PostgreSQL |
| Database | PostgreSQL | 16+ | Via Supabase |
| Queue | BullMQ | 5+ | Production-grade queue on Redis (NOT raw Redis) |
| Cache | ioredis | 5+ | Redis client (used by BullMQ internally) |
| Password Hashing | argon2 | 0.40+ | OWASP recommended (replaces bcrypt) |
| JWT | jose | 5+ | Modern, Edge-compatible (replaces jsonwebtoken) |
| Validation | Zod | 3+ | Shared with frontend |
| Logging | pino + pino-pretty | 9+ | Structured JSON logging (replaces winston + morgan) |
| Security | helmet | 8+ | HTTP security headers |
| CORS | cors | 2+ | Cross-origin handling |
| Rate Limiting | express-rate-limit | 7+ | API protection |
| API Docs | swagger-jsdoc + swagger-ui-express | latest | Interactive OpenAPI documentation |
| Dev Runner | tsx | latest | Fast TypeScript execution (replaces ts-node-dev) |

## Judge Worker

| Category | Library | Version | Why |
|---|---|---|---|
| Runtime | Node.js | 22+ | Same runtime as backend |
| Language | TypeScript | 5.5+ | Consistent across services |
| Docker API | dockerode | latest | Programmatic Docker container management |
| Queue | BullMQ | 5+ | Same queue as backend |
| Redis | ioredis | 5+ | Queue transport |

## DevOps & Quality

| Category | Library | Why |
|---|---|---|
| Monorepo | Turborepo | Build orchestration, caching, task pipelines |
| Testing (Unit) | Vitest | Faster than Jest, native TypeScript |
| Testing (E2E) | Playwright | Cross-browser E2E testing |
| Linting | ESLint v9 (flat config) | Code quality |
| Formatting | Prettier | Consistent code style |
| Git Hooks | husky + lint-staged | Pre-commit linting/formatting |
| Error Tracking | @sentry/node + @sentry/nextjs | Production error monitoring (free tier) |
| CI/CD | GitHub Actions | Automated lint → test → build → deploy |

---

# 2. Monorepo Structure

```text
interview-prep-platform/
│
├── apps/
│   ├── frontend/                    # Next.js application
│   ├── backend-api/                 # Express API server
│   └── judge-worker/                # Docker-based code execution service
│
├── packages/
│   ├── shared-types/                # Shared TypeScript types & Zod schemas
│   │   ├── src/
│   │   │   ├── entities/
│   │   │   │   ├── user.ts
│   │   │   │   ├── problem.ts
│   │   │   │   ├── submission.ts
│   │   │   │   └── test-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── auth.dto.ts
│   │   │   │   ├── problem.dto.ts
│   │   │   │   └── submission.dto.ts
│   │   │   ├── enums/
│   │   │   │   ├── difficulty.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── submission-status.ts
│   │   │   │   └── user-role.ts
│   │   │   ├── api/
│   │   │   │   ├── responses.ts       # ApiResponse<T>, PaginatedResponse<T>
│   │   │   │   └── errors.ts          # Error code enums
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-utils/                 # Shared utility functions
│       ├── src/
│       │   ├── slug.ts
│       │   ├── format-date.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.judge
│   │   └── Dockerfile.runner         # Sandboxed JS execution image
│   ├── docker-compose.yml            # Full local dev environment
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + Test + Build
│       ├── deploy-frontend.yml       # Vercel deploy
│       └── deploy-backend.yml        # VPS deploy
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── setup-guide.md
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace config
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── .husky/
│   └── pre-commit
└── README.md                         # Architecture diagram, demo GIF, badges
```

---

# 3. Clean Architecture — Backend

## Layer Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│          (Express routes, controllers, middleware)           │
│   Depends on ↓                                              │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│            (Use cases, DTOs, orchestration)                  │
│   Depends on ↓                                              │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                           │
│     (Entities, Value Objects, Ports/Interfaces, Errors)     │
│   Depends on → NOTHING (pure business logic)                │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                        │
│      (Prisma repos, Redis, JWT, BullMQ, Socket.io)          │
│   Implements Domain Ports                                   │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule: Dependencies point INWARD only. Domain never imports from infrastructure.**

---

## Backend Folder Structure

```text
apps/backend-api/
└── src/
    │
    ├── domain/                          # 🟢 CORE — Zero framework imports
    │   ├── entities/
    │   │   ├── User.ts                  # User entity class with business rules
    │   │   ├── Problem.ts               # Problem entity
    │   │   ├── Submission.ts            # Submission entity with status transitions
    │   │   ├── TestCase.ts              # TestCase entity
    │   │   └── SubmissionResult.ts      # Result entity
    │   │
    │   ├── value-objects/
    │   │   ├── Email.ts                 # Self-validating: Email.create("x@y.com")
    │   │   ├── HashedPassword.ts        # Wraps hashed password string
    │   │   ├── Slug.ts                  # Auto-generates from title
    │   │   ├── Difficulty.ts            # Enum-like: EASY | MEDIUM | HARD
    │   │   └── SubmissionStatus.ts      # PENDING | PROCESSING | ACCEPTED | etc.
    │   │
    │   ├── errors/
    │   │   ├── DomainError.ts           # Base: abstract class DomainError extends Error
    │   │   ├── NotFoundError.ts         # Entity not found
    │   │   ├── ValidationError.ts       # Invalid input
    │   │   ├── AuthenticationError.ts   # Invalid credentials
    │   │   ├── AuthorizationError.ts    # Insufficient permissions
    │   │   └── ConflictError.ts         # Duplicate email, slug, etc.
    │   │
    │   └── ports/                       # 🔌 Interfaces (contracts)
    │       ├── repositories/
    │       │   ├── IUserRepository.ts
    │       │   ├── IProblemRepository.ts
    │       │   ├── ISubmissionRepository.ts
    │       │   └── ITestCaseRepository.ts
    │       ├── services/
    │       │   ├── IAuthTokenService.ts     # generate, verify, refresh tokens
    │       │   ├── IPasswordService.ts      # hash, compare passwords
    │       │   ├── IQueueService.ts         # enqueue, getJobStatus
    │       │   ├── ICacheService.ts         # get, set, invalidate
    │       │   └── INotificationService.ts  # WebSocket event emission
    │       └── index.ts
    │
    ├── application/                     # 🟡 USE CASES — Orchestration logic
    │   ├── use-cases/
    │   │   ├── auth/
    │   │   │   ├── RegisterUser.ts      # Validates, hashes password, creates user
    │   │   │   ├── LoginUser.ts         # Validates credentials, returns tokens
    │   │   │   ├── RefreshToken.ts      # Validates refresh token, returns new pair
    │   │   │   └── GetCurrentUser.ts    # Returns user profile from token
    │   │   │
    │   │   ├── problem/
    │   │   │   ├── CreateProblem.ts      # Admin creates problem + starter code
    │   │   │   ├── UpdateProblem.ts      # Admin edits problem
    │   │   │   ├── DeleteProblem.ts      # Admin deletes (soft delete)
    │   │   │   ├── GetProblems.ts        # List with filters, pagination, search
    │   │   │   ├── GetProblemBySlug.ts   # Single problem detail
    │   │   │   └── GetDailyChallenge.ts  # Returns today's challenge
    │   │   │
    │   │   ├── submission/
    │   │   │   ├── SubmitSolution.ts     # Stores submission, enqueues job
    │   │   │   ├── RunCode.ts           # Run without submitting (playground mode)
    │   │   │   ├── GetSubmissions.ts     # User's submission history
    │   │   │   └── GetSubmissionResult.ts # Single result with test case details
    │   │   │
    │   │   ├── test-case/
    │   │   │   ├── CreateTestCase.ts
    │   │   │   ├── UpdateTestCase.ts
    │   │   │   └── DeleteTestCase.ts
    │   │   │
    │   │   └── dashboard/
    │   │       ├── GetUserStats.ts       # Solved count, success rate, streaks
    │   │       ├── GetCategoryProgress.ts # Progress per category
    │   │       ├── GetActivityHeatmap.ts  # GitHub-style contribution data
    │   │       └── GetRecentActivity.ts   # Last N submissions
    │   │
    │   ├── dto/                          # Data Transfer Objects (input/output)
    │   │   ├── auth/
    │   │   │   ├── RegisterDTO.ts
    │   │   │   ├── LoginDTO.ts
    │   │   │   └── AuthResponseDTO.ts
    │   │   ├── problem/
    │   │   │   ├── CreateProblemDTO.ts
    │   │   │   ├── UpdateProblemDTO.ts
    │   │   │   ├── ProblemFilterDTO.ts
    │   │   │   └── ProblemResponseDTO.ts
    │   │   ├── submission/
    │   │   │   ├── SubmitSolutionDTO.ts
    │   │   │   ├── RunCodeDTO.ts
    │   │   │   └── SubmissionResponseDTO.ts
    │   │   └── dashboard/
    │   │       └── UserStatsDTO.ts
    │   │
    │   └── interfaces/                   # Application-level interfaces
    │       └── IUseCase.ts               # interface IUseCase<TInput, TOutput>
    │
    ├── infrastructure/                  # 🔴 IMPLEMENTATIONS — Framework-specific
    │   ├── database/
    │   │   ├── prisma/
    │   │   │   ├── schema.prisma
    │   │   │   ├── migrations/
    │   │   │   └── seed.ts              # Seed 15+ real problems
    │   │   └── repositories/
    │   │       ├── PrismaUserRepository.ts         # implements IUserRepository
    │   │       ├── PrismaProblemRepository.ts       # implements IProblemRepository
    │   │       ├── PrismaSubmissionRepository.ts    # implements ISubmissionRepository
    │   │       └── PrismaTestCaseRepository.ts      # implements ITestCaseRepository
    │   │
    │   ├── queue/
    │   │   ├── BullMQQueueService.ts    # implements IQueueService
    │   │   ├── queues.ts                # Queue definitions (submission queue)
    │   │   └── processors.ts            # Job processors
    │   │
    │   ├── cache/
    │   │   ├── RedisCacheService.ts     # implements ICacheService
    │   │   └── cache-keys.ts            # Centralized cache key definitions
    │   │
    │   ├── auth/
    │   │   ├── JoseAuthTokenService.ts  # implements IAuthTokenService (using jose)
    │   │   └── Argon2PasswordService.ts # implements IPasswordService (using argon2)
    │   │
    │   ├── websocket/
    │   │   ├── SocketIOService.ts       # implements INotificationService
    │   │   └── socket-events.ts         # Event name constants
    │   │
    │   └── external/
    │       └── OpenAIHintService.ts     # AI hints integration (Phase 4)
    │
    ├── presentation/                    # 🔵 HTTP LAYER — Express-specific
    │   ├── controllers/
    │   │   ├── AuthController.ts
    │   │   ├── ProblemController.ts
    │   │   ├── SubmissionController.ts
    │   │   ├── TestCaseController.ts
    │   │   ├── DashboardController.ts
    │   │   └── HealthController.ts      # /health and /ready endpoints
    │   │
    │   ├── middleware/
    │   │   ├── authenticate.ts          # JWT verification
    │   │   ├── authorize.ts             # Role-based (STUDENT, ADMIN)
    │   │   ├── error-handler.ts         # Global error handler (maps DomainErrors to HTTP)
    │   │   ├── rate-limiter.ts          # express-rate-limit config
    │   │   ├── validate-request.ts      # Zod schema validation middleware
    │   │   ├── request-id.ts            # X-Request-ID header injection
    │   │   └── request-logger.ts        # pino HTTP logging
    │   │
    │   ├── routes/
    │   │   ├── auth.routes.ts
    │   │   ├── problem.routes.ts
    │   │   ├── submission.routes.ts
    │   │   ├── test-case.routes.ts
    │   │   ├── dashboard.routes.ts
    │   │   ├── health.routes.ts
    │   │   └── index.ts                 # Route aggregator
    │   │
    │   └── docs/
    │       └── swagger.ts               # OpenAPI/Swagger configuration
    │
    ├── container/                       # 💉 DEPENDENCY INJECTION
    │   ├── container.ts                 # Manual DI wiring
    │   └── types.ts                     # DI token constants
    │
    ├── config/
    │   ├── env.ts                       # Zod-validated env variables
    │   ├── database.ts                  # Prisma client singleton
    │   ├── redis.ts                     # ioredis connection
    │   ├── logger.ts                    # pino instance
    │   └── constants.ts                 # App-wide constants
    │
    ├── app.ts                           # Express app bootstrap
    ├── server.ts                        # Server start with graceful shutdown
    └── global.d.ts                      # TypeScript augmentations
```

---

## Dependency Injection — container.ts Example

```typescript
// apps/backend-api/src/container/container.ts

import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaProblemRepository } from '../infrastructure/database/repositories/PrismaProblemRepository';
import { PrismaSubmissionRepository } from '../infrastructure/database/repositories/PrismaSubmissionRepository';
import { PrismaTestCaseRepository } from '../infrastructure/database/repositories/PrismaTestCaseRepository';
import { JoseAuthTokenService } from '../infrastructure/auth/JoseAuthTokenService';
import { Argon2PasswordService } from '../infrastructure/auth/Argon2PasswordService';
import { BullMQQueueService } from '../infrastructure/queue/BullMQQueueService';
import { RedisCacheService } from '../infrastructure/cache/RedisCacheService';
import { SocketIOService } from '../infrastructure/websocket/SocketIOService';

// Use Cases
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { GetProblems } from '../application/use-cases/problem/GetProblems';
import { SubmitSolution } from '../application/use-cases/submission/SubmitSolution';
// ... more use cases

import { prisma } from '../config/database';
import { redis } from '../config/redis';

// --- Instantiate Infrastructure ---
const userRepository = new PrismaUserRepository(prisma);
const problemRepository = new PrismaProblemRepository(prisma);
const submissionRepository = new PrismaSubmissionRepository(prisma);
const testCaseRepository = new PrismaTestCaseRepository(prisma);

const authTokenService = new JoseAuthTokenService();
const passwordService = new Argon2PasswordService();
const queueService = new BullMQQueueService(redis);
const cacheService = new RedisCacheService(redis);
const notificationService = new SocketIOService();

// --- Instantiate Use Cases ---
export const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
export const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
export const getProblems = new GetProblems(problemRepository, cacheService);
export const submitSolution = new SubmitSolution(submissionRepository, queueService, notificationService);
// ... more use cases

// --- Export for Controllers ---
export const container = {
  // Repositories (if controllers need direct access)
  userRepository,
  problemRepository,
  submissionRepository,

  // Use Cases
  registerUser,
  loginUser,
  getProblems,
  submitSolution,

  // Services (for middleware)
  authTokenService,
  notificationService,
};
```

---

## Use Case Pattern — IUseCase Interface

```typescript
// apps/backend-api/src/application/interfaces/IUseCase.ts

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
```

```typescript
// apps/backend-api/src/application/use-cases/auth/RegisterUser.ts

import { IUseCase } from '../../interfaces/IUseCase';
import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { IPasswordService } from '../../../domain/ports/services/IPasswordService';
import { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import { RegisterDTO } from '../../dto/auth/RegisterDTO';
import { AuthResponseDTO } from '../../dto/auth/AuthResponseDTO';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { ConflictError } from '../../../domain/errors/ConflictError';

export class RegisterUser implements IUseCase<RegisterDTO, AuthResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(input: RegisterDTO): Promise<AuthResponseDTO> {
    const email = Email.create(input.email); // Value object validates format

    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hash(input.password);

    const user = User.create({
      name: input.name,
      email: email.value,
      password: hashedPassword,
      role: 'STUDENT',
    });

    const savedUser = await this.userRepository.create(user);

    const accessToken = await this.authTokenService.generateAccessToken(savedUser.id, savedUser.role);
    const refreshToken = await this.authTokenService.generateRefreshToken(savedUser.id);

    return {
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email, role: savedUser.role },
      accessToken,
      refreshToken,
    };
  }
}
```

---

## Error Handler — Maps Domain Errors to HTTP

```typescript
// apps/backend-api/src/presentation/middleware/error-handler.ts

import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors/DomainError';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { AuthenticationError } from '../../domain/errors/AuthenticationError';
import { AuthorizationError } from '../../domain/errors/AuthorizationError';
import { ConflictError } from '../../domain/errors/ConflictError';
import { logger } from '../../config/logger';

const errorStatusMap = new Map<string, number>([
  [NotFoundError.name, 404],
  [ValidationError.name, 400],
  [AuthenticationError.name, 401],
  [AuthorizationError.name, 403],
  [ConflictError.name, 409],
]);

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.headers['x-request-id'];

  if (err instanceof DomainError) {
    const status = errorStatusMap.get(err.constructor.name) ?? 500;
    logger.warn({ err, requestId, path: req.path }, 'Domain error');
    return res.status(status).json({
      success: false,
      error: { code: err.code, message: err.message },
      requestId,
    });
  }

  // Unexpected errors
  logger.error({ err, requestId, path: req.path }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    requestId,
  });
}
```

---

# 4. Clean Architecture — Frontend

## Frontend Folder Structure

```text
apps/frontend/
└── src/
    ├── app/                             # Next.js App Router pages
    │   ├── (auth)/                      # Auth route group (no layout nesting)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── register/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx               # Minimal layout for auth pages
    │   │
    │   ├── (main)/                      # Authenticated route group
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── problems/
    │   │   │   ├── page.tsx             # Problem listing
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx         # Problem workspace (editor + description)
    │   │   ├── submissions/
    │   │   │   └── page.tsx
    │   │   ├── profile/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx               # Sidebar + header layout
    │   │
    │   ├── (admin)/                     # Admin route group
    │   │   ├── admin/
    │   │   │   ├── page.tsx             # Admin dashboard
    │   │   │   ├── problems/
    │   │   │   │   ├── page.tsx         # Problem management
    │   │   │   │   ├── new/
    │   │   │   │   │   └── page.tsx     # Create problem form
    │   │   │   │   └── [id]/
    │   │   │   │       └── edit/
    │   │   │   │           └── page.tsx # Edit problem form
    │   │   │   └── test-cases/
    │   │   │       └── page.tsx
    │   │   └── layout.tsx               # Admin layout with sidebar
    │   │
    │   ├── api/                         # Next.js API routes (auth callbacks)
    │   │   └── auth/
    │   │       └── [...nextauth]/
    │   │           └── route.ts
    │   │
    │   ├── layout.tsx                   # Root layout (providers, fonts, metadata)
    │   ├── page.tsx                     # Landing page
    │   ├── not-found.tsx
    │   ├── error.tsx                    # Error boundary
    │   └── globals.css
    │
    ├── components/                      # Shared/reusable components
    │   ├── ui/                          # shadcn/ui components (auto-generated)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   └── ...
    │   │
    │   ├── layout/
    │   │   ├── sidebar.tsx
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── mobile-nav.tsx
    │   │   └── theme-toggle.tsx
    │   │
    │   ├── common/
    │   │   ├── loading-skeleton.tsx
    │   │   ├── error-boundary.tsx
    │   │   ├── empty-state.tsx
    │   │   ├── pagination.tsx
    │   │   └── confirm-dialog.tsx
    │   │
    │   └── charts/
    │       ├── heatmap-calendar.tsx      # GitHub-style contribution graph
    │       ├── progress-ring.tsx         # Circular progress indicator
    │       └── category-bar-chart.tsx    # Progress per category
    │
    ├── features/                        # Feature modules (domain-driven)
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── login-form.tsx
    │   │   │   ├── register-form.tsx
    │   │   │   ├── oauth-buttons.tsx
    │   │   │   └── auth-guard.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-login.ts         # TanStack Query mutation
    │   │   │   ├── use-register.ts
    │   │   │   └── use-current-user.ts
    │   │   ├── services/
    │   │   │   └── auth.service.ts      # API calls (fetch wrapper)
    │   │   ├── schemas/
    │   │   │   └── auth.schema.ts       # Zod schemas for forms
    │   │   └── index.ts                 # Public exports
    │   │
    │   ├── problem/
    │   │   ├── components/
    │   │   │   ├── problem-card.tsx
    │   │   │   ├── problem-table.tsx
    │   │   │   ├── problem-filters.tsx
    │   │   │   ├── problem-description.tsx   # Markdown rendered
    │   │   │   ├── problem-workspace.tsx     # Split-pane layout
    │   │   │   └── difficulty-badge.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-problems.ts
    │   │   │   ├── use-problem-detail.ts
    │   │   │   └── use-daily-challenge.ts
    │   │   ├── services/
    │   │   │   └── problem.service.ts
    │   │   ├── schemas/
    │   │   │   └── problem.schema.ts
    │   │   └── index.ts
    │   │
    │   ├── editor/
    │   │   ├── components/
    │   │   │   ├── code-editor.tsx           # Monaco wrapper
    │   │   │   ├── editor-toolbar.tsx        # Run, Submit, Reset buttons
    │   │   │   ├── theme-selector.tsx
    │   │   │   ├── output-panel.tsx          # Test results display
    │   │   │   └── test-case-tabs.tsx        # Switch between test cases
    │   │   ├── hooks/
    │   │   │   ├── use-editor-settings.ts
    │   │   │   └── use-keyboard-shortcuts.ts # Ctrl+Enter, Ctrl+S
    │   │   ├── constants/
    │   │   │   └── editor-themes.ts
    │   │   └── index.ts
    │   │
    │   ├── submission/
    │   │   ├── components/
    │   │   │   ├── submission-table.tsx
    │   │   │   ├── submission-detail.tsx
    │   │   │   ├── result-badge.tsx
    │   │   │   └── code-diff-viewer.tsx      # Compare submissions
    │   │   ├── hooks/
    │   │   │   ├── use-submit-solution.ts
    │   │   │   ├── use-run-code.ts
    │   │   │   ├── use-submissions.ts
    │   │   │   └── use-submission-status.ts  # WebSocket real-time updates
    │   │   ├── services/
    │   │   │   ├── submission.service.ts
    │   │   │   └── websocket.service.ts
    │   │   └── index.ts
    │   │
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── stats-overview.tsx        # Solved, streak, success rate
    │   │   │   ├── category-progress.tsx
    │   │   │   ├── recent-submissions.tsx
    │   │   │   ├── activity-heatmap.tsx
    │   │   │   └── daily-challenge-card.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-user-stats.ts
    │   │   │   └── use-activity-data.ts
    │   │   ├── services/
    │   │   │   └── dashboard.service.ts
    │   │   └── index.ts
    │   │
    │   └── admin/
    │       ├── components/
    │       │   ├── problem-form.tsx          # Create/Edit problem form
    │       │   ├── test-case-form.tsx
    │       │   ├── problem-management-table.tsx
    │       │   └── admin-stats.tsx
    │       ├── hooks/
    │       │   ├── use-create-problem.ts
    │       │   ├── use-update-problem.ts
    │       │   └── use-manage-test-cases.ts
    │       ├── services/
    │       │   └── admin.service.ts
    │       └── index.ts
    │
    ├── hooks/                           # Global hooks
    │   ├── use-debounce.ts
    │   ├── use-local-storage.ts
    │   ├── use-media-query.ts
    │   └── use-toast.ts
    │
    ├── lib/
    │   ├── api-client.ts                # Fetch wrapper with auth headers, error handling
    │   ├── auth.ts                      # next-auth configuration
    │   ├── utils.ts                     # cn() helper, etc.
    │   └── query-client.ts             # TanStack Query client config
    │
    ├── stores/                          # Zustand — CLIENT state only
    │   ├── ui.store.ts                  # Sidebar, modals, theme
    │   └── editor.store.ts             # Editor settings (font size, tab size, theme)
    │
    ├── providers/
    │   ├── query-provider.tsx           # TanStack Query provider
    │   ├── theme-provider.tsx           # Dark/light theme
    │   ├── auth-provider.tsx            # Session provider
    │   └── toast-provider.tsx
    │
    ├── types/
    │   └── index.ts                     # Re-exports from @interviewprep/types
    │
    └── constants/
        ├── routes.ts                    # Route path constants
        ├── query-keys.ts               # TanStack Query key factory
        └── site.ts                      # Site metadata, links
```

---

# 5. Database Schema (Revised)

## Prisma Schema

```prisma
// apps/backend-api/src/infrastructure/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  STUDENT
  ADMIN
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum Category {
  JAVASCRIPT
  REACT
  NODEJS
  TYPESCRIPT
}

enum SubmissionStatus {
  PENDING
  PROCESSING
  ACCEPTED
  WRONG_ANSWER
  RUNTIME_ERROR
  COMPILATION_ERROR
  TIME_LIMIT_EXCEEDED
}

model User {
  id            String       @id @default(cuid())
  name          String
  email         String       @unique
  password      String?      // Nullable for OAuth users
  image         String?      // Avatar URL from OAuth
  role          UserRole     @default(STUDENT)
  githubId      String?      @unique  // For GitHub OAuth
  streak        Int          @default(0)
  lastActiveAt  DateTime?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  submissions   Submission[]

  @@index([email])
  @@index([githubId])
  @@map("users")
}

model Problem {
  id            String       @id @default(cuid())
  title         String
  slug          String       @unique
  description   String       @db.Text  // Markdown content
  difficulty    Difficulty
  category      Category
  starterCode   String       @db.Text
  solutionCode  String?      @db.Text  // Reference solution (admin only)
  tags          String[]     // Additional tags for filtering
  order         Int          @default(0) // Display order
  isPublished   Boolean      @default(false)
  solvedCount   Int          @default(0)
  attemptCount  Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  testCases     TestCase[]
  submissions   Submission[]

  @@index([slug])
  @@index([category, difficulty])
  @@index([isPublished])
  @@map("problems")
}

model TestCase {
  id              String   @id @default(cuid())
  problemId       String
  input           String   @db.Text
  expectedOutput  String   @db.Text
  isHidden        Boolean  @default(false)
  order           Int      @default(0)
  createdAt       DateTime @default(now())

  problem         Problem  @relation(fields: [problemId], references: [id], onDelete: Cascade)

  @@index([problemId])
  @@map("test_cases")
}

model Submission {
  id          String           @id @default(cuid())
  userId      String
  problemId   String
  code        String           @db.Text
  language    String           @default("javascript")
  status      SubmissionStatus @default(PENDING)
  createdAt   DateTime         @default(now())

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  problem     Problem          @relation(fields: [problemId], references: [id], onDelete: Cascade)
  result      SubmissionResult?

  @@index([userId, problemId])
  @@index([userId, createdAt])
  @@index([status])
  @@map("submissions")
}

model SubmissionResult {
  id            String     @id @default(cuid())
  submissionId  String     @unique
  runtime       Int?       // Milliseconds
  memory        Int?       // Bytes
  passedCases   Int        @default(0)
  totalCases    Int        @default(0)
  error         String?    @db.Text
  output        String?    @db.Text  // Stdout capture
  createdAt     DateTime   @default(now())

  submission    Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@map("submission_results")
}

model DailyChallenge {
  id          String   @id @default(cuid())
  problemId   String
  date        DateTime @unique @db.Date
  createdAt   DateTime @default(now())

  @@index([date])
  @@map("daily_challenges")
}
```

### Key Improvements Over Original Schema

1. **Composite indexes** on `(userId, problemId)` for fast submission lookups
2. **Soft publish** via `isPublished` flag (problems aren't visible until admin publishes)
3. **OAuth support** with nullable `password` and `githubId` fields
4. **Streak tracking** built into User model
5. **Tags array** on Problem for flexible filtering
6. **DailyChallenge** table for the gamification feature
7. **solvedCount/attemptCount** on Problem for displaying stats without joins
8. **Cascade deletes** to maintain referential integrity
9. **Removed MongoDB** from categories — using `TYPESCRIPT` instead (resolves the contradiction)
10. **Output field** on SubmissionResult to show stdout to users

---

# 6. Sprint 1 — Foundation (Week 1–2)

> **Goal:** "A user can register, log in, and browse problems with filtering."

## Tasks

### Week 1: Setup & Backend Foundation

```text
Day 1–2: Project Setup
- [x] Initialize monorepo with Turborepo
- [x] Setup apps/frontend (Next.js with App Router)
- [x] Setup apps/backend-api (Express + TypeScript)
- [x] Setup packages/shared-types
- [x] Configure ESLint, Prettier, tsconfig across all packages
- [ ] Setup husky + lint-staged for pre-commit hooks
- [x] Create .env.example with all required variables
- [x] Setup docker-compose.yml for PostgreSQL + Redis (local dev)
- [x] Create initial GitHub repository with README

Day 3–4: Database & Domain Layer
- [x] Create Prisma schema (all models from Section 5)
- [ ] Run initial migration
- [ ] Write seed script with 15+ real JavaScript interview problems
- [ ] Create domain entities (User, Problem, TestCase, Submission)
- [ ] Create value objects (Email, Slug, Difficulty, SubmissionStatus)
- [x] Create domain errors (NotFound, Validation, Auth, Conflict)
- [x] Create port interfaces (IUserRepository, IProblemRepository, etc.)

Day 5: Infrastructure Layer
- [ ] Implement PrismaUserRepository
- [ ] Implement PrismaProblemRepository
- [ ] Implement Argon2PasswordService
- [ ] Implement JoseAuthTokenService
- [x] Setup pino logger
- [x] Create env.ts with Zod validation
```

### Week 2: Auth + Problem Listing

```text
Day 6–7: Auth Module (Backend)
- [x] Create RegisterUser use case
- [x] Create LoginUser use case
- [ ] Create RefreshToken use case
- [ ] Create AuthController
- [ ] Create authenticate middleware (JWT verification)
- [ ] Create authorize middleware (role-based)
- [x] Create validate-request middleware (Zod)
- [x] Create error-handler middleware
- [ ] Create rate-limiter middleware
- [ ] Setup auth routes
- [ ] Write unit tests for RegisterUser and LoginUser use cases

Day 8–9: Problem Listing (Backend + Frontend)
- [x] Create GetProblems use case (with filters, search, pagination)
- [ ] Create GetProblemBySlug use case
- [ ] Create ProblemController
- [ ] Setup problem routes
- [ ] Write unit tests for GetProblems use case

Day 9–10: Frontend Auth + Problem Pages
- [ ] Setup shadcn/ui
- [ ] Create root layout with providers (Query, Theme, Auth)
- [ ] Create login page with form validation
- [ ] Create register page with form validation
- [ ] Create auth service (API calls)
- [ ] Create auth hooks (useLogin, useRegister, useCurrentUser)
- [ ] Create auth guard component
- [ ] Create problem listing page
- [ ] Create ProblemCard component
- [ ] Create ProblemFilters component (category, difficulty, search)
- [ ] Create sidebar layout with navigation
- [ ] Setup dark/light theme toggle
- [ ] Create DifficultyBadge component

Day 10: CI + First Deploy
- [ ] Create GitHub Actions CI workflow (lint → typecheck → test → build)
- [ ] Deploy frontend to Vercel (preview)
- [ ] Test full auth flow end-to-end
```

### Sprint 1 Deliverable

A deployed app where a user can:
- ✅ Register with email/password
- ✅ Log in and receive JWT tokens
- ✅ Browse problems with category/difficulty filters
- ✅ Search problems by title
- ✅ See difficulty badges (Easy/Medium/Hard)
- ✅ Dark/light theme toggle
- ✅ CI pipeline runs on every push

---

# 7. Sprint 2 — Core Engine (Week 3–4)

> **Goal:** "A user can write code, submit, and see real-time execution results."

## Tasks

### Week 3: Editor + Submission + Queue

```text
Day 11–12: Problem Workspace
- [ ] Create split-pane layout (description | editor)
- [ ] Integrate Monaco Editor with starter code loading
- [ ] Create editor toolbar (Run, Submit, Reset buttons)
- [ ] Create theme selector for editor
- [ ] Create output panel (tabbed: test cases | results)
- [ ] Implement keyboard shortcuts (Ctrl+Enter = submit, Ctrl+S = save)
- [ ] Create problem description renderer (react-markdown)

Day 13–14: Submission System (Backend)
- [x] Create SubmitSolution use case
- [ ] Create RunCode use case (playground mode — run without saving)
- [ ] Create GetSubmissions use case
- [ ] Create GetSubmissionResult use case
- [ ] Create SubmissionController
- [ ] Setup submission routes
- [ ] Install and configure BullMQ
- [ ] Create BullMQQueueService (implements IQueueService)
- [ ] Write unit tests for SubmitSolution use case
```

### Week 4: Judge Worker + Real-Time

```text
Day 15–17: Judge Worker Service
- [ ] Setup apps/judge-worker project
- [ ] Create Docker runner image (node:22-slim based)
- [ ] Create JavaScript executor
  - [ ] Generate solution.js from user code
  - [ ] Generate runner.js with test case injection
  - [ ] Execute inside Docker container via dockerode
  - [ ] Capture stdout, stderr, exit code
  - [ ] Enforce resource limits (memory: 256MB, CPU: 1, timeout: 10s)
  - [ ] Parse and compare outputs
- [ ] Create BullMQ worker that processes submission jobs
- [ ] Update submission status in database (PENDING → PROCESSING → result)
- [ ] Write unit tests for executor (at least 10 test scenarios)

Day 18–19: WebSocket + Real-Time Updates
- [ ] Setup Socket.io on backend
- [ ] Create SocketIOService (implements INotificationService)
- [ ] Authenticate WebSocket connections (JWT)
- [ ] Emit status updates: PENDING → PROCESSING → ACCEPTED/WRONG_ANSWER/etc.
- [ ] Create useSubmissionStatus hook (frontend WebSocket listener)
- [ ] Update output panel with real-time status
- [ ] Show animated processing indicator

Day 20: Integration Testing
- [ ] Test full submission flow: write code → submit → queue → execute → result
- [ ] Test edge cases: runtime error, timeout, compilation error
- [ ] Write 3+ E2E tests with Playwright for submission flow
```

### Sprint 2 Deliverable

A user can:
- ✅ Open a problem and see description + code editor side by side
- ✅ Write JavaScript code in Monaco Editor
- ✅ Run code against visible test cases (playground mode)
- ✅ Submit solution for evaluation against hidden test cases
- ✅ See real-time status updates (Processing → Result)
- ✅ View pass/fail for each test case
- ✅ See runtime and memory usage

---

# 8. Sprint 3 — Polish & Admin (Week 5–6)

> **Goal:** "This feels like a real product."

## Tasks

### Week 5: Dashboard + History

```text
Day 21–22: User Dashboard
- [ ] Create GetUserStats use case (total solved, success rate, streak)
- [ ] Create GetCategoryProgress use case
- [ ] Create GetActivityHeatmap use case (daily solve count for past year)
- [ ] Create GetRecentActivity use case
- [ ] Create DashboardController + routes
- [ ] Create stats overview component (solved count, streak, success rate)
- [ ] Create category progress bar chart (Recharts)
- [ ] Create activity heatmap component (GitHub-style)
- [ ] Create recent submissions widget
- [ ] Create daily challenge card

Day 23–24: Submission History
- [ ] Create submission history page with pagination
- [ ] Create submission detail view (code, result, test cases)
- [ ] Create code diff viewer (compare two submissions)
- [ ] Create result badge component (Accepted = green, WA = red, etc.)
- [ ] Add "View previous submissions" link on problem page
```

### Week 6: Admin Panel + Polish

```text
Day 25–27: Admin Panel
- [ ] Create admin layout with sidebar navigation
- [ ] Create problem management table (list, search, filter)
- [ ] Create problem form (create + edit) with:
  - [ ] Title, description (Markdown editor), difficulty, category
  - [ ] Starter code input (Monaco Editor)
  - [ ] Solution code input (optional)
  - [ ] Tags input
  - [ ] Publish/Unpublish toggle
- [ ] Create test case management:
  - [ ] Add/edit/delete test cases per problem
  - [ ] Mark as hidden/visible
  - [ ] Order test cases
- [ ] Create admin stats page (total users, total submissions, etc.)
- [ ] Add role-based route protection (frontend + backend)
- [ ] Create CreateProblem, UpdateProblem, DeleteProblem use cases
- [ ] Create CreateTestCase, UpdateTestCase, DeleteTestCase use cases

Day 28–30: UI Polish
- [ ] Add skeleton loaders for all data-fetching pages
- [ ] Add toast notifications for all actions (success, error)
- [ ] Add empty states for no problems, no submissions
- [ ] Add confirm dialogs for destructive actions (delete problem)
- [ ] Add responsive mobile layout (sidebar → bottom nav)
- [ ] Add loading states for submit/run buttons
- [ ] Add optimistic UI updates for submissions
- [ ] Review and fix all accessibility issues (keyboard nav, ARIA labels)
- [ ] Add page metadata (title, description) for all routes
```

### Sprint 3 Deliverable

- ✅ Dashboard with analytics, heatmap, and progress tracking
- ✅ Submission history with diff comparison
- ✅ Full admin panel for problem + test case management
- ✅ Polished UI with skeletons, toasts, empty states
- ✅ Mobile responsive layout
- ✅ Accessible interface

---

# 9. Sprint 4 — Differentiation (Week 7–8)

> **Goal:** "This is why you hire me."

## Tasks

### Week 7: Auth Upgrade + AI Hints + Daily Challenge

```text
Day 31–32: GitHub OAuth
- [ ] Setup next-auth v5 with GitHub provider
- [ ] Create OAuth callback route
- [ ] Update User model to support OAuth (nullable password, githubId)
- [ ] Create OAuth buttons on login/register pages
- [ ] Link GitHub avatar to user profile
- [ ] Test OAuth flow end-to-end

Day 33–34: AI-Powered Hints
- [ ] Create OpenAIHintService in infrastructure/external/
- [ ] Create GetHintForProblem use case
- [ ] Create hint API endpoint (POST /api/problems/:slug/hint)
- [ ] Rate limit to 3 hints per problem per user per day
- [ ] Design prompt template:
  - Include problem description + user's current code
  - Instruct: "Give a conceptual hint, NOT code. Max 2 sentences."
- [ ] Create hint UI component (collapsible, with "Get Hint" button)
- [ ] Track hint usage in database
- [ ] Add loading animation for hint generation

Day 35: Daily Challenge + Streaks
- [ ] Create cron job or scheduled task to rotate daily challenge
- [ ] Create GetDailyChallenge use case
- [ ] Create daily challenge banner on dashboard
- [ ] Implement streak calculation logic
- [ ] Show streak counter in header/profile
- [ ] Create streak milestone notifications (7-day, 30-day, etc.)
```

### Week 8: Quality + Documentation + Deploy

```text
Day 36–37: Testing Suite
- [ ] Unit tests for ALL use cases (Vitest)
  - [ ] Auth: RegisterUser, LoginUser, RefreshToken
  - [ ] Problem: GetProblems, GetProblemBySlug, CreateProblem
  - [ ] Submission: SubmitSolution, GetSubmissions
  - [ ] Dashboard: GetUserStats, GetActivityHeatmap
- [ ] Integration tests for API endpoints (Vitest + supertest)
  - [ ] Auth flow (register → login → protected route)
  - [ ] Problem CRUD (create → read → update → delete)
  - [ ] Submission flow (submit → queue → result)
- [ ] E2E tests (Playwright)
  - [ ] Register → Login → Browse Problems → Solve → See Result
  - [ ] Admin: Create Problem → Add Test Cases → Publish
  - [ ] Dashboard: Verify stats update after solving
  - [ ] OAuth login flow
  - [ ] Dark mode toggle persistence

Day 38–39: Documentation
- [ ] Setup Swagger/OpenAPI with swagger-jsdoc
- [ ] Document all API endpoints with:
  - [ ] Request body schemas
  - [ ] Response schemas
  - [ ] Authentication requirements
  - [ ] Error responses
  - [ ] Example requests/responses
- [ ] Create interactive Swagger UI at /api-docs
- [ ] Write comprehensive README.md:
  - [ ] Project overview with badges (TypeScript, Next.js, etc.)
  - [ ] Architecture diagram (Mermaid)
  - [ ] Demo GIF or video
  - [ ] Tech stack table
  - [ ] Setup instructions (local dev)
  - [ ] Environment variables table
  - [ ] API documentation link
  - [ ] Contributing guidelines
  - [ ] License

Day 40: Production Deployment
- [ ] Frontend → Vercel (production)
  - [ ] Configure environment variables
  - [ ] Setup custom domain (if available)
- [ ] Backend → VPS
  - [ ] Docker Compose for backend + Redis + judge worker
  - [ ] Setup nginx reverse proxy
  - [ ] Configure SSL (Let's Encrypt)
  - [ ] Setup PM2 or systemd for process management
- [ ] Database → Supabase PostgreSQL
  - [ ] Run production migration
  - [ ] Seed production data
- [ ] Monitoring
  - [ ] Setup Sentry for error tracking
  - [ ] Add health check endpoints (/health, /ready)
  - [ ] Test graceful shutdown (SIGTERM handling)
- [ ] Final smoke test of all features in production
```

### Sprint 4 Deliverable

- ✅ GitHub OAuth login
- ✅ AI-powered contextual hints
- ✅ Daily challenge with streak tracking
- ✅ Comprehensive test suite (unit + integration + E2E)
- ✅ Interactive API documentation (Swagger)
- ✅ Professional README with architecture diagram
- ✅ Production deployment with monitoring
- ✅ **Portfolio-ready project**

---

# 10. CI/CD Pipeline

## GitHub Actions — ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run format:check

  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: quality
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: interviewprep_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
        working-directory: apps/backend-api
      - run: npm run test
      - run: npm run test:e2e

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

---

# 11. Testing Strategy

## Test Pyramid

```text
         ┌─────────┐
         │  E2E    │  5–10 tests (Playwright)
         │ Tests   │  Critical user flows
         ├─────────┤
         │ Integ.  │  15–20 tests (Vitest + supertest)
         │ Tests   │  API endpoints, DB queries
         ├─────────┤
         │  Unit   │  50+ tests (Vitest)
         │ Tests   │  Use cases, value objects, entities
         └─────────┘
```

## What to Test

| Layer | What to Test | Tool |
|---|---|---|
| Domain | Value objects (Email validation, Slug generation) | Vitest |
| Domain | Entity business rules | Vitest |
| Application | Use cases with mocked repositories | Vitest |
| Infrastructure | Repository queries against test DB | Vitest + Prisma |
| Presentation | API endpoints with supertest | Vitest + supertest |
| Judge Worker | Code execution with Docker | Vitest (with Docker) |
| Frontend | Critical user flows | Playwright |

## Test File Naming

```text
RegisterUser.test.ts         # Unit test for use case
auth.routes.test.ts          # Integration test for API
submit-and-solve.spec.ts     # E2E test (Playwright)
```

---

# 12. API Documentation

## Endpoint Summary

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login with credentials |
| POST | /api/auth/refresh | — | Refresh access token |
| POST | /api/auth/logout | ✅ | Invalidate refresh token |
| GET | /api/auth/me | ✅ | Get current user |

### Problems

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/problems | — | List problems (filters, search, pagination) |
| GET | /api/problems/:slug | — | Get problem detail |
| GET | /api/problems/daily | — | Get daily challenge |
| POST | /api/problems/:slug/hint | ✅ | Get AI hint |
| POST | /api/admin/problems | ✅ Admin | Create problem |
| PATCH | /api/admin/problems/:id | ✅ Admin | Update problem |
| DELETE | /api/admin/problems/:id | ✅ Admin | Delete problem |

### Test Cases

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/admin/problems/:id/test-cases | ✅ Admin | List test cases |
| POST | /api/admin/problems/:id/test-cases | ✅ Admin | Create test case |
| PATCH | /api/admin/test-cases/:id | ✅ Admin | Update test case |
| DELETE | /api/admin/test-cases/:id | ✅ Admin | Delete test case |

### Submissions

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/submissions | ✅ | Submit solution |
| POST | /api/submissions/run | ✅ | Run code (playground) |
| GET | /api/submissions | ✅ | Get user's submissions |
| GET | /api/submissions/:id | ✅ | Get submission detail |

### Dashboard

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/dashboard/stats | ✅ | Get user statistics |
| GET | /api/dashboard/progress | ✅ | Get category progress |
| GET | /api/dashboard/heatmap | ✅ | Get activity heatmap data |
| GET | /api/dashboard/recent | ✅ | Get recent activity |

### System

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /health | — | Health check |
| GET | /ready | — | Readiness check (DB + Redis) |
| GET | /api-docs | — | Swagger UI |

---

## API Response Format

### Success

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Required" }
    ]
  },
  "requestId": "req_abc123"
}
```

---

# 13. Deployment Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                    (Browser / Mobile)                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                          │
│               Next.js SSR + Static Pages                     │
│                  CDN + Edge Network                          │
└──────────────────┬───────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    VPS (Linux Server)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Nginx                                │  │
│  │              Reverse Proxy + SSL                        │  │
│  └─────────┬──────────────────────────────────────────────┘  │
│            │                                                  │
│  ┌─────────▼──────────┐  ┌─────────────────────────────┐   │
│  │   Express API       │  │     Judge Worker             │   │
│  │   (Node.js)         │  │     (Node.js)                │   │
│  │                     │  │                              │   │
│  │  • Auth             │  │  • BullMQ Consumer           │   │
│  │  • Problems         │  │  • Docker Container Mgmt     │   │
│  │  • Submissions      │  │  • Code Execution            │   │
│  │  • Dashboard        │  │  • Result Processing         │   │
│  │  • WebSocket        │  │                              │   │
│  └─────────┬──────────┘  └──────────────┬───────────────┘   │
│            │                             │                    │
│  ┌─────────▼─────────────────────────────▼───────────────┐  │
│  │                    Redis 7                              │  │
│  │            BullMQ Queues + Caching                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Docker Engine                        │  │
│  │         Sandboxed Code Execution Containers             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│               Supabase (Managed PostgreSQL)                   │
│                   Connection Pooling                          │
└──────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────┐  ┌─────────────────┐
│   Sentry        │  │   OpenAI API    │
│   Error Track   │  │   AI Hints      │
└─────────────────┘  └─────────────────┘
```

---

# 14. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (Frontend) | kebab-case | `problem-card.tsx`, `use-problems.ts` |
| Files (Backend) | PascalCase for classes, kebab for routes | `RegisterUser.ts`, `auth.routes.ts` |
| React Components | PascalCase | `ProblemCard`, `CodeEditor` |
| Hooks | camelCase with `use` prefix | `useProblems`, `useSubmitSolution` |
| Zustand Stores | camelCase with `.store.ts` | `ui.store.ts`, `editor.store.ts` |
| Use Cases | PascalCase verb+noun | `RegisterUser`, `GetProblems` |
| Entities | PascalCase singular | `User`, `Problem`, `Submission` |
| Value Objects | PascalCase | `Email`, `HashedPassword`, `Slug` |
| Repositories | I + PascalCase + Repository | `IUserRepository`, `PrismaUserRepository` |
| Services | I + PascalCase + Service | `IQueueService`, `BullMQQueueService` |
| Database Tables | snake_case plural | `users`, `test_cases`, `submissions` |
| API Routes | lowercase plural | `/api/problems`, `/api/submissions` |
| Env Variables | SCREAMING_SNAKE_CASE | `DATABASE_URL`, `JWT_SECRET` |
| CSS Classes | Tailwind utilities | No custom class naming needed |
| Test Files | same name + `.test.ts` or `.spec.ts` | `RegisterUser.test.ts` |
| Branch Names | kebab-case with prefix | `feat/auth-module`, `fix/submission-queue` |
| Commit Messages | Conventional Commits | `feat(auth): add register use case` |

---

# 15. Environment Variables

## .env.example

```bash
# === Database ===
DATABASE_URL="postgresql://user:password@localhost:5432/interviewprep?schema=public"

# === Redis ===
REDIS_URL="redis://localhost:6379"

# === JWT ===
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# === Server ===
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000"

# === OAuth (Sprint 4) ===
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# === OpenAI (Sprint 4) ===
OPENAI_API_KEY=""

# === Sentry (Sprint 4) ===
SENTRY_DSN=""

# === Docker (Judge Worker) ===
DOCKER_SOCKET="/var/run/docker.sock"
EXECUTION_TIMEOUT_MS=10000
EXECUTION_MEMORY_LIMIT="256m"
EXECUTION_CPU_LIMIT=1

# === Rate Limiting ===
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

# 16. MVP Completion Criteria (Revised)

A user can:

- ✅ Register with email/password
- ✅ Login with GitHub OAuth
- ✅ Browse problems with search, category, and difficulty filters
- ✅ Open a problem and see description + code editor
- ✅ Write JavaScript code in Monaco Editor
- ✅ Run code against visible test cases (playground mode)
- ✅ Submit solution for evaluation against hidden test cases
- ✅ See real-time execution status via WebSocket
- ✅ View pass/fail results with runtime and memory
- ✅ View submission history with code diff comparison
- ✅ Track progress on dashboard with analytics charts
- ✅ See GitHub-style activity heatmap
- ✅ Maintain daily streak
- ✅ Solve daily challenge
- ✅ Get AI-powered hints (limited per day)
- ✅ Admin can create, edit, delete, publish problems
- ✅ Admin can manage test cases (visible + hidden)

An engineer reviewing the code can:

- ✅ See Clean Architecture with SOLID principles
- ✅ Read comprehensive API documentation (Swagger)
- ✅ Run the full test suite (unit + integration + E2E)
- ✅ Understand the system from the README + architecture diagram
- ✅ Run the project locally with a single `docker-compose up`
- ✅ See CI/CD pipeline in GitHub Actions

---

**At this point, the project demonstrates: systems design, clean code architecture, distributed systems (queue + worker), DevOps awareness, testing discipline, and product thinking. This is a portfolio project that gets interviews.**
