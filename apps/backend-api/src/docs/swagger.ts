/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: NOT_FOUND
 *             message:
 *               type: string
 *               example: Resource not found
 *             requestId:
 *               type: string
 *               example: 0f5f0d63-c1ef-4bb7-b5df-5c6c3d9d7a11
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [STUDENT, ADMIN]
 *         image:
 *           type: string
 *           nullable: true
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/AuthUser'
 *             accessToken:
 *               type: string
 *             refreshToken:
 *               type: string
 *     RegisterRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Developer
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     RefreshTokenRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *     GithubAuthRequest:
 *       type: object
 *       required: [githubId, email, name]
 *       properties:
 *         githubId:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *     Problem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [EASY, MEDIUM, HARD]
 *         category:
 *           type: string
 *           enum: [JAVASCRIPT, REACT, NODEJS, TYPESCRIPT]
 *         starterCode:
 *           type: string
 *         solutionCode:
 *           type: string
 *           nullable: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         order:
 *           type: integer
 *         isPublished:
 *           type: boolean
 *         solvedCount:
 *           type: integer
 *         attemptCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProblemListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 *     CreateProblemRequest:
 *       type: object
 *       required: [title, slug, description, difficulty, category, starterCode]
 *       properties:
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *           example: two-sum
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [EASY, MEDIUM, HARD]
 *         category:
 *           type: string
 *           enum: [JAVASCRIPT, REACT, NODEJS, TYPESCRIPT]
 *         starterCode:
 *           type: string
 *         solutionCode:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isPublished:
 *           type: boolean
 *     UpdateProblemRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateProblemRequest'
 *     HintRequest:
 *       type: object
 *       required: [code]
 *       properties:
 *         code:
 *           type: string
 *     HintResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             hint:
 *               type: string
 *             remainingHints:
 *               type: integer
 *     SubmitSolutionRequest:
 *       type: object
 *       required: [problemId, code]
 *       properties:
 *         problemId:
 *           type: string
 *         code:
 *           type: string
 *         language:
 *           type: string
 *           example: javascript
 *     Submission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         problemId:
 *           type: string
 *         code:
 *           type: string
 *         language:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, COMPILATION_ERROR, TIME_LIMIT_EXCEEDED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     SubmissionResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         submissionId:
 *           type: string
 *         runtime:
 *           type: integer
 *           nullable: true
 *         memory:
 *           type: integer
 *           nullable: true
 *         passedCases:
 *           type: integer
 *         totalCases:
 *           type: integer
 *         error:
 *           type: string
 *           nullable: true
 *         output:
 *           type: string
 *           nullable: true
 *     SubmissionListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 *     PlaygroundRunResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             jobId:
 *               type: string
 *             status:
 *               type: string
 *               example: PENDING
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalSolved:
 *           type: integer
 *         totalProblems:
 *           type: integer
 *         successRate:
 *           type: integer
 *         streak:
 *           type: integer
 *         difficultyBreakdown:
 *           type: object
 *     CategoryProgressItem:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *         solved:
 *           type: integer
 *         total:
 *           type: integer
 *         percentage:
 *           type: integer
 *     ActivityHeatmapItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         count:
 *           type: integer
 *     RecentSubmissionItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         problemId:
 *           type: string
 *         problemTitle:
 *           type: string
 *         problemSlug:
 *           type: string
 *         difficulty:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     DashboardSummaryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             stats:
 *               $ref: '#/components/schemas/DashboardStats'
 *             progress:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryProgressItem'
 *             activity:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityHeatmapItem'
 *             recent:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecentSubmissionItem'
 *     AdminStatsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: integer
 *             totalProblems:
 *               type: integer
 *             totalSubmissions:
 *               type: integer
 *             acceptedSubmissions:
 *               type: integer
 *             problemCountsByDifficulty:
 *               type: object
 *     TestCase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         problemId:
 *           type: string
 *         input:
 *           type: string
 *         expectedOutput:
 *           type: string
 *         isHidden:
 *           type: boolean
 *         order:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateTestCaseRequest:
 *       type: object
 *       required: [problemId, input, expectedOutput]
 *       properties:
 *         problemId:
 *           type: string
 *         input:
 *           type: string
 *         expectedOutput:
 *           type: string
 *         isHidden:
 *           type: boolean
 *         order:
 *           type: integer
 *     UpdateTestCaseRequest:
 *       type: object
 *       properties:
 *         input:
 *           type: string
 *         expectedOutput:
 *           type: string
 *         isHidden:
 *           type: boolean
 *         order:
 *           type: integer
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Liveness probe
 *     responses:
 *       200:
 *         description: Service is alive
 * /ready:
 *   get:
 *     tags: [Health]
 *     summary: Readiness probe
 *     responses:
 *       200:
 *         description: Dependencies are ready
 *       503:
 *         description: Dependencies are not ready
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 * /api/auth/refreshToken:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange a refresh token for new tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 * /api/auth/github:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate or provision a GitHub OAuth user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GithubAuthRequest'
 *     responses:
 *       200:
 *         description: OAuth login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */

/**
 * @openapi
 * /api/problems:
 *   get:
 *     tags: [Problems]
 *     summary: List published problems
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [JAVASCRIPT, REACT, NODEJS, TYPESCRIPT]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [EASY, MEDIUM, HARD]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, difficulty, createdAt, solvedCount]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Problem catalog page
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemListResponse'
 * /api/problems/daily:
 *   get:
 *     tags: [Problems]
 *     summary: Get the current daily challenge
 *     responses:
 *       200:
 *         description: Daily challenge returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 * /api/problems/{slug}:
 *   get:
 *     tags: [Problems]
 *     summary: Get a problem by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Problem details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 *       404:
 *         description: Problem not found
 * /api/problems/{slug}/hint:
 *   post:
 *     tags: [Problems]
 *     summary: Generate a conceptual hint for a problem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HintRequest'
 *     responses:
 *       200:
 *         description: Hint generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HintResponse'
 *       401:
 *         description: Authentication required
 */

/**
 * @openapi
 * /api/submissions:
 *   post:
 *     tags: [Submissions]
 *     summary: Submit a solution for grading
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitSolutionRequest'
 *     responses:
 *       201:
 *         description: Submission created and queued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Submission'
 *   get:
 *     tags: [Submissions]
 *     summary: List submissions for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: problemId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission history page
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmissionListResponse'
 * /api/submissions/run:
 *   post:
 *     tags: [Submissions]
 *     summary: Execute code in playground mode without saving
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitSolutionRequest'
 *     responses:
 *       200:
 *         description: Playground run queued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaygroundRunResponse'
 * /api/submissions/{id}:
 *   get:
 *     tags: [Submissions]
 *     summary: Get a submission and its result
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Submission'
 *                     - type: object
 *                       properties:
 *                         result:
 *                           $ref: '#/components/schemas/SubmissionResult'
 *       404:
 *         description: Submission not found
 */

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get the full dashboard payload
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummaryResponse'
 * /api/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get high-level user statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats
 * /api/dashboard/progress:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get category progress metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category progress list
 * /api/dashboard/heatmap:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get activity heatmap data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily activity counts
 * /api/dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent user submissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Recent activity feed
 */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStatsResponse'
 * /api/admin/problems:
 *   get:
 *     tags: [Admin]
 *     summary: List problems for admin management
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin problem list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemListResponse'
 *   post:
 *     tags: [Admin]
 *     summary: Create a problem
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProblemRequest'
 *     responses:
 *       201:
 *         description: Problem created
 * /api/admin/problems/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a problem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProblemRequest'
 *     responses:
 *       200:
 *         description: Problem updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a problem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Problem deleted
 * /api/admin/problems/{problemId}/test-cases:
 *   get:
 *     tags: [Admin]
 *     summary: List test cases for a problem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test cases returned
 * /api/admin/test-cases:
 *   post:
 *     tags: [Admin]
 *     summary: Create a test case
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestCaseRequest'
 *     responses:
 *       201:
 *         description: Test case created
 * /api/admin/test-cases/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a test case
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTestCaseRequest'
 *     responses:
 *       200:
 *         description: Test case updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a test case
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test case deleted
 */

export const swaggerAnnotationsLoaded = true;
