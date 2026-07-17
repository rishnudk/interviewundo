'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Code2,
  History,
  User,
  Shield,
  LogOut,
  Terminal,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
  onClose?: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Problems',
    href: '/problems',
    icon: Code2,
  },
  {
    label: 'Submissions',
    href: '/submissions',
    icon: History,
  },
  {
    label: 'Request Challenge',
    href: '/requests',
    icon: Sparkles,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function Sidebar({ className, onLinkClick, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside
      className={cn(
        'w-64 border-r border-border bg-card/60 backdrop-blur-md flex flex-col h-full',
        className,
      )}
    >
      {/* Brand Logo Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
            <Terminal size={18} className="animate-pulse" />
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            interviewUndo
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 active:scale-95 transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/10'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <item.icon
                size={18}
                className={cn('shrink-0', isActive ? 'text-current' : 'text-muted-foreground/80')}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Conditionally Display Admin Section */}
        {isAdmin && (
          <div className="pt-6 border-t border-border mt-6">
            <span className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider block mb-3">
              Admin Area
            </span>
            <Link
              href="/admin"
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                pathname.startsWith('/admin')
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/10'
                  : 'text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400',
              )}
            >
              <Shield size={18} className="shrink-0" />
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Footer / User Profile section */}
      {user && (
        <div className="p-4 border-t border-border bg-muted/20 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold uppercase ring-2 ring-background">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-none mb-1">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate leading-none">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 active:scale-95"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
