'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Loader2, BookOpen, Eye, EyeOff, ListPlus, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB';
  starterCode: string;
  solutionCode?: string | null;
  tags: string[];
  isPublished: boolean;
  solvedCount: number;
  attemptCount: number;
}

interface AdminProblemsTableProps {
  problems: Problem[] | undefined;
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  togglePublishMutation: any;
  handleOpenTestCases: (problem: Problem) => void;
  handleOpenEditModal: (problem: Problem) => void;
  handleDeleteProblem: (id: string) => void;
  handleOpenCreateModal: () => void;
}

export function AdminProblemsTable({
  problems,
  isLoading,
  page,
  setPage,
  totalPages,
  togglePublishMutation,
  handleOpenTestCases,
  handleOpenEditModal,
  handleDeleteProblem,
  handleOpenCreateModal,
}: AdminProblemsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="animate-spin text-rose-500" size={32} />
          <p className="text-sm font-medium animate-pulse">Loading database index...</p>
        </div>
      ) : !problems || problems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <BookOpen size={40} className="text-muted-foreground/60 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No problems found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Curate new problems or change search terms to refine results.
          </p>
          <Button
            type="button"
            onClick={handleOpenCreateModal}
            variant="outline"
            className="mt-4 rounded-xl border-rose-500/20 text-rose-600 hover:bg-rose-500/5 hover:text-rose-600"
          >
            Create First Problem
          </Button>
        </div>
      ) : (
        <>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-rose-500/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
                <th className="py-4 px-6 w-24">Status</th>
                <th className="py-4 px-6 min-w-[200px]">Problem Title</th>
                <th className="py-4 px-6 w-28">Difficulty</th>
                <th className="py-4 px-6 w-32">Topic</th>
                <th className="py-4 px-6 w-28 text-center">Submissions</th>
                <th className="py-4 px-6 w-44 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {problems.map((problem) => (
                <tr
                  key={problem.id}
                  className="hover:bg-accent/25 transition-colors group border-b border-border/20"
                >
                  {/* Status Toggle */}
                  <td className="py-4 px-6">
                    <button
                      type="button"
                      onClick={() =>
                        togglePublishMutation.mutate({
                          id: problem.id,
                          isPublished: !problem.isPublished,
                        })
                      }
                      title={problem.isPublished ? 'Click to unpublish' : 'Click to publish'}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border transition-all active:scale-95 border-none cursor-pointer',
                        problem.isPublished
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-muted/30 text-muted-foreground border-border',
                      )}
                    >
                      {problem.isPublished ? (
                        <>
                          <Eye size={12} />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Title & Slug */}
                  <td className="py-4 px-6 min-w-[200px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground leading-tight group-hover:text-rose-500 transition-colors">
                        {problem.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 font-mono tracking-tight mt-0.5">
                        slug: {problem.slug}
                      </span>
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-6">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                      {problem.category}
                    </span>
                  </td>

                  {/* Attempts */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-semibold text-foreground">
                        {problem.solvedCount}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">
                        {problem.attemptCount} tries
                      </span>
                    </div>
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Test Cases Trigger */}
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        title="Manage Test Cases"
                        aria-label="Manage Test Cases"
                        onClick={() => handleOpenTestCases(problem)}
                        className="rounded-lg text-amber-500 hover:bg-amber-500/10 hover:text-amber-500 active:scale-95"
                      >
                        <ListPlus size={15} />
                      </Button>

                      {/* Edit Problem Trigger */}
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        title="Edit Details"
                        aria-label="Edit problem details"
                        onClick={() => handleOpenEditModal(problem)}
                        className="rounded-lg text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500 active:scale-95"
                      >
                        <Edit size={15} />
                      </Button>

                      {/* Delete Trigger */}
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        title="Delete Problem"
                        aria-label="Delete problem"
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 active:scale-95"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="py-4 px-6 border-t border-border flex items-center justify-between bg-muted/10">
              <span className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of{' '}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl h-8 text-xs font-semibold"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl h-8 text-xs font-semibold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
