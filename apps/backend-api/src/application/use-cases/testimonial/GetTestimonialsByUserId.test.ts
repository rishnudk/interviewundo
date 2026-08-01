import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTestimonialsByUserId } from './GetTestimonialsByUserId';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';

describe('GetTestimonialsByUserId Use Case', () => {
  let mockRepo: ITestimonialRepository;
  let useCase: GetTestimonialsByUserId;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      getPublicTestimonials: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetTestimonialsByUserId(mockRepo);
  });

  it('should return user testimonials when userId is provided', async () => {
    const mockTestimonials = [
      {
        id: 't-1',
        userId: 'u-1',
        name: 'Jane Doe',
        title: 'Software Engineer',
        content: 'Loved the platform experience!',
        rating: 5,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    vi.mocked(mockRepo.findByUserId).mockResolvedValue(mockTestimonials);

    const result = await useCase.execute('u-1');

    expect(mockRepo.findByUserId).toHaveBeenCalledWith('u-1');
    expect(result).toEqual(mockTestimonials);
  });

  it('should throw error when userId is missing', async () => {
    await expect(useCase.execute('')).rejects.toThrow('User ID is required');
  });
});
