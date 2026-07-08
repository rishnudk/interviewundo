'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Flame, Calendar, ChevronRight, Sparkles, Terminal } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { user, apiFetch } = useAuth();

  // Fetch real user stats for active coding streak
  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => apiFetch<{ streak: number }>('/api/dashboard/stats'),
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  // Simple route to title map
  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/problems')) return 'Coding Problems';
    if (pathname.startsWith('/submissions')) return 'Submission History';
    if (pathname.startsWith('/profile')) return 'User Profile';
    if (pathname.startsWith('/admin')) return 'Admin Panel';
    return 'Dashboard';
  };

  const streakCount = stats?.streak ?? 0;

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Unified Dropdown Menu Toggle Icon */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className={`rounded-lg hover:bg-accent/40 active:scale-95 transition-all ${pathname.startsWith('/problems') ? 'lg:hidden' : ''}`}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </Button>

        {/* Logo next to menu button */}
        <div className="flex items-center gap-2">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
            <Terminal size={15} />
          </div>
          <span className="font-bold tracking-tight text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent select-none">
            interviewUndo
          </span>
        </div>

        <span className="w-px h-4 bg-border hidden sm:inline" />

        {/* Dynamic Title */}
        <h1 className="font-semibold text-xs md:text-sm tracking-tight text-muted-foreground">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Daily Challenge Capsule */}
        <Link
          href="/problems/daily"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 text-xs font-semibold transition-all group active:scale-95"
        >
          <Calendar size={13} className="shrink-0 group-hover:scale-110 transition-transform" />
          <span>Daily Challenge</span>
          <ChevronRight
            size={12}
            className="opacity-60 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>

        {/* User Streak Widget */}
        {user && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm shadow-amber-500/5 hover:bg-amber-500/15 transition-all select-none cursor-default"
            title={`${streakCount} ${streakCount === 1 ? 'day' : 'days'} in your active streak.`}
          >
            <Flame size={14} className="fill-current text-amber-500 animate-bounce" />
            <span>
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        )}

        {/* AI Help indicator (mockups) */}
        <Link
          href="/dashboard"
          className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <Sparkles size={13} className="text-violet-500" />
          <span>AI Assistant Ready</span>
        </Link>

        <span className="w-px h-5 bg-border hidden sm:inline" />

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
