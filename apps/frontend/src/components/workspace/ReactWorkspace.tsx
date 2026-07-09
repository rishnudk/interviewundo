'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useSocket, useToast } from '@/providers';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { ChevronLeft, RotateCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactWorkspaceDescriptionPanel } from './ReactWorkspaceDescriptionPanel';
import { ReactWorkspaceEditorPanel } from './ReactWorkspaceEditorPanel';
import { ReactWorkspacePreviewPanel } from './ReactWorkspacePreviewPanel';

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  starterCode: string;
  starterFiles?: Record<string, string> | null;
  solvedCount: number;
  attemptCount: number;
}

interface ReactWorkspaceProps {
  problem: Problem;
}

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

export default function ReactWorkspace({ problem }: ReactWorkspaceProps) {
  const router = useRouter();
  const { apiFetch } = useAuth();
  const socket = useSocket();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  // Load starter files or default files
  const defaultFiles = problem.starterFiles || {
    'Counter.js': problem.starterCode,
    'App.js': `function App() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-4">React App</h1>
      <Counter />
    </div>
  );
}`,
    'styles.css': `body {
  font-family: sans-serif;
  background-color: #121212;
  color: #ffffff;
  margin: 0;
}`,
  };

  const [files, setFiles] = useState<Record<string, string>>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>(
    Object.keys(defaultFiles).find((f) => f.endsWith('.js') && f !== 'App.js') || 'App.js',
  );

  // Settings
  const [fontSize, setFontSize] = useState<number>(14);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Preview state
  const [previewSrcdoc, setPreviewSrcdoc] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [rightTab, setRightTab] = useState<'preview' | 'console' | 'result'>('console');

  // Mobile Tab navigation
  const [mobileTab, setMobileTab] = useState<'description' | 'editor' | 'preview'>('description');

  // Double resizable panel states
  const containerRef = useRef<HTMLDivElement>(null);
  const [split1, setSplit1] = useState<number>(25); // Left boundary percentage
  const [split2, setSplit2] = useState<number>(65); // Right boundary percentage
  const [activeDivider, setActiveDivider] = useState<1 | 2 | null>(null);
  const [isMd, setIsMd] = useState<boolean>(true);

  // Monitor screen width for media query breakpoints
  useEffect(() => {
    const checkWidth = () => {
      setIsMd(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Handle global mouse/touch events during divider drag
  useEffect(() => {
    if (activeDivider === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;

      if (activeDivider === 1) {
        // Divider 1 must be between 15% and 40%, and at least 15% to the left of Divider 2
        const maxSplit1 = Math.min(40, split2 - 15);
        if (percentage >= 15 && percentage <= maxSplit1) {
          setSplit1(percentage);
        }
      } else if (activeDivider === 2) {
        // Divider 2 must be between split1 + 15% and 85%
        const minSplit2 = split1 + 15;
        if (percentage >= minSplit2 && percentage <= 85) {
          setSplit2(percentage);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const percentage = ((e.touches[0].clientX - rect.left) / rect.width) * 100;

      if (activeDivider === 1) {
        const maxSplit1 = Math.min(40, split2 - 15);
        if (percentage >= 15 && percentage <= maxSplit1) {
          setSplit1(percentage);
        }
      } else if (activeDivider === 2) {
        const minSplit2 = split1 + 15;
        if (percentage >= minSplit2 && percentage <= 85) {
          setSplit2(percentage);
        }
      }
    };

    const handleMouseUp = () => {
      setActiveDivider(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [activeDivider, split1, split2]);

  // Run & Submit state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{
    status: string;
    stdout?: string;
    passed?: boolean;
    error?: string;
  } | null>(null);

  // Debounced update for iframe srcdoc
  useEffect(() => {
    const timer = setTimeout(() => {
      buildPreviewHtml();
    }, 500);

    return () => clearTimeout(timer);
  }, [files]);

  const cleanCode = (code: string) => {
    return code
      .replace(/import\s+.*?\s+from\s+['"]react['"];?/g, '')
      .replace(/import\s+.*?\s+from\s+['"]react-dom['"];?/g, '')
      .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+function\s+/g, 'function ');
  };

  const buildPreviewHtml = () => {
    let cssContent = '';
    let jsContent = '';

    for (const [filename, content] of Object.entries(files)) {
      if (filename.endsWith('.css')) {
        cssContent += content + '\n';
      } else if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
        jsContent += cleanCode(content) + '\n';
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          ${cssContent}
        </style>
        <script src="https://unpkg.com/react@19/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@19/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
        <script>
          // Intercept console messages and post to parent window
          const createLogInterceptor = (level) => {
            const original = console[level];
            console[level] = (...args) => {
              original.apply(console, args);
              window.parent.postMessage({
                type: 'REACT_CONSOLE',
                level,
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
            };
          };

          createLogInterceptor('log');
          createLogInterceptor('info');
          createLogInterceptor('warn');
          createLogInterceptor('error');

          window.onerror = (message, source, lineno, colno, error) => {
            window.parent.postMessage({
              type: 'REACT_CONSOLE',
              level: 'error',
              message: \`Runtime Error: \${message}\`
            }, '*');
            return false;
          };
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          try {
            ${jsContent}

            const AppComp = typeof App !== 'undefined' ? App : (typeof Counter !== 'undefined' ? Counter : null);
            if (AppComp) {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(AppComp));
            } else {
              console.error('No renderable component found (define App or Counter)');
            }
          } catch (err) {
            console.error(err.message || String(err));
          }
        </script>
      </body>
      </html>
    `;

    setPreviewSrcdoc(html);
  };

  // Listen for logs from preview iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REACT_CONSOLE') {
        setConsoleLogs((prev) => [
          ...prev,
          {
            level: event.data.level,
            message: event.data.message,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Listen for real-time WebSocket updates
  useEffect(() => {
    if (!socket || !activeJobId) return;

    const handleStatusUpdate = (payload: {
      submissionId: string;
      status: string;
      data?: any;
      error?: string;
    }) => {
      if (payload.submissionId !== activeJobId) return;

      if (payload.status === 'PROCESSING') {
        setConsoleOutput({
          status: 'Processing',
          stdout: 'Executing UI component tests inside sandboxed JSDOM container...',
        });
      } else {
        setIsRunning(false);
        setIsSubmitting(false);
        setActiveJobId(null);

        if (
          payload.status === 'ACCEPTED' ||
          payload.status === 'SUCCESS' ||
          payload.status === 'Finished'
        ) {
          showSuccess('All component tests passed! Solution Accepted.');
        } else if (payload.status === 'WRONG_ANSWER') {
          showError('Wrong Answer: Test case assertions failed.');
        } else if (payload.status === 'RUNTIME_ERROR') {
          showError('Runtime Error: Code execution crashed.');
        } else if (payload.status === 'COMPILATION_ERROR') {
          showError('Compilation Error: Check syntax/JSX.');
        } else {
          showError('Execution failed: ' + payload.status);
        }

        let stdout = '';
        if (payload.error) {
          stdout = payload.error;
        } else if (payload.data?.results) {
          const results = payload.data.results as Array<{
            id: string;
            passed: boolean;
            actual: any;
            expected: any;
            runtime: number;
            error?: string;
          }>;
          stdout = results
            .map((res, i) => {
              const tcTitle = `Test Case ${i + 1}: ${res.passed ? 'PASSED ✅' : 'FAILED ❌'} (${res.runtime}ms)`;
              const detail = res.passed
                ? 'Component interactions matched expected UI states.'
                : `Error: ${res.error || 'UI state mismatch.'}`;
              return `${tcTitle}\n${detail}`;
            })
            .join('\n\n');
        } else if (payload.data) {
          const d = payload.data;
          stdout = `Passed Cases: ${d.passedCases} / ${d.totalCases}\nRuntime: ${d.runtime} ms`;
        }

        setConsoleOutput({
          status: payload.status,
          stdout,
          passed:
            payload.status === 'ACCEPTED' ||
            payload.status === 'Finished' ||
            payload.status === 'SUCCESS',
          error: payload.error,
        });
      }
    };

    socket.on('submission:status', handleStatusUpdate);
    return () => {
      socket.off('submission:status', handleStatusUpdate);
    };
  }, [socket, activeJobId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setRightTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing React component execution in the sandbox...',
    });
    showInfo('Code execution queued...');

    try {
      const result = await apiFetch<{ jobId: string; status: string }>('/api/submissions/run', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code: files[activeFile],
          files,
          language: 'javascript',
        }),
      });

      setActiveJobId(result.jobId);
    } catch (err: any) {
      setIsRunning(false);
      const errMsg = err.message || 'Failed to trigger runner';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setRightTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing React submission to the judge...',
    });
    showInfo('React submission queued...');

    try {
      const result = await apiFetch<{ id: string; status: string }>('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code: files[activeFile],
          files,
          language: 'javascript',
        }),
      });

      setActiveJobId(result.id);
    } catch (err: any) {
      setIsSubmitting(false);
      const errMsg = err.message || 'Failed to submit solution';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  const handleResetCode = () => {
    if (confirm('Are you sure you want to reset all files to their starter templates?')) {
      setFiles(defaultFiles);
      setConsoleLogs([]);
    }
  };

  const handleFileChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value,
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 overflow-hidden bg-[#1e1e1e] text-foreground">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-800 bg-[#151515] select-none">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/problems')}
            className="rounded-lg h-9 hover:bg-zinc-800 active:scale-95 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <h1 className="text-sm font-bold truncate text-zinc-200">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-[10px] font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
            React Workspace
          </span>
        </div>

        {/* Editor Config Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
            <Settings size={12} className="text-zinc-500" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-[11px] font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="h-8.5 text-xs font-semibold rounded-lg border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            {editorTheme === 'vs-dark' ? 'Light Theme' : 'Dark Theme'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetCode}
            className="h-8.5 text-xs font-semibold rounded-lg border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all"
            title="Reset files to template"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex border-b border-zinc-800 md:hidden shrink-0 select-none bg-[#151515]">
        <button
          type="button"
          onClick={() => setMobileTab('description')}
          className={cn(
            'flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer',
            mobileTab === 'description'
              ? 'border-indigo-500 text-indigo-400 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300',
          )}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={cn(
            'flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer',
            mobileTab === 'editor'
              ? 'border-indigo-500 text-indigo-400 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300',
          )}
        >
          Code Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={cn(
            'flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer',
            mobileTab === 'preview'
              ? 'border-indigo-500 text-indigo-400 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300',
          )}
        >
          Live Preview
        </button>
      </div>

      {/* 3-Panel Main Layout */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Panel 1: Description */}
        <div
          className={cn(
            'flex flex-col border-r border-zinc-800 bg-[#181818] overflow-hidden shrink-0',
            mobileTab === 'description' ? 'flex w-full' : 'hidden md:flex',
          )}
          style={isMd ? { width: `${split1}%` } : undefined}
        >
          <ReactWorkspaceDescriptionPanel
            description={problem.description}
            slug={problem.slug}
            code={files[activeFile]}
            handleRunCode={handleRunCode}
            handleSubmitCode={handleSubmitCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Divider 1 */}
        <div
          onMouseDown={() => setActiveDivider(1)}
          onTouchStart={() => setActiveDivider(1)}
          className={cn(
            'hidden md:flex w-1.5 bg-zinc-800 hover:bg-indigo-500/80 active:bg-indigo-500 cursor-col-resize select-none items-center justify-center relative transition-colors duration-150 shrink-0 z-10',
            activeDivider === 1 && 'bg-indigo-500',
          )}
        >
          {/* Subtle grab bar indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 pointer-events-none">
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 1 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 1 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 1 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
          </div>
        </div>

        {/* Panel 2: Multi-tab Monaco Editor */}
        <div
          className={cn(
            'flex flex-col border-r border-zinc-800 bg-[#1e1e1e] overflow-hidden shrink-0',
            mobileTab === 'editor' ? 'flex w-full' : 'hidden md:flex',
          )}
          style={isMd ? { width: `${split2 - split1}%` } : undefined}
        >
          <ReactWorkspaceEditorPanel
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            editorTheme={editorTheme}
            fontSize={fontSize}
            handleFileChange={handleFileChange}
          />
        </div>

        {/* Divider 2 */}
        <div
          onMouseDown={() => setActiveDivider(2)}
          onTouchStart={() => setActiveDivider(2)}
          className={cn(
            'hidden md:flex w-1.5 bg-zinc-800 hover:bg-indigo-500/80 active:bg-indigo-500 cursor-col-resize select-none items-center justify-center relative transition-colors duration-150 shrink-0 z-10',
            activeDivider === 2 && 'bg-indigo-500',
          )}
        >
          {/* Subtle grab bar indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 pointer-events-none">
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 2 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 2 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                activeDivider === 2 ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
          </div>
        </div>

        {/* Panel 3: Live Preview & Console Output */}
        <div
          className={cn(
            'flex flex-col bg-[#121212] overflow-hidden shrink-0',
            mobileTab === 'preview' ? 'flex w-full' : 'hidden md:flex',
          )}
          style={isMd ? { width: `${100 - split2}%` } : undefined}
        >
          <ReactWorkspacePreviewPanel
            previewSrcdoc={previewSrcdoc}
            consoleLogs={consoleLogs}
            setConsoleLogs={setConsoleLogs}
            rightTab={rightTab}
            setRightTab={setRightTab}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            consoleOutput={consoleOutput}
          />
        </div>

        {/* Dragging Overlay to prevent iframes/Monaco from stealing events */}
        {activeDivider !== null && (
          <div className="absolute inset-0 bg-transparent z-[9999] cursor-col-resize select-none pointer-events-auto" />
        )}
      </div>
    </div>
  );
}
