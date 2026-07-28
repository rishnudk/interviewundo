import { nodejsProblems } from '../../../src/infrastructure/database/prisma/seed-nodejs';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(nodejsProblems, 'seed-nodejs.ts'));
