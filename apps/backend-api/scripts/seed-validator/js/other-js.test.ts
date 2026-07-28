import { otherJsProblems } from '../../../src/infrastructure/database/prisma/seed-other-js';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(otherJsProblems, 'seed-other-js.ts'));
