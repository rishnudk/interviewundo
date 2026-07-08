'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StreakNotificationListener } from './StreakNotificationListener';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const showPermanentSidebar = pathname.startsWith('/problems');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background relative">
      <StreakNotificationListener />

      {/* Permanent Sidebar (visible on lg screens) */}
      {showPermanentSidebar && (
        <div className="hidden lg:block h-full relative z-20 shrink-0">
          <Sidebar className="h-full border-r border-border" />
        </div>
      )}

      {/* Floating absolute sidebar drawer overlay */}
      {isSidebarOpen && (
        <div
          className={`absolute inset-0 bg-[#0c0c0e]/30 backdrop-blur-sm z-50 transition-all duration-200 ${showPermanentSidebar ? 'lg:hidden' : ''}`}
        >
          <Sidebar
            className="absolute left-0 top-0 h-full w-64 shadow-2xl z-50 animate-in slide-in-from-left duration-200 border-r border-border"
            onClose={() => setIsSidebarOpen(false)}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
          {/* Backdrop click target */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Main App Frame (occupies full width) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Global Header */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 relative z-10">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
