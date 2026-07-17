'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Code2,
  CheckCircle,
  Database,
  ShieldCheck,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalSubmissions: number;
  totalProblems: number;
  acceptanceRate: number;
  problemsByDifficulty: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
}

export default function AdminDashboardPage() {
  const { apiFetch } = useAuth();

  const { data, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: () => apiFetch<AdminStats>('/api/admin/stats'),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Failed to load administrative statistics.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
          Refresh
        </Button>
      </div>
    );
  }

  const { totalUsers, totalProblems, totalSubmissions, acceptanceRate, problemsByDifficulty } =
    data;

  const statCards = [
    {
      label: 'Total Registered Users',
      value: totalUsers,
      description: 'Active platform developers',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Problem Database',
      value: totalProblems,
      description: 'Standard & custom coding tasks',
      icon: Code2,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Code Submissions',
      value: totalSubmissions,
      description: 'Total user code compilations',
      icon: Database,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Success Rate',
      value: `${acceptanceRate}%`,
      description: 'Percentage of ACCEPTED status',
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 to-amber-500 p-8 text-white relative overflow-hidden shadow-lg shadow-rose-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck size={12} />
            System Administrator Authorization
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome to the Admin Portal
          </h2>
          <p className="text-rose-50 text-sm md:text-base leading-relaxed max-w-2xl">
            Monitor platform metrics, manage database coding problems, construct test case suites,
            and oversee student activity in real-time.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="border-border bg-card/40 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{card.value}</p>
                  <p className="text-[11px] text-muted-foreground/80">{card.description}</p>
                </div>
                <div className={`p-3 rounded-2xl border ${card.color}`}>
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Difficulty Distribution Chart */}
        <Card className="lg:col-span-2 border-border bg-card/30 backdrop-blur-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" /> Problems by Difficulty
            </CardTitle>
            <CardDescription>Visual breakdown of currently available tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 py-4 flex-1 flex flex-col justify-center">
            {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
              const count = problemsByDifficulty[diff] || 0;
              const percent = totalProblems > 0 ? Math.round((count / totalProblems) * 100) : 0;

              const colorMap = {
                EASY: 'bg-emerald-500',
                MEDIUM: 'bg-amber-500',
                HARD: 'bg-rose-500',
              };

              const textMap = {
                EASY: 'text-emerald-500',
                MEDIUM: 'text-amber-500',
                HARD: 'text-rose-500',
              };

              return (
                <div key={diff} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-bold text-xs uppercase tracking-wider ${textMap[diff]}`}>
                      {diff}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {count}{' '}
                      <span className="text-xs text-muted-foreground/50">
                        problems ({percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative border border-border/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorMap[diff]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Management Actions */}
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-500" /> Quick Tasks
            </CardTitle>
            <CardDescription>Shortcut actions for database maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl border border-border/50 bg-background/30 hover:bg-accent/40 transition-all">
              <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                <Code2 size={16} className="text-rose-500" />
                Problem Database
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Edit descriptions, compile solutions, toggle publishing.
              </p>
              <Link href="/admin/problems">
                <Button
                  size="sm"
                  className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1"
                >
                  Manage Problems <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-border/50 bg-background/30 hover:bg-accent/40 transition-all">
              <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                <PlusCircle size={16} className="text-indigo-500" />
                Create New Coding Task
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Add title, starter templates, tags and test cases.
              </p>
              <Link href="/admin/problems?create=true">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/20 font-medium"
                >
                  Add New Problem
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      <div className="h-44 bg-muted/40 rounded-3xl" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 bg-muted/20 rounded-2xl" />
        <div className="h-72 bg-muted/20 rounded-2xl" />
      </div>
    </div>
  );
}
