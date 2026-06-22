// ============================================================
// Enums — Shared between frontend and backend
// ============================================================

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum Category {
  JAVASCRIPT = 'JAVASCRIPT',
  REACT = 'REACT',
  NODEJS = 'NODEJS',
  TYPESCRIPT = 'TYPESCRIPT',
  SQL = 'SQL',
  MONGODB = 'MONGODB',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
}
