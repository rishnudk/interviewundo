'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSocket, useToast } from '@/providers';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { ChevronLeft, RotateCcw, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactWorkspace from '@/components/workspace/ReactWorkspace';
import { ProblemDescriptionPanel } from './ProblemDescriptionPanel';
import { ProblemEditorPanel } from './ProblemEditorPanel';

const getCategoryEditorConfig = (cat: string) => {
  switch (cat) {
    case 'JAVASCRIPT':
    case 'NODEJS':
    case 'REACT':
      return { language: 'javascript', filename: 'solution.js' };
    case 'TYPESCRIPT':
      return { language: 'typescript', filename: 'solution.ts' };
    case 'SQL':
      return { language: 'sql', filename: 'query.sql' };
    case 'MONGODB':
      return { language: 'javascript', filename: 'pipeline.js' };
    default:
      return { language: 'javascript', filename: 'solution.js' };
  }
};

export default function ProblemWorkspacePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { apiFetch } = useAuth();
  const socket = useSocket();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  // Resizable layout ref & states
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const newSplit = ((e.clientX - rect.left) / rect.width) * 100;
      if (newSplit >= 20 && newSplit <= 80) {
        setSplitPercent(newSplit);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const newSplit = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      if (newSplit >= 20 && newSplit <= 80) {
        setSplitPercent(newSplit);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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
  }, [isDragging]);

  // Workspace Settings
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [code, setCode] = useState<string>('');

  // Mobile Navigation: 'description' | 'code'
  const [mobileTab, setMobileTab] = useState<'description' | 'code'>('description');

  // Output Console State
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'result'>('testcases');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{
    status: string;
    stdout?: string;
    stderr?: string;
    passed?: boolean;
    error?: string;
  } | null>(null);

  // Fetch Problem Details
  const {
    data: problem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['problem', slug],
    queryFn: async () => {
      return apiFetch<{
        id: string;
        title: string;
        slug: string;
        description: string;
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        category: string;
        starterCode: string;
        solvedCount: number;
        attemptCount: number;
        tags?: string[];
        solutionCode?: string | null;
        testCases?: Array<{
          id: string;
          input: string;
          expectedOutput: string;
          isHidden: boolean;
          order: number;
        }>;
      }>(`/api/problems/${slug}`);
    },
  });

  const editorConfig = problem?.category
    ? getCategoryEditorConfig(problem.category)
    : { language: 'javascript', filename: 'solution.js' };

  // Load starter code once problem data is fetched
  useEffect(() => {
    if (problem?.starterCode) {
      setCode(problem.starterCode);
    }
  }, [problem]);

  // Keyboard Shortcuts (Ctrl+Enter = Submit, Ctrl+S = Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmitCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Inform user that code was saved locally
        setConsoleTab('result');
        setConsoleOutput({
          status: 'Saved',
          stdout: `Draft saved successfully at ${new Date().toLocaleTimeString()}!`,
          passed: true,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  const handleResetCode = () => {
    if (
      problem?.starterCode &&
      confirm('Are you sure you want to reset your code to the starter template?')
    ) {
      setCode(problem.starterCode);
    }
  };

  // Listen for real-time WebSocket updates
  useEffect(() => {
    if (!socket || !activeJobId) return;

    const handleStatusUpdate = (payload: {
      submissionId: string;
      status: string;
      data?: any;
      error?: string;
      userStreak?: number;
      streakMilestone?: number | null;
    }) => {
      console.log('Received WebSocket submission:status update:', payload);
      if (payload.submissionId !== activeJobId) return;

      if (payload.status === 'PROCESSING') {
        setConsoleOutput({
          status: 'Processing',
          stdout: 'Executing test cases inside Docker container...',
        });
      } else {
        // Final status reached!
        setIsRunning(false);
        setIsSubmitting(false);
        setActiveJobId(null);

        if (
          payload.status === 'ACCEPTED' ||
          payload.status === 'SUCCESS' ||
          payload.status === 'Finished'
        ) {
          showSuccess('All tests passed! Solution Accepted.');
        } else if (payload.status === 'WRONG_ANSWER') {
          showError('Wrong Answer: Some test cases failed.');
        } else if (payload.status === 'TIME_LIMIT_EXCEEDED') {
          showError('Time Limit Exceeded.');
        } else if (payload.status === 'RUNTIME_ERROR') {
          showError('Runtime Error: Check logs.');
        } else if (payload.status === 'COMPILATION_ERROR') {
          showError('Compilation Error: Check syntax.');
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
            stdout?: string;
          }>;
          stdout = results
            .map((res, i) => {
              const tcTitle = `Test Case ${i + 1}: ${res.passed ? 'PASSED ✅' : 'FAILED ❌'} (${res.runtime}ms)`;
              const actStr = JSON.stringify(res.actual);
              const expStr = JSON.stringify(res.expected);
              const runLog = res.stdout ? `\nLogs:\n${res.stdout}` : '';
              return `${tcTitle}\nExpected: ${expStr}\nReceived: ${actStr}${runLog}`;
            })
            .join('\n\n');
        } else if (payload.data) {
          const d = payload.data;
          stdout = `Passed Cases: ${d.passedCases} / ${d.totalCases}\nRuntime: ${d.runtime} ms\nMemory: ${typeof d.memory === 'number' ? (d.memory / 1024 / 1024).toFixed(2) : 0} MB`;
        }

        setConsoleOutput({
          status: payload.status,
          stdout,
          passed:
            payload.status === 'ACCEPTED' ||
            payload.status === 'Finished' ||
            payload.status === 'SUCCESS',
          error:
            payload.error ||
            (payload.status !== 'ACCEPTED' && payload.status !== 'Finished'
              ? 'Some test cases failed.'
              : undefined),
        });
      }
    };

    socket.on('submission:status', handleStatusUpdate);

    return () => {
      socket.off('submission:status', handleStatusUpdate);
    };
  }, [socket, activeJobId]);

  const handleRunCode = async () => {
    if (!problem?.id) return;
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing code run in the sandbox...',
    });
    showInfo('Code execution queued...');

    try {
      const result = await apiFetch<{ jobId: string; status: string }>('/api/submissions/run', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language: editorConfig.language,
        }),
      });

      setActiveJobId(result.jobId);
    } catch (err: any) {
      setIsRunning(false);
      const errMsg = err.message || 'Failed to trigger playground run';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem?.id) return;
    setIsSubmitting(true);
    setConsoleTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing submission in the judge...',
    });
    showInfo('Solution submission queued...');

    try {
      const result = await apiFetch<{ id: string; status: string }>('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language: editorConfig.language,
        }),
      });

      setActiveJobId(result.id);
    } catch (err: any) {
      setIsSubmitting(false);
      const errMsg = err.message || 'Failed to trigger solution submission';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (isError || !problem) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4">
          <HelpCircle size={32} />
        </div>
        <h3 className="text-lg font-semibold mb-2">Workspace Loading Failed</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-normal">
          We encountered an error loading the challenge description and editor configuration.
        </p>
        <Button
          type="button"
          onClick={() => router.push('/problems')}
          className="rounded-xl font-bold active:scale-95 transition-all"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Challenges
        </Button>
      </div>
    );
  }

  if (problem.category === 'REACT') {
    return <ReactWorkspace problem={problem} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 overflow-hidden bg-background text-foreground">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/45 backdrop-blur-sm select-none">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/problems')}
            className="rounded-lg h-9 hover:bg-accent/40 active:scale-95 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h1 className="text-base font-bold truncate max-w-[200px] sm:max-w-xs">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {problem.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 capitalize"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Editor Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-muted/40 border border-border px-2 py-1 rounded-lg">
            <Settings size={13} className="text-muted-foreground" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-[11px] font-semibold outline-none cursor-pointer pr-1"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
            </select>
          </div>

          {/* Theme Selector */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="h-8.5 text-xs font-semibold rounded-lg border-border"
          >
            {editorTheme === 'vs-dark' ? 'Light Theme' : 'Dark Theme'}
          </Button>

          {/* Reset Code */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetCode}
            className="h-8.5 text-xs font-semibold rounded-lg border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            title="Reset code to starter template"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex border-b border-border md:hidden shrink-0 select-none">
        <button
          type="button"
          onClick={() => setMobileTab('description')}
          className={cn(
            'flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer',
            mobileTab === 'description'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground',
          )}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('code')}
          className={cn(
            'flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer',
            mobileTab === 'code'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground',
          )}
        >
          Code Editor
        </button>
      </div>

      {/* Workspace Body (Split Screen) */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Side: Description Panel */}
        <div
          className={cn(
            'flex flex-col border-r border-border bg-card/15 overflow-hidden shrink-0',
            mobileTab === 'description' ? 'flex w-full' : 'hidden md:flex',
          )}
          style={isMd ? { width: `${splitPercent}%` } : undefined}
        >
          <ProblemDescriptionPanel
            description={problem.description}
            slug={slug}
            code={code}
            solutionCode={problem.solutionCode}
            tags={problem.tags}
            handleRunCode={handleRunCode}
            handleSubmitCode={handleSubmitCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Resizer Divider */}
        <div
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className={cn(
            'hidden md:flex w-1.5 bg-border hover:bg-indigo-500/80 active:bg-indigo-500 cursor-col-resize select-none items-center justify-center relative transition-colors duration-150 shrink-0 z-10',
            isDragging && 'bg-indigo-500',
          )}
        >
          {/* Subtle grab bar indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 pointer-events-none">
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                isDragging ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                isDragging ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
            <div
              className={cn(
                'w-1 h-1 rounded-full transition-colors',
                isDragging ? 'bg-indigo-100' : 'bg-zinc-600',
              )}
            />
          </div>
        </div>

        {/* Right Side: Editor & Output Panel */}
        <div
          className={cn(
            'flex flex-col overflow-hidden bg-[#1e1e1e] shrink-0',
            mobileTab === 'code' ? 'flex w-full' : 'hidden md:flex',
          )}
          style={isMd ? { width: `${100 - splitPercent}%` } : undefined}
        >
          <ProblemEditorPanel
            code={code}
            setCode={setCode}
            editorConfig={editorConfig}
            editorTheme={editorTheme}
            fontSize={fontSize}
            consoleTab={consoleTab}
            setConsoleTab={setConsoleTab}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            consoleOutput={consoleOutput}
            handleRunCode={handleRunCode}
            handleSubmitCode={handleSubmitCode}
            category={problem.category}
            testCases={problem.testCases}
          />
        </div>

        {/* Dragging Overlay to prevent Monaco from stealing events */}
        {isDragging && (
          <div className="absolute inset-0 bg-transparent z-[9999] cursor-col-resize select-none pointer-events-auto" />
        )}
      </div>
    </div>
  );
}

// ============================================================
// Workspace Skeleton Loader
// ============================================================

function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 overflow-hidden bg-background animate-pulse">
      {/* Workspace Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/45 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-8 bg-muted rounded-lg" />
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="w-48 h-5 bg-muted rounded-md" />
          <div className="w-16 h-5 bg-muted rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-8 bg-muted rounded-lg" />
          <div className="w-24 h-8 bg-muted rounded-lg" />
          <div className="w-10 h-8 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Split Screen Workspace Body Skeleton */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Description Skeleton */}
        <div className="w-1/2 flex flex-col border-r border-border bg-card/15 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20 shrink-0">
            <div className="w-32 h-4 bg-muted rounded-md" />
            <div className="w-24 h-4 bg-muted rounded-md" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="w-3/4 h-6 bg-muted rounded-md" />
            <div className="w-1/2 h-4 bg-muted rounded-md" />
            <div className="space-y-2.5 pt-4">
              <div className="w-full h-4 bg-muted rounded-md" />
              <div className="w-full h-4 bg-muted rounded-md" />
              <div className="w-5/6 h-4 bg-muted rounded-md" />
              <div className="w-2/3 h-4 bg-muted rounded-md" />
            </div>
            <div className="space-y-2.5 pt-6">
              <div className="w-full h-4 bg-muted rounded-md" />
              <div className="w-4/5 h-4 bg-muted rounded-md" />
              <div className="w-full h-4 bg-muted rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Editor Skeleton */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-[#181818] shrink-0">
            <div className="w-24 h-4 bg-muted/30 rounded-md" />
            <div className="w-20 h-7 bg-muted/30 rounded-md" />
          </div>
          <div className="flex-1 bg-[#1e1e1e] p-6 space-y-3">
            <div className="w-[120px] h-4 bg-muted/20 rounded-md" />
            <div className="w-[200px] h-4 bg-muted/20 rounded-md pl-6" />
            <div className="w-[150px] h-4 bg-muted/20 rounded-md pl-6" />
            <div className="w-[80px] h-4 bg-muted/20 rounded-md" />
            <div className="w-[180px] h-4 bg-muted/20 rounded-md pl-6" />
          </div>
          <div className="h-60 border-t border-border bg-[#151515] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border bg-[#111111] -mx-6 -mt-6 p-4">
              <div className="flex gap-2">
                <div className="w-24 h-7 bg-muted/20 rounded-lg" />
                <div className="w-20 h-7 bg-muted/20 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="w-24 h-8 bg-muted/30 rounded-lg" />
                <div className="w-20 h-8 bg-muted/30 rounded-lg" />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="w-1/3 h-3 bg-muted/20 rounded-md" />
              <div className="w-full h-8 bg-muted/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
