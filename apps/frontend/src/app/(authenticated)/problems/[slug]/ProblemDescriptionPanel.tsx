'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  History,
  Sparkles,
  FileCode,
  Lock,
  Unlock,
  Eye,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast, useAuth } from '@/providers';
import { cn } from '@/lib/utils';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-all active:scale-90 cursor-pointer flex items-center justify-center border-none bg-transparent"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={13} className="text-emerald-500 animate-in zoom-in duration-200" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

import { Problem } from '@interviewprep/shared-types';
import { ProblemHeader } from '@/components/workspace/ProblemHeader';

interface ProblemDescriptionPanelProps {
  problem: Problem;
  solutionCode?: string | null;
  tags?: string[];
}

const staticHints = [
  'Analyze input constraints and edge cases. Check for empty inputs, null values, or single element inputs.',
  'Think about optimal data structures. Using a Map or a Set can help reduce lookup time from linear O(N) to constant O(1).',
  'Consider complexity trade-offs. Using two-pointers or a hash map can avoid nested loops and optimize time to O(N).',
  'Handle edge cases and boundary conditions (e.g., negative numbers, integer overflow, duplicate values) in your code.',
];

export function ProblemDescriptionPanel({
  problem,
  solutionCode,
  tags,
}: ProblemDescriptionPanelProps) {
  const { success: showSuccess } = useToast();
  const { apiFetch } = useAuth();

  const slug = problem.slug;
  const description = problem.description;

  // Tab State
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'related'>('description');

  const firstTag = tags && tags.length > 0 ? tags[0] : null;

  const { data: relatedData } = useQuery({
    queryKey: ['related-problems', firstTag],
    queryFn: async () => {
      if (!firstTag) return { data: [] };
      return apiFetch<{
        data: Array<{ id: string; title: string; slug: string; difficulty: string }>;
      }>(`/api/problems?tag=${firstTag}&limit=5`);
    },
    enabled: !!firstTag,
  });

  // Hints Progression State
  const [unlockedHints, setUnlockedHints] = useState<boolean[]>([true, false, false, false]);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([false, false, false, false]);

  const handleUnlockNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < 4) {
      setUnlockedHints((prev) => {
        const next = [...prev];
        next[nextIndex] = true;
        return next;
      });
      showSuccess(`Hint ${nextIndex + 1} unlocked!`);
    }
  };

  const handleReveal = (index: number) => {
    setRevealedHints((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-muted/20 shrink-0 text-xs font-semibold select-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
              activeTab === 'description'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookOpen size={13} />
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solution')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
              activeTab === 'solution'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileCode size={13} />
            Solution
          </button>
          {firstTag && (
            <button
              type="button"
              onClick={() => setActiveTab('related')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
                activeTab === 'related'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Sparkles size={13} />
              Related
            </button>
          )}
        </div>

        <Link
          href="/submissions"
          className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1 active:scale-95 transition-all"
        >
          <History size={12} />
          Submissions History
        </Link>
      </div>

      {/* Description Tab Content */}
      {activeTab === 'description' && (
        <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none scrollbar-thin">
          <ProblemHeader problem={problem} />
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>

          {/* Locked Hints Section */}
          <div className="mt-8 pt-6 border-t border-border/60 not-prose space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
              <h4 className="text-sm font-bold text-foreground">Sequential Hints</h4>
            </div>

            <div className="space-y-3">
              {staticHints.map((hintText, idx) => {
                const isUnlocked = unlockedHints[idx];
                const isRevealed = revealedHints[idx];
                const isPrevRevealed = idx === 0 || revealedHints[idx - 1];

                return (
                  <div
                    key={idx}
                    className={cn(
                      'border rounded-2xl p-4 transition-all duration-200 shadow-sm relative overflow-hidden',
                      isUnlocked
                        ? isRevealed
                          ? 'bg-indigo-500/5 border-indigo-500/20 text-foreground'
                          : 'bg-muted/30 border-border hover:border-zinc-400'
                        : 'bg-muted/10 border-border/60 opacity-60',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          isRevealed ? (
                            <Unlock size={14} className="text-indigo-500" />
                          ) : (
                            <Unlock size={14} className="text-zinc-500" />
                          )
                        ) : (
                          <Lock size={14} className="text-muted-foreground/60" />
                        )}
                        <span className="text-xs font-bold">Hint {idx + 1}</span>
                      </div>

                      {isUnlocked && !isRevealed && (
                        <Button
                          type="button"
                          onClick={() => handleReveal(idx)}
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[10px] font-bold rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Eye size={12} />
                          Reveal Hint
                        </Button>
                      )}
                    </div>

                    {isUnlocked && isRevealed && (
                      <div className="mt-2 text-xs leading-relaxed text-muted-foreground animate-in fade-in duration-300">
                        <p>{hintText}</p>

                        {/* Show unlock next button if the next hint is locked */}
                        {idx < 3 && !unlockedHints[idx + 1] && (
                          <div className="mt-3 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => handleUnlockNext(idx)}
                              size="sm"
                              className="h-7 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg active:scale-95 transition-all"
                            >
                              Unlock Hint {idx + 2}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {!isUnlocked && (
                      <div className="mt-2 text-[11px] text-muted-foreground/60 flex items-center justify-between">
                        <span>Locked</span>
                        {isPrevRevealed ? (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Reveal previous hint to unlock
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/40 italic">
                            Prerequisites locked
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Solution Tab Content */}
      {activeTab === 'solution' && (
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin bg-card/5">
          {solutionCode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full select-none uppercase tracking-wider">
                  Reference Solution Code
                </span>
                <CopyButton text={solutionCode} />
              </div>
              <pre className="p-4 bg-zinc-950/90 border border-border rounded-2xl text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                <code>{solutionCode}</code>
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20 select-none">
              <FileCode size={36} className="text-muted-foreground/50 mb-2" />
              <p className="text-xs font-semibold">
                No reference solution available for this challenge.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Related Tab Content */}
      {activeTab === 'related' && (
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin bg-card/5 space-y-4">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              Problems tagged with "{firstTag}"
            </h4>
            {relatedData &&
            relatedData.data &&
            relatedData.data.filter((p) => p.slug !== slug).length > 0 ? (
              <div className="flex flex-col gap-2">
                {relatedData.data
                  .filter((p) => p.slug !== slug)
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/problems/${p.slug}`}
                      className="flex items-center justify-between p-3 border border-border hover:border-zinc-400 bg-background/40 hover:bg-accent/30 rounded-xl transition-all duration-150 group"
                    >
                      <span className="text-xs font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground capitalize">
                        {p.difficulty.toLowerCase()}
                      </span>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No other similar problems found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
