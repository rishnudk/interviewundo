'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useToast } from '@/providers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Plus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminProblemsTable } from './AdminProblemsTable';
import { ProblemFormDialog } from './ProblemFormDialog';
import { TestCasesDialog } from './TestCasesDialog';

// ============================================================
// Types
// ============================================================

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

interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
  createdAt: string;
}

export default function AdminProblemsPage() {
  const { apiFetch } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const queryClient = useQueryClient();

  // ------------------------------------------------------------
  // Table Filters State
  // ------------------------------------------------------------
  const [search, setSearch] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<
    'ALL' | 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB'
  >('ALL');
  const [difficulty, setDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setDifficulty('ALL');
    setPage(1);
  };

  // ------------------------------------------------------------
  // Fetch Problems Query
  // ------------------------------------------------------------
  const { data, isLoading } = useQuery({
    queryKey: ['adminProblems', { search: debouncedSearch, category, difficulty, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category !== 'ALL') params.set('category', category);
      if (difficulty !== 'ALL') params.set('difficulty', difficulty);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      params.set('isPublished', 'all');

      return apiFetch<{
        data: Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/api/admin/problems?${params.toString()}`);
    },
    refetchOnWindowFocus: false,
  });

  // ------------------------------------------------------------
  // CRUD Actions & Form Dialog State
  // ------------------------------------------------------------
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [formCategory, setFormCategory] = useState<
    'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB'
  >('JAVASCRIPT');
  const [formStarterCode, setFormStarterCode] = useState('');
  const [formSolutionCode, setFormSolutionCode] = useState('');
  const [formTagsString, setFormTagsString] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(false);

  // Check if URL includes request to create automatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('create') === 'true') {
        window.history.replaceState({}, '', window.location.pathname);
        handleOpenCreateModal();
      }
    }
  }, []);

  const handleOpenCreateModal = () => {
    setActiveProblem(null);
    setFormTitle('');
    setFormDescription('');
    setFormDifficulty('EASY');
    setFormCategory('JAVASCRIPT');
    setFormStarterCode('// Write your starter code template here\nfunction solution() {\n  \n}');
    setFormSolutionCode(
      '// Complete solution implementation for validation\nfunction solution() {\n  \n}',
    );
    setFormTagsString('');
    setFormIsPublished(false);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (problem: Problem) => {
    setActiveProblem(problem);
    setFormTitle(problem.title);
    setFormDescription(problem.description);
    setFormDifficulty(problem.difficulty);
    setFormCategory(problem.category);
    setFormStarterCode(problem.starterCode);
    setFormSolutionCode(problem.solutionCode || '');
    setFormTagsString(problem.tags.join(', '));
    setFormIsPublished(problem.isPublished);
    setIsFormOpen(true);
  };

  const saveProblemMutation = useMutation({
    mutationFn: async () => {
      const parsedTags = formTagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formTitle,
        description: formDescription,
        difficulty: formDifficulty,
        category: formCategory,
        starterCode: formStarterCode,
        solutionCode: formSolutionCode || null,
        tags: parsedTags,
        isPublished: formIsPublished,
        slug: formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      };

      if (activeProblem) {
        return apiFetch<Problem>(`/api/admin/problems/${activeProblem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        return apiFetch<Problem>('/api/admin/problems', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      showSuccess(
        activeProblem ? 'Problem updated successfully!' : 'Problem created successfully!',
      );
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to save problem.');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      return apiFetch<Problem>(`/api/admin/problems/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished }),
      });
    },
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ['adminProblems'] });
      const previousProblems = queryClient.getQueryData(['adminProblems']);
      queryClient.setQueryData(['adminProblems'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: any) => (p.id === id ? { ...p, isPublished } : p)),
        };
      });
      return { previousProblems };
    },
    onSuccess: (_, variables) => {
      showSuccess(variables.isPublished ? 'Problem published live!' : 'Problem reverted to draft.');
    },
    onError: (err: any, _, context: any) => {
      if (context?.previousProblems) {
        queryClient.setQueryData(['adminProblems'], context.previousProblems);
      }
      showError(err.message || 'Failed to update problem status.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
    },
  });

  const deleteProblemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch<{ success: boolean }>(`/api/admin/problems/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      showSuccess('Problem deleted successfully.');
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to delete problem.');
    },
  });

  const handleDeleteProblem = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteProblem = () => {
    if (deleteTargetId) {
      deleteProblemMutation.mutate(deleteTargetId);
      setIsDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  // ------------------------------------------------------------
  // Test Cases Management State & Dialog
  // ------------------------------------------------------------
  const [isTestCasesOpen, setIsTestCasesOpen] = useState(false);
  const [testCaseProblem, setTestCaseProblem] = useState<Problem | null>(null);

  const [tcInput, setTcInput] = useState('');
  const [tcExpectedOutput, setTcExpectedOutput] = useState('');
  const [tcIsHidden, setTcIsHidden] = useState(false);
  const [tcOrder, setTcOrder] = useState(0);

  const { data: testCases, isLoading: isLoadingTestCases } = useQuery<TestCase[]>({
    queryKey: ['testCases', testCaseProblem?.id],
    queryFn: () => {
      if (!testCaseProblem) return [];
      return apiFetch<TestCase[]>(`/api/admin/problems/${testCaseProblem.id}/test-cases`);
    },
    enabled: !!testCaseProblem,
  });

  const handleOpenTestCases = (problem: Problem) => {
    setTestCaseProblem(problem);
    setTcInput('');
    setTcExpectedOutput('');
    setTcIsHidden(false);
    setTcOrder(0);
    setIsTestCasesOpen(true);
  };

  const addTestCaseMutation = useMutation({
    mutationFn: async () => {
      if (!testCaseProblem) return;
      return apiFetch<TestCase>('/api/admin/test-cases', {
        method: 'POST',
        body: JSON.stringify({
          problemId: testCaseProblem.id,
          input: tcInput,
          expectedOutput: tcExpectedOutput,
          isHidden: tcIsHidden,
          order: tcOrder,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases', testCaseProblem?.id] });
      showSuccess('Test case added successfully.');
      setTcInput('');
      setTcExpectedOutput('');
      setTcIsHidden(false);
      setTcOrder(0);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to add test case.');
    },
  });

  const deleteTestCaseMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch<{ success: boolean }>(`/api/admin/test-cases/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases', testCaseProblem?.id] });
      showSuccess('Test case deleted successfully.');
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to delete test case.');
    },
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Problem Database</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build and curate technical challenges for the platform workspace.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenCreateModal}
          className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Problem
        </Button>
      </div>

      {/* Filter Options Card */}
      <Card className="border-border bg-card/45 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75"
                size={17}
              />
              <Input
                placeholder="Search database by title, description, or slug..."
                className="pl-10 rounded-xl h-11 border-border bg-background/50 focus:border-rose-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Difficulty dropdown */}
            <div className="w-full md:w-48">
              <select
                aria-label="Filter by difficulty"
                className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium text-foreground outline-none focus:border-rose-500 transition-colors cursor-pointer"
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as any);
                  setPage(1);
                }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Clear Button */}
            {(search || category !== 'ALL' || difficulty !== 'ALL') && (
              <Button
                type="button"
                variant="ghost"
                className="h-11 px-4 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 hover:bg-accent/40 active:scale-95 transition-all"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                Reset
              </Button>
            )}
          </div>

          {/* Categories bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {[
              { value: 'ALL', label: 'All Subjects' },
              { value: 'JAVASCRIPT', label: 'JavaScript' },
              { value: 'REACT', label: 'React' },
              { value: 'NODEJS', label: 'Node.js' },
              { value: 'TYPESCRIPT', label: 'TypeScript' },
              { value: 'SQL', label: 'SQL' },
              { value: 'MONGODB', label: 'MongoDB' },
            ].map((cat) => {
              const isActive = category === cat.value;
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value as any);
                    setPage(1);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 border cursor-pointer select-none',
                    isActive
                      ? 'bg-rose-600 border-transparent text-white shadow-sm'
                      : 'bg-background/40 hover:bg-accent/50 text-muted-foreground border-border',
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Database Listing Table */}
      <Card className="border-border bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <AdminProblemsTable
          problems={data?.data}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={data?.totalPages || 0}
          togglePublishMutation={togglePublishMutation}
          handleOpenTestCases={handleOpenTestCases}
          handleOpenEditModal={handleOpenEditModal}
          handleDeleteProblem={handleDeleteProblem}
          handleOpenCreateModal={handleOpenCreateModal}
        />
      </Card>

      {/* DIALOG: CREATE / EDIT PROBLEM */}
      <ProblemFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        activeProblem={activeProblem}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formDifficulty={formDifficulty}
        setFormDifficulty={setFormDifficulty}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formStarterCode={formStarterCode}
        setFormStarterCode={setFormStarterCode}
        formSolutionCode={formSolutionCode}
        setFormSolutionCode={setFormSolutionCode}
        formTagsString={formTagsString}
        setFormTagsString={setFormTagsString}
        formIsPublished={formIsPublished}
        setFormIsPublished={setFormIsPublished}
        saveProblemMutation={saveProblemMutation}
      />

      {/* DIALOG: TEST CASES MANAGEMENT */}
      <TestCasesDialog
        isOpen={isTestCasesOpen}
        setIsOpen={setIsTestCasesOpen}
        testCaseProblem={testCaseProblem}
        testCases={testCases}
        isLoadingTestCases={isLoadingTestCases}
        tcInput={tcInput}
        setTcInput={setTcInput}
        tcExpectedOutput={tcExpectedOutput}
        setTcExpectedOutput={setTcExpectedOutput}
        tcIsHidden={tcIsHidden}
        setTcIsHidden={setTcIsHidden}
        tcOrder={tcOrder}
        setTcOrder={setTcOrder}
        addTestCaseMutation={addTestCaseMutation}
        deleteTestCaseMutation={deleteTestCaseMutation}
      />

      {/* DIALOG: DELETE CONFIRMATION */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md p-6 bg-card border-border rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-500">
              Confirm Problem Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you absolutely sure you want to delete this problem? This will permanently erase
              it, all associated test cases, and user submissions history. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-xl h-10 px-5 text-xs font-semibold active:scale-95 border-border"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteProblem}
              className="rounded-xl h-10 px-6 text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold active:scale-95"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
