import { prisma } from '../../../config/database';
import type { IFeatureRequestRepository } from '../../../domain/ports/repositories/IFeatureRequestRepository';
import type { FeatureRequest, RequestType, RequestStatus } from '@interviewprep/shared-types';

export class PrismaFeatureRequestRepository implements IFeatureRequestRepository {
  private mapPrismaFeatureRequest(prismaItem: any): FeatureRequest {
    return {
      id: prismaItem.id,
      userId: prismaItem.userId,
      title: prismaItem.title,
      description: prismaItem.description,
      type: prismaItem.type as RequestType,
      status: prismaItem.status as RequestStatus,
      upvotes: prismaItem.upvotes,
      createdAt: prismaItem.createdAt,
      updatedAt: prismaItem.updatedAt,
      user: prismaItem.user
        ? {
            name: prismaItem.user.name,
            email: prismaItem.user.email,
          }
        : undefined,
    };
  }

  async create(data: {
    userId: string;
    title: string;
    description: string;
    type: RequestType;
  }): Promise<FeatureRequest> {
    const item = await prisma.featureRequest.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        type: data.type,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return this.mapPrismaFeatureRequest(item);
  }

  async findById(id: string): Promise<FeatureRequest | null> {
    const item = await prisma.featureRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!item) return null;
    return this.mapPrismaFeatureRequest(item);
  }

  async findAll(): Promise<FeatureRequest[]> {
    const items = await prisma.featureRequest.findMany({
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return items.map((item) => this.mapPrismaFeatureRequest(item));
  }

  async findByStatus(status: RequestStatus): Promise<FeatureRequest[]> {
    const items = await prisma.featureRequest.findMany({
      where: { status },
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return items.map((item) => this.mapPrismaFeatureRequest(item));
  }

  async updateStatus(id: string, status: RequestStatus): Promise<FeatureRequest> {
    const item = await prisma.featureRequest.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return this.mapPrismaFeatureRequest(item);
  }

  async incrementUpvotes(id: string): Promise<FeatureRequest> {
    const item = await prisma.featureRequest.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return this.mapPrismaFeatureRequest(item);
  }

  async delete(id: string): Promise<void> {
    await prisma.featureRequest.delete({
      where: { id },
    });
  }
}
