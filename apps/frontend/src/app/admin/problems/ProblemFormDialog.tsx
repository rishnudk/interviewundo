'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, FileCode, CheckCircle, Check, X } from 'lucide-react';
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

interface ProblemFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeProblem: Problem | null;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  formDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  setFormDifficulty: (val: 'EASY' | 'MEDIUM' | 'HARD') => void;
  formCategory: 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB';
  setFormCategory: (
    val: 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB',
  ) => void;
  formStarterCode: string;
  setFormStarterCode: (val: string) => void;
  formSolutionCode: string;
  setFormSolutionCode: (val: string) => void;
  formTagsString: string;
  setFormTagsString: (val: string) => void;
  formIsPublished: boolean;
  setFormIsPublished: (val: boolean) => void;
  saveProblemMutation: any;
}

export function ProblemFormDialog({
  isOpen,
  setIsOpen,
  activeProblem,
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  formDifficulty,
  setFormDifficulty,
  formCategory,
  setFormCategory,
  formStarterCode,
  setFormStarterCode,
  formSolutionCode,
  setFormSolutionCode,
  formTagsString,
  setFormTagsString,
  formIsPublished,
  setFormIsPublished,
  saveProblemMutation,
}: ProblemFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border rounded-2xl shadow-xl">
        <DialogHeader className="p-6 pb-2 shrink-0 border-b border-border">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <PlusCircle className="text-rose-500" size={20} />
            {activeProblem ? 'Modify Coding Task' : 'Draft New Coding Task'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Specify complete details. Solutions and starter templates will be used for code
            execution tests.
          </DialogDescription>
        </DialogHeader>

        {/* Form Scrollport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Task Title
              </label>
              <Input
                required
                placeholder="e.g. Find Prime Numbers"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="rounded-xl bg-background/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Topic Subject
              </label>
              <select
                aria-label="Topic Subject"
                className="w-full h-10 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium outline-none focus:border-rose-500 transition-colors"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
              >
                <option value="JAVASCRIPT">JavaScript</option>
                <option value="REACT">React Component</option>
                <option value="NODEJS">Node.js API</option>
                <option value="TYPESCRIPT">TypeScript</option>
                <option value="SQL">SQL Database</option>
                <option value="MONGODB">MongoDB Database</option>
              </select>
            </div>
          </div>

          {/* Difficulty & tags & isPublished */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Difficulty Level
              </label>
              <select
                aria-label="Difficulty Level"
                className="w-full h-10 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium outline-none focus:border-rose-500 transition-colors"
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as any)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tags (comma separated)
              </label>
              <Input
                placeholder="e.g. arrays, strings, algorithms"
                value={formTagsString}
                onChange={(e) => setFormTagsString(e.target.value)}
                className="rounded-xl bg-background/50"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setFormIsPublished(!formIsPublished)}
                className={cn(
                  'h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer',
                  formIsPublished
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-muted/40 text-muted-foreground border-border',
                )}
              >
                {formIsPublished ? <Check size={14} /> : <X size={14} />}
                <span>{formIsPublished ? 'Publish Live' : 'Save as Draft'}</span>
              </button>
            </div>
          </div>

          {/* Description (Markdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Problem Description (Markdown)
            </label>
            <textarea
              required
              rows={5}
              placeholder="Markdown description here... support paragraph explanation, code snippets, and constraints."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/50 p-3 text-sm outline-none focus:border-rose-500 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Starter code template */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FileCode size={14} className="text-indigo-500" />
                Starter Code Template
              </label>
            </div>
            <textarea
              required
              rows={6}
              value={formStarterCode}
              onChange={(e) => setFormStarterCode(e.target.value)}
              aria-label="Starter Code Template"
              className="w-full rounded-xl border border-border bg-background/50 p-3 text-xs outline-none focus:border-rose-500 transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Complete Solution implementation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" />
              Solution Reference Code
            </label>
            <textarea
              rows={6}
              placeholder="Reference implementation code..."
              value={formSolutionCode}
              onChange={(e) => setFormSolutionCode(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/50 p-3 text-xs outline-none focus:border-rose-500 transition-all font-mono leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="p-4 shrink-0 border-t border-border bg-muted/20 flex flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="rounded-xl h-10 px-5 text-sm font-semibold active:scale-95"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              saveProblemMutation.isPending || !formTitle || !formDescription || !formStarterCode
            }
            onClick={() => saveProblemMutation.mutate()}
            className="rounded-xl h-10 px-6 text-sm bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 active:scale-95"
          >
            {saveProblemMutation.isPending && <Loader2 className="animate-spin" size={14} />}
            <span>{activeProblem ? 'Update Database' : 'Publish Problem'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
