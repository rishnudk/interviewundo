/**
 * SQL Seed Validator
 *
 * Uses sql.js — a pure WebAssembly port of SQLite (no native compilation needed).
 * For each test case:
 *   1. Parses testCase.input (JSON-stringified SQL DDL+DML) to get setup SQL
 *   2. Creates a fresh in-memory SQLite database
 *   3. Runs the setup SQL (CREATE TABLE + INSERT statements)
 *   4. Runs problem.solutionCode as a SELECT query
 *   5. Converts results to array-of-objects and compares with testCase.expectedOutput
 *
 * SQLite-incompatible syntax (ILIKE, PostgreSQL type casts, etc.) is flagged as
 * "skipped" rather than "failed".
 */

import initSqlJs, { type Database } from 'sql.js';
import { sqlProblems } from '../../../src/infrastructure/database/prisma/seed-sql';

// ─── Colours ──────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// ─── Smart deep comparison ────────────────────────────────────────────────────

const FLOAT_TOLERANCE = 1e-9;

function smartCompare(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) < FLOAT_TOLERANCE;
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    return actual.every((item, i) => smartCompare(item, expected[i]));
  }
  if (
    actual !== null &&
    expected !== null &&
    typeof actual === 'object' &&
    typeof expected === 'object' &&
    !Array.isArray(actual) &&
    !Array.isArray(expected)
  ) {
    const aKeys = Object.keys(actual as object).sort();
    const eKeys = Object.keys(expected as object).sort();
    if (aKeys.join(',') !== eKeys.join(',')) return false;
    return aKeys.every((k) =>
      smartCompare(
        (actual as Record<string, unknown>)[k],
        (expected as Record<string, unknown>)[k],
      ),
    );
  }
  return false;
}

// ─── Result converter: sql.js → array-of-objects ─────────────────────────────

function sqlResultToObjects(
  results: { columns: string[]; values: unknown[][] }[],
): Record<string, unknown>[] {
  if (results.length === 0) return [];
  const { columns, values } = results[0];
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// ─── SQLite-incompatible syntax detector ──────────────────────────────────────

const INCOMPATIBLE_PATTERNS = [
  /\bILIKE\b/i,
  /\bFULL\s+OUTER\s+JOIN\b/i,
  /::[\w]+/, // PostgreSQL type casts e.g. ::integer
  /\bSERIAL\b/i,
  /\bARRAY\b/i,
  /\bINTERVAL\b/i,
  /\bRETURNING\b/i,
];

function isIncompatible(sql: string): boolean {
  return INCOMPATIBLE_PATTERNS.some((p) => p.test(sql));
}

// ─── Execute one SQL test case ─────────────────────────────────────────────────

function runSqlCase(
  SQL: { Database: new () => Database },
  setupSql: string,
  querySql: string,
): Record<string, unknown>[] {
  const db = new SQL.Database();
  try {
    db.run(setupSql);
    const results = db.exec(querySql);
    return sqlResultToObjects(results);
  } finally {
    db.close();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const SQL = await initSqlJs();

  const line = '━'.repeat(60);
  console.log(`\n${BOLD}${CYAN}${line}${RESET}`);
  console.log(`${BOLD}${CYAN}📦  seed-sql.ts  (SQL Validator — sql.js / SQLite)${RESET}`);
  console.log(`${DIM}    ${sqlProblems.length} problems${RESET}`);
  console.log(`${CYAN}${line}${RESET}\n`);

  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const problem of sqlProblems) {
    let problemPassed = 0;
    let problemFailed = 0;
    let problemSkipped = 0;

    const caseResults: { passed: boolean; skipped: boolean; msg: string }[] = [];

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      const caseIndex = i + 1;

      // Input is JSON.stringify'd SQL string — parse it back
      let setupSql: string;
      try {
        setupSql = JSON.parse(tc.input) as string;
      } catch {
        setupSql = tc.input;
      }

      const querySql = problem.solutionCode;

      // Check for SQLite-incompatible syntax
      if (isIncompatible(setupSql + '\n' + querySql)) {
        caseResults.push({
          passed: false,
          skipped: true,
          msg: `      ${YELLOW}⚠️ ${RESET} #${caseIndex}  ${DIM}SQLite-incompatible syntax — skipped${RESET}`,
        });
        problemSkipped++;
        totalSkipped++;
        continue;
      }

      try {
        const rows = runSqlCase(
          SQL as unknown as { Database: new () => Database },
          setupSql,
          querySql,
        );
        const expected = JSON.parse(tc.expectedOutput) as unknown[];
        const passed = smartCompare(rows, expected);

        if (passed) {
          caseResults.push({
            passed: true,
            skipped: false,
            msg: `      ${GREEN}✓${RESET} ${DIM}#${caseIndex}  OK${RESET}`,
          });
          problemPassed++;
          totalPassed++;
        } else {
          const gotStr = JSON.stringify(rows).slice(0, 80);
          const expStr = tc.expectedOutput.slice(0, 80);
          caseResults.push({
            passed: false,
            skipped: false,
            msg: [
              `      ${RED}✗${RESET} #${caseIndex}`,
              `            expected: ${GREEN}${expStr}${RESET}`,
              `            got:      ${RED}${gotStr}${RESET}`,
            ].join('\n'),
          });
          problemFailed++;
          totalFailed++;
        }
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        caseResults.push({
          passed: false,
          skipped: false,
          msg: `      ${RED}✗${RESET} #${caseIndex}  ${RED}ERROR: ${error.slice(0, 100)}${RESET}`,
        });
        problemFailed++;
        totalFailed++;
      }
    }

    // Print problem header with icon
    const icon =
      problemFailed > 0
        ? `${RED}❌${RESET}`
        : problemSkipped > 0
          ? `${YELLOW}⚠️ ${RESET}`
          : `${GREEN}✅${RESET}`;
    console.log(`  ${icon} ${BOLD}${problem.title}${RESET}`);
    for (const r of caseResults) console.log(r.msg);
    console.log();
  }

  const status =
    totalFailed === 0
      ? `${GREEN}${BOLD}ALL PASSED${RESET}`
      : `${RED}${BOLD}${totalFailed} FAILED${RESET}`;

  console.log(line);
  console.log(
    `Summary: ${GREEN}${totalPassed} passed${RESET}, ${RED}${totalFailed} failed${RESET}, ${YELLOW}${totalSkipped} skipped${RESET} — ${status}`,
  );
  console.log(`${line}\n`);
  process.exit(totalFailed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`${RED}Fatal error:${RESET}`, e);
  process.exit(1);
});
