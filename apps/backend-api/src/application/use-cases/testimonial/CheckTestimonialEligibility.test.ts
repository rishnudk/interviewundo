import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckTestimonialEligibility } from './CheckTestimonialEligibility';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

describe('CheckTestimonialEligibility Use Case', () => {
  let mockTestimonialRepo: ITestimonialRepository;
  let mockSubmissionRepo: ISubmissionRepository;
  let useCase: CheckTestimonialEligibility;

  beforeEach(() => {
    mockTestimonialRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      getPublicTestimonials: vi.fn(),
      delete: vi.fn(),
    };
    mockSubmissionRepo = {
      countByUser: vi.fn(),
    } as unknown as ISubmissionRepository;

    useCase = new CheckTestimonialEligibility(mockTestimonialRepo, mockSubmissionRepo);
  });

  it('should return eligible = true on first submission if testimonial not yet submitted', async () => {
    vi.mocked(mockTestimonialRepo.findByUserId).mockResolvedValue([]);
    vi.mocked(mockSubmissionRepo.countByUser).mockResolvedValue(1);

    const result = await useCase.execute('u-1');

    expect(result).toEqual({
      isEligible: true,
      isFirstSubmission: true,
      submissionCount: 1,
      hasSubmittedTestimonial: false,
    });
  });

  it('should return eligible = false if user has already submitted a testimonial', async () => {
    vi.mocked(mockTestimonialRepo.findByUserId).mockResolvedValue([
      {
        id: 't-1',
        userId: 'u-1',
        name: 'User',
        title: 'Dev',
        content: 'Great app',
        rating: 5,
        isFeatured: true,
        createdAt: '',
        updatedAt: '',
      },
    ]);
    vi.mocked(mockSubmissionRepo.countByUser).mockResolvedValue(1);

    const result = await useCase.execute('u-1');

    expect(result.isEligible).toBe(false);
    expect(result.hasSubmittedTestimonial).toBe(true);
  });

  it('should return eligible = false if user has 0 submissions', async () => {
    vi.mocked(mockTestimonialRepo.findByUserId).mockResolvedValue([]);
    vi.mocked(mockSubmissionRepo.countByUser).mockResolvedValue(0);

    const result = await useCase.execute('u-1');

    expect(result.isEligible).toBe(false);
    expect(result.isFirstSubmission).toBe(false);
    expect(result.submissionCount).toBe(0);
  });
});
