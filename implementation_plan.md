# Gamification, Motivational Engagement & Real-Time Stats Implementation Plan

This plan transforms problem pages and submission evaluation into a high-engagement, motivational experience for users on `interviewUndo`. By leveraging data already tracked in the database (`attemptCount`, `solvedCount`, execution `runtime`/`memory`) and adding new interactive endpoints, users will see competitive feedback like `"Beats 86% of developers!"`.

> **How to use this plan:** Work phase by phase. When a task is done, mark it `[x]`. Only move to the next phase after all tasks in the current one are complete.

---

## Pre-Implementation Analysis Notes

> [!IMPORTANT]
> **Read before starting.** These findings from the codebase review must be respected throughout every phase.

### ✅ Already Done — Do NOT Duplicate

- `solvedCount` is already incremented in [`SubmissionWorker.ts` L180-184](file:///d:/interviewUndo/apps/judge-worker/src/worker/SubmissionWorker.ts#L180-L185) on `ACCEPTED`.
- `attemptCount` is already incremented in [`SubmitSolution.ts` L43](file:///d:/interviewUndo/apps/backend-api/src/application/use-cases/submission/SubmitSolution.ts#L43) on every submission.
- `incrementSolvedCount()` and `incrementAttemptCount()` already exist in [`PrismaProblemRepository.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/repositories/PrismaProblemRepository.ts#L176-L196).
- `likesCount` and `viewsCount` fields already exist in the Prisma schema and `Problem` shared type.

### ❌ Critical Bugs to Avoid

1. **Cache bypass bug:** [`GetProblemBySlug.ts`](file:///d:/interviewUndo/apps/backend-api/src/application/use-cases/problem/GetProblemBySlug.ts) caches the problem response for 5 minutes. Any Redis side-effects placed inside it will silently no-op on cache hits. All page-view-based logic must go in the **controller layer** ([`ProblemController.ts`](file:///d:/interviewUndo/apps/backend-api/src/presentation/controllers/ProblemController.ts)), not inside the use-case.
2. **Like system integrity:** `toggleLike` currently uses localStorage only. Wiring it to a bare `POST /like` increment-only endpoint will allow spam liking and broken unlike semantics. A persistent like system requires a `ProblemLike` join table — deferred to Phase 3.
3. **Stale stats cache:** When `solvedCount`/`attemptCount` update after a submission in the worker, the cached problem response (key: `problems:slug:<slug>`, TTL 5 min) remains stale. The worker must invalidate this cache key after stat updates.

---

## Phase 1 — Frontend Engagement (Zero Backend Changes)

> **Goal:** Add acceptance rate, social proof, and basic stats display purely in the frontend. No API changes, no migrations. Safe to ship immediately.

### Tasks

- [x] **1.1 — Acceptance Rate Badge in `ProblemHeader.tsx`**

  File: [`ProblemHeader.tsx`](file:///d:/interviewUndo/apps/frontend/src/components/workspace/ProblemHeader.tsx)

  Add an acceptance rate pill directly below the difficulty badge, derived from already-available `problem.solvedCount` and `problem.attemptCount`:

  ```tsx
  const acceptanceRate =
    problem.attemptCount > 0
      ? Math.round((problem.solvedCount / problem.attemptCount) * 100)
      : null;
  ```

  Render as a badge in the stats row:

  ```tsx
  {
    acceptanceRate !== null && (
      <div className="flex items-center gap-1 text-zinc-400/90" title="Acceptance Rate">
        <Target size={13} className="text-emerald-500 shrink-0" />
        <span className="text-emerald-400 font-semibold">{acceptanceRate}%</span>
        <span>accepted</span>
      </div>
    );
  }
  ```

  > **Note:** `attemptCount` = number of actual code submissions (not page views). Use copy like "**74% acceptance rate**" not "74% of viewers solved it".

- [x] **1.2 — Social Proof Banner in `ProblemHeader.tsx`**

  File: [`ProblemHeader.tsx`](file:///d:/interviewUndo/apps/frontend/src/components/workspace/ProblemHeader.tsx)

  Add a dynamic banner below the title based on data thresholds:

  ```tsx
  const socialProof =
    problem.attemptCount > 100
      ? `🔥 Popular Challenge · ${formatNumber(problem.attemptCount)} submissions · ${formatNumber(problem.solvedCount)} solved`
      : problem.attemptCount > 0
        ? `✨ ${formatNumber(problem.attemptCount)} developers have attempted this`
        : `🌟 New Challenge · Be among the first to solve this!`;
  ```

  Render as a subtle banner between the title and the badges row:

  ```tsx
  <p className="text-[11px] text-zinc-500 mt-1.5 tracking-wide">{socialProof}</p>
  ```

- [x] **1.3 — Verify No Regressions**
  - Open any problem page locally (`http://localhost:3000/problems/two-sum`)
  - Confirm the acceptance rate badge shows correctly (or is hidden when `attemptCount === 0`)
  - Confirm the social proof banner renders for all three states (popular, some, zero)
  - Confirm no TypeScript errors: `npm run typecheck` in `apps/frontend`

---

## Phase 2 — Backend Percentile Calculation (Worker Change)

> **Goal:** On every `ACCEPTED` submission, calculate the runtime percentile and include it in the real-time Redis pub/sub payload. No schema changes required.

### Tasks

- [ ] **2.1 — Add `activeSolversCount` to the `Problem` shared type**

  File: [`packages/shared-types/src/entities/index.ts`](file:///d:/interviewUndo/packages/shared-types/src/entities/index.ts)

  Add an optional field to the `Problem` interface (it's virtual/computed, never stored in DB):

  ```ts
  export interface Problem {
    // ... existing fields ...
    activeSolversCount?: number; // virtual: read from Redis, not persisted
  }
  ```

- [ ] **2.2 — Percentile Calculation in `SubmissionWorker.ts`**

  File: [`SubmissionWorker.ts`](file:///d:/interviewUndo/apps/judge-worker/src/worker/SubmissionWorker.ts)

  After `finalStatus === 'ACCEPTED'` is set, and **before** publishing to Redis pub/sub, add a parallel percentile query. Place this after the `solvedCount` increment (around line 185):

  ```typescript
  // Calculate runtime percentile for ACCEPTED submissions
  let runtimePercentile: number | null = null;
  if (finalStatus === 'ACCEPTED' && execResult.runtime != null) {
    const [totalAccepted, slowerOrEqual] = await Promise.all([
      prisma.submissionResult.count({
        where: { submission: { problemId, status: 'ACCEPTED' } },
      }),
      prisma.submissionResult.count({
        where: {
          submission: { problemId, status: 'ACCEPTED' },
          runtime: { gte: execResult.runtime },
        },
      }),
    ]);
    // Edge case: if this is the very first accepted submission, default to a motivating value
    runtimePercentile = totalAccepted > 1 ? Math.round((slowerOrEqual / totalAccepted) * 100) : 90; // first solver gets a celebratory 90%
  }
  ```

  > [!IMPORTANT]
  > Always use `Promise.all()` — never two sequential `await` calls here. This runs 2 COUNT queries in parallel to minimize latency added to every job.

- [ ] **2.3 — Publish `runtimePercentile` in the Redis payload**

  File: [`SubmissionWorker.ts`](file:///d:/interviewUndo/apps/judge-worker/src/worker/SubmissionWorker.ts)

  Update the final `redis.publish` call (currently around line 227) to include the percentile:

  ```typescript
  await redis.publish(
    'submission:updates',
    JSON.stringify({
      userId,
      submissionId,
      status: finalStatus,
      error: execResult.error,
      userStreak: newStreak,
      streakMilestone,
      runtimePercentile, // ← NEW
      data: {
        runtime: execResult.runtime,
        memory: execResult.memory,
        passedCases: execResult.passedCases,
        totalCases: execResult.totalCases,
      },
    }),
  );
  ```

- [ ] **2.4 — Invalidate Problem Cache After Stat Updates**

  File: [`SubmissionWorker.ts`](file:///d:/interviewUndo/apps/judge-worker/src/worker/SubmissionWorker.ts)

  After the `solvedCount` increment (and also after `attemptCount` is already updated in the backend), add cache invalidation. The worker needs access to the problem `slug` for this. Fetch it during the initial problem fetch at the top of the job:

  **Update the initial fetch (around line 54) to also select `slug`:**

  ```typescript
  const [problem, testCases] = await Promise.all([
    prisma.problem.findUnique({
      where: { id: problemId },
      select: { category: true, slug: true }, // ← add slug
    }),
    // ...
  ]);
  ```

  **Then after the solvedCount increment:**

  ```typescript
  // Invalidate the cached problem response so stats are fresh on next page load
  await redis.del(`problems:slug:${problem.slug}`).catch(() => {});
  ```

  > [!NOTE]
  > The `.catch(() => {})` silently swallows cache-delete errors — this is intentional. A failed cache invalidation is non-critical; the data will eventually expire on its own.

- [ ] **2.5 — Display Percentile on Frontend Verdict Panel**

  File: Wherever the real-time submission verdict is rendered (the panel that shows "ACCEPTED / runtime / memory").

  Read `runtimePercentile` from the Socket.IO/Redis pub/sub message payload and render:

  ```tsx
  {
    runtimePercentile != null && status === 'ACCEPTED' && (
      <div className="mt-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
        🏆 Your solution ran in {runtime}ms — faster than{' '}
        <span className="font-bold">{runtimePercentile}%</span> of all submissions!
      </div>
    );
  }
  ```

- [ ] **2.6 — Verify Phase 2**
  - Run `npm run typecheck` in `apps/judge-worker` and `apps/backend-api`
  - Submit an accepted solution and confirm the verdict panel shows percentile
  - Submit with a deliberately slow solution and confirm a lower percentile
  - Check that stale problem stats are refreshed after submission (cache is busted)

---

## Phase 3 — Active Solvers Counter (Live Page Presence)

> **Goal:** Show a "X developers viewing/solving right now" indicator. This avoids the cache-bypass bug by placing Redis logic at the controller layer, not inside the use-case.

### Tasks

- [ ] **3.1 — Fire-and-Forget Redis INCR in `ProblemController.ts`**

  File: [`ProblemController.ts`](file:///d:/interviewUndo/apps/backend-api/src/presentation/controllers/ProblemController.ts)

  The controller has direct access to the raw Redis client via DI or import. Update `getBySlug` to fire an async Redis INCR **after** the problem is returned, without blocking the response:

  ```typescript
  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const problem = await this.getProblemBySlug.execute(slug);

      // Fire-and-forget: track active page views in Redis (does NOT block response)
      // Key expires after 5 min; each page load bumps a sliding counter
      redis.setex(`problem:active:${slug}`, 300, '1').catch(() => {});
      // For a true count instead of just presence: use INCR + EXPIRE separately
      // redis.incr(`problem:active:count:${slug}`).then(() => redis.expire(`problem:active:count:${slug}`, 300));

      res.status(200).json({ success: true, data: problem });
    } catch (error) {
      next(error);
    }
  };
  ```

  > [!IMPORTANT]
  > The INCR **must** happen in the controller, NOT inside `GetProblemBySlug.ts`. The use-case caches the response and returns early on cache hits — the side-effect would never fire.

- [ ] **3.2 — Expose `GET /api/problems/:slug/active` Endpoint**

  For accurate real-time counts, create a **separate lightweight endpoint** that returns the active solver count from Redis. This avoids embedding volatile data in the cached problem response.

  **New route:** `GET /api/problems/:slug/active` → returns `{ activeSolversCount: number }`

  **In `ProblemController.ts`:**

  ```typescript
  getActiveSolvers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const count = await redis.get(`problem:active:count:${slug}`);
      res.status(200).json({
        success: true,
        data: { activeSolversCount: parseInt(count ?? '0', 10) },
      });
    } catch (error) {
      next(error);
    }
  };
  ```

- [ ] **3.3 — Poll Active Count from Frontend `ProblemHeader.tsx`**

  File: [`ProblemHeader.tsx`](file:///d:/interviewUndo/apps/frontend/src/components/workspace/ProblemHeader.tsx)

  Add a client-side poll for the active solver count (every 60 seconds is enough — no need for WebSockets for this feature):

  ```tsx
  const [activeSolvers, setActiveSolvers] = useState<number | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await fetch(`/api/problems/${problem.slug}/active`);
        const json = await res.json();
        setActiveSolvers(json.data?.activeSolversCount ?? null);
      } catch {}
    };

    fetchActive(); // initial fetch
    const interval = setInterval(fetchActive, 60_000); // poll every 60s
    return () => clearInterval(interval);
  }, [problem.slug]);
  ```

  Render in the stats row:

  ```tsx
  {
    activeSolvers != null && activeSolvers > 0 && (
      <div className="flex items-center gap-1 text-zinc-400/90" title="Solving right now">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>{activeSolvers} solving now</span>
      </div>
    );
  }
  ```

  > **Note:** Label as "solving now" or "viewing now" — not "solving right now" if the signal is just a page hit. Match copy to the tracking method you implement.

- [ ] **3.4 — Verify Phase 3**
  - Open a problem page and confirm the active counter appears
  - Open two browser tabs to the same problem and confirm the counter increments
  - Wait 5 minutes and confirm the counter resets to 0 (Redis TTL expired)
  - Confirm `GET /api/problems/:slug/active` returns proper JSON when key is missing (`activeSolversCount: 0`)

---

## Phase 4 — Persistent Likes (Schema Migration Required)

> **Goal:** Replace localStorage-based likes with a real server-side system. Requires a new `ProblemLike` join table to support toggle semantics and prevent duplicate counting.

> [!WARNING]
> This phase requires a **Prisma migration** and must be coordinated carefully. Do not attempt this until Phases 1–3 are fully working and deployed.

### Tasks

- [ ] **4.1 — Add `ProblemLike` Join Table to Prisma Schema**

  File: [`schema.prisma`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/schema.prisma)

  ```prisma
  model ProblemLike {
    id        String   @id @default(cuid())
    userId    String
    problemId String
    createdAt DateTime @default(now())

    user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
    problem Problem @relation(fields: [problemId], references: [id], onDelete: Cascade)

    @@unique([userId, problemId])  // ← prevents double-liking
    @@index([problemId])
    @@map("problem_likes")
  }
  ```

  Also add the reverse relation in the `Problem` model:

  ```prisma
  model Problem {
    // ... existing fields ...
    likes ProblemLike[]
  }
  ```

  And in the `User` model:

  ```prisma
  model User {
    // ... existing fields ...
    problemLikes ProblemLike[]
  }
  ```

- [ ] **4.2 — Run Migration**

  ```bash
  npx prisma migrate dev --name add_problem_like_table
  ```

- [ ] **4.3 — Add `toggleLike` Use Case**

  New file: `apps/backend-api/src/application/use-cases/problem/ToggleProblemLike.ts`

  Logic:
  - Check if a `ProblemLike` row exists for `{ userId, problemId }`
  - If exists: DELETE it, DECREMENT `likesCount` on Problem
  - If not: CREATE it, INCREMENT `likesCount` on Problem
  - Return `{ liked: boolean, likesCount: number }`

  This must be an atomic DB transaction to avoid race conditions on `likesCount`.

- [ ] **4.4 — Add `POST /api/problems/:slug/like` Route**

  Wire the new use case to the problems router. Requires authenticated user (JWT middleware already in place).

- [ ] **4.5 — Update `ProblemHeader.tsx` to Use API Instead of localStorage**

  Replace the localStorage `toggleLike` implementation with an API call.
  Read initial like state from the API response (add `isLikedByUser?: boolean` to the problem response when user is authenticated).

- [ ] **4.6 — Verify Phase 4**
  - Like a problem, refresh the page — confirm like state persists
  - Unlike the same problem, refresh — confirm it's gone
  - Log in from a different device/browser — confirm like state syncs
  - Confirm `likesCount` in the DB increments/decrements atomically

---

## Verification Checklist (All Phases)

### Automated

```bash
# Type safety
npm run typecheck  # in apps/frontend, apps/backend-api, apps/judge-worker

# Unit tests
npm run test       # in apps/backend-api (percentile edge cases: totalAccepted === 1 vs 1000)
```

### Manual

1. Open `http://localhost:3000/problems/two-sum`
2. Confirm **Phase 1**: acceptance rate badge + social proof banner visible
3. Submit an accepted solution:
   - Confirm **Phase 2**: `"faster than X% of submissions!"` message appears
   - Confirm stats in header update within 5 minutes (cache busted)
4. Open 3 tabs to the same problem and confirm **Phase 3**: active counter shows `3 solving now`
5. Like/unlike the problem (after Phase 4) and confirm persistence across sessions

---

## ❌ Explicitly Out of Scope (Deferred)

| Feature                                                               | Reason                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Real-time WebSocket counter updates                                   | Complexity vs value tradeoff; polling is sufficient                      |
| Memory percentile                                                     | Memory usage varies too much by runtime environment to be meaningful     |
| Per-language percentile (`faster than 88% of JavaScript submissions`) | Requires storing `language` on `SubmissionResult`; not currently tracked |
| Leaderboard                                                           | Separate feature with its own design                                     |
