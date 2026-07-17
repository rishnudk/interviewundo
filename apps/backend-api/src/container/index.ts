// ============================================================
// Dependency Injection Container
// Wires infrastructure implementations to domain ports
// All use cases are instantiated here and exported
// ============================================================

// --- Infrastructure (implementations) ---
import { PrismaUserRepository } from '../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaProblemRepository } from '../infrastructure/database/repositories/PrismaProblemRepository';
import { PrismaSubmissionRepository } from '../infrastructure/database/repositories/PrismaSubmissionRepository';
import { PrismaTestCaseRepository } from '../infrastructure/database/repositories/PrismaTestCaseRepository';
import { PrismaHintUsageRepository } from '../infrastructure/database/repositories/PrismaHintUsageRepository';
import { PrismaFeatureRequestRepository } from '../infrastructure/database/repositories/PrismaFeatureRequestRepository';
import { GrokHintService } from '../infrastructure/ai/GrokHintService';
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
import { AuthenticateGithubUser } from '../application/use-cases/auth/AuthenticateGithubUser';
import { AuthenticateGoogleUser } from '../application/use-cases/auth/AuthenticateGoogleUser';
import { GetProblems } from '../application/use-cases/problem/GetProblems';
import { GetProblemBySlug } from '../application/use-cases/problem/GetProblemBySlug';
import { GetDailyChallenge } from '../application/use-cases/problem/GetDailyChallenge';
import { GetHintForProblem } from '../application/use-cases/problem/GetHintForProblem';
import { SubmitSolution } from '../application/use-cases/submission/SubmitSolution';
import { RunCode } from '../application/use-cases/submission/RunCode';
import { GetSubmissions } from '../application/use-cases/submission/GetSubmissions';
import { GetSubmissionResult } from '../application/use-cases/submission/GetSubmissionResult';
import { GetUserStats } from '../application/use-cases/dashboard/GetUserStats';
import { GetCategoryProgress } from '../application/use-cases/dashboard/GetCategoryProgress';
import { GetActivityHeatmap } from '../application/use-cases/dashboard/GetActivityHeatmap';
import { GetRecentActivity } from '../application/use-cases/dashboard/GetRecentActivity';

// Admin & Test Cases & Feature Request Use Cases
import { GetAdminStats } from '../application/use-cases/admin/GetAdminStats';
import { GetAdminProblems } from '../application/use-cases/admin/GetAdminProblems';
import { CreateProblem } from '../application/use-cases/problem/CreateProblem';
import { UpdateProblem } from '../application/use-cases/problem/UpdateProblem';
import { DeleteProblem } from '../application/use-cases/problem/DeleteProblem';
import { ToggleProblemLike } from '../application/use-cases/problem/ToggleProblemLike';
import { CreateTestCase } from '../application/use-cases/testcase/CreateTestCase';
import { UpdateTestCase } from '../application/use-cases/testcase/UpdateTestCase';
import { DeleteTestCase } from '../application/use-cases/testcase/DeleteTestCase';
import { GetTestCasesByProblemId } from '../application/use-cases/testcase/GetTestCasesByProblemId';
import { CreateFeatureRequest } from '../application/use-cases/requests/CreateFeatureRequest';
import { GetFeatureRequests } from '../application/use-cases/requests/GetFeatureRequests';
import { UpvoteFeatureRequest } from '../application/use-cases/requests/UpvoteFeatureRequest';

// --- Controllers ---
import { AuthController } from '../presentation/controllers/AuthController';
import { ProblemController } from '../presentation/controllers/ProblemController';
import { SubmissionController } from '../presentation/controllers/SubmissionController';
import { DashboardController } from '../presentation/controllers/DashboardController';
import { AdminController } from '../presentation/controllers/AdminController';
import { FeatureRequestController } from '../presentation/controllers/FeatureRequestController';

// ============================================================
// Wire Dependencies
// ============================================================

// Step 1: Instantiate infrastructure
const userRepository = new PrismaUserRepository();
const problemRepository = new PrismaProblemRepository();
const submissionRepository = new PrismaSubmissionRepository();
const testCaseRepository = new PrismaTestCaseRepository();
const featureRequestRepository = new PrismaFeatureRequestRepository();
const authTokenService = new JoseAuthTokenService();
const passwordService = new Argon2PasswordService();
const cacheService = new RedisCacheService();
const queueService = new BullMQQueueService(submissionQueue);
const hintUsageRepository = new PrismaHintUsageRepository();
const hintService = new GrokHintService();

// Use real SocketIOService as the notification service
const notificationService = socketIOService;

// Step 2: Instantiate use cases with injected dependencies
const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
const refreshToken = new RefreshToken(userRepository, authTokenService);
const authenticateGithubUser = new AuthenticateGithubUser(userRepository, authTokenService);
const authenticateGoogleUser = new AuthenticateGoogleUser(userRepository, authTokenService);
const getProblems = new GetProblems(problemRepository, cacheService);
const getProblemBySlug = new GetProblemBySlug(problemRepository, cacheService);
const getDailyChallenge = new GetDailyChallenge(problemRepository, cacheService);
const getHintForProblem = new GetHintForProblem(
  problemRepository,
  hintUsageRepository,
  hintService,
);
const toggleProblemLike = new ToggleProblemLike();
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

// Admin & Test Cases & Feature Requests
const getAdminStats = new GetAdminStats(userRepository, submissionRepository, problemRepository);
const getAdminProblems = new GetAdminProblems(problemRepository);
const createProblem = new CreateProblem(problemRepository);
const updateProblem = new UpdateProblem(problemRepository);
const deleteProblem = new DeleteProblem(problemRepository);
const createTestCase = new CreateTestCase(testCaseRepository, problemRepository);
const updateTestCase = new UpdateTestCase(testCaseRepository);
const deleteTestCase = new DeleteTestCase(testCaseRepository);
const getTestCasesByProblemId = new GetTestCasesByProblemId(testCaseRepository);
const createFeatureRequest = new CreateFeatureRequest(featureRequestRepository);
const getFeatureRequests = new GetFeatureRequests(featureRequestRepository);
const upvoteFeatureRequest = new UpvoteFeatureRequest(featureRequestRepository);

// Step 3: Instantiate controllers
const authController = new AuthController(
  registerUser,
  loginUser,
  refreshToken,
  authenticateGithubUser,
  authenticateGoogleUser,
);
const problemController = new ProblemController(
  getProblems,
  getProblemBySlug,
  getDailyChallenge,
  getHintForProblem,
  toggleProblemLike,
);
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
const adminController = new AdminController(
  getAdminStats,
  getAdminProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  getTestCasesByProblemId,
);
const featureRequestController = new FeatureRequestController(
  createFeatureRequest,
  getFeatureRequests,
  upvoteFeatureRequest,
);

// Step 4: Export container
export const container = {
  repositories: {
    userRepository,
    problemRepository,
    submissionRepository,
    testCaseRepository,
    hintUsageRepository,
    featureRequestRepository,
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
    authenticateGithubUser,
    authenticateGoogleUser,
    getProblems,
    getProblemBySlug,
    getDailyChallenge,
    getHintForProblem,
    submitSolution,
    runCode,
    getSubmissions,
    getSubmissionResult,
    getUserStats,
    getCategoryProgress,
    getActivityHeatmap,
    getRecentActivity,
    getAdminStats,
    getAdminProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    createTestCase,
    updateTestCase,
    deleteTestCase,
    getTestCasesByProblemId,
    createFeatureRequest,
    getFeatureRequests,
    upvoteFeatureRequest,
  },
  controllers: {
    authController,
    problemController,
    submissionController,
    dashboardController,
    adminController,
    featureRequestController,
  },
};
