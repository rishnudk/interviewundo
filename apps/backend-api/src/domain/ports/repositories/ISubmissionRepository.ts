import type { Submission, SubmissionResult } from '@interviewprep/shared-types';

// ============================================================
// ISubmissionRepository — Port for submission data access
// ============================================================

export interface ISubmissionRepository {
  create(data: {
    userId: string;
    problemId: string;
    code: string;
    language: string;
    status: string;
  }): Promise<Submission>;

  findById(id: string): Promise<(Submission & { result?: SubmissionResult | null }) | null>;

  findByUser(
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Submission[]; total: number }>;

  findByUserAndProblem(userId: string, problemId: string): Promise<Submission[]>;

  updateStatus(id: string, status: string): Promise<void>;

  createResult(data: {
    submissionId: string;
    runtime?: number;
    memory?: number;
    passedCases: number;
    totalCases: number;
    error?: string;
    output?: string;
  }): Promise<SubmissionResult>;

  countByUser(userId: string): Promise<number>;

  countSolvedByUser(userId: string): Promise<number>;

  countAcceptedByUser(userId: string): Promise<number>;

  getSolvedProblemsDifficultyByUser(userId: string): Promise<Record<string, number>>;

  getSolvedProblemsCategoryByUser(userId: string): Promise<Record<string, number>>;

  getRecentActivityByUser(
    userId: string,
    limit: number,
  ): Promise<
    Array<{
      id: string;
      problemId: string;
      problemTitle: string;
      problemSlug: string;
      difficulty: string;
      status: string;
      createdAt: Date;
    }>
  >;

  getActivityByUser(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: string; count: number }>>;
}
