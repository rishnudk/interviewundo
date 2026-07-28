import vm from 'node:vm';

process.env.SKIP_SEED_DB = 'true';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TestCaseSeed {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

export interface ProblemSeed {
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

export interface TestResult {
  caseIndex: number;
  input: string;
  expected: string;
  got: string;
  passed: boolean;
  error?: string;
}

export interface ProblemResult {
  title: string;
  slug: string;
  results: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
}

export interface ValidationReport {
  seedName: string;
  problems: ProblemResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
}

// ─── Function name extraction ─────────────────────────────────────────────────

/**
 * Extracts the first top-level function or class name from solution code.
 * Handles: `function foo(`, `class Foo`, `const foo = (`
 */
export function extractFunctionName(code: string): string | null {
  const patterns = [
    /^\s*class\s+(\w+)/m, // class EventEmitter
    /^\s*(?:async\s+)?function\s+(\w+)\s*\(/m, // function foo(...
    /^\s*(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(/m, // const foo = (...
    /^\s*(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?function/m, // const foo = function
    /^\s*(?:const|let|var)\s+(\w+)\s*=\s*/m, // const foo = ...
  ];
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

// ─── Smart comparison ─────────────────────────────────────────────────────────

const FLOAT_TOLERANCE = 1e-9;

/**
 * Deep comparison with numeric tolerance for floats and timestamp matching for dates.
 */
export function smartCompare(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;

  if (typeof actual === 'number' && typeof expected === 'number') {
    if (isNaN(actual) && isNaN(expected)) return true;
    return Math.abs(actual - expected) < FLOAT_TOLERANCE;
  }

  if (typeof actual === 'string' && typeof expected === 'string') {
    const d1 = Date.parse(actual);
    const d2 = Date.parse(expected);
    if (!isNaN(d1) && !isNaN(d2) && actual.includes('T') && expected.includes('T')) {
      return d1 === d2;
    }
    return false;
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

// ─── JS solution executor ─────────────────────────────────────────────────────

/**
 * Executes solutionCode in an isolated vm sandbox, calls the detected function/class
 * with the parsed args, and returns the raw result (awaiting Promises if async).
 */
export async function executeJS(code: string, args: unknown[]): Promise<unknown> {
  const fnName = extractFunctionName(code);
  if (!fnName) throw new Error('Could not detect function or class name in solution code');

  const context = vm.createContext({
    // Expose Node.js & JS safe globals
    Math,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    RegExp,
    Date,
    Error,
    TypeError,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    Buffer,
    URL,
    URLSearchParams,
    require,
    process,
    global,
    undefined,
  });

  // Run the solution code in the sandbox
  vm.runInNewContext(code, context, { timeout: 5000 });

  // Retrieve function or class reference from top-level lexical scope or context object
  let fn: unknown;
  try {
    const getFnCode = `(typeof ${fnName} !== 'undefined' ? ${fnName} : (this.${fnName} || globalThis.${fnName}))`;
    fn = vm.runInNewContext(getFnCode, context);
  } catch {
    fn = (context as Record<string, unknown>)[fnName];
  }

  if (typeof fn !== 'function') {
    throw new Error(`Function or class '${fnName}' not found in sandbox after execution`);
  }

  // Handle special HOF test runners
  if (typeof args[0] === 'string') {
    if (args[0] === 'debounce-test-simple') {
      const testCode = `(async () => {
        let count = 0;
        const debounced = ${fnName}(() => { count++; }, 50);
        debounced(); debounced(); debounced();
        if (count !== 0) return 'failed';
        await new Promise(r => setTimeout(r, 80));
        return count === 1 ? 'passed' : 'failed';
      })()`;
      return await vm.runInNewContext(testCode, context);
    }
    if (args[0] === 'memoize-test-simple') {
      const testCode = `(async () => {
        let calls = 0;
        const memoed = ${fnName}((a, b) => { calls++; return a + b; });
        const r1 = memoed(2, 3);
        const r2 = memoed(2, 3);
        return (r1 === 5 && r2 === 5 && calls === 1) ? 'passed' : 'failed';
      })()`;
      return await vm.runInNewContext(testCode, context);
    }
    if (args[0] === 'curry-test-simple') {
      const testCode = `(async () => {
        const add3 = (a, b, c) => a + b + c;
        const curried = ${fnName}(add3);
        return (curried(1)(2)(3) === 6 && curried(1, 2)(3) === 6 && curried(1, 2, 3) === 6) ? 'passed' : 'failed';
      })()`;
      return await vm.runInNewContext(testCode, context);
    }
    if (args[0] === 'promise-all-simple') {
      const testCode = `(async () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(2);
        const res = await ${fnName}([p1, p2]);
        return (Array.isArray(res) && res[0] === 1 && res[1] === 2) ? 'passed' : 'failed';
      })()`;
      return await vm.runInNewContext(testCode, context);
    }
    if (args[0] === 'emitter-test-simple') {
      const testCode = `(async () => {
        const emitter = new ${fnName}();
        const sub = emitter.subscribe('click', (x) => x * 2);
        const res1 = emitter.emit('click', [5]);
        if (!Array.isArray(res1) || res1[0] !== 10) return 'failed';
        sub.release();
        const res2 = emitter.emit('click', [5]);
        if (!Array.isArray(res2) || res2.length !== 0) return 'failed';
        return 'passed';
      })()`;
      return await vm.runInNewContext(testCode, context);
    }
  }

  // Call function and await if asynchronous / returned a Promise
  const rawResult = (fn as (...a: unknown[]) => unknown)(...args);
  const result =
    rawResult instanceof Promise || (rawResult && typeof (rawResult as any).then === 'function')
      ? await rawResult
      : rawResult;

  return result;
}

// ─── Core validator ───────────────────────────────────────────────────────────

function safeParseJSON(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return vm.runInNewContext(`(${str})`, vm.createContext({ undefined, NaN, Infinity }));
  }
}

/**
 * Validates all problems in a seed file.
 * Parses input as JSON/JS array of args, runs the solution, and compares with expectedOutput.
 */
export async function validateProblems(
  problems: ProblemSeed[],
  seedName = 'unknown',
): Promise<ValidationReport> {
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  const problemResults: ProblemResult[] = [];

  for (const problem of problems) {
    const results: TestResult[] = [];

    for (let idx = 0; idx < problem.testCases.length; idx++) {
      const tc = problem.testCases[idx];
      let got: unknown;
      let error: string | undefined;
      let passed = false;

      try {
        let args = safeParseJSON(tc.input);
        if (!Array.isArray(args)) args = [args];

        const expected = safeParseJSON(tc.expectedOutput);
        got = await executeJS(problem.solutionCode, args as unknown[]);
        passed = smartCompare(got, expected);
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        got = `ERROR: ${error}`;
        passed = false;
      }

      const gotStr = got !== undefined ? (JSON.stringify(got) ?? String(got)) : 'undefined';

      results.push({
        caseIndex: idx + 1,
        input: tc.input ?? '',
        expected: tc.expectedOutput ?? '',
        got: gotStr,
        passed,
        error,
      });
    }

    const p = results.filter((r) => r.passed).length;
    const f = results.filter((r) => !r.passed).length;

    totalPassed += p;
    totalFailed += f;

    problemResults.push({
      title: problem.title,
      slug: problem.slug,
      results,
      passed: p,
      failed: f,
      skipped: 0,
    });
  }

  return { seedName, problems: problemResults, totalPassed, totalFailed, totalSkipped };
}

// ─── Report printer ───────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function truncate(s: string | undefined | null, max = 60): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max - 3) + '...' : s;
}

export async function printReport(
  reportPromise: ValidationReport | Promise<ValidationReport>,
): Promise<void> {
  const report = await reportPromise;
  const line = '━'.repeat(60);
  console.log(`\n${BOLD}${CYAN}${line}${RESET}`);
  console.log(`${BOLD}${CYAN}📦  ${report.seedName}${RESET}`);
  console.log(
    `${DIM}    ${report.problems.length} problems, ${report.totalPassed + report.totalFailed} test cases${RESET}`,
  );
  console.log(`${CYAN}${line}${RESET}\n`);

  for (const prob of report.problems) {
    const allPass = prob.failed === 0;
    const prefix = allPass ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
    console.log(`  ${prefix} ${BOLD}${prob.title}${RESET}`);

    for (const r of prob.results) {
      if (r.passed) {
        console.log(
          `      ${GREEN}✓${RESET} ${DIM}#${r.caseIndex}  ${truncate(r.input, 40)} → ${truncate(r.expected, 30)}${RESET}`,
        );
      } else {
        console.log(
          `      ${RED}✗${RESET} #${r.caseIndex}  input:    ${YELLOW}${truncate(r.input, 50)}${RESET}`,
        );
        console.log(`            expected: ${GREEN}${truncate(r.expected, 50)}${RESET}`);
        console.log(`            got:      ${RED}${truncate(r.got, 50)}${RESET}`);
        if (r.error) console.log(`            error:    ${RED}${r.error}${RESET}`);
      }
    }
    console.log();
  }

  const status =
    report.totalFailed === 0
      ? `${GREEN}${BOLD}ALL PASSED${RESET}`
      : `${RED}${BOLD}${report.totalFailed} FAILED${RESET}`;
  console.log(`${line}`);
  console.log(
    `Summary: ${GREEN}${report.totalPassed} passed${RESET}, ${RED}${report.totalFailed} failed${RESET} — ${status}`,
  );
  console.log(`${line}\n`);

  process.exit(report.totalFailed === 0 ? 0 : 1);
}
