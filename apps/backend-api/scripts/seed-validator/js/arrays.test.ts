import { arrayProblems } from '../../../src/infrastructure/database/prisma/seed-arrays';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(arrayProblems, 'seed-arrays.ts'));
