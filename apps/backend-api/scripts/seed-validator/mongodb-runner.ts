import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import vm from 'node:vm';
import { smartCompare, printReport, ProblemSeed, ProblemResult, TestCaseResult } from './engine';

class CursorProxy {
  private realCursor: any;
  private queue: (fn: () => Promise<any>) => Promise<any>;

  constructor(realCursor: any, queue: (fn: () => Promise<any>) => Promise<any>) {
    this.realCursor = realCursor;
    this.queue = queue;
  }

  sort(sortSpec: any) {
    this.realCursor = this.realCursor.sort(sortSpec);
    return this;
  }

  limit(limitVal: number) {
    this.realCursor = this.realCursor.limit(limitVal);
    return this;
  }

  project(projectionSpec: any) {
    this.realCursor = this.realCursor.project(projectionSpec);
    return this;
  }

  toArray() {
    return this.queue(() => this.realCursor.toArray());
  }
}

class CollectionProxy {
  private realCol: any;
  private queue: (fn: () => Promise<any>) => Promise<any>;

  constructor(realCol: any, queue: (fn: () => Promise<any>) => Promise<any>) {
    this.realCol = realCol;
    this.queue = queue;
  }

  updateMany(filter: any, update: any, options?: any) {
    return this.queue(() => this.realCol.updateMany(filter, update, options));
  }

  bulkWrite(operations: any[], options?: any) {
    return this.queue(() => this.realCol.bulkWrite(operations, options));
  }

  find(query: any, options?: any) {
    let finalOptions = options;
    if (
      options &&
      typeof options === 'object' &&
      !('projection' in options) &&
      !('sort' in options) &&
      !('limit' in options) &&
      !('skip' in options)
    ) {
      finalOptions = { projection: options };
    }
    const cursor = this.realCol.find(query, finalOptions);
    return new CursorProxy(cursor, this.queue);
  }

  aggregate(pipeline: any[], options?: any) {
    const cursor = this.realCol.aggregate(pipeline, options);
    return new CursorProxy(cursor, this.queue);
  }
}

function reviveDates(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (obj.$date) {
      return new Date(obj.$date);
    }
    if (Array.isArray(obj)) {
      return obj.map(reviveDates);
    }
    const newObj: any = {};
    for (const [key, val] of Object.entries(obj)) {
      newObj[key] = reviveDates(val);
    }
    return newObj;
  }
  return obj;
}

function cleanId(doc: any, expectedDoc: any): any {
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  if (doc && typeof doc === 'object') {
    if (Array.isArray(doc)) {
      return doc.map((item, idx) => cleanId(item, expectedDoc && expectedDoc[idx]));
    }
    const newDoc = { ...doc };
    if ('_id' in newDoc) {
      const hasIdInExpected =
        expectedDoc && typeof expectedDoc === 'object' && '_id' in expectedDoc;
      if (!hasIdInExpected) {
        delete newDoc._id;
      }
    }
    // Deep clean nested objects
    for (const key of Object.keys(newDoc)) {
      if (newDoc[key] && typeof newDoc[key] === 'object') {
        newDoc[key] = cleanId(newDoc[key], expectedDoc && expectedDoc[key]);
      }
    }
    return newDoc;
  }
  return doc;
}

export async function validateMongoDBProblems(fileName: string, problems: ProblemSeed[]) {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('test');

  const results: ProblemResult[] = [];

  for (const problem of problems) {
    const testCaseResults: TestCaseResult[] = [];
    let problemPassed = true;

    for (const tc of problem.testCases) {
      let passed = false;
      let actual: any = null;
      let expected: any = null;
      let errorMsg: string | undefined = undefined;

      // Clean slate for each testcase
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        if (!col.name.startsWith('system.')) {
          await db
            .collection(col.name)
            .drop()
            .catch(() => {});
        }
      }

      try {
        const rawInputData = JSON.parse(tc.input);
        const inputData = reviveDates(rawInputData);
        for (const [colName, docs] of Object.entries(inputData)) {
          if (Array.isArray(docs) && docs.length > 0) {
            await db.collection(colName).insertMany(docs);
          }
        }

        try {
          expected = JSON.parse(tc.expectedOutput);
        } catch {
          expected = tc.expectedOutput;
        }

        // Sequential execution queue for db calls
        let promiseChain = Promise.resolve();
        const queue = (fn: () => Promise<any>) => {
          const nextPromise = promiseChain.then(() => fn());
          promiseChain = nextPromise.catch(() => {});
          return nextPromise;
        };

        const dbProxy = new Proxy(db, {
          get(target, prop) {
            if (prop === 'collection') {
              return (colName: string) => new CollectionProxy(target.collection(colName), queue);
            }
            if (typeof prop === 'string') {
              if (prop in target) {
                const val = (target as any)[prop];
                if (typeof val === 'function') {
                  return (...args: any[]) => queue(() => val.apply(target, args));
                }
                return val;
              }
              return new CollectionProxy(target.collection(prop), queue);
            }
            return (target as any)[prop];
          },
        });

        // Run the solutionCode
        let result = vm.runInNewContext(problem.solutionCode, {
          db: dbProxy,
          console,
          Math,
          Date,
          Array,
          Object,
          String,
          Number,
          Boolean,
          RegExp,
          JSON,
        });

        if (result && typeof result.toArray === 'function') {
          result = await result.toArray();
        } else if (result instanceof Promise) {
          result = await result;
        } else {
          await promiseChain;
        }

        // Deep clean expected/actual _id fields based on expected
        actual = cleanId(result, expected);

        passed = smartCompare(actual, expected);
      } catch (err: any) {
        passed = false;
        errorMsg = err.message || String(err);
      }

      if (!passed) {
        problemPassed = false;
      }

      testCaseResults.push({
        input: tc.input,
        expected,
        actual,
        passed,
        error: errorMsg,
        order: tc.order,
      });
    }

    results.push({
      title: problem.title,
      slug: problem.slug,
      passed: problemPassed,
      testCases: testCaseResults,
    });
  }

  await client.close();
  await mongoServer.stop();

  printReport(fileName, results);
}
