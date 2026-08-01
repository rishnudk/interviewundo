import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTestimonial } from './DeleteTestimonial';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';

describe('DeleteTestimonial Use Case', () => {
  let mockRepo: ITestimonialRepository;
  let useCase: DeleteTestimonial;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      getPublicTestimonials: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteTestimonial(mockRepo);
  });

  it('should delete a testimonial if owned by user', async () => {
    vi.mocked(mockRepo.findByUserId).mockResolvedValue([
      {
        id: 't-1',
        userId: 'u-1',
        name: 'User',
        title: 'Dev',
        content: 'Sample content test',
        rating: 5,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    await useCase.execute({ id: 't-1', userId: 'u-1' });

    expect(mockRepo.delete).toHaveBeenCalledWith('t-1');
  });

  it('should throw error if user does not own testimonial', async () => {
    vi.mocked(mockRepo.findByUserId).mockResolvedValue([]);

    await expect(useCase.execute({ id: 't-1', userId: 'u-1' })).rejects.toThrow(
      'Testimonial not found or unauthorized',
    );
  });
});
