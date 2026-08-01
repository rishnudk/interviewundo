import { Router } from 'express';
import { container } from '../../container';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validate-request';
import { CreateTestimonialSchema } from '@interviewprep/shared-types';

const testimonialRoutes = Router();

// GET /api/testimonials/public (Public landing page testimonials)
testimonialRoutes.get('/public', (req, res, next) => {
  container.controllers.testimonialController.getPublic(req, res, next);
});

// GET /api/testimonials/check (Authenticated check eligibility for popup)
testimonialRoutes.get('/check', authenticate, (req, res, next) => {
  container.controllers.testimonialController.checkUserEligibility(req, res, next);
});

// POST /api/testimonials (Authenticated submit testimonial)
testimonialRoutes.post(
  '/',
  authenticate,
  validateRequest(CreateTestimonialSchema),
  (req, res, next) => {
    container.controllers.testimonialController.create(req, res, next);
  },
);

// GET /api/testimonials (Authenticated list current user testimonials)
testimonialRoutes.get('/', authenticate, (req, res, next) => {
  container.controllers.testimonialController.getByUserId(req, res, next);
});

// DELETE /api/testimonials/:id (Authenticated delete user testimonial)
testimonialRoutes.delete('/:id', authenticate, (req, res, next) => {
  container.controllers.testimonialController.delete(req, res, next);
});

export { testimonialRoutes };
