import type { FeatureRequest, RequestType, RequestStatus } from '@interviewprep/shared-types';

// ============================================================
// IFeatureRequestRepository — Port for feature/problem requests
// ============================================================

export interface IFeatureRequestRepository {
  create(data: {
    userId: string;
    title: string;
    description: string;
    type: RequestType;
  }): Promise<FeatureRequest>;

  findById(id: string): Promise<FeatureRequest | null>;

  findAll(): Promise<FeatureRequest[]>;

  findByStatus(status: RequestStatus): Promise<FeatureRequest[]>;

  updateStatus(id: string, status: RequestStatus): Promise<FeatureRequest>;

  incrementUpvotes(id: string): Promise<FeatureRequest>;

  delete(id: string): Promise<void>;
}
