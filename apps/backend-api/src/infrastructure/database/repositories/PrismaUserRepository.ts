import { prisma } from '../../../config/database';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { User } from '@interviewprep/shared-types';
import { UserRole } from '@interviewprep/shared-types';

// ============================================================
// PrismaUserRepository
// Concrete repository implementing User database operations
// ============================================================

export class PrismaUserRepository implements IUserRepository {
  private mapPrismaUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role as UserRole,
      image: prismaUser.image,
      streak: prismaUser.streak,
      lastActiveAt: prismaUser.lastActiveAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  async create(data: {
    name: string;
    email: string;
    password?: string | null;
    role: string;
    githubId?: string | null;
    googleId?: string | null;
    image?: string | null;
  }): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || null,
        role: data.role as any,
        githubId: data.githubId || null,
        googleId: data.googleId || null,
        image: data.image || null,
      },
    });

    return this.mapPrismaUser(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) return null;
    return this.mapPrismaUser(prismaUser);
  }

  async findByEmail(email: string): Promise<(User & { password: string | null }) | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) return null;

    return {
      ...this.mapPrismaUser(prismaUser),
      password: prismaUser.password,
    };
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { githubId },
    });

    if (!prismaUser) return null;
    return this.mapPrismaUser(prismaUser);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!prismaUser) return null;
    return this.mapPrismaUser(prismaUser);
  }

  async updateStreak(userId: string, streak: number, lastActiveAt: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak,
        lastActiveAt,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      image?: string | null;
      githubId?: string | null;
      googleId?: string | null;
    },
  ): Promise<User> {
    const prismaUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
        githubId: data.githubId,
        googleId: data.googleId,
      },
    });

    return this.mapPrismaUser(prismaUser);
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async findRecentWithImages(limit: number): Promise<User[]> {
    const prismaUsers = await prisma.user.findMany({
      where: {
        AND: [{ image: { not: null } }, { image: { not: '' } }],
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaUsers.map(this.mapPrismaUser);
  }
}
