import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTestimonial } from './CreateTestimonial';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';

describe('CreateTestimonial Use Case', () => {
  let mockTestimonialRepo: ITestimonialRepository;
  let useCase: CreateTestimonial;

  beforeEach(() => {
    mockTestimonialRepo = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      getPublicTestimonials: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateTestimonial(mockTestimonialRepo);
  });

  it('should successfully create a testimonial', async () => {
    const input = {
      userId: 'user-123',
      name: 'John Doe',
      title: 'Senior Developer',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: '@johndoe',
      content: 'InterviewUndo helped me land my dream job! The platform is incredible.',
      rating: 5,
    };

    const mockResponse = {
      id: 'test-1',
      ...input,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(mockTestimonialRepo.create).mockResolvedValue(mockResponse);

    const result = await useCase.execute(input);

    expect(mockTestimonialRepo.create).toHaveBeenCalledWith({
      userId: 'user-123',
      name: 'John Doe',
      title: 'Senior Developer',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: '@johndoe',
      content: 'InterviewUndo helped me land my dream job! The platform is incredible.',
      rating: 5,
      isFeatured: true,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if userId is missing', async () => {
    const input = {
      userId: '',
      name: 'John Doe',
      title: 'Developer',
      content: 'Great app experience!',
    };

    await expect(useCase.execute(input)).rejects.toThrow('User ID is required');
  });

  it('should throw an error if content is too short', async () => {
    const input = {
      userId: 'user-123',
      name: 'John Doe',
      title: 'Developer',
      content: 'Short',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Testimonial content must be at least 10 characters long',
    );
  });

  it('should throw an error if title is missing', async () => {
    const input = {
      userId: 'user-123',
      name: 'John Doe',
      title: '',
      content: 'This is a valid long testimonial text for testing.',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Title is required');
  });
});
