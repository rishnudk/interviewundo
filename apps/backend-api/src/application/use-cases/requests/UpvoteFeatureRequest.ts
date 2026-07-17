import type { IUseCase } from '../../interfaces/IUseCase';
import type { IFeatureRequestRepository } from '../../../domain/ports/repositories/IFeatureRequestRepository';
import type { FeatureRequest } from '@interviewprep/shared-types';

export interface UpvoteFeatureRequestInput {
  requestId: string;
}

export class UpvoteFeatureRequest implements IUseCase<UpvoteFeatureRequestInput, FeatureRequest> {
  constructor(private readonly featureRequestRepository: IFeatureRequestRepository) {}

  async execute(input: UpvoteFeatureRequestInput): Promise<FeatureRequest> {
    return this.featureRequestRepository.incrementUpvotes(input.requestId);
  }
}
