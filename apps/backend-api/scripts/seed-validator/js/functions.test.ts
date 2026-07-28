import { functionProblems } from '../../../src/infrastructure/database/prisma/seed-functions';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(functionProblems, 'seed-functions.ts'));
