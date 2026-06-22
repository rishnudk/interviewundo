import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';

// Setup mock registry on globalThis to satisfy hoisting rules
(globalThis as any).mockTestCaseFindMany = vi.fn();
(globalThis as any).mockSubmissionUpdate = vi.fn();
(globalThis as any).mockSubmissionResultCreate = vi.fn();
(globalThis as any).mockProblemUpdate = vi.fn();
(globalThis as any).mockProblemFindUnique = vi.fn();
(globalThis as any).mockUserFindUnique = vi.fn();
(globalThis as any).mockUserUpdate = vi.fn();
(globalThis as any).mockTransaction = vi.fn();
(globalThis as any).mockRedisPublish = vi.fn();
(globalThis as any).mockRedisSetex = vi.fn();
(globalThis as any).mockExecute = vi.fn();

// Mock dependencies using delegating functions that lookup globalThis registry values at invocation time
vi.mock('../config/database', () => ({
  prisma: {
    testCase: {
      findMany: (...args: any[]) => (globalThis as any).mockTestCaseFindMany(...args),
    },
    submission: {
      update: (...args: any[]) => (globalThis as any).mockSubmissionUpdate(...args),
    },
    submissionResult: {
      create: (...args: any[]) => (globalThis as any).mockSubmissionResultCreate(...args),
    },
    problem: {
      findUnique: (...args: any[]) => (globalThis as any).mockProblemFindUnique(...args),
      update: (...args: any[]) => (globalThis as any).mockProblemUpdate(...args),
    },
    user: {
      findUnique: (...args: any[]) => (globalThis as any).mockUserFindUnique(...args),
      update: (...args: any[]) => (globalThis as any).mockUserUpdate(...args),
    },
    $transaction: (...args: any[]) => (globalThis as any).mockTransaction(...args),
  },
}));

vi.mock('../config/redis', () => ({
  redis: {
    publish: (...args: any[]) => (globalThis as any).mockRedisPublish(...args),
    setex: (...args: any[]) => (globalThis as any).mockRedisSetex(...args),
  },
}));

vi.mock('../executor/JavascriptExecutor', () => {
  return {
    JavascriptExecutor: vi.fn().mockImplementation(() => ({
      execute: (...args: any[]) => (globalThis as any).mockExecute(...args),
    })),
  };
});

vi.mock('bullmq', () => {
  return {
    Worker: vi.fn().mockImplementation((_name, processor) => {
      return {
        processor, // Expose processor so we can trigger it in tests
        on: vi.fn(),
      };
    }),
  };
});

let submissionWorkerInstance: any;

describe('SubmissionWorker Unit Tests', () => {
  const mockJob = {
    data: {
      submissionId: 'sub-123',
      userId: 'user-456',
      problemId: 'problem-789',
      code: 'function twoSum() {}',
      language: 'javascript',
    },
  } as any;

  const mockTestCases = [{ id: 'tc-1', input: '[[1, 2], 3]', expectedOutput: '3' }];

  beforeAll(async () => {
    // Dynamically import SubmissionWorker only after mocks and globalThis are set up
    const mod = await import('./SubmissionWorker.js');
    submissionWorkerInstance = mod.submissionWorker;
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (globalThis as any).mockTestCaseFindMany.mockResolvedValue(mockTestCases);
    (globalThis as any).mockSubmissionUpdate.mockResolvedValue({});
    (globalThis as any).mockSubmissionResultCreate.mockResolvedValue({});
    (globalThis as any).mockProblemUpdate.mockResolvedValue({});
    (globalThis as any).mockProblemFindUnique.mockResolvedValue({ category: 'JAVASCRIPT' });
    (globalThis as any).mockUserFindUnique.mockResolvedValue({
      streak: 1,
      lastActiveAt: new Date(),
    });
    (globalThis as any).mockUserUpdate.mockResolvedValue({});
    (globalThis as any).mockRedisPublish.mockResolvedValue(1);
    (globalThis as any).mockRedisSetex.mockResolvedValue('OK');
    (globalThis as any).mockTransaction.mockImplementation(async (promises: any) =>
      Promise.all(promises),
    );
  });

  it('should process a database submission successfully and save ACCEPTED status', async () => {
    (globalThis as any).mockExecute.mockResolvedValue({
      passed: true,
      passedCases: 1,
      totalCases: 1,
      results: [{ id: 'tc-1', passed: true, actual: 3, expected: 3, runtime: 5, error: null }],
      runtime: 5,
      memory: 2048,
    });

    // Execute worker processor
    const processor = submissionWorkerInstance.processor;
    await processor(mockJob);

    // Verify database update to PROCESSING
    expect((globalThis as any).mockSubmissionUpdate).toHaveBeenCalledWith({
      where: { id: 'sub-123' },
      data: { status: 'PROCESSING' },
    });

    // Verify transaction updates status to ACCEPTED and saves results
    expect((globalThis as any).mockSubmissionUpdate).toHaveBeenCalledWith({
      where: { id: 'sub-123' },
      data: { status: 'ACCEPTED' },
    });
    expect((globalThis as any).mockSubmissionResultCreate).toHaveBeenCalledWith({
      data: {
        submissionId: 'sub-123',
        runtime: 5,
        memory: 2048,
        passedCases: 1,
        totalCases: 1,
        error: undefined,
        output: '3',
      },
    });

    // Verify problem solved count is incremented
    expect((globalThis as any).mockProblemUpdate).toHaveBeenCalledWith({
      where: { id: 'problem-789' },
      data: { solvedCount: { increment: 1 } },
    });

    // Verify Redis publishes update
    expect((globalThis as any).mockRedisPublish).toHaveBeenCalledWith(
      'submission:updates',
      expect.stringContaining('ACCEPTED'),
    );
  });

  it('should process WRONG_ANSWER status and not increment solvedCount', async () => {
    (globalThis as any).mockExecute.mockResolvedValue({
      passed: false,
      passedCases: 0,
      totalCases: 1,
      results: [{ id: 'tc-1', passed: false, actual: 4, expected: 3, runtime: 5, error: null }],
      runtime: 5,
      memory: 2048,
    });

    const processor = submissionWorkerInstance.processor;
    await processor(mockJob);

    // Verify WRONG_ANSWER transaction
    expect((globalThis as any).mockSubmissionUpdate).toHaveBeenCalledWith({
      where: { id: 'sub-123' },
      data: { status: 'WRONG_ANSWER' },
    });

    // solvedCount should NOT be incremented
    expect((globalThis as any).mockProblemUpdate).not.toHaveBeenCalled();

    // Verify Redis update
    expect((globalThis as any).mockRedisPublish).toHaveBeenCalledWith(
      'submission:updates',
      expect.stringContaining('WRONG_ANSWER'),
    );
  });

  it('should handle playground execution (run-xxxx) by caching in Redis instead of saving to DB', async () => {
    const playgroundJob = {
      data: {
        submissionId: 'run-999',
        userId: 'user-456',
        problemId: 'problem-789',
        code: 'console.log("Playground");',
        language: 'javascript',
      },
    } as any;

    (globalThis as any).mockExecute.mockResolvedValue({
      passed: true,
      passedCases: 1,
      totalCases: 1,
      results: [{ id: 'tc-1', passed: true, actual: 3, expected: 3, runtime: 5, error: null }],
      runtime: 5,
      memory: 2048,
    });

    const processor = submissionWorkerInstance.processor;
    await processor(playgroundJob);

    // Should NOT touch the database for status updates, solvedCounts, or results
    expect((globalThis as any).mockSubmissionUpdate).not.toHaveBeenCalled();
    expect((globalThis as any).mockSubmissionResultCreate).not.toHaveBeenCalled();
    expect((globalThis as any).mockProblemUpdate).not.toHaveBeenCalled();

    // Should set result in Redis cache with run-999 key
    expect((globalThis as any).mockRedisSetex).toHaveBeenCalledWith(
      'run:result:run-999',
      300,
      expect.stringContaining('run-999'),
    );

    // Should publish update via Redis pub/sub
    expect((globalThis as any).mockRedisPublish).toHaveBeenCalledWith(
      'submission:updates',
      expect.stringContaining('run-999'),
    );
  });
});
