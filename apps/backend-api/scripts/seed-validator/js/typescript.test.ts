import { typescriptProblems } from '../../../src/infrastructure/database/prisma/seed-typescript';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(typescriptProblems, 'seed-typescript.ts'));
