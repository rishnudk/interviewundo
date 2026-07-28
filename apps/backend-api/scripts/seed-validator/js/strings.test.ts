import { stringProblems } from '../../../src/infrastructure/database/prisma/seed-strings';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(stringProblems, 'seed-strings.ts'));
