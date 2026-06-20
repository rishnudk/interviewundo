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

// --- Use Cases ---
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../application/use-cases/auth/RefreshToken';
import { GetProblems } from '../application/use-cases/problem/GetProblems';
import { GetProblemBySlug } from '../application/use-cases/problem/GetProblemBySlug';
import { SubmitSolution } from '../application/use-cases/submission/SubmitSolution';
import { RunCode } from '../application/use-cases/submission/RunCode';

// --- Controllers ---
import { AuthController } from '../presentation/controllers/AuthController';
import { ProblemController } from '../presentation/controllers/ProblemController';
import { SubmissionController } from '../presentation/controllers/SubmissionController';

// --- Interfaces for Mock Services ---
import type { IQueueService } from '../domain/ports/services/IQueueService';
import type { INotificationService } from '../domain/ports/services/INotificationService';

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

// Mock Services for Queue and Notification
const mockQueueService: IQueueService = {
  enqueueSubmission: async (job) => {
    console.log(`[Queue Mock] Enqueued submission ${job.submissionId} for user ${job.userId}`);
    return `job-${job.submissionId}`;
  },
  getJobStatus: async (_jobId) => 'active',
};

const mockNotificationService: INotificationService = {
  notifyUser: (userId, event, data) => {
    console.log(`[Notification Mock] Notified user ${userId} of event ${event} with data:`, data);
  },
  notifyAll: (event, data) => {
    console.log(`[Notification Mock] Broadcasted event ${event} with data:`, data);
  },
};

// Step 2: Instantiate use cases with injected dependencies
const registerUser = new RegisterUser(userRepository, passwordService, authTokenService);
const loginUser = new LoginUser(userRepository, passwordService, authTokenService);
const refreshToken = new RefreshToken(userRepository, authTokenService);
const getProblems = new GetProblems(problemRepository, cacheService);
const getProblemBySlug = new GetProblemBySlug(problemRepository, cacheService);
const submitSolution = new SubmitSolution(
  submissionRepository,
  problemRepository,
  mockQueueService,
  mockNotificationService,
);
const runCode = new RunCode(problemRepository, mockQueueService);

// Step 3: Instantiate controllers
const authController = new AuthController(registerUser, loginUser, refreshToken);
const problemController = new ProblemController(getProblems, getProblemBySlug);
const submissionController = new SubmissionController(submitSolution, runCode);

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
  },
  controllers: {
    authController,
    problemController,
    submissionController,
  },
};
