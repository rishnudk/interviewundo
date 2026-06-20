'use client';

import React from 'react';
// DashboardLayout is handled globally by route group layout
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Code,
  BookOpen,
  Trophy,
  Activity,
  Flame,
  ArrowRight,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const stats = [
    {
      label: 'Problems Solved',
      value: '18 / 150',
      description: '12% complete',
      icon: Code,
      color: 'text-indigo-500',
    },
    {
      label: 'Success Rate',
      value: '76.4%',
      description: '+2.1% this week',
      icon: Trophy,
      color: 'text-amber-500',
    },
    {
      label: 'Active Streak',
      value: '3 Days',
      description: 'Keep the flame alive!',
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: 'Submissions',
      value: '34 Total',
      description: '12 accepted solutions',
      icon: Activity,
      color: 'text-emerald-500',
    },
  ];

  const recentProblems = [
    {
      title: 'Two Sum',
      category: 'Arrays & Hashing',
      difficulty: 'EASY',
      slug: 'two-sum',
      successRate: '92%',
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      category: 'Sliding Window',
      difficulty: 'MEDIUM',
      slug: 'longest-substring-without-repeating-characters',
      successRate: '68%',
    },
    {
      title: 'LRU Cache',
      category: 'Design',
      difficulty: 'HARD',
      slug: 'lru-cache',
      successRate: '41%',
    },
  ];

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* Welcome Section */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
              <Sparkles width={12} height={12} className="animate-spin" />
              Sprint 1 Launching Ready
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back to CodePrep!
            </h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
              Enhance your problem-solving capabilities, master JavaScript/React, and ace your technical interviews with real-time feedback.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/problems"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  "bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2"
                )}
              >
                <PlayCircle size={16} />
                Start Solving
              </Link>
              <Link
                href="/problems/daily"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  "border border-white/20 text-blue-600 hover:bg-blue-400/10 hover:text-blue-400 rounded-xl font-semibold active:scale-95 transition-all flex items-center gap-2"
                )}
              >
                <BookOpen size={16} />
                Daily Challenge
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-border bg-card/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
                    <Icon size={22} className="stroke-[2.5]" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recommended Problems */}
          <Card className="lg:col-span-2 border-border bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recommended for You</CardTitle>
                <CardDescription>Handpicked problems to match your skill level</CardDescription>
              </div>
              <Link
                href="/problems"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  "text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-accent rounded-lg flex items-center gap-1.5"
                )}
              >
                View All
                <ArrowRight size={13} />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/60 hover:bg-accent/40 transition-all duration-200 group"
                >
                  <div className="space-y-1 min-w-0 flex-1 pr-4">
                    <Link
                      href={`/problems/${prob.slug}`}
                      className="font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      {prob.title}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {prob.category} • Success rate: {prob.successRate}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={prob.difficulty} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Learning Card */}
          <Card className="border-border bg-card/30 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">Prep Plan Overview</CardTitle>
              <CardDescription>Current path: Frontend Master</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">JavaScript Core</span>
                  <span className="text-emerald-500">80% Done</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">React & Virtual DOM</span>
                  <span className="text-indigo-500">45% Done</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-indigo-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Node.js Basics</span>
                  <span className="text-muted-foreground/60">Not Started</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-muted-foreground rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}
