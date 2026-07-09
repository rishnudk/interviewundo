'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, History, Sparkles, Loader2, Play, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useToast } from '@/providers';

interface ReactWorkspaceDescriptionPanelProps {
  description: string;
  slug: string;
  code: string;
  handleRunCode?: () => void;
  handleSubmitCode?: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export function ReactWorkspaceDescriptionPanel({
  description,
  slug,
  code,
  handleRunCode,
  handleSubmitCode,
  isRunning,
  isSubmitting,
}: ReactWorkspaceDescriptionPanelProps) {
  const { apiFetch } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // AI Hint state
  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const handleFetchHint = async () => {
    setIsHintLoading(true);
    setHintError(null);
    try {
      const response = await apiFetch<{ hint: string }>(`/api/problems/${slug}/hint`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setHint(response.hint);
      showSuccess('AI Hint generated!');
    } catch (err: any) {
      const msg = err.message || 'Failed to generate hint';
      setHintError(msg);
      showError(msg);
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-800 bg-[#151515] shrink-0 text-xs font-semibold text-zinc-400 select-none">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} className="text-zinc-500" />
          Problem Description
        </div>

        <div className="flex items-center gap-3">
          {handleRunCode && handleSubmitCode && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="h-8 px-2.5 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-[11px] font-bold active:scale-95 transition-all"
              >
                {isRunning ? (
                  <Loader2 size={12} className="animate-spin mr-1" />
                ) : (
                  <Play size={11} className="mr-1 fill-current text-zinc-400" />
                )}
                Run Code
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold active:scale-95 shadow-sm transition-all border-transparent"
              >
                {isSubmitting ? (
                  <Loader2 size={12} className="animate-spin mr-1" />
                ) : (
                  <Send size={11} className="mr-1" />
                )}
                Submit
              </Button>
            </div>
          )}
          <Link
            href="/submissions"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 active:scale-95 transition-all"
          >
            <History size={12} />
            History
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none text-sm text-zinc-300 scrollbar-thin">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>

        {/* AI Hint Section */}
        <div className="mt-8 pt-6 border-t border-zinc-800 not-prose">
          <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-xl border border-indigo-500/10 p-4.5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <h4 className="text-xs font-bold text-zinc-200">AI Component Hints</h4>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Stuck on this component's logic or event handling? Let the AI analyze your active file
              and provide a conceptual hint.
            </p>

            {hint && (
              <div className="bg-zinc-900 border border-indigo-500/10 rounded-lg p-3 text-[11px] text-zinc-300 leading-relaxed shadow-sm">
                <span className="inline-block text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  AI Hint
                </span>
                <p>{hint}</p>
              </div>
            )}

            {hintError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 text-[11px] font-semibold leading-relaxed">
                <span>{hintError}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                onClick={handleFetchHint}
                disabled={isHintLoading}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                {isHintLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Get AI Hint
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
