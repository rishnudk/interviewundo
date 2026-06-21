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
      solutionCode: prismaProblem.solutionCode,
      tags: prismaProblem.tags,
      order: prismaProblem.order,
      isPublished: prismaProblem.isPublished,
      solvedCount: prismaProblem.solvedCount,
      attemptCount: prismaProblem.attemptCount,
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
    });

    if (!prismaProblem) return null;
    return this.mapPrismaProblem(prismaProblem);
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
}
