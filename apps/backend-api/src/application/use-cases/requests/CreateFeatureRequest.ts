import type { IUseCase } from '../../interfaces/IUseCase';
import type { IFeatureRequestRepository } from '../../../domain/ports/repositories/IFeatureRequestRepository';
import type { FeatureRequest, RequestType } from '@interviewprep/shared-types';

export interface CreateFeatureRequestInput {
  userId: string;
  title: string;
  description: string;
  type: RequestType;
}

export class CreateFeatureRequest implements IUseCase<CreateFeatureRequestInput, FeatureRequest> {
  constructor(private readonly featureRequestRepository: IFeatureRequestRepository) {}

  async execute(input: CreateFeatureRequestInput): Promise<FeatureRequest> {
    return this.featureRequestRepository.create(input);
  }
}
