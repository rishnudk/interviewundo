import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { TestimonialResponseDTO } from '@interviewprep/shared-types';

export class GetPublicTestimonials implements IUseCase<void, TestimonialResponseDTO[]> {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(): Promise<TestimonialResponseDTO[]> {
    return this.testimonialRepository.getPublicTestimonials();
  }
}
