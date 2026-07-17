'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuth } from '@/providers';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Code2,
  ArrowLeft,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  {
    label: 'Stats Overview',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Problem Database',
    href: '/admin/problems',
    icon: Code2,
    exact: false,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const renderNavLinks = (onItemClick?: () => void) => {
    return (
      <div className="flex flex-col h-full bg-card">
        {/* Brand Logo Header */}
        <div className="h-16 px-6 border-b border-border flex items-center gap-2.5 bg-rose-500/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/10">
            <ShieldCheck size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm leading-none bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              interviewUndo
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Admin Console
            </span>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <span className="px-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest block mb-3">
            Management
          </span>
          {adminNavItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                  isActive
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border-l-2 border-rose-500 rounded-l-none'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon
                    size={18}
                    className={cn(
                      'shrink-0',
                      isActive ? 'text-rose-500' : 'text-muted-foreground/80',
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-rose-500" />}
              </Link>
            );
          })}

          {/* Back to App Section */}
          <div className="pt-6 border-t border-border mt-6">
            <span className="px-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest block mb-3">
              Exit
            </span>
            <Link
              href="/dashboard"
              onClick={onItemClick}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 active:scale-[0.98]"
            >
              <ArrowLeft size={18} className="shrink-0 text-muted-foreground/80" />
              <span>Student Hub</span>
            </Link>
          </div>
        </nav>

        {/* User Profile Footer */}
        {user && (
          <div className="p-4 border-t border-border bg-rose-500/5 flex flex-col gap-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold uppercase ring-2 ring-background">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none mb-1 text-foreground">
                  {user.name}
                </p>
                <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold truncate leading-none">
                  System Admin
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onItemClick) onItemClick();
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 active:scale-95"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Admin Sidebar - Desktop Only */}
        <aside className="hidden md:flex w-64 shrink-0 z-30 border-r border-border bg-card/60 backdrop-blur-md flex-col h-full">
          {renderNavLinks()}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Admin Header */}
          <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 relative z-20">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden rounded-lg hover:bg-accent"
                    >
                      <Menu size={20} />
                    </Button>
                  }
                />
                <SheetContent side="left" className="p-0 w-64">
                  {renderNavLinks(() => {})}
                </SheetContent>
              </Sheet>

              {/* Mobile back link toggle */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex md:hidden p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} />
              </Link>
              <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-rose-500">Admin</span> Console
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                <ShieldCheck size={14} />
                <span>Admin Session</span>
              </div>
            </div>
          </header>

          {/* Content Scrollport */}
          <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 relative z-10">
            <div className="max-w-7xl mx-auto h-full">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
