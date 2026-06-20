import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProblemBySlug } from './GetProblemBySlug';
import { NotFoundError } from '../../../domain/errors';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { ICacheService } from '../../../domain/ports/services/ICacheService';
import type { Problem, Difficulty } from '@interviewprep/shared-types';

describe('GetProblemBySlug Use Case', () => {
  let problemRepository: IProblemRepository;
  let cacheService: ICacheService;
  let useCase: GetProblemBySlug;

  const mockProblem: Problem = {
    id: 'problem-1',
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Find two numbers that add up to a target.',
    difficulty: 'EASY' as Difficulty,
    category: 'Arrays',
    starterCode: 'function twoSum() {}',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

    useCase = new GetProblemBySlug(problemRepository, cacheService);
  });

  it('should return cached problem if present in cache', async () => {
    const slug = 'two-sum';
    const cacheKey = `problems:slug:${slug}`;

    vi.mocked(cacheService.get).mockResolvedValue(mockProblem);

    const result = await useCase.execute(slug);

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.findBySlug).not.toHaveBeenCalled();
    expect(result).toEqual(mockProblem);
  });

  it('should query database, cache result, and return if not in cache', async () => {
    const slug = 'two-sum';
    const cacheKey = `problems:slug:${slug}`;

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.findBySlug).mockResolvedValue(mockProblem);

    const result = await useCase.execute(slug);

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(cacheService.set).toHaveBeenCalledWith(cacheKey, mockProblem, 300);
    expect(result).toEqual(mockProblem);
  });

  it('should throw NotFoundError if problem does not exist in database', async () => {
    const slug = 'non-existent';
    const cacheKey = `problems:slug:${slug}`;

    vi.mocked(cacheService.get).mockResolvedValue(null);
    vi.mocked(problemRepository.findBySlug).mockResolvedValue(null);

    await expect(useCase.execute(slug)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(slug)).rejects.toThrow('Problem with identifier "non-existent" was not found');

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(problemRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(cacheService.set).not.toHaveBeenCalled();
  });
});
