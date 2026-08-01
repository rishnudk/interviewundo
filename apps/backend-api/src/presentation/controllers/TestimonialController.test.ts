import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestimonialController } from './TestimonialController';
import type { Request, Response, NextFunction } from 'express';

describe('TestimonialController', () => {
  let controller: TestimonialController;
  let mockCreate: any;
  let mockGetByUserId: any;
  let mockGetPublic: any;
  let mockDelete: any;
  let mockCheckEligibility: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockCreate = { execute: vi.fn() };
    mockGetByUserId = { execute: vi.fn() };
    mockGetPublic = { execute: vi.fn() };
    mockDelete = { execute: vi.fn() };
    mockCheckEligibility = { execute: vi.fn() };

    controller = new TestimonialController(
      mockCreate,
      mockGetByUserId,
      mockGetPublic,
      mockDelete,
      mockCheckEligibility,
    );

    req = {
      user: { id: 'user-123', email: 'test@example.com', role: 'STUDENT' },
      body: {},
      params: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    next = vi.fn();
  });

  it('should call create testimonial and return 201', async () => {
    req.body = {
      name: 'John Doe',
      title: 'Dev',
      content: 'Great app performance',
    };
    mockCreate.execute.mockResolvedValue({ id: 't-1', ...req.body });

    await controller.create(req as Request, res as Response, next);

    expect(mockCreate.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      name: 'John Doe',
      title: 'Dev',
      content: 'Great app performance',
      linkedin: undefined,
      twitter: undefined,
      rating: undefined,
      isFeatured: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 't-1', name: 'John Doe', title: 'Dev', content: 'Great app performance' },
    });
  });

  it('should return eligibility check data on checkUserEligibility', async () => {
    mockCheckEligibility.execute.mockResolvedValue({
      isEligible: true,
      isFirstSubmission: true,
      submissionCount: 1,
      hasSubmittedTestimonial: false,
    });

    await controller.checkUserEligibility(req as Request, res as Response, next);

    expect(mockCheckEligibility.execute).toHaveBeenCalledWith('user-123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        isEligible: true,
        isFirstSubmission: true,
        submissionCount: 1,
        hasSubmittedTestimonial: false,
      },
    });
  });

  it('should get public testimonials', async () => {
    mockGetPublic.execute.mockResolvedValue([{ id: 't-1' }]);

    await controller.getPublic(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ id: 't-1' }],
    });
  });

  it('should throw unauthorized error if user is missing on protected routes', async () => {
    req.user = undefined;

    await controller.create(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
