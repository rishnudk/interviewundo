import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';

export class DeleteTestimonial implements IUseCase<{ id: string; userId: string }, void> {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(input: { id: string; userId: string }): Promise<void> {
    if (!input.id) {
      throw new Error('Testimonial ID is required');
    }
    if (!input.userId) {
      throw new Error('User ID is required');
    }

    const existing = await this.testimonialRepository.findByUserId(input.userId);
    const ownsTestimonial = existing.some((t: any) => t.id === input.id);
    if (!ownsTestimonial) {
      throw new Error('Testimonial not found or unauthorized');
    }

    await this.testimonialRepository.delete(input.id);
  }
}
