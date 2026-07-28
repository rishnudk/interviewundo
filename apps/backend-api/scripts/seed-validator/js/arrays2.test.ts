// Aliased because seed-arrays2 exports the same name 'arrayProblems' as seed-arrays
import { arrayProblems as arrayProblems2 } from '../../../src/infrastructure/database/prisma/seed-arrays2';
import { validateProblems, printReport } from '../engine';

printReport(validateProblems(arrayProblems2, 'seed-arrays2.ts'));
