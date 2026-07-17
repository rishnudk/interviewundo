import type { IUseCase } from '../../interfaces/IUseCase';
import type { IFeatureRequestRepository } from '../../../domain/ports/repositories/IFeatureRequestRepository';
import type { FeatureRequest } from '@interviewprep/shared-types';

export class GetFeatureRequests implements IUseCase<void, FeatureRequest[]> {
  constructor(private readonly featureRequestRepository: IFeatureRequestRepository) {}

  async execute(): Promise<FeatureRequest[]> {
    return this.featureRequestRepository.findAll();
  }
}
