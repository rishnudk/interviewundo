// ============================================================
// Dependency Injection Container
// Wires infrastructure implementations to domain ports
// All use cases are instantiated here and exported
// ============================================================

// --- Infrastructure (implementations) ---
import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaProblemRepository } from '../infrastructure/database/repositories/PrismaProblemRepository';
import { PrismaSubmissionRepository } from '../infrastructure/database/repositories/PrismaSubmissionRepository';
import { JoseAuthTokenService } from '../infrastructure/auth/JoseAuthTokenService';
import { Argon2PasswordService } from '../infrastructure/auth/Argon2PasswordService';
import { RedisCacheService } from '../infrastructure/cache/RedisCacheService';
import { BullMQQueueService } from '../infrastructure/queue/BullMQQueueService';
import { submissionQueue } from '../infrastructure/queue/queues';
import { socketIOService } from '../infrastructure/notification/SocketIOService';

// --- Use Cases ---
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../application/use-cases/auth/RefreshToken';
import { GetProblems } from '../application/use-cases/problem/GetProblems';
import { GetProblemBySlug } from '../application/use-cases/problem/GetProblemBySlug';
import { SubmitSolution } from '../application/use-cases/submission/SubmitSolution';
import { RunCode } from '../application/use-cases/submission/RunCode';
import { GetSubmissions } from '../application/use-cases/submission/GetSubmissions';
import { GetSubmissionResult } from '../application/use-cases/submission/GetSubmissionResult';
import { GetUserStats } from '../application/use-cases/dashboard/GetUserStats';
import { GetCategoryProgress } from '../application/use-cases/dashboard/GetCategoryProgress';
import { GetActivityHeatmap } from '../application/use-cases/dashboard/GetActivityHeatmap';
import { GetRecentActivity } from '../application/use-cases/dashboard/GetRecentActivity';

// --- Controllers ---
import { AuthController } from '../presentation/controllers/AuthController';
import { ProblemController } from '../presentation/controllers/ProblemController';
import { SubmissionController } from '../presentation/controllers/SubmissionController';
import { DashboardController } from '../presentation/controllers/DashboardController';

// ============================================================
// Wire Dependencies
// ============================================================

// Step 1: Instantiate infrastructure
const userRepository = new PrismaUserRepository();
const problemRepository = new PrismaProblemRepository();
const submissionRepository = new PrismaSubmissionRepository();
const authTokenService = new JoseAuthTokenService();
const passwordService = new Argon2PasswordService();
const cacheService = new RedisCacheService();
const queueService = new BullMQQueueService(submissionQueue);

// Use real SocketIOService as the notification service
const notificationService = socketIOService;

// Step 2: Instantiate use cases with injected dependencies
const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
const refreshToken = new RefreshToken(userRepository, authTokenService);
const getProblems = new GetProblems(problemRepository, cacheService);
const getProblemBySlug = new GetProblemBySlug(problemRepository, cacheService);
const submitSolution = new SubmitSolution(
  submissionRepository,
  problemRepository,
  queueService,
  notificationService,
);
const runCode = new RunCode(problemRepository, queueService);
const getSubmissions = new GetSubmissions(submissionRepository);
const getSubmissionResult = new GetSubmissionResult(submissionRepository);
const getUserStats = new GetUserStats(submissionRepository, problemRepository, userRepository);
const getCategoryProgress = new GetCategoryProgress(submissionRepository, problemRepository);
const getActivityHeatmap = new GetActivityHeatmap(submissionRepository);
const getRecentActivity = new GetRecentActivity(submissionRepository);

// Step 3: Instantiate controllers
const authController = new AuthController(registerUser, loginUser, refreshToken);
const problemController = new ProblemController(getProblems, getProblemBySlug);
const submissionController = new SubmissionController(
  submitSolution,
  runCode,
  getSubmissions,
  getSubmissionResult,
);
const dashboardController = new DashboardController(
  getUserStats,
  getCategoryProgress,
  getActivityHeatmap,
  getRecentActivity,
);

// Step 4: Export container
export const container = {
  repositories: {
    userRepository,
    problemRepository,
    submissionRepository,
  },
  services: {
    authTokenService,
    passwordService,
    cacheService,
  },
  useCases: {
    registerUser,
    loginUser,
    refreshToken,
    getProblems,
    getProblemBySlug,
    submitSolution,
    runCode,
    getSubmissions,
    getSubmissionResult,
    getUserStats,
    getCategoryProgress,
    getActivityHeatmap,
    getRecentActivity,
  },
  controllers: {
    authController,
    problemController,
    submissionController,
    dashboardController,
  },
};
