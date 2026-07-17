'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ThumbsUp,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquarePlus,
  Filter,
} from 'lucide-react';

interface FeatureRequestItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'PROBLEM_REQUEST' | 'FEATURE_SUGGESTION' | 'BUG_REPORT';
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  upvotes: number;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function RequestsPage() {
  const { apiFetch } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PROBLEM_REQUEST' | 'FEATURE_SUGGESTION' | 'BUG_REPORT'>(
    'PROBLEM_REQUEST',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch Requests
  const { data: requests = [], isLoading } = useQuery<FeatureRequestItem[]>({
    queryKey: ['feature-requests'],
    queryFn: async () => {
      const res = await apiFetch<any>('/api/requests');
      return res?.data || res || [];
    },
  });

  // Create Request Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiFetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, type }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setErrorMsg('');
      setSuccessMsg('Your request has been submitted to the community roadmap!');
      setTimeout(() => setSuccessMsg(''), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(
        err?.message ||
          'Failed to submit request. Please ensure title is at least 5 chars and description at least 10 chars.',
      );
    },
  });

  // Upvote Mutation
  const upvoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(`/api/requests/${id}/upvote`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (title.trim().length < 5) {
      setErrorMsg('Title must be at least 5 characters long.');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMsg('Description must be at least 10 characters long.');
      return;
    }
    createMutation.mutate();
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType === 'ALL') return true;
    return r.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-foreground p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> Community Roadmap & Requests
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Challenge & Feature Board
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Want to practice a specific FAANG interview challenge or need a new platform tool?
            Submit a request below and let the developer community upvote what we build next!
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Plus size={18} /> Request Challenge / Feature
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 mr-2">
          <Filter size={14} /> Filter By:
        </span>
        {[
          { label: 'All Requests', value: 'ALL' },
          { label: 'Challenge Requests', value: 'PROBLEM_REQUEST' },
          { label: 'Feature Suggestions', value: 'FEATURE_SUGGESTION' },
          { label: 'Bug Reports', value: 'BUG_REPORT' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === tab.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card/60 text-muted-foreground hover:bg-accent/40 hover:text-foreground border border-border/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Feed */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Loading community requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="bg-card/40 border-border/60 p-12 text-center flex flex-col items-center justify-center gap-4 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquarePlus size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg">No requests found</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Be the first engineer to request a custom coding challenge or feature for this
              category!
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="mt-2 border-primary/40 text-primary hover:bg-primary/10 font-semibold"
          >
            Submit a Request
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => {
            const isApproved = req.status === 'APPROVED';
            const isUnderReview = req.status === 'UNDER_REVIEW';

            return (
              <Card
                key={req.id}
                className="bg-card/60 backdrop-blur-md border-border/80 hover:border-border transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md"
              >
                <CardContent className="p-6 flex items-start justify-between gap-6">
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          req.type === 'PROBLEM_REQUEST'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : req.type === 'FEATURE_SUGGESTION'
                              ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {req.type.replace('_', ' ')}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isUnderReview
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                        }`}
                      >
                        {isApproved && <CheckCircle2 size={12} />}
                        {isUnderReview && <Clock size={12} />}
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-foreground tracking-tight">
                      {req.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {req.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground/80 pt-1">
                      <span>Requested by {req.user?.name || 'Anonymous Engineer'}</span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => upvoteMutation.mutate(req.id)}
                      disabled={upvoteMutation.isPending}
                      className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl bg-accent/40 hover:bg-primary/15 hover:text-primary border border-border/80 hover:border-primary/40 active:scale-95 transition-all cursor-pointer min-w-[70px]"
                      title="Upvote this request"
                    >
                      <ThumbsUp
                        size={18}
                        className="text-primary transition-transform group-hover:-translate-y-0.5"
                      />
                      <span className="font-extrabold text-sm">{req.upvotes}</span>
                    </button>
                    <span className="text-[10px] text-muted-foreground/60 font-semibold mt-1 uppercase tracking-wider">
                      Upvote
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-[#141417] border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-primary" /> Request Challenge or Feature
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Help shape the interviewprep roadmap by sharing what challenge or feature you want
                next.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Request Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="PROBLEM_REQUEST">
                      Challenge Request (e.g., LeetCode/System Design problem)
                    </option>
                    <option value="FEATURE_SUGGESTION">
                      Feature Suggestion (e.g., Dark mode option, new compiler)
                    </option>
                    <option value="BUG_REPORT">
                      Bug Report (e.g., Sandbox issue or UI glitch)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Title
                  </label>
                  <Input
                    placeholder="e.g., Add 'Design Twitter Rate Limiter' problem"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background border-border rounded-xl h-10"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Detailed Description
                  </label>
                  <textarea
                    placeholder="Explain why this challenge is helpful for FAANG prep or how the feature should work..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-xl shadow-md cursor-pointer"
                  >
                    {createMutation.isPending ? 'Submitting...' : 'Submit to Roadmap'}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
