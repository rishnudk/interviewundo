import type { User } from '@interviewprep/shared-types';

// ============================================================
// IUserRepository — Port for user data access
// Infrastructure provides the Prisma implementation
// ============================================================

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    password?: string | null;
    role: string;
    githubId?: string | null;
    googleId?: string | null;
    image?: string | null;
  }): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<(User & { password: string | null }) | null>;

  findByGithubId(githubId: string): Promise<User | null>;

  findByGoogleId(googleId: string): Promise<User | null>;

  findRecentWithImages?(limit: number): Promise<User[]>;

  updateStreak(userId: string, streak: number, lastActiveAt: Date): Promise<void>;

  update(
    id: string,
    data: {
      name?: string;
      image?: string | null;
      githubId?: string | null;
      googleId?: string | null;
    },
  ): Promise<User>;

  count(): Promise<number>;
}
