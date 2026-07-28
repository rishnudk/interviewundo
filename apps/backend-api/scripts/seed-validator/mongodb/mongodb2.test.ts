/**
 * MongoDB Seed Validator — seed-mongodb2.ts
 *
 * Uses mongodb-memory-server to spin up a real in-process MongoDB instance.
 * Supports Mongo shell syntax via Db Proxy. Converts EJSON dates in input to JS Date objects.
 */

process.env.SKIP_SEED_DB = 'true';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, type Db } from 'mongodb';
import vm from 'node:vm';
// Aliased to avoid name conflict with seed-mongodb's export
import { mongodbProblems as mongodbProblems2 } from '../../../src/infrastructure/database/prisma/seed-mongodb2';

// ─── Colours ──────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
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

// ─── EJSON Date parsing for inputs ───────────────────────────────────────────

function parseEJSON(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(parseEJSON);
  if (typeof obj['$date'] === 'string') {
    return new Date(obj['$date']);
  }
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = parseEJSON(val);
  }
  return result;
}

// ─── Format Date objects to ISO strings for actual results ───────────────────

function formatEJSONOut(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj['$date'] === 'string') return obj['$date'];
  if (Array.isArray(obj)) return obj.map(formatEJSONOut);
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = formatEJSONOut(val);
  }
  return result;
}

// ─── Clean docs: strip _id only if expected output does NOT have _id ─────────

function cleanActualDocs(rawActual: unknown[], expected: unknown[]): unknown[] {
  if (!Array.isArray(rawActual)) return [];
  const actual = formatEJSONOut(rawActual);
  const expectedHasId =
    Array.isArray(expected) &&
    expected.length > 0 &&
    expected[0] !== null &&
    typeof expected[0] === 'object' &&
    '_id' in expected[0];

  if (expectedHasId) return actual;

  return actual.map((doc: any) => {
    if (doc !== null && typeof doc === 'object') {
      const copy = { ...doc };
      delete copy._id;
      return copy;
    }
    return doc;
  });
}

// ─── Execute MongoDB solution code ───────────────────────────────────────────

async function executeMongoDB(solutionCode: string, db: Db): Promise<unknown[]> {
  const dbProxy = new Proxy(db, {
    get(target, prop) {
      if (
        typeof prop === 'string' &&
        !(prop in target) &&
        typeof (target as any)[prop] !== 'function'
      ) {
        const coll = target.collection(prop);
        const origFind = coll.find.bind(coll);
        coll.find = function (filter?: any, optionsOrProj?: any, ...rest: any[]) {
          if (
            optionsOrProj &&
            typeof optionsOrProj === 'object' &&
            !('projection' in optionsOrProj) &&
            !('limit' in optionsOrProj) &&
            !('sort' in optionsOrProj) &&
            !('skip' in optionsOrProj)
          ) {
            return (origFind as any)(filter, { projection: optionsOrProj }, ...rest);
          }
          return (origFind as any)(filter, optionsOrProj, ...rest);
        };
        return coll;
      }
      return (target as any)[prop];
    },
  });

  if (/async\s+function|const\s+\w+\s*=\s*async/.test(solutionCode)) {
    const fnMatch = solutionCode.match(/(?:async\s+function|const)\s+(\w+)/);
    const fnName = fnMatch ? fnMatch[1] : null;
    const wrappedCode = `
      ${solutionCode};
      (async () => {
        if ("${fnName}" && typeof eval("${fnName}") === "function") {
          return await eval("${fnName}")(db);
        }
        throw new Error("No callable async function found");
      })()
    `;
    const context = vm.createContext({ db: dbProxy, Promise, console, Math });
    const res = await vm.runInNewContext(wrappedCode, context, { timeout: 10000 });
    return Array.isArray(res) ? res : [res];
  }

  let code = solutionCode.trim();
  code = code.replace(/db\.createCollection\(/g, 'await db.createCollection(');
  code = code.replace(/db\.(\w+)\.updateMany\(/g, 'await db.$1.updateMany(');
  code = code.replace(
    /db\.collection\(["'](\w+)["']\)\.updateMany\(/g,
    'await db.collection("$1").updateMany(',
  );

  const lastDbIdx = code.lastIndexOf('db.');
  if (lastDbIdx !== -1) {
    const before = code.slice(0, lastDbIdx);
    let lastStmt = code.slice(lastDbIdx).trim();
    if (lastStmt.endsWith(';')) lastStmt = lastStmt.slice(0, -1);
    if (!lastStmt.endsWith('.toArray()') && /\.(find|aggregate)\(/.test(lastStmt)) {
      lastStmt = `(${lastStmt}).toArray()`;
    }
    code = `${before}\nreturn await (${lastStmt});`;
  }

  const wrapped = `(async () => {\n${code}\n})()`;
  const context = vm.createContext({ db: dbProxy, Promise, console, Math });
  let res = await vm.runInNewContext(wrapped, context, { timeout: 10000 });

  if (res && typeof res.toArray === 'function') {
    res = await res.toArray();
  }

  return Array.isArray(res) ? res : res ? [res] : [];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const client = new MongoClient(uri);
  await client.connect();

  const line = '━'.repeat(60);
  console.log(`\n${BOLD}${CYAN}${line}${RESET}`);
  console.log(`${BOLD}${CYAN}📦  seed-mongodb2.ts  (MongoDB Validator)${RESET}`);
  console.log(`${DIM}    ${mongodbProblems2.length} problems${RESET}`);
  console.log(`${CYAN}${line}${RESET}\n`);

  let totalPassed = 0;
  let totalFailed = 0;

  for (const problem of mongodbProblems2) {
    let problemPassed = 0;
    let problemFailed = 0;

    console.log(`  ${BOLD}${problem.title}${RESET}`);

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      const caseIndex = i + 1;

      const dbName = `test_${problem.slug}_${caseIndex}_${Date.now()}`;
      const db = client.db(dbName);

      try {
        const rawInput = JSON.parse(tc.input) as Record<string, unknown[]>;
        const input = parseEJSON(rawInput);

        for (const [collName, docs] of Object.entries(input)) {
          if (Array.isArray(docs) && docs.length > 0) {
            await db.collection(collName).insertMany(docs as Record<string, unknown>[]);
          }
        }

        const rawResult = await executeMongoDB(problem.solutionCode, db);
        const expected = JSON.parse(tc.expectedOutput) as unknown[];
        const actual = cleanActualDocs(rawResult, expected);

        const passed = smartCompare(actual, expected);

        if (passed) {
          console.log(`      ${GREEN}✓${RESET} ${DIM}#${caseIndex}  OK${RESET}`);
          problemPassed++;
          totalPassed++;
        } else {
          console.log(`      ${RED}✗${RESET} #${caseIndex}`);
          console.log(`            expected: ${GREEN}${tc.expectedOutput.slice(0, 80)}${RESET}`);
          console.log(`            got:      ${RED}${JSON.stringify(actual).slice(0, 80)}${RESET}`);
          problemFailed++;
          totalFailed++;
        }
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        console.log(
          `      ${RED}✗${RESET} #${caseIndex}  ${RED}ERROR: ${error.slice(0, 100)}${RESET}`,
        );
        problemFailed++;
        totalFailed++;
      } finally {
        await db.dropDatabase();
      }
    }

    const icon = problemFailed === 0 ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
    console.log(`      ${icon} ${problemPassed}/${problemPassed + problemFailed} passed\n`);
  }

  await client.close();
  await mongod.stop();

  const status =
    totalFailed === 0
      ? `${GREEN}${BOLD}ALL PASSED${RESET}`
      : `${RED}${BOLD}${totalFailed} FAILED${RESET}`;

  console.log(line);
  console.log(
    `Summary: ${GREEN}${totalPassed} passed${RESET}, ${RED}${totalFailed} failed${RESET} — ${status}`,
  );
  console.log(`${line}\n`);
  process.exit(totalFailed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`${RED}Fatal error:${RESET}`, e);
  process.exit(1);
});
