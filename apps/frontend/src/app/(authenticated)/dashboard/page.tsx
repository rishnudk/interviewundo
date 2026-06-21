'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Code,
  Sparkles,
  Trophy,
  Activity,
  Flame,
  PlayCircle,
  ExternalLink,
  Target,
  CheckCircle2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Problem } from '@interviewprep/shared-types';

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

  // Calculate Calendar Days (last 365 days aligned to weeks)
  const calendarData = useMemo(() => {
    if (!data?.activity) return { weeks: [], monthLabels: [], activityMap: {} };

    const activityMap = data.activity.reduce(
      (acc, curr) => {
        acc[curr.date] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const days: Date[] = [];
    const today = new Date();

    // Align start to 52 weeks ago, starting on Sunday
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const curr = new Date(startDate);
    while (curr <= today) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Generate month labels positioned at the starting week index
    const monthLabels: { text: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const firstDay = week[0];
      if (firstDay && firstDay.getMonth() !== lastMonth) {
        lastMonth = firstDay.getMonth();
        monthLabels.push({
          text: firstDay.toLocaleDateString(undefined, { month: 'short' }),
          index,
        });
      }
    });

    return { weeks, monthLabels, activityMap };
  }, [data?.activity]);

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

  // Handle get cell color based on submission intensity
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-muted/20 dark:bg-muted/10 hover:bg-muted/40';
    if (count <= 2) return 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30';
    if (count <= 4) return 'bg-emerald-500/50 text-emerald-400 hover:bg-emerald-500/60';
    return 'bg-emerald-500 dark:bg-emerald-400 text-white hover:bg-emerald-600';
  };

  // Render Skeleton Loader
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Failed to load dashboard statistics.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
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
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      description: 'Accepted vs total submissions',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      label: 'Active Streak',
      value: `${stats.streak} ${stats.streak === 1 ? 'Day' : 'Days'}`,
      description: 'Keep the flame alive!',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10 animate-pulse',
    },
    {
      label: 'Total Submissions',
      value: `${stats.totalSolved > 0 ? 'Active' : 'Get Started'}`,
      description: 'Submit solutions to build stats',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Sparkles width={12} height={12} className="animate-spin" />
            Interview Prep Dashboard Active
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, {user?.name || 'Developer'}!
          </h2>
          <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
            Enhance your problem-solving capabilities, master JavaScript/React, and ace your
            technical interviews with real-time feedback.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/problems"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2',
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
        <div className="w-full bg-card/30 border border-border backdrop-blur-sm rounded-3xl p-6 md:p-8 animate-pulse space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-32 bg-muted rounded-full" />
              <div className="h-7 w-1/3 bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
            <div className="h-10 w-32 bg-muted rounded-xl" />
          </div>
        </div>
      ) : dailyChallenge?.data ? (
        <div className="w-full relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-indigo-500/10 backdrop-blur-md shadow-lg shadow-orange-500/5 transition-all duration-300 hover:border-orange-500/30 group">
          {/* Decorative glowing blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 dark:text-orange-400 text-xs font-bold tracking-wider uppercase border border-orange-500/30">
                  <Flame size={12} className="animate-pulse fill-orange-500" />
                  Daily Challenge
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <DifficultyBadge difficulty={dailyChallenge.data.difficulty} />
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-md">
                  {dailyChallenge.data.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {dailyChallenge.data.title}
                </h3>
                <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
                  {dailyChallenge.data.description.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="font-semibold text-foreground">
                    {dailyChallenge.data.solvedCount}
                  </span>{' '}
                  Solved
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className="text-indigo-500" />
                  <span className="font-semibold text-foreground">
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
                  'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-md shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-2 border-0',
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
              className="border-border bg-card/40 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground/80">{stat.description}</p>
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
        {/* Left Side: Stats Breakdown & Category Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Difficulty breakdown */}
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" /> Difficulty Progress
              </CardTitle>
              <CardDescription>Breakdown of solved problems by difficulty level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
                const breakdown = stats.difficultyBreakdown[diff];
                const solved = breakdown?.solved || 0;
                const total = breakdown?.total || 0;
                const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

                const colorMap = {
                  EASY: 'bg-emerald-500',
                  MEDIUM: 'bg-amber-500',
                  HARD: 'bg-destructive',
                };

                const textMap = {
                  EASY: 'text-emerald-500',
                  MEDIUM: 'text-amber-500',
                  HARD: 'text-destructive',
                };

                return (
                  <div key={diff} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={cn(
                          'font-semibold text-xs uppercase tracking-wider',
                          textMap[diff],
                        )}
                      >
                        {diff}
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        {solved}{' '}
                        <span className="text-xs text-muted-foreground/50">/ {total} solved</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          colorMap[diff],
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Category progress bar chart (Recharts) */}
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Category Progress
              </CardTitle>
              <CardDescription>Completion percentages across technical subjects</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rechartsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover text-popover-foreground p-3 rounded-xl border border-border shadow-lg text-xs space-y-1">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-muted-foreground">
                              Solved:{' '}
                              <span className="font-semibold text-foreground">
                                {data.solved} / {data.total}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Completion:{' '}
                              <span className="font-semibold text-indigo-500">
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
                      const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
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
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" /> Submission Activity
              </CardTitle>
              <CardDescription>Daily coding activity over the past year</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col">
                {/* Month Headers */}
                <div className="flex gap-[4.5px] text-[10px] text-muted-foreground/60 h-4 pl-6 relative">
                  {calendarData.monthLabels.map((lbl, idx) => (
                    <div
                      key={idx}
                      className="absolute"
                      style={{ left: `${lbl.index * 13.5 + 24}px` }}
                    >
                      {lbl.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  {/* Days label */}
                  <div className="flex flex-col justify-between text-[9px] text-muted-foreground/60 h-[92px] pr-1 py-1">
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                  </div>

                  {/* Grid Container */}
                  <div className="flex-1 overflow-x-auto pb-2 scrollbar-thin select-none">
                    <div className="flex gap-[2px]">
                      {calendarData.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[2px]">
                          {week.map((day, dIdx) => {
                            const dateStr = day.toISOString().split('T')[0];
                            const count = calendarData.activityMap[dateStr] || 0;
                            const colorClass = getCellColor(count);
                            return (
                              <div
                                key={dIdx}
                                className={cn(
                                  'w-[10px] h-[10px] rounded-[1.5px] transition-all hover:scale-125 cursor-pointer relative group',
                                  colorClass,
                                )}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] py-1.5 px-2 rounded-lg shadow-md whitespace-nowrap z-50 pointer-events-none border border-border">
                                  {count} {count === 1 ? 'submission' : 'submissions'} on{' '}
                                  {day.toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/60 pt-2">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-muted/20" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500/20" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500/50" />
                  <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500" />
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Submissions</CardTitle>
                <CardDescription>Your latest submissions on problems</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recent.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No submissions yet. Start coding to build history!
                </div>
              ) : (
                recent.map((sub, idx) => {
                  const statusColors = {
                    ACCEPTED:
                      'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10',
                    WRONG_ANSWER:
                      'text-destructive border-destructive/20 bg-destructive/5 dark:bg-destructive/10',
                    TIME_LIMIT_EXCEEDED:
                      'text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10',
                    RUNTIME_ERROR:
                      'text-stone-500 border-stone-500/20 bg-stone-500/5 dark:bg-stone-500/10',
                    COMPILATION_ERROR:
                      'text-zinc-500 border-zinc-500/20 bg-zinc-500/5 dark:bg-zinc-500/10',
                    PENDING: 'text-muted-foreground border-border bg-muted/5',
                    PROCESSING:
                      'text-indigo-500 border-indigo-500/20 bg-indigo-500/5 animate-pulse',
                  };

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border/50 hover:bg-accent/30 transition-all duration-200 group"
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-3">
                        <Link
                          href={`/problems/${sub.problemSlug}`}
                          className="font-semibold text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                        >
                          {sub.problemTitle}
                          <ExternalLink
                            size={10}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </Link>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                            statusColors[sub.status as keyof typeof statusColors] ||
                              statusColors.PENDING,
                          )}
                        >
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                        <DifficultyBadge difficulty={sub.difficulty} />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
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
      <div className="h-44 bg-muted/40 rounded-3xl" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-muted/20 rounded-2xl" />
          <div className="h-80 bg-muted/20 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-muted/20 rounded-2xl" />
          <div className="h-[320px] bg-muted/20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
