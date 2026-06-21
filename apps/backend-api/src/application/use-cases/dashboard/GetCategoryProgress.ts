import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

// ============================================================
// GetCategoryProgress Use Case
// Calculates categories progress (solved vs total) for user
// ============================================================

export interface CategoryProgressItem {
  category: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface CategoryProgressOutput {
  categories: CategoryProgressItem[];
}

export interface GetCategoryProgressInput {
  userId: string;
}

export class GetCategoryProgress implements IUseCase<
  GetCategoryProgressInput,
  CategoryProgressOutput
> {
  constructor(
    private readonly submissionRepository: ISubmissionRepository,
    private readonly problemRepository: IProblemRepository,
  ) {}

  async execute({ userId }: GetCategoryProgressInput): Promise<CategoryProgressOutput> {
    const [categoryTotals, categorySolved] = await Promise.all([
      this.problemRepository.countByCategory(),
      this.submissionRepository.getSolvedProblemsCategoryByUser(userId),
    ]);

    const categoriesList = ['JAVASCRIPT', 'REACT', 'NODEJS', 'TYPESCRIPT'];

    const categories = categoriesList.map((cat) => {
      const solved = categorySolved[cat] || 0;
      const total = categoryTotals[cat] || 0;
      const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

      return {
        category: cat,
        solved,
        total,
        percentage,
      };
    });

    return { categories };
  }
}
