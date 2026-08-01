import { Request, Response, NextFunction } from 'express';
import type { CreateTestimonial } from '../../application/use-cases/testimonial/CreateTestimonial';
import type { GetTestimonialsByUserId } from '../../application/use-cases/testimonial/GetTestimonialsByUserId';
import type { GetPublicTestimonials } from '../../application/use-cases/testimonial/GetPublicTestimonials';
import type { DeleteTestimonial } from '../../application/use-cases/testimonial/DeleteTestimonial';
import type { CheckTestimonialEligibility } from '../../application/use-cases/testimonial/CheckTestimonialEligibility';
import { AuthenticationError } from '../../domain/errors';

export class TestimonialController {
  constructor(
    private readonly createTestimonial: CreateTestimonial,
    private readonly getTestimonialsByUserId: GetTestimonialsByUserId,
    private readonly getPublicTestimonials: GetPublicTestimonials,
    private readonly deleteTestimonial: DeleteTestimonial,
    private readonly checkEligibility: CheckTestimonialEligibility,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Authentication required');
      }
      const dto = req.body;
      const testimonial = await this.createTestimonial.execute({
        userId,
        name: dto.name,
        title: dto.title,
        linkedin: dto.linkedin,
        twitter: dto.twitter,
        content: dto.content,
        rating: dto.rating,
        isFeatured: dto.isFeatured,
      });
      res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
      next(error);
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Authentication required');
      }
      const testimonials = await this.getTestimonialsByUserId.execute(userId);
      res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      next(error);
    }
  }

  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonials = await this.getPublicTestimonials.execute();
      res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      next(error);
    }
  }

  async checkUserEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Authentication required');
      }
      const result = await this.checkEligibility.execute(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError('Authentication required');
      }
      const id = String(req.params.id);
      await this.deleteTestimonial.execute({ id, userId });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
}
