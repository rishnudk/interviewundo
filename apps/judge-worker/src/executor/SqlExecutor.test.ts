import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';

(globalThis as any).mockCreateContainer = vi.fn();

vi.mock('dockerode', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createContainer: (...args: any[]) => (globalThis as any).mockCreateContainer(...args),
    })),
  };
});

let SqlExecutorClass: any;

describe('SqlExecutor Unit Tests', () => {
  let executor: any;

  const mockStart = vi.fn();
  const mockPutArchive = vi.fn();
  const mockStop = vi.fn();
  const mockRemove = vi.fn();
  const mockInspect = vi.fn();
  const mockExecStart = vi.fn();
  const mockExecInspect = vi.fn();

  const mockExec = vi.fn().mockResolvedValue({
    start: mockExecStart,
    inspect: mockExecInspect,
  });

  const mockContainer = {
    start: mockStart,
    putArchive: mockPutArchive,
    exec: mockExec,
    stop: mockStop,
    remove: mockRemove,
    inspect: mockInspect,
    modem: {
      demuxStream: vi.fn(),
    },
  };

  const testCases = [
    {
      id: '1',
      input: 'CREATE TABLE users (id INTEGER, name TEXT); INSERT INTO users VALUES (1, "Alice");',
      expectedOutput: '[{"id":1,"name":"Alice"}]',
    },
  ];

  beforeAll(async () => {
    const mod = await import('./SqlExecutor.js');
    SqlExecutorClass = mod.SqlExecutor;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    executor = new SqlExecutorClass();

    mockInspect.mockResolvedValue({
      State: { ExitCode: 0 },
    });

    mockExecInspect.mockResolvedValue({
      ExitCode: 0,
    });

    mockContainer.modem.demuxStream = vi.fn();
    (globalThis as any).mockCreateContainer.mockResolvedValue(mockContainer);
  });

  describe('Sandbox Execution', () => {
    it('should return success when SQL runner output returns all passed', async () => {
      const mockRunnerOutput = JSON.stringify({
        results: [
          {
            id: '1',
            passed: true,
            actual: [{ id: 1, name: 'Alice' }],
            expected: [{ id: 1, name: 'Alice' }],
            runtime: 1.2,
            error: null,
          },
        ],
      });

      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') {
            setTimeout(cb, 10);
          }
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      mockContainer.modem.demuxStream = vi.fn((_stream, stdout, _stderr) => {
        stdout.write(Buffer.from(mockRunnerOutput));
      });

      const result = await executor.execute('sub-123', 'SELECT * FROM users;', testCases);
      expect(result.totalCases).toBe(1);
      expect(result.passed).toBe(true);
      expect(result.results[0].passed).toBe(true);
      expect(result.results[0].actual).toEqual([{ id: 1, name: 'Alice' }]);
    });

    it('should report runtime error if runner script exits with non-zero exit code', async () => {
      mockExecInspect.mockResolvedValue({ ExitCode: 1 });

      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') setTimeout(cb, 10);
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      const result = await executor.execute('sub-123', 'SELECT * FROM users;', testCases);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Runtime error');
    });

    it('should timeout if container execution hangs', async () => {
      const mockStream = {
        on: vi.fn((_event, _cb) => {
          // Never calls end
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      const result = await executor.execute('sub-123', 'SELECT * FROM users;', testCases, 50);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Time Limit Exceeded');
    });

    it('should handle malformed runner output gracefully', async () => {
      const mockStream = {
        on: vi.fn((event, cb) => {
          if (event === 'end') setTimeout(cb, 10);
        }),
      };
      mockExecStart.mockResolvedValue(mockStream);

      mockContainer.modem.demuxStream = vi.fn((_stream, stdout, _stderr) => {
        stdout.write(Buffer.from('Not a JSON output'));
      });

      const result = await executor.execute('sub-123', 'SELECT * FROM users;', testCases);
      expect(result.passed).toBe(false);
      expect(result.error).toContain('Output format error');
    });
  });
});
