import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { TestimonialResponseDTO } from '@interviewprep/shared-types';

export class GetTestimonialsByUserId implements IUseCase<string, TestimonialResponseDTO[]> {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(userId: string): Promise<TestimonialResponseDTO[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.testimonialRepository.findByUserId(userId);
  }
}
