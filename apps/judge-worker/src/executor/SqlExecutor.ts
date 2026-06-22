import fs from 'fs';
import path from 'path';
import os from 'os';
import { Writable } from 'stream';
import Docker from 'dockerode';
import * as tar from 'tar';
import { logger } from '../config/logger';
import { IExecutor, TestCaseInput, TestCaseResult, ExecutionResult } from './IExecutor';

const docker = new Docker();

export class SqlExecutor implements IExecutor {
  private generateRunnerCode(): string {
    return `
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

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

try {
  const userQuery = fs.readFileSync(path.join(__dirname, 'solution.sql'), 'utf8').trim();
  const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'testcases.json'), 'utf8'));
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    
    // Parse setup SQL
    let setupSql = tc.input;
    try {
      const parsed = JSON.parse(tc.input);
      if (typeof parsed === 'string') {
        setupSql = parsed;
      } else if (Array.isArray(parsed)) {
        setupSql = parsed.join('\\n');
      }
    } catch (e) {
      // Treat as raw SQL string if JSON parsing fails
    }

    const expected = JSON.parse(tc.expectedOutput);

    const db = new Database(':memory:');
    let actual = null;
    let error = null;
    const start = process.hrtime.bigint();

    try {
      // Execute schema setup
      db.exec(setupSql);

      // Execute user query
      const stmt = db.prepare(userQuery);
      actual = stmt.all();
    } catch (e) {
      const errName = e.name || 'Error';
      const errMsg = e.message || String(e);
      error = errName + ': ' + errMsg;
    } finally {
      try {
        db.close();
      } catch (closeErr) {}
    }

    const end = process.hrtime.bigint();
    const runtimeMs = Number(end - start) / 1e6;

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
}
`;
  }

  async execute(
    submissionId: string,
    code: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 10000,
  ): Promise<ExecutionResult> {
    const tempDir = path.join(os.tmpdir(), 'judge-sql', submissionId);
    const tarPath = path.join(os.tmpdir(), `judge-sql-${submissionId}.tar`);
    let container: Docker.Container | null = null;

    try {
      const runnerCode = this.generateRunnerCode();

      // Write temp files on the host
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'solution.sql'), code);
      fs.writeFileSync(path.join(tempDir, 'testcases.json'), JSON.stringify(testCases));
      fs.writeFileSync(path.join(tempDir, 'runner.js'), runnerCode);

      // Create tarball
      await tar.create(
        {
          gzip: false,
          file: tarPath,
          cwd: tempDir,
        },
        ['solution.sql', 'runner.js', 'testcases.json'],
      );

      // Create and start Docker container (node-sql-runner)
      // Enforces 256MB memory limit, 1 CPU limit, no network access, and non-root execution
      container = await docker.createContainer({
        Image: 'node-sql-runner',
        Cmd: ['sleep', '60'],
        NetworkDisabled: true,
        User: 'node',
        WorkingDir: '/app',
        HostConfig: {
          Memory: 256 * 1024 * 1024,
          NanoCpus: 1000000000,
          AutoRemove: false,
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
          logger.warn(`SQL Submission ${submissionId} timed out`);
          return {
            passed: false,
            passedCases: 0,
            totalCases: testCases.length,
            results: [],
            error: 'Time Limit Exceeded: Your query exceeded the 10-second limit.',
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
          'SQL execution error in container',
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
          memory: 1024 * 1024 * 8, // Estimated 8MB memory footprint for SQL
        };
      } catch (parseErr) {
        logger.error({ stdoutStr, parseErr }, 'Failed to parse SQL runner output');
        return {
          passed: false,
          passedCases: 0,
          totalCases: testCases.length,
          results: [],
          error: `Output format error: ${stdoutStr.substring(0, 200)}`,
        };
      }
    } catch (err: any) {
      logger.error({ err }, 'Unexpected error in SqlExecutor');
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
