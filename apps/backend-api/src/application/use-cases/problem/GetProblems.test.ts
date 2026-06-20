import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProblems } from './GetProblems';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { Problem, ProblemFilterDTO, Difficulty } from '@interviewprep/shared-types';

describe('GetProblems Use Case', () => {
  let problemRepository: IProblemRepository;
  let cacheService: ICacheService;
  let useCase: GetProblems;

  const mockProblems: Problem[] = [
    {
      id: 'problem-1',
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Find two numbers that add up to a target.',
      difficulty: 'EASY' as Difficulty,
      category: 'Arrays',
      starterCode: 'function twoSum() {}',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'problem-2',
      title: 'Reverse String',
      slug: 'reverse-string',
      description: 'Reverse an array of characters.',
      difficulty: 'EASY' as Difficulty,
      category: 'Strings',
      starterCode: 'function reverseString() {}',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    problemRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      incrementSolvedCount: vi.fn(),
      incrementAttemptCount: vi.fn(),
    };

    cacheService = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      deleteByPattern: vi.fn(),
    };

    useCase = new GetProblems(problemRepository, cacheService);
  });

  it('should return cached problems if present in cache', async () => {
    const filters: ProblemFilterDTO = { page: 1, limit: 10, search: '' };
    const cacheKey = `problems:${JSON.stringify(filters)}`;

    const mockCachedResult = {
      data: mockProblems,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(cacheService.get).mockResolvedValue(mockCachedResult);

    const result = await useCase.execute(filters);

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(mockCachedResult);
  });

  it('should query database, cache result, and return if not in cache', async () => {
    const filters: ProblemFilterDTO = { page: 1, limit: 10, search: '' };
    const cacheKey = `problems:${JSON.stringify(filters)}`;

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.findAll).mockResolvedValue({
      data: mockProblems,
      total: 2,
    });

    const result = await useCase.execute(filters);

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.findAll).toHaveBeenCalledWith(filters);
    expect(cacheService.set).toHaveBeenCalledWith(
      cacheKey,
      {
        data: mockProblems,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      300
    );

    expect(result).toEqual({
      data: mockProblems,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });
});
