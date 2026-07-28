import { loopProblems } from '../../../src/infrastructure/database/prisma/seed-loops';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(loopProblems, 'seed-loops.ts'));
