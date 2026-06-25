'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Code, Sparkles, Trophy, Activity, Flame, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Problem } from '@interviewprep/shared-types';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { DifficultyProgress } from './DifficultyProgress';
import { RecentSubmissions } from './RecentSubmissions';
import { ActivityHeatmap } from './ActivityHeatmap';

// ============================================================
// Types
// ============================================================

interface DifficultyBreakdown {
  solved: number;
  total: number;
}

interface DashboardStats {
  totalSolved: number;
  totalProblems: number;
  successRate: number;
  streak: number;
  difficultyBreakdown: {
    EASY: DifficultyBreakdown;
    MEDIUM: DifficultyBreakdown;
    HARD: DifficultyBreakdown;
  };
}

interface CategoryProgressItem {
  category: string;
  solved: number;
  total: number;
  percentage: number;
}

interface ActivityHeatmapItem {
  date: string;
  count: number;
}

interface RecentSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface DashboardSummaryData {
  stats: DashboardStats;
  progress: CategoryProgressItem[];
  activity: ActivityHeatmapItem[];
  recent: RecentSubmissionItem[];
}

export default function DashboardPage() {
  const { apiFetch, user } = useAuth();

  // Fetch consolidated dashboard summary data
  const { data, isLoading, error } = useQuery<DashboardSummaryData>({
    queryKey: ['dashboardSummary'],
    queryFn: () => apiFetch<DashboardSummaryData>('/api/dashboard/summary'),
    refetchOnWindowFocus: false,
  });

  // Fetch Daily Challenge problem
  const { data: dailyChallenge, isLoading: isDailyLoading } = useQuery<{
    success: boolean;
    data: Problem;
  }>({
    queryKey: ['dailyChallenge'],
    queryFn: () => apiFetch<{ success: boolean; data: Problem }>('/api/problems/daily'),
    refetchOnWindowFocus: false,
  });

  // Format Recharts data
  const rechartsData = useMemo(() => {
    if (!data?.progress) return [];
    return data.progress.map((item) => ({
      name: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
      solved: item.solved,
      total: item.total,
      percentage: item.percentage,
      rawName: item.category,
    }));
  }, [data?.progress]);

  // Render Skeleton Loader
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-400 font-medium">Failed to load dashboard statistics.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="rounded-xl border-white/10 text-white hover:bg-white/5"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, recent } = data;

  const statsGridData = [
    {
      label: 'Problems Solved',
      value: `${stats.totalSolved} / ${stats.totalProblems}`,
      description: `${stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0}% complete`,
      icon: Code,
      color: 'text-[#479ffa] bg-[#479ffa]/10',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      description: 'Accepted vs total submissions',
      icon: Trophy,
      color: 'text-[#4ebe96] bg-[#4ebe96]/10',
    },
    {
      label: 'Active Streak',
      value: `${stats.streak} ${stats.streak === 1 ? 'Day' : 'Days'}`,
      description: 'Keep the flame alive!',
      icon: Flame,
      color: 'text-[#ffa16c] bg-[#ffa16c]/10 animate-pulse',
    },
    {
      label: 'Total Submissions',
      value: `${stats.totalSolved > 0 ? 'Active' : 'Get Started'}`,
      description: 'Submit solutions to build stats',
      icon: Activity,
      color: 'text-[#ffffff] bg-white/10',
    },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Welcome Section */}
      <div className="rounded-[16px] bg-[#191919] border border-white/5 p-8 text-white relative overflow-hidden shadow-[0_0_44px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#479ffa]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#479ffa]/30 bg-[#479ffa]/10 text-xs font-semibold backdrop-blur-md text-[#479ffa]">
            <Sparkles width={12} height={12} className="animate-spin" />
            Interview Prep Dashboard Active
          </span>
          <h2 className="text-3xl font-bold tracking-[-0.05em] md:text-4xl text-[#ffffff]">
            Welcome back, {user?.name || 'Developer'}!
          </h2>
          <p className="text-[#868f97] text-sm md:text-base leading-relaxed">
            Enhance your problem-solving capabilities, master JavaScript/React, and ace your
            technical interviews with real-time feedback.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/problems"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'rounded-full bg-[#0b0b0b] hover:bg-[#131313] text-[#ffffff] font-medium border border-white/10 shadow-[0_0_14px_rgba(255,255,255,0.15)] transition-all flex items-center gap-2',
              )}
            >
              <PlayCircle size={16} />
              Start Solving
            </Link>
          </div>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      {isDailyLoading ? (
        <div className="w-full bg-[#131313] border border-white/5 rounded-[16px] p-6 md:p-8 animate-pulse space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-32 bg-[#191919] rounded-full" />
              <div className="h-7 w-1/3 bg-[#191919] rounded" />
              <div className="h-4 w-2/3 bg-[#191919] rounded" />
            </div>
            <div className="h-10 w-32 bg-[#191919] rounded-full" />
          </div>
        </div>
      ) : dailyChallenge?.data ? (
        <div className="w-full relative overflow-hidden rounded-[16px] border border-[#ffa16c]/20 bg-[#131313] shadow-[0_0_44px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#ffa16c]/40 group">
          {/* Decorative glowing blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ffa16c]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#479ffa]/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffa16c]/10 text-[#ffa16c] text-xs font-bold tracking-wider uppercase border border-[#ffa16c]/20">
                  <Flame size={12} className="animate-pulse fill-[#ffa16c]" />
                  Daily Challenge
                </span>
                <span className="text-xs text-[#525252]">•</span>
                <DifficultyBadge difficulty={dailyChallenge.data.difficulty} />
                <span className="text-xs text-[#525252]">•</span>
                <span className="text-xs font-medium text-[#868f97] bg-[#191919] border border-white/5 px-2.5 py-0.5 rounded-md">
                  {dailyChallenge.data.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold tracking-[-0.05em] text-[#ffffff] group-hover:text-[#ffa16c] transition-colors">
                  {dailyChallenge.data.title}
                </h3>
                <p className="text-sm text-[#868f97] line-clamp-2 leading-relaxed">
                  {dailyChallenge.data.description.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#868f97]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#4ebe96]" />
                  <span className="font-semibold text-[#ffffff]">
                    {dailyChallenge.data.solvedCount}
                  </span>{' '}
                  Solved
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className="text-[#479ffa]" />
                  <span className="font-semibold text-[#ffffff]">
                    {dailyChallenge.data.attemptCount > 0
                      ? Math.round(
                          (dailyChallenge.data.solvedCount / dailyChallenge.data.attemptCount) *
                            100,
                        )
                      : 0}
                    %
                  </span>{' '}
                  Acceptance Rate
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <Link
                href={`/problems/${dailyChallenge.data.slug}`}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'default' }),
                  'rounded-full bg-[#0b0b0b] hover:bg-[#191919] text-[#ffffff] font-medium border border-white/10 shadow-[0_0_14px_rgba(255,255,255,0.15)] transition-all flex items-center gap-2',
                )}
              >
                Solve Challenge
                <PlayCircle size={18} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsGridData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)] hover:border-white/10 transition-all duration-300"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[#868f97] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-[#ffffff]">{stat.value}</p>
                  <p className="text-[11px] text-[#868f97]/80">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Stats Breakdown & Category Progress Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Difficulty breakdown */}
          <DifficultyProgress difficultyBreakdown={stats.difficultyBreakdown} />

          {/* Category progress bar chart (Recharts) */}
          <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#ffffff] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#4ebe96]" /> Category Progress
              </CardTitle>
              <CardDescription className="text-[#868f97] text-xs">
                Completion percentages across technical subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rechartsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#868f97" fontSize={11} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#868f97" fontSize={11} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#131313] text-[#ffffff] p-3 rounded-xl border border-white/10 shadow-xl text-xs space-y-1">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-[#868f97]">
                              Solved:{' '}
                              <span className="font-semibold text-[#ffffff]">
                                {data.solved} / {data.total}
                              </span>
                            </p>
                            <p className="text-[#868f97]">
                              Completion:{' '}
                              <span className="font-semibold text-[#479ffa]">
                                {data.percentage}%
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={16}>
                    {rechartsData.map((entry, index) => {
                      const colors = ['#479ffa', '#4ebe96', '#ffa16c', '#ffffff'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Heatmap Calendar & Recent Submissions */}
        <div className="space-y-6">
          {/* Submission Heatmap */}
          <ActivityHeatmap activity={data.activity} />

          {/* Recent Submissions */}
          <RecentSubmissions recent={recent} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Skeleton Loader Component
// ============================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-44 bg-[#191919] border border-white/5 rounded-[16px]" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[#191919] border border-white/5 rounded-[16px]" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-[#191919] border border-white/5 rounded-[16px]" />
          <div className="h-80 bg-[#191919] border border-white/5 rounded-[16px]" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-[#191919] border border-white/5 rounded-[16px]" />
          <div className="h-[320px] bg-[#191919] border border-white/5 rounded-[16px]" />
        </div>
      </div>
    </div>
  );
}
