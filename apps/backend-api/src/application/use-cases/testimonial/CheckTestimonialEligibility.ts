import type { IUseCase } from '../../interfaces/IUseCase';
import type { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

export interface TestimonialEligibilityResult {
  isEligible: boolean;
  isFirstSubmission: boolean;
  submissionCount: number;
  hasSubmittedTestimonial: boolean;
}

export class CheckTestimonialEligibility implements IUseCase<string, TestimonialEligibilityResult> {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(userId: string): Promise<TestimonialEligibilityResult> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const [testimonials, submissionCount] = await Promise.all([
      this.testimonialRepository.findByUserId(userId),
      this.submissionRepository.countByUser(userId),
    ]);

    const hasSubmittedTestimonial = testimonials.length > 0;
    const isFirstSubmission = submissionCount === 1;

    // Eligible if the user hasn't submitted a testimonial yet, and has made at least 1 submission
    const isEligible = !hasSubmittedTestimonial && submissionCount >= 1;

    return {
      isEligible,
      isFirstSubmission,
      submissionCount,
      hasSubmittedTestimonial,
    };
  }
}
