# TODO List: Node.js, React, SQL, and MongoDB Question Support

This document tracks the implementation checklist and execution steps for adding support for Node.js problems, React component logic, SQL queries, and MongoDB aggregation questions.

> **Rollout Order:** Node.js → SQL → React → MongoDB (easiest to hardest)

---

## 📅 Checklist

### 1. Database & Shared Types Setup

- [ ] **Modify shared-types enum:** Add `SQL` and `MONGODB` to the `Category` enum in [packages/shared-types/src/enums/index.ts](file:///d:/interview-prep-platform/packages/shared-types/src/enums/index.ts). (`NODEJS` and `REACT` already exist.)
- [ ] **Update Prisma schema:** Add `SQL` and `MONGODB` to the `Category` enum in [schema.prisma](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/schema.prisma). (`NODEJS` and `REACT` already exist.)
- [ ] **Run database migration:** Execute migrations to apply schema changes locally.
- [ ] **Seed Node.js problems:** Add Node.js-specific problems with `category: 'NODEJS'` in [seed.ts](file:///d:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/seed.ts). (See problem ideas in Section 5.)
- [ ] **Seed React problems:** Add React logic problems with `category: 'REACT'` in seed.ts. (Currently zero REACT problems exist despite the enum value.)
- [ ] **Seed SQL problems:** Add SQL query problems with `category: 'SQL'` in seed.ts.
- [ ] **Seed MongoDB problems:** Add MongoDB aggregation problems with `category: 'MONGODB'` in seed.ts.

---

### 2. Judge Worker — Executor Strategy Per Category

#### Phase 1: Node.js (No new executor needed)

Node.js problems reuse the existing `JavascriptExecutor` because the `node:22-slim` Docker container already has all Node.js built-in modules available (`crypto`, `Buffer`, `URL`, `path`, `events`, `streams`, etc.).

- [ ] **Update SubmissionWorker routing:** Modify [SubmissionWorker.ts](file:///d:/interview-prep-platform/apps/judge-worker/src/worker/SubmissionWorker.ts) to fetch the problem's `category` and route execution accordingly. Both `JAVASCRIPT` and `NODEJS` categories use the existing `JavascriptExecutor`.
- [ ] **Seed Node.js problems:** Problems must use pure functions with Node.js APIs (no HTTP servers, no filesystem reads from disk, no child processes — container has `NetworkDisabled: true` and runs as non-root `node` user).

#### Phase 2: SQL (New executor + custom Docker image)

SQL problems use `better-sqlite3` to create an in-memory SQLite database, run the user's query, and compare tabular output.

- [ ] **Create `infrastructure/docker/` directory** (does not exist yet).
- [ ] **Create Dockerfile.sql-runner:** Based on `node:22-slim`, pre-install `better-sqlite3`.
  ```dockerfile
  FROM node:22-slim
  WORKDIR /app
  RUN npm init -y && npm install better-sqlite3
  USER node
  ```
- [ ] **Build the image:** `docker build -t node-sql-runner -f infrastructure/docker/Dockerfile.sql-runner .`
- [ ] **Implement SqlExecutor:** Create [apps/judge-worker/src/executor/SqlExecutor.ts](file:///d:/interview-prep-platform/apps/judge-worker/src/executor/SqlExecutor.ts).
  - Runner script creates an in-memory SQLite DB using `better-sqlite3`.
  - Test case `input` contains the schema + seed SQL (CREATE TABLE, INSERT) as a JSON string.
  - User code is the SQL query to execute.
  - Runner compares the query result rows against `expectedOutput` (JSON array of row objects).
  - Container image: `node-sql-runner` instead of `node:22-slim`.
- [ ] **Wire into SubmissionWorker:** Route `SQL` category to `SqlExecutor`.

#### Phase 3: React (Logic-based testing, reuse JS executor)

React problems test the **logic behind components** (custom hooks, state management, reducer patterns), NOT DOM rendering. This avoids needing JSDOM, Testing Library, or JSX compilation in the container.

- [ ] **Decide test approach:** React problems use the existing `JavascriptExecutor` with the standard `input → expectedOutput` JSON format. Problems are designed to test pure logic:
  - Custom hooks (e.g., "implement `useCounter` that returns `[count, increment, decrement]`")
  - Reducer functions (e.g., "write a `todoReducer` for ADD, TOGGLE, DELETE actions")
  - State derivation functions (e.g., "given this state shape, compute derived values")
  - Context/Provider patterns as plain JS objects
- [ ] **No new Docker image needed** — runs on `node:22-slim` like JavaScript problems.
- [ ] **No JSX in user code** — problems are pure JS/TS functions that represent React logic patterns.
- [ ] **Seed React logic problems** in seed.ts.
- [ ] **Wire into SubmissionWorker:** Route `REACT` category to the existing `JavascriptExecutor`.

> **Future enhancement (optional):** If DOM-based React testing is needed later, create a `Dockerfile.react-runner` with `esbuild`, `jsdom`, and `@testing-library/react` pre-installed, and design an assertion-based test case format instead of simple input/output comparison.

#### Phase 4: MongoDB (Shared container approach)

MongoDB problems use a **shared MongoDB container** added to docker-compose (NOT `mongodb-memory-server` inside sandboxed containers — it won't work with `NetworkDisabled: true` and 256MB memory limit).

- [ ] **Add MongoDB to docker-compose.yml:** Add a `mongo:7` service to [infrastructure/docker-compose.yml](file:///d:/interview-prep-platform/infrastructure/docker-compose.yml).
  ```yaml
  mongo:
    image: mongo:7
    container_name: interviewprep-mongo
    restart: unless-stopped
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
  ```
- [ ] **Create Dockerfile.mongodb-runner:** Based on `node:22-slim`, pre-install `mongodb` driver.
  ```dockerfile
  FROM node:22-slim
  WORKDIR /app
  RUN npm init -y && npm install mongodb
  USER node
  ```
- [ ] **Build the image:** `docker build -t node-mongodb-runner -f infrastructure/docker/Dockerfile.mongodb-runner .`
- [ ] **Implement MongodbExecutor:** Create [apps/judge-worker/src/executor/MongodbExecutor.ts](file:///d:/interview-prep-platform/apps/judge-worker/src/executor/MongodbExecutor.ts).
  - Runner connects to the shared MongoDB container (NOT network-disabled for this executor).
  - Creates a unique temporary database per submission (e.g., `judge_<submissionId>`).
  - Seeds collection with documents from test case `input`.
  - Executes user's aggregation pipeline / find query.
  - Compares result documents against `expectedOutput`.
  - **Cleans up:** Drops the temporary database after execution.
  - **Important:** This executor must set `NetworkDisabled: false` on the container (needs MongoDB access), but restrict network to only the MongoDB host via Docker networking.
- [ ] **Wire into SubmissionWorker:** Route `MONGODB` category to `MongodbExecutor`.

#### Executor Refactoring (Optional, Recommended)

- [ ] **Create an `IExecutor` interface** to standardize all executors:
  ```typescript
  interface IExecutor {
    execute(
      submissionId: string,
      code: string,
      testCases: TestCaseInput[],
      timeoutMs?: number,
    ): Promise<ExecutionResult>;
  }
  ```
- [ ] **Refactor `JavascriptExecutor`** to implement `IExecutor`.
- [ ] **Consider creating a custom `node-js-runner` image** for JS/Node.js too, so all executors consistently use custom images instead of mixing stock and custom.

---

### 3. Frontend Editor & Preview Integration

#### Language Auto-Detection (All categories)

- [ ] **Remove freeform language selector** from [page.tsx](<file:///d:/interview-prep-platform/apps/frontend/src/app/(authenticated)/problems/[slug]/page.tsx>). Replace with auto-detection based on `problem.category`:

  | Category     | Monaco Language | Filename Display |
  | ------------ | --------------- | ---------------- |
  | `JAVASCRIPT` | `javascript`    | `solution.js`    |
  | `NODEJS`     | `javascript`    | `solution.js`    |
  | `TYPESCRIPT` | `typescript`    | `solution.ts`    |
  | `REACT`      | `javascript`    | `solution.js`    |
  | `SQL`        | `sql`           | `query.sql`      |
  | `MONGODB`    | `javascript`    | `pipeline.js`    |

- [ ] **Pass category-derived language** to the submission/run API calls instead of the user-selected value.

#### React Live Preview (Future — Phase 3 Enhancement)

> This is optional and should only be tackled after the core React logic executor works.

- [ ] **Build `ReactPreview` iframe sandbox wrapper** for live component preview.
- [ ] **Load `@babel/standalone` asynchronously** for in-browser JSX transpilation.
- [ ] **Modify workspace layout** in page.tsx to render a Preview tab only when `category === 'REACT'`.
- [ ] **Debounce editor changes** before sending to the preview sandbox.

---

### 4. Testing & Validation

- [ ] Create unit tests for `SqlExecutor`.
- [ ] Create unit tests for `MongodbExecutor`.
- [ ] Test SubmissionWorker category routing logic.
- [ ] Verify Node.js problems execute correctly with the existing `JavascriptExecutor`.
- [ ] Verify React logic problems execute correctly with the existing `JavascriptExecutor`.
- [ ] Validate seed data — ensure test case formats match executor expectations.
- [ ] Perform E2E manual test verification for all new categories.

---

## 📝 5. Problem Ideas by Category

### Node.js Problems (use existing JS executor)

| Problem                                 | Concept                            | Difficulty |
| --------------------------------------- | ---------------------------------- | ---------- |
| Hash a string with SHA-256              | `crypto` module                    | EASY       |
| Parse URL query parameters              | `URL` / `URLSearchParams`          | EASY       |
| Resolve relative paths                  | `path.resolve` / `path.join` logic | EASY       |
| Implement an EventEmitter with `once()` | `events` pattern                   | MEDIUM     |
| Parse CSV string using Buffers          | `Buffer` operations                | MEDIUM     |
| Implement a Transform stream            | Streams API                        | HARD       |

### React Problems (logic-based, use existing JS executor)

| Problem                                      | Concept          | Difficulty |
| -------------------------------------------- | ---------------- | ---------- |
| Implement a `todoReducer`                    | Reducer pattern  | EASY       |
| Write a `useToggle` hook (as plain function) | Custom hooks     | EASY       |
| Implement `useDebounce` logic                | Debounce + state | MEDIUM     |
| Build a state machine for a form wizard      | State management | MEDIUM     |
| Implement `usePagination` with derived state | Derived state    | HARD       |

### SQL Problems (use SqlExecutor)

| Problem                             | Concept           | Difficulty |
| ----------------------------------- | ----------------- | ---------- |
| SELECT with WHERE and ORDER BY      | Basic queries     | EASY       |
| JOIN two tables                     | Table joins       | EASY       |
| GROUP BY with HAVING                | Aggregation       | MEDIUM     |
| Window functions (RANK, ROW_NUMBER) | Window functions  | MEDIUM     |
| Recursive CTE (org hierarchy)       | Recursive queries | HARD       |

### MongoDB Problems (use MongodbExecutor)

| Problem                                | Concept              | Difficulty |
| -------------------------------------- | -------------------- | ---------- |
| Basic find with filter and projection  | `find()`             | EASY       |
| Aggregation with `$group` and `$sum`   | Aggregation pipeline | MEDIUM     |
| `$lookup` for collection join          | Joins                | MEDIUM     |
| `$unwind` + `$group` for nested arrays | Array operations     | HARD       |

---

## 🚀 6. Steps to Execute & Run the Code

### Step 1: Install Dependencies & Update Workspace Types

```bash
npm install
npm run build --filter=@interviewprep/shared-types
```

### Step 2: Apply Database Migrations & Re-seed

```bash
# Start Postgres, Redis, and MongoDB (after adding mongo to docker-compose)
docker compose -f infrastructure/docker-compose.yml up -d

# Generate and run migrations
npx prisma migrate dev --name add_sql_mongodb_categories --schema apps/backend-api/src/infrastructure/database/prisma/schema.prisma

# Re-seed with all new problems
npx prisma db seed --schema apps/backend-api/src/infrastructure/database/prisma/schema.prisma
```

### Step 3: Build Custom Docker Runner Images

```bash
# Create the directory first
mkdir -p infrastructure/docker

# SQL runner
docker build -t node-sql-runner -f infrastructure/docker/Dockerfile.sql-runner .

# MongoDB runner
docker build -t node-mongodb-runner -f infrastructure/docker/Dockerfile.mongodb-runner .
```

### Step 4: Run Development Services

```bash
npm run dev
```

### Step 5: Execute Automated Test Suite

```bash
npm run test --prefix apps/judge-worker
```
