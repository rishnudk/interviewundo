import type { CreateTestimonialDTO, TestimonialResponseDTO } from '@interviewprep/shared-types';

export interface ITestimonialRepository {
  create(dto: CreateTestimonialDTO & { userId: string }): Promise<TestimonialResponseDTO>;
  findByUserId(userId: string): Promise<TestimonialResponseDTO[]>;
  getPublicTestimonials(): Promise<TestimonialResponseDTO[]>;
  delete(id: string): Promise<void>;
}
