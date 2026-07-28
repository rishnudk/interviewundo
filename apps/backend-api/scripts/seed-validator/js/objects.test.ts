import { objectProblems } from '../../../src/infrastructure/database/prisma/seed-objects';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(objectProblems, 'seed-objects.ts'));
