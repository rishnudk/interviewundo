import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPublicTestimonials } from './GetPublicTestimonials';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';

describe('GetPublicTestimonials Use Case', () => {
  let mockRepo: ITestimonialRepository;
  let useCase: GetPublicTestimonials;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      getPublicTestimonials: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetPublicTestimonials(mockRepo);
  });

  it('should fetch all public testimonials', async () => {
    const mockPublic = [
      {
        id: 't-pub',
        userId: 'u-1',
        name: 'Alex Developer',
        title: 'Full Stack Engineer',
        content: 'Top quality practice platform!',
        rating: 5,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    vi.mocked(mockRepo.getPublicTestimonials).mockResolvedValue(mockPublic);

    const result = await useCase.execute();

    expect(mockRepo.getPublicTestimonials).toHaveBeenCalled();
    expect(result).toEqual(mockPublic);
  });
});
