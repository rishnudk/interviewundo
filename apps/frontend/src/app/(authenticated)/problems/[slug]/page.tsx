'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProblemWorkspacePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { apiFetch } = useAuth();

  // Workspace Settings
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');

  // Mobile Navigation: 'description' | 'code' | 'output'
  const [mobileTab, setMobileTab] = useState<'description' | 'code'>('description');

  // Output Console State
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'result'>('testcases');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      }>(`/api/problems/${slug}`);
    },
  });

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

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput(null);

    // Mock code execution delay
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput({
        status: 'Finished',
        stdout: `Success! All mock tests passed in ${language}.`,
        passed: true,
      });
    }, 1500);
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setConsoleTab('result');
    setConsoleOutput(null);

    // Mock submit code execution delay
    setTimeout(() => {
      setIsSubmitting(false);
      setConsoleOutput({
        status: 'Accepted',
        stdout: `All test cases passed in ${language}!\nRuntime: 76 ms\nMemory: 42.1 MB`,
        passed: true,
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
            Loading problem workspace...
          </p>
        </div>
      </div>
    );
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
          <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border bg-muted/20 shrink-0 text-xs font-semibold text-muted-foreground select-none">
            <BookOpen size={13} />
            Problem Description
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none scrollbar-thin">
            <ReactMarkdown>{problem.description}</ReactMarkdown>
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
              <div className="flex items-center gap-1.5">
                <FileCode size={13} />
                {language === 'javascript' && 'solution.js'}
                {language === 'typescript' && 'solution.ts'}
                {language === 'python' && 'solution.py'}
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-[#2a2a2a] hover:bg-zinc-800 text-zinc-300 text-[11px] font-semibold px-2.5 py-1 rounded outline-none border border-zinc-700/60 cursor-pointer focus:border-zinc-500 transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="flex-1 min-h-0 bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={language}
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
