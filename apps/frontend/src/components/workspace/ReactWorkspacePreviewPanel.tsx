'use client';

import React, { useState } from 'react';
import { Eye, Terminal, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

interface ReactWorkspacePreviewPanelProps {
  previewSrcdoc: string;
  consoleLogs: ConsoleLog[];
  setConsoleLogs: React.Dispatch<React.SetStateAction<ConsoleLog[]>>;
  rightTab: 'preview' | 'console' | 'result';
  setRightTab: (tab: 'preview' | 'console' | 'result') => void;
  isRunning: boolean;
  isSubmitting: boolean;
  consoleOutput: {
    status: string;
    stdout?: string;
    passed?: boolean;
    error?: string;
  } | null;
}

export function ReactWorkspacePreviewPanel({
  previewSrcdoc,
  consoleLogs,
  setConsoleLogs,
  rightTab,
  setRightTab,
  isRunning,
  isSubmitting,
  consoleOutput,
}: ReactWorkspacePreviewPanelProps) {
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(true);

  // Map parent's 'preview' rightTab state to 'console' so it doesn't break when initialized
  const activeTab = rightTab === 'preview' ? 'console' : rightTab;

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] overflow-hidden">
      {/* Header bar for Live Preview */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] h-[38px] px-4 shrink-0 select-none">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
          <Eye size={13} className="text-zinc-500" />
          Live Preview
        </div>
      </div>

      {/* Live Preview Iframe Container */}
      <div className="flex-1 min-h-0 bg-[#121212] relative">
        {previewSrcdoc ? (
          <iframe
            title="Live Preview Sandbox"
            srcDoc={previewSrcdoc}
            sandbox="allow-scripts"
            className="w-full h-full bg-[#121212] border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2 select-none">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs">Loading Live Sandbox...</span>
          </div>
        )}
      </div>

      {/* Console logs & Sandbox results section */}
      <div
        className={cn(
          'flex flex-col bg-[#151515] shrink-0 border-t border-zinc-800 transition-all duration-300 ease-in-out',
          isConsoleExpanded ? 'h-[260px] max-h-[50vh]' : 'h-[38px]',
        )}
      >
        {/* Console Header Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] h-[37px] px-4 shrink-0 select-none">
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setRightTab('console');
                setIsConsoleExpanded(true);
              }}
              className={cn(
                'px-3 py-2 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
                activeTab === 'console' && isConsoleExpanded
                  ? 'text-zinc-200 border-b border-indigo-500'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Terminal size={11} />
              Console logs
              {consoleLogs.length > 0 && (
                <span className="ml-1 bg-amber-500/20 text-amber-400 font-extrabold text-[8px] px-1.5 py-0.5 rounded-full">
                  {consoleLogs.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setRightTab('result');
                setIsConsoleExpanded(true);
              }}
              className={cn(
                'px-3 py-2 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
                activeTab === 'result' && isConsoleExpanded
                  ? 'text-zinc-200 border-b border-indigo-500'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Sparkles size={11} />
              Sandbox Result
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'console' && consoleLogs.length > 0 && isConsoleExpanded && (
              <button
                type="button"
                onClick={() => setConsoleLogs([])}
                className="px-2 text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer active:scale-95 transition-all border-none bg-transparent"
              >
                Clear
              </button>
            )}

            {/* Toggle arrow */}
            <button
              type="button"
              onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/65 cursor-pointer active:scale-90 transition-all border-none bg-transparent"
              title={isConsoleExpanded ? 'Minimize Console' : 'Maximize Console'}
            >
              {isConsoleExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Console Body Content */}
        {isConsoleExpanded && (
          <div className="flex-1 overflow-y-auto min-h-0 bg-[#151515] scrollbar-thin">
            {activeTab === 'console' && (
              <div className="w-full h-full px-5 py-4 font-mono text-[11px] space-y-2.5">
                {consoleLogs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-10 select-none">
                    No console messages. Call console.log() in your code to view logs.
                  </div>
                ) : (
                  consoleLogs.map((log, index) => (
                    <div
                      key={index}
                      className={cn(
                        'pb-1.5 border-b border-zinc-900/60 leading-relaxed flex items-start gap-2',
                        log.level === 'error' && 'text-rose-400',
                        log.level === 'warn' && 'text-amber-400',
                        log.level === 'info' && 'text-cyan-400',
                        log.level === 'log' && 'text-zinc-300',
                      )}
                    >
                      <span className="opacity-45 text-[9px] shrink-0 font-sans mt-0.5 select-none">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="font-extrabold uppercase text-[8px] tracking-wider px-1.5 rounded shrink-0 select-none bg-zinc-900 border border-zinc-800">
                        {log.level}
                      </span>
                      <pre className="whitespace-pre-wrap word-break-all font-mono">
                        {log.message}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'result' && (
              <div className="w-full h-full px-6 py-5 font-mono text-xs text-zinc-300 leading-normal bg-[#151515]">
                {isRunning ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span>Executing code against JSDOM test cases...</span>
                  </div>
                ) : isSubmitting ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                    <span>Submitting solution to judge worker queue...</span>
                  </div>
                ) : consoleOutput ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border',
                          consoleOutput.status === 'Accepted' ||
                            consoleOutput.status === 'Finished' ||
                            consoleOutput.status === 'ACCEPTED' ||
                            consoleOutput.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                        )}
                      >
                        {consoleOutput.status}
                      </span>
                    </div>
                    <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {consoleOutput.stdout}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-zinc-500 py-10 select-none">
                    Run or Submit code to inspect sandbox test case execution results.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
