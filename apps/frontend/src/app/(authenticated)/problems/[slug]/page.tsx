'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useAuth, useSocket, useToast } from '@/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import Link from 'next/link';
import {
  Loader2,
  ChevronLeft,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  BookOpen,
  Terminal,
  Settings,
  HelpCircle,
  FileCode,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProblemWorkspacePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { apiFetch } = useAuth();
  const socket = useSocket();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  // Workspace Settings
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [code, setCode] = useState<string>('');

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

  // Mobile Navigation: 'description' | 'code' | 'output'
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

  // AI Hint State
  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [remainingHints, setRemainingHints] = useState<number | null>(null);

  const handleFetchHint = async () => {
    setIsHintLoading(true);
    setHintError(null);
    try {
      const response = await apiFetch<{ hint: string; remainingHints: number }>(
        `/api/problems/${slug}/hint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        },
      );
      setHint(response.hint);
      setRemainingHints(response.remainingHints);
      showSuccess('AI Hint generated!');
    } catch (err: any) {
      const msg = err.message || 'Failed to generate hint';
      setHintError(msg);
      showError(msg);
    } finally {
      setIsHintLoading(false);
    }
  };

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
          onClick={() => router.push('/problems')}
          className="rounded-xl font-bold active:scale-95 transition-all"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Challenges
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 overflow-hidden bg-background text-foreground">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/45 backdrop-blur-sm select-none">
        <div className="flex items-center gap-4">
          <Button
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
            variant="outline"
            size="sm"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="h-8.5 text-xs font-semibold rounded-lg border-border"
          >
            {editorTheme === 'vs-dark' ? 'Light Theme' : 'Dark Theme'}
          </Button>

          {/* Reset Code */}
          <Button
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
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side: Description Panel */}
        <div
          className={cn(
            'w-full md:w-1/2 flex flex-col border-r border-border bg-card/15 overflow-hidden',
            mobileTab === 'description' ? 'flex' : 'hidden md:flex',
          )}
        >
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20 shrink-0 text-xs font-semibold text-muted-foreground select-none">
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} />
              Problem Description
            </div>
            <Link
              href="/submissions"
              className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <History size={12} />
              Submissions History
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none scrollbar-thin">
            <ReactMarkdown>{problem.description}</ReactMarkdown>

            {/* AI Hint Section */}
            <div className="mt-8 pt-6 border-t border-border/60 not-prose">
              <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl border border-indigo-500/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-foreground">AI Conceptual Hints</h4>
                  </div>
                  {remainingHints !== null && (
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      {remainingHints} / 3 remaining today
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stuck on this problem? Ask Grok for a high-level conceptual hint. Grok will
                  analyze your current code and guide you without giving away the solution.
                </p>

                {hint && (
                  <div className="bg-card/40 border border-indigo-500/20 rounded-xl p-4 text-xs text-foreground leading-relaxed shadow-sm relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                    <span className="inline-block text-[9px] font-bold text-indigo-400 tracking-wider uppercase mb-1.5">
                      Grok's Hint
                    </span>
                    <p className="font-medium text-foreground/90">{hint}</p>
                  </div>
                )}

                {hintError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3.5 text-xs font-semibold leading-relaxed flex items-center gap-2">
                    <span>{hintError}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleFetchHint}
                    disabled={isHintLoading || (remainingHints !== null && remainingHints <= 0)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    {isHintLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Hint...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Get AI Hint
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editor & Output Panel */}
        <div
          className={cn(
            'w-full md:w-1/2 flex flex-col overflow-hidden bg-[#1e1e1e]',
            mobileTab === 'code' ? 'flex' : 'hidden md:flex',
          )}
        >
          {/* Top Panel: Monaco Editor */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-[#181818] shrink-0 text-xs font-semibold text-zinc-400 select-none">
              <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-zinc-300">
                <FileCode size={13} className="text-zinc-400" />
                {editorConfig.filename}
              </div>

              <div className="bg-[#2a2a2a]/60 border border-zinc-800/80 px-2.5 py-1 rounded text-zinc-400 font-mono text-[9px] select-none uppercase tracking-wider font-extrabold">
                {problem.category}
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={editorConfig.language}
                theme={editorTheme}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  fontFamily:
                    'Fira Code, JetBrains Mono, source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
                  fontLigatures: true,
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          </div>

          {/* Bottom Panel: Tabbed Console/Output */}
          <div className="h-60 border-t border-border flex flex-col bg-[#151515] shrink-0 min-h-0">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-border bg-[#111111] px-6 py-2 shrink-0 select-none">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setConsoleTab('testcases')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                    consoleTab === 'testcases'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300',
                  )}
                >
                  <Terminal size={12} />
                  Test Cases
                </button>
                <button
                  onClick={() => setConsoleTab('result')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                    consoleTab === 'result'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300',
                  )}
                >
                  <Sparkles size={12} />
                  Result
                </button>
              </div>

              {/* Console Execution Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="h-8.5 px-3 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold active:scale-95 transition-all"
                >
                  {isRunning ? (
                    <Loader2 size={13} className="animate-spin mr-1" />
                  ) : (
                    <Play size={12} className="mr-1.5 fill-current" />
                  )}
                  Run Code
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold active:scale-95 shadow-sm shadow-emerald-600/10 hover:shadow-emerald-500/20 border-transparent transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 size={13} className="animate-spin mr-1" />
                  ) : (
                    <Send size={12} className="mr-1.5" />
                  )}
                  Submit
                </Button>
              </div>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 font-mono text-xs text-zinc-300 leading-normal scrollbar-thin">
              {consoleTab === 'testcases' ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-zinc-500 font-bold mb-1 text-[10px] uppercase select-none">
                      Test Case Example
                    </div>
                    <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300">
                      Input: nums = [2, 7, 11, 15], target = 9
                    </pre>
                  </div>
                  <div>
                    <div className="text-zinc-500 font-bold mb-1 text-[10px] uppercase select-none">
                      Expected Output
                    </div>
                    <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300">
                      [0, 1]
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center">
                  {isRunning ? (
                    <div className="flex items-center justify-center gap-2 text-zinc-400 py-6 select-none animate-pulse">
                      <Loader2 size={14} className="animate-spin" />
                      Executing code against test cases...
                    </div>
                  ) : isSubmitting ? (
                    <div className="flex items-center justify-center gap-2 text-zinc-400 py-6 select-none animate-pulse">
                      <Loader2 size={14} className="animate-spin text-emerald-500" />
                      Submitting solution to judge queue...
                    </div>
                  ) : consoleOutput ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 select-none">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase',
                            consoleOutput.status === 'Accepted' ||
                              consoleOutput.status === 'Finished'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                          )}
                        >
                          {consoleOutput.status}
                        </span>
                      </div>
                      <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {consoleOutput.stdout}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-zinc-500 py-10 select-none">
                      Run or Submit code to inspect runtime execution results.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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
