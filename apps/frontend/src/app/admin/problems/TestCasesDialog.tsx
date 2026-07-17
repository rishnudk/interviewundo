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
import { ListPlus, Loader2, BookOpen, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
  createdAt: string;
}

interface Problem {
  id: string;
  title: string;
}

interface TestCasesDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  testCaseProblem: Problem | null;
  testCases: TestCase[] | undefined;
  isLoadingTestCases: boolean;
  tcInput: string;
  setTcInput: (val: string) => void;
  tcExpectedOutput: string;
  setTcExpectedOutput: (val: string) => void;
  tcIsHidden: boolean;
  setTcIsHidden: (val: boolean) => void;
  tcOrder: number;
  setTcOrder: (val: number) => void;
  addTestCaseMutation: any;
  deleteTestCaseMutation: any;
}

export function TestCasesDialog({
  isOpen,
  setIsOpen,
  testCaseProblem,
  testCases,
  isLoadingTestCases,
  tcInput,
  setTcInput,
  tcExpectedOutput,
  setTcExpectedOutput,
  tcIsHidden,
  setTcIsHidden,
  tcOrder,
  setTcOrder,
  addTestCaseMutation,
  deleteTestCaseMutation,
}: TestCasesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-card border-border rounded-2xl shadow-xl">
        <DialogHeader className="p-6 pb-2 shrink-0 border-b border-border">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ListPlus className="text-amber-500" size={20} />
            Test Cases: {testCaseProblem?.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add verification data to evaluate user submissions. Hidden test cases run in sandbox but
            are invisible to students.
          </DialogDescription>
        </DialogHeader>

        {/* Split container: List on top, form at the bottom */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Test Cases Table Scrollport */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingTestCases ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Loader2 className="animate-spin text-amber-500" size={24} />
                <p className="text-xs font-semibold animate-pulse">Loading test suite...</p>
              </div>
            ) : !testCases || testCases.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/5 flex flex-col items-center justify-center">
                <BookOpen size={30} className="text-muted-foreground/50 mb-2" />
                <p className="text-xs font-bold text-foreground">No test cases registered</p>
                <p className="text-[10px] text-muted-foreground max-w-xs mt-0.5">
                  Submit inputs below to initialize code execution tests.
                </p>
              </div>
            ) : (
              <div className="border border-border/50 rounded-xl overflow-hidden bg-background/30">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-amber-500/5 text-[10px] font-bold text-muted-foreground uppercase select-none">
                      <th className="py-2.5 px-4 w-12 text-center">Order</th>
                      <th className="py-2.5 px-4">Standard Input</th>
                      <th className="py-2.5 px-4">Expected Output</th>
                      <th className="py-2.5 px-4 w-20 text-center">Visibility</th>
                      <th className="py-2.5 px-4 w-16 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 font-medium">
                    {testCases.map((tc) => (
                      <tr key={tc.id} className="hover:bg-accent/20 border-b border-border/10">
                        <td className="py-2.5 px-4 text-center font-bold text-muted-foreground">
                          {tc.order}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[10px] truncate max-w-[150px]">
                          {tc.input}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[10px] truncate max-w-[150px]">
                          {tc.expectedOutput}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={cn(
                              'inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border',
                              tc.isHidden
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                            )}
                          >
                            {tc.isHidden ? 'Hidden' : 'Visible'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Delete test case"
                            onClick={() => deleteTestCaseMutation.mutate(tc.id)}
                            className="text-rose-500 hover:bg-rose-500/10 rounded-md active:scale-95"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Test Case Add Form Area */}
          <div className="shrink-0 p-6 border-t border-border bg-muted/40 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
              <PlusCircle size={14} /> Add New Test Case
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Input Parameters
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. [1, 2], 3"
                  value={tcInput}
                  onChange={(e) => setTcInput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 p-2 text-xs font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Expected Output
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 4"
                  value={tcExpectedOutput}
                  onChange={(e) => setTcExpectedOutput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 p-2 text-xs font-mono outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Order & Hidden toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-6">
                {/* Order Input */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Order:
                  </span>
                  <Input
                    type="number"
                    value={tcOrder}
                    onChange={(e) => setTcOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-16 h-8 rounded-lg text-center bg-background"
                  />
                </div>

                {/* Hidden Toggle */}
                <button
                  type="button"
                  onClick={() => setTcIsHidden(!tcIsHidden)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all active:scale-95 cursor-pointer border-none',
                    tcIsHidden
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  )}
                >
                  {tcIsHidden ? 'Hidden Sandbox Case' : 'Visible Demo Case'}
                </button>
              </div>

              <Button
                type="button"
                onClick={() => addTestCaseMutation.mutate()}
                disabled={addTestCaseMutation.isPending || !tcInput || !tcExpectedOutput}
                className="rounded-xl h-9 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {addTestCaseMutation.isPending && <Loader2 className="animate-spin" size={12} />}
                <span>Register Case</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 shrink-0 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-xl h-10 px-6 font-semibold active:scale-95"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
