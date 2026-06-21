'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StreakNotificationListener } from './StreakNotificationListener';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <StreakNotificationListener />

      {/* Sidebar - Desktop Only */}
      <Sidebar className="hidden md:flex shrink-0 z-30" />

      {/* Main App Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Global Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 relative z-10">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
