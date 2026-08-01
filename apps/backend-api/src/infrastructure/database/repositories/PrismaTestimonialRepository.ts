import { prisma } from '../../../config/database';
import { ITestimonialRepository } from '../../../domain/ports/repositories/ITestimonialRepository';
import type { CreateTestimonialDTO, TestimonialResponseDTO } from '@interviewprep/shared-types';

export class PrismaTestimonialRepository implements ITestimonialRepository {
  private mapPrismaTestimonial(prismaItem: any): TestimonialResponseDTO {
    return {
      id: prismaItem.id,
      userId: prismaItem.userId,
      name: prismaItem.name,
      title: prismaItem.title,
      linkedin: prismaItem.linkedin ?? undefined,
      twitter: prismaItem.twitter ?? undefined,
      content: prismaItem.content,
      rating: prismaItem.rating,
      isFeatured: prismaItem.isFeatured,
      createdAt:
        prismaItem.createdAt instanceof Date
          ? prismaItem.createdAt.toISOString()
          : prismaItem.createdAt,
      updatedAt:
        prismaItem.updatedAt instanceof Date
          ? prismaItem.updatedAt.toISOString()
          : prismaItem.updatedAt,
      user: prismaItem.user
        ? {
            id: prismaItem.user.id,
            name: prismaItem.user.name,
            email: prismaItem.user.email,
            image: prismaItem.user.image ?? undefined,
          }
        : undefined,
    };
  }

  async create(dto: CreateTestimonialDTO & { userId: string }): Promise<TestimonialResponseDTO> {
    const item = await (prisma as any).testimonial.create({
      data: {
        userId: dto.userId,
        name: dto.name,
        title: dto.title,
        linkedin: dto.linkedin || null,
        twitter: dto.twitter || null,
        content: dto.content,
        rating: dto.rating ?? 5,
        isFeatured: dto.isFeatured ?? true,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Mark user as having submitted a testimonial
    await (prisma as any).user.update({
      where: { id: dto.userId },
      data: { hasSubmittedTestimonial: true },
    });

    return this.mapPrismaTestimonial(item);
  }

  async findByUserId(userId: string): Promise<TestimonialResponseDTO[]> {
    const items = await (prisma as any).testimonial.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return items.map((item: any) => this.mapPrismaTestimonial(item));
  }

  async getPublicTestimonials(): Promise<TestimonialResponseDTO[]> {
    const items = await (prisma as any).testimonial.findMany({
      where: { isFeatured: true },
      orderBy: [{ createdAt: 'desc' }],
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return items.map((item: any) => this.mapPrismaTestimonial(item));
  }

  async delete(id: string): Promise<void> {
    await (prisma as any).testimonial.delete({
      where: { id },
    });
  }
}
