/**
 * Master Seed Validator Runner
 *
 * Runs ALL seed validators in sequence regardless of individual failures.
 * Each validator is run as a child process so their exit codes don't stop the chain.
 * Prints each validator's output inline, then gives a full summary at the end.
 */

import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..'); // apps/backend-api

// Find tsx binary — on Windows it is a .cmd file, needs shell:true
const IS_WINDOWS = process.platform === 'win32';
const TSX_CANDIDATES = [
  resolve(ROOT, '..', '..', 'node_modules', '.bin', IS_WINDOWS ? 'tsx.cmd' : 'tsx'),
  resolve(ROOT, 'node_modules', '.bin', IS_WINDOWS ? 'tsx.cmd' : 'tsx'),
];
const TSX_BIN = TSX_CANDIDATES.find(existsSync) ?? 'tsx';

// ─── Colours ──────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// ─── Validators to run ────────────────────────────────────────────────────────

const JS_VALIDATORS = [
  'js/arrays.test.ts',
  'js/arrays2.test.ts',
  'js/loops.test.ts',
  'js/strings.test.ts',
  'js/objects.test.ts',
  'js/other-js.test.ts',
  'js/functions.test.ts',
  'js/nodejs.test.ts',
  'js/typescript.test.ts',
];

const SQL_VALIDATORS = ['sql/sql.test.ts'];

const MONGODB_VALIDATORS = ['mongodb/mongodb.test.ts', 'mongodb/mongodb2.test.ts'];

const ALL_VALIDATORS = [
  { group: 'JavaScript / TypeScript', files: JS_VALIDATORS },
  { group: 'SQL', files: SQL_VALIDATORS },
  { group: 'MongoDB', files: MONGODB_VALIDATORS },
];

// ─── Runner ───────────────────────────────────────────────────────────────────

interface RunResult {
  file: string;
  exitCode: number;
  passedLine: string;
  failedCount: number;
}

const divider = '═'.repeat(62);
const subline = '─'.repeat(62);

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function extractSummary(output: string): { passed: number; failed: number; skipped: number } {
  const clean = stripAnsi(output);
  const match = clean.match(/Summary:\s*(\d+)\s*passed,\s*(\d+)\s*failed(?:,\s*(\d+)\s*skipped)?/);
  if (!match) return { passed: 0, failed: 0, skipped: 0 };
  return {
    passed: parseInt(match[1] ?? '0', 10),
    failed: parseInt(match[2] ?? '0', 10),
    skipped: parseInt(match[3] ?? '0', 10),
  };
}

function runValidator(file: string): RunResult {
  const scriptPath = resolve(__dirname, file);

  const result = spawnSync(TSX_BIN, [scriptPath], {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
    timeout: 120_000,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: IS_WINDOWS, // .cmd files on Windows require shell:true
  });

  const output = (result.stdout ?? '') + (result.stderr ?? '');
  const exitCode = result.status ?? 1;
  const { passed, failed, skipped } = extractSummary(output);

  // Print the validator's full output inline
  process.stdout.write(output);

  return {
    file,
    exitCode,
    passedLine:
      skipped > 0
        ? `${GREEN}${passed} passed${RESET}, ${RED}${failed} failed${RESET}, ${YELLOW}${skipped} skipped${RESET}`
        : `${GREEN}${passed} passed${RESET}, ${RED}${failed} failed${RESET}`,
    failedCount: failed,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`\n${BOLD}${CYAN}${divider}${RESET}`);
console.log(`${BOLD}${CYAN}  🔍  Seed Validator — Full Run${RESET}`);
console.log(`${BOLD}${CYAN}${divider}${RESET}\n`);

const allResults: RunResult[] = [];
let anyFailed = false;

for (const { group, files } of ALL_VALIDATORS) {
  console.log(`\n${BOLD}${CYAN}▶  ${group}${RESET}`);
  console.log(`${DIM}${subline}${RESET}\n`);

  for (const file of files) {
    const result = runValidator(file);
    allResults.push(result);
    if (result.failedCount > 0 || result.exitCode !== 0) anyFailed = true;
  }
}

// ─── Final summary ────────────────────────────────────────────────────────────

console.log(`\n${BOLD}${divider}${RESET}`);
console.log(`${BOLD}  📋  OVERALL SUMMARY${RESET}`);
console.log(`${BOLD}${divider}${RESET}\n`);

let grandPassed = 0;
let grandFailed = 0;

for (const r of allResults) {
  const clean = stripAnsi(r.passedLine);
  const pMatch = clean.match(/(\d+) passed/);
  const fMatch = clean.match(/(\d+) failed/);
  const p = parseInt(pMatch?.[1] ?? '0', 10);
  const f = parseInt(fMatch?.[1] ?? '0', 10);
  grandPassed += p;
  grandFailed += f;

  const icon = f === 0 && r.exitCode === 0 ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
  const label = r.file.padEnd(35);
  console.log(`  ${icon}  ${DIM}${label}${RESET}  ${r.passedLine}`);
}

console.log();
const overallStatus = anyFailed
  ? `${RED}${BOLD}${grandFailed} FAILURES FOUND — fix the seed data above${RESET}`
  : `${GREEN}${BOLD}ALL SEEDS VALID ✅${RESET}`;

console.log(`${BOLD}${divider}${RESET}`);
console.log(
  `  Grand total: ${GREEN}${grandPassed} passed${RESET}, ${RED}${grandFailed} failed${RESET}`,
);
console.log(`  Status:      ${overallStatus}`);
console.log(`${BOLD}${divider}${RESET}\n`);

process.exit(anyFailed ? 1 : 0);
