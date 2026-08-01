import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { CreateTestimonialDTO, TestimonialResponseDTO } from '@interviewprep/shared-types';

export interface CreateTestimonialInput extends CreateTestimonialDTO {
  userId: string;
}

export class CreateTestimonial implements IUseCase<CreateTestimonialInput, TestimonialResponseDTO> {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(input: CreateTestimonialInput): Promise<TestimonialResponseDTO> {
    if (!input.userId) {
      throw new Error('User ID is required');
    }
    if (!input.content || input.content.trim().length < 10) {
      throw new Error('Testimonial content must be at least 10 characters long');
    }
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    return this.testimonialRepository.create({
      userId: input.userId,
      name: input.name,
      title: input.title,
      linkedin: input.linkedin,
      twitter: input.twitter,
      content: input.content,
      rating: input.rating ?? 5,
      isFeatured: input.isFeatured ?? true,
    });
  }
}
