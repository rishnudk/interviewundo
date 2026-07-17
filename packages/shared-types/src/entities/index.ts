import { Difficulty, Category, SubmissionStatus, UserRole } from '../enums';

// ============================================================
// User
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  streak: number;
  lastActiveAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Problem
// ============================================================

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  starterCode: string;
  starterFiles?: Record<string, string> | null;
  solutionCode?: string | null;
  tags: string[];
  order: number;
  isPublished: boolean;
  solvedCount: number;
  attemptCount: number;
  likesCount: number;
  viewsCount: number;
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  testCases?: TestCase[];
  activeSolversCount?: number;
  isLikedByUser?: boolean;
}

// ============================================================
// TestCase
// ============================================================

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
  createdAt: Date;
}

// ============================================================
// Submission
// ============================================================

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  createdAt: Date;
}

// ============================================================
// SubmissionResult
// ============================================================

export interface SubmissionResult {
  id: string;
  submissionId: string;
  runtime?: number | null;
  memory?: number | null;
  passedCases: number;
  totalCases: number;
  error?: string | null;
  output?: string | null;
  createdAt: Date;
}

// ============================================================
// DailyChallenge
// ============================================================

export interface DailyChallenge {
  id: string;
  problemId: string;
  date: Date;
  createdAt: Date;
}

// ============================================================
// FeatureRequest
// ============================================================

export type RequestType = 'PROBLEM_REQUEST' | 'FEATURE_SUGGESTION' | 'BUG_REPORT';
export type RequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface FeatureRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
}
