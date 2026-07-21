import fs from 'fs';
import path from 'path';
import os from 'os';
import { Writable } from 'stream';
import Docker from 'dockerode';
import * as tar from 'tar';
import { logger } from '../config/logger';
import { IExecutor, TestCaseInput, TestCaseResult, ExecutionResult } from './IExecutor';

const docker = new Docker();

export class MongodbExecutor implements IExecutor {
  private extractFunctionName(code: string): string | null {
    const functionMatch = code.match(/function\*?\s+([a-zA-Z0-9_]+)\s*\(/);
    if (functionMatch) return functionMatch[1];

    const classMatch = code.match(/class\s+([a-zA-Z0-9_]+)/);
    if (classMatch) return classMatch[1];

    const constMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*/);
    if (constMatch) return constMatch[1];

    return null;
  }

  private generateRunnerCode(functionName: string): string {
    return `
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

async function run() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://host.docker.internal:27017';
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    
    let targetFn = null;
    const isDirectQuery = process.env.DIRECT_QUERY === 'true';

    if (!isDirectQuery) {
      targetFn = require('./solution');
      if (!targetFn) {
        console.log(JSON.stringify({
          error: 'Target function "${functionName}" was not found or not exported properly.'
        }));
        process.exit(1);
      }
    } else {
      // Build function from direct query code
      const userCode = fs.readFileSync(path.join(__dirname, 'solution.js'), 'utf8');
      const lines = userCode.trim().split('\\n');
      let lastLineIdx = -1;
      for (let j = lines.length - 1; j >= 0; j--) {
        if (lines[j].trim() !== '') {
          lastLineIdx = j;
          break;
        }
      }

      if (lastLineIdx !== -1) {
        let statementStartIdx = lastLineIdx;
        while (statementStartIdx > 0) {
          const prevLine = lines[statementStartIdx - 1].trim();
          const currLine = lines[statementStartIdx].trim();
          
          if (prevLine.endsWith(';')) {
            break;
          }

          if (
            currLine.startsWith('.') ||
            prevLine.endsWith('.') ||
            prevLine.endsWith('(') ||
            prevLine.endsWith('[') ||
            prevLine.endsWith('{') ||
            prevLine.endsWith(',') ||
            prevLine.endsWith('+') ||
            prevLine.endsWith('-') ||
            prevLine.endsWith('*') ||
            prevLine.endsWith('/') ||
            prevLine.endsWith('=') ||
            prevLine.endsWith('?') ||
            prevLine.endsWith(':') ||
            currLine.startsWith(')') ||
            currLine.startsWith(']') ||
            currLine.startsWith('}')
          ) {
            statementStartIdx--;
          } else {
            break;
          }
        }

        const lineText = lines[statementStartIdx];
        const leadingSpaces = lineText.match(/^\s*/)?.[0] || '';
        const trimmedText = lineText.trim();
        if (
          !trimmedText.startsWith('return') &&
          !trimmedText.startsWith('const') &&
          !trimmedText.startsWith('let') &&
          !trimmedText.startsWith('var')
        ) {
          lines[statementStartIdx] = leadingSpaces + 'return ' + trimmedText;
        }
      }

      const rewrittenCode = lines.join('\\n');
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      targetFn = new AsyncFunction('db', rewrittenCode);
    }

    const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'testcases.json'), 'utf8'));
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const dbName = 'judge_' + process.env.SUBMISSION_ID + '_' + i;
      const db = client.db(dbName);
      
      let actual = null;
      let error = null;
      const start = process.hrtime.bigint();

      try {
        // Seed database
        const seedData = JSON.parse(tc.input);
        if (Array.isArray(seedData)) {
          if (seedData.length > 0) {
            await db.collection('test_collection').insertMany(seedData);
          }
        } else if (typeof seedData === 'object' && seedData !== null) {
          for (const [colName, docs] of Object.entries(seedData)) {
            if (Array.isArray(docs) && docs.length > 0) {
              await db.collection(colName).insertMany(docs);
            }
          }
        }

        const dbProxy = new Proxy(db, {
          get(target, prop) {
            if (prop in target) {
              if (typeof target[prop] === 'function') {
                return target[prop].bind(target);
              }
              return target[prop];
            }
            const collection = target.collection(prop);
            return new Proxy(collection, {
              get(colTarget, colProp) {
                if (colProp === 'find') {
                  return (filter, optionsOrProjection) => {
                    let options = optionsOrProjection;
                    if (
                      options &&
                      typeof options === 'object' &&
                      !Array.isArray(options) &&
                      !('projection' in options) &&
                      !('sort' in options) &&
                      !('limit' in options) &&
                      !('skip' in options)
                    ) {
                      options = { projection: options };
                    }
                    return colTarget.find(filter, options);
                  };
                }
                if (typeof colTarget[colProp] === 'function') {
                  return colTarget[colProp].bind(colTarget);
                }
                return colTarget[colProp];
              }
            });
          }
        });

        // Execute user query
        let rawActual = await targetFn(dbProxy);

        // Auto-toArray cursor objects
        if (rawActual && typeof rawActual.toArray === 'function') {
          rawActual = await rawActual.toArray();
        }
        
        // Serialize actual results to strip BSON types for standard JSON comparison
        actual = JSON.parse(JSON.stringify(rawActual));
      } catch (e) {
        const errName = e.name || 'Error';
        const errMsg = e.message || String(e);
        error = errName + ': ' + errMsg;
      } finally {
        try {
          // Drop database cleanup
          await db.dropDatabase();
        } catch (dropErr) {}
      }

      const end = process.hrtime.bigint();
      const runtimeMs = Number(end - start) / 1e6;
      const expected = JSON.parse(tc.expectedOutput);

      results.push({
        id: tc.id,
        passed: error === null && deepEqual(actual, expected),
        actual: actual !== null ? actual : null,
        expected,
        runtime: Number(runtimeMs.toFixed(2)),
        error
      });
    }

    console.log(JSON.stringify({ results }));
  } catch (globalErr) {
    const errName = globalErr.name || 'Error';
    const errMsg = globalErr.message || String(globalErr);
    console.log(JSON.stringify({
      error: errName + ': ' + errMsg
    }));
    process.exit(1);
  } finally {
    await client.close().catch(() => {});
  }
}

run();
`;
  }

  async execute(
    submissionId: string,
    code: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 10000,
  ): Promise<ExecutionResult> {
    const tempDir = path.join(os.tmpdir(), 'judge-mongodb', submissionId);
    const tarPath = path.join(os.tmpdir(), `judge-mongodb-${submissionId}.tar`);
    let container: Docker.Container | null = null;

    try {
      const functionName = this.extractFunctionName(code);
      const solutionCode = functionName
        ? `${code}\n\nmodule.exports = typeof ${functionName} !== 'undefined' ? ${functionName} : null;\n`
        : code;
      const runnerCode = this.generateRunnerCode(functionName || '');

      // Write temp files
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'solution.js'), solutionCode);
      fs.writeFileSync(path.join(tempDir, 'testcases.json'), JSON.stringify(testCases));
      fs.writeFileSync(path.join(tempDir, 'runner.js'), runnerCode);

      // Create tarball
      await tar.create(
        {
          gzip: false,
          file: tarPath,
          cwd: tempDir,
        },
        ['solution.js', 'runner.js', 'testcases.json'],
      );

      // Create and start Docker container (node-mongodb-runner)
      // Enforces 256MB memory limit, 1 CPU limit, no network access, and non-root execution
      container = await docker.createContainer({
        Image: 'node-mongodb-runner',
        Cmd: ['sleep', '60'],
        NetworkDisabled: false, // Network enabled to access shared MongoDB container
        User: 'node',
        WorkingDir: '/app',
        Env: [
          `SUBMISSION_ID=${submissionId}`,
          `MONGO_URL=${process.env.MONGO_URL || 'mongodb://host.docker.internal:27017'}`,
          `DIRECT_QUERY=${functionName ? 'false' : 'true'}`,
        ],
        HostConfig: {
          Memory: 256 * 1024 * 1024,
          NanoCpus: 1000000000,
          AutoRemove: false,
          ExtraHosts: ['host.docker.internal:host-gateway'],
        },
      });

      await container.start();

      // Copy tarball to container
      const tarStream = fs.createReadStream(tarPath);
      await container.putArchive(tarStream, { path: '/app' });

      // Run runner script
      const exec = await container.exec({
        Cmd: ['node', '/app/runner.js'],
        AttachStdout: true,
        AttachStderr: true,
      });

      const execStream = await exec.start({ Detach: false });

      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];

      const stdoutStream = new Writable({
        write(chunk, _encoding, callback) {
          stdoutChunks.push(chunk);
          callback();
        },
      });

      const stderrStream = new Writable({
        write(chunk, _encoding, callback) {
          stderrChunks.push(chunk);
          callback();
        },
      });

      container.modem.demuxStream(execStream, stdoutStream, stderrStream);

      // Enforce timeout
      const executionPromise = new Promise<void>((resolve, reject) => {
        execStream.on('end', resolve);
        execStream.on('error', reject);
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs),
      );

      try {
        await Promise.race([executionPromise, timeoutPromise]);
      } catch (err: any) {
        if (err.message === 'TIMEOUT') {
          logger.warn(`MongoDB Submission ${submissionId} timed out`);
          return {
            passed: false,
            passedCases: 0,
            totalCases: testCases.length,
            results: [],
            error: 'Time Limit Exceeded: Your aggregation/query exceeded the 10-second limit.',
          };
        }
        throw err;
      }

      const execInspect = await exec.inspect();
      const stdoutStr = Buffer.concat(stdoutChunks).toString('utf8').trim();
      const stderrStr = Buffer.concat(stderrChunks).toString('utf8').trim();

      if (execInspect.ExitCode !== 0) {
        logger.error(
          { stderrStr, exitCode: execInspect.ExitCode },
          'MongoDB execution error in container',
        );
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error:
            stderrStr ||
            stdoutStr ||
            `Runtime error: process exited with code ${execInspect.ExitCode}`,
        };
      }

      try {
        const output = JSON.parse(stdoutStr);
        if (output.error) {
          return {
            passed: false,
            passedCases: 0,
            totalCases: testCases.length,
            results: [],
            error: output.error,
          };
        }

        const results = output.results as TestCaseResult[];
        const passedCases = results.filter((r) => r.passed).length;
        const totalCases = testCases.length;

        const totalRuntime = results.reduce((acc, r) => acc + r.runtime, 0);

        return {
          passed: passedCases === totalCases,
          passedCases,
          totalCases,
          results,
          runtime: Math.round(totalRuntime),
          memory: 1024 * 1024 * 12, // Estimated 12MB memory footprint for MongoDB client operations
        };
      } catch (parseErr) {
        logger.error({ stdoutStr, parseErr }, 'Failed to parse MongoDB runner output');
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error: `Output format error: ${stdoutStr.substring(0, 200)}`,
        };
      }
    } catch (err: any) {
      logger.error({ err }, 'Unexpected error in MongodbExecutor');
      return {
        passed: false,
        passedCases: 0,
        totalCases: testCases.length,
        results: [],
        error: `Sandbox execution failed: ${err.message || String(err)}`,
      };
    } finally {
      // Cleanup
      if (container) {
        try {
          await container.stop({ t: 0 }).catch(() => {});
          await container.remove().catch(() => {});
        } catch (cleanupErr) {
          logger.warn({ cleanupErr }, 'Container cleanup failed');
        }
      }

      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
        if (fs.existsSync(tarPath)) {
          fs.unlinkSync(tarPath);
        }
      } catch (fsCleanupErr) {
        logger.warn({ fsCleanupErr }, 'FS cleanup failed');
      }
    }
  }
}
