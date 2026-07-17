import { z } from 'zod';
import { Difficulty, Category } from '../enums';

// ============================================================
// Auth DTOs
// ============================================================

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;

export interface AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

// ============================================================
// Problem DTOs
// ============================================================

export const CreateProblemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.nativeEnum(Difficulty),
  category: z.nativeEnum(Category),
  starterCode: z.string().min(1, 'Starter code is required'),
  solutionCode: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const UpdateProblemSchema = CreateProblemSchema.partial();

export const ProblemFilterSchema = z.object({
  category: z.nativeEnum(Category).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  sortBy: z.enum(['title', 'difficulty', 'createdAt', 'solvedCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProblemDTO = z.infer<typeof CreateProblemSchema>;
export type UpdateProblemDTO = z.infer<typeof UpdateProblemSchema>;
export type ProblemFilterDTO = z.infer<typeof ProblemFilterSchema>;

// ============================================================
// Submission DTOs
// ============================================================

export const SubmitSolutionSchema = z.object({
  problemId: z.string().cuid(),
  code: z.string().min(1, 'Code is required').max(50000),
  files: z.record(z.string(), z.string()).optional(),
  language: z.string().default('javascript'),
});

export const RunCodeSchema = z.object({
  problemId: z.string().cuid(),
  code: z.string().min(1, 'Code is required').max(50000),
  files: z.record(z.string(), z.string()).optional(),
  language: z.string().default('javascript'),
});

export type SubmitSolutionDTO = z.infer<typeof SubmitSolutionSchema>;
export type RunCodeDTO = z.infer<typeof RunCodeSchema>;

// ============================================================
// Test Case DTOs
// ============================================================

export const CreateTestCaseSchema = z.object({
  problemId: z.string().cuid(),
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const UpdateTestCaseSchema = CreateTestCaseSchema.partial().omit({ problemId: true });

export type CreateTestCaseDTO = z.infer<typeof CreateTestCaseSchema>;
export type UpdateTestCaseDTO = z.infer<typeof UpdateTestCaseSchema>;

// ============================================================
// Feature Request DTOs
// ============================================================

export const CreateFeatureRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z
    .string()
    .min(10, 'Please provide a more detailed description (at least 10 characters)')
    .max(2000),
  type: z.enum(['PROBLEM_REQUEST', 'FEATURE_SUGGESTION', 'BUG_REPORT']).default('PROBLEM_REQUEST'),
});

export const UpdateFeatureRequestStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
});

export type CreateFeatureRequestDTO = z.infer<typeof CreateFeatureRequestSchema>;
export type UpdateFeatureRequestStatusDTO = z.infer<typeof UpdateFeatureRequestStatusSchema>;
