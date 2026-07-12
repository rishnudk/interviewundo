// @ts-nocheck â€” TODO: Remove this and fix all `any` types properly
import { prisma } from '../../../config/database';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem, ProblemFilterDTO } from '@interviewprep/shared-types';
import { Difficulty, Category } from '@interviewprep/shared-types';

// ============================================================
// PrismaProblemRepository
// Concrete repository implementing Problem database operations
// ============================================================

export class PrismaProblemRepository implements IProblemRepository {
  private mapPrismaProblem(prismaProblem: any): Problem {
    return {
      id: prismaProblem.id,
      title: prismaProblem.title,
      slug: prismaProblem.slug,
      description: prismaProblem.description,
      difficulty: prismaProblem.difficulty as Difficulty,
      category: prismaProblem.category as Category,
      starterCode: prismaProblem.starterCode,
      starterFiles: prismaProblem.starterFiles as Record<string, string> | null,
      solutionCode: prismaProblem.solutionCode,
      tags: prismaProblem.tags,
      order: prismaProblem.order,
      isPublished: prismaProblem.isPublished,
      solvedCount: prismaProblem.solvedCount,
      attemptCount: prismaProblem.attemptCount,
      likesCount: prismaProblem.likesCount,
      viewsCount: prismaProblem.viewsCount,
      estimatedMinutes: prismaProblem.estimatedMinutes,
      createdAt: prismaProblem.createdAt,
      updatedAt: prismaProblem.updatedAt,
    };
  }

  async create(data: {
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    category: string;
    starterCode: string;
    starterFiles?: Record<string, string> | null;
    solutionCode?: string;
    tags?: string[];
    isPublished?: boolean;
  }): Promise<Problem> {
    const prismaProblem = await prisma.problem.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty as any,
        category: data.category as any,
        starterCode: data.starterCode,
        starterFiles: data.starterFiles || undefined,
        solutionCode: data.solutionCode || null,
        tags: data.tags || [],
        isPublished: data.isPublished ?? false,
      },
    });

    return this.mapPrismaProblem(prismaProblem);
  }

  async findById(id: string): Promise<Problem | null> {
    const prismaProblem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!prismaProblem) return null;
    return this.mapPrismaProblem(prismaProblem);
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    const prismaProblem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!prismaProblem) return null;
    return {
      ...this.mapPrismaProblem(prismaProblem),
      testCases: prismaProblem.testCases,
    };
  }

  async findAll(
    filters: ProblemFilterDTO & { isPublished?: boolean },
  ): Promise<{ data: Problem[]; total: number }> {
    const where: any = {};

    // Filter by published status
    if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    } else {
      where.isPublished = true; // Default for public API
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters.tag) {
      where.tags = {
        has: filters.tag,
      };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [prismaProblems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
        },
      }),
      prisma.problem.count({ where }),
    ]);

    return {
      data: prismaProblems.map((p: any) => this.mapPrismaProblem(p)),
      total,
    };
  }

  async update(id: string, data: Partial<Problem>): Promise<Problem> {
    const prismaProblem = await prisma.problem.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty as any,
        category: data.category as any,
        starterCode: data.starterCode,
        starterFiles: data.starterFiles || undefined,
        solutionCode: data.solutionCode,
        tags: data.tags,
        isPublished: data.isPublished,
        order: data.order,
      },
    });

    return this.mapPrismaProblem(prismaProblem);
  }

  async delete(id: string): Promise<void> {
    await prisma.problem.delete({
      where: { id },
    });
  }

  async incrementSolvedCount(id: string): Promise<void> {
    await prisma.problem.update({
      where: { id },
      data: {
        solvedCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementAttemptCount(id: string): Promise<void> {
    await prisma.problem.update({
      where: { id },
      data: {
        attemptCount: {
          increment: 1,
        },
      },
    });
  }

  async countByDifficulty(): Promise<Record<string, number>> {
    const counts = await prisma.problem.groupBy({
      by: ['difficulty'],
      where: { isPublished: true },
      _count: {
        id: true,
      },
    });

    const result: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
    counts.forEach((c) => {
      result[c.difficulty] = c._count.id;
    });
    return result;
  }

  async countByCategory(): Promise<Record<string, number>> {
    const counts = await prisma.problem.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: {
        id: true,
      },
    });

    const result: Record<string, number> = {
      JAVASCRIPT: 0,
      REACT: 0,
      NODEJS: 0,
      TYPESCRIPT: 0,
    };
    counts.forEach((c) => {
      result[c.category] = c._count.id;
    });
    return result;
  }

  async countAll(): Promise<number> {
    return prisma.problem.count();
  }

  async getDailyChallenge(date: Date): Promise<Problem | null> {
    const dateOnly = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dailyChallenge = await prisma.dailyChallenge.findUnique({
      where: { date: dateOnly },
    });

    if (!dailyChallenge) return null;

    return this.findById(dailyChallenge.problemId);
  }

  async setDailyChallenge(problemId: string, date: Date): Promise<Problem> {
    const dateOnly = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    await prisma.dailyChallenge.upsert({
      where: { date: dateOnly },
      create: {
        problemId,
        date: dateOnly,
      },
      update: {
        problemId,
      },
    });

    const problem = await this.findById(problemId);
    if (!problem) {
      throw new Error(`Problem not found: ${problemId}`);
    }
    return problem;
  }
}
