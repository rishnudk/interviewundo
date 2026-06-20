'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show a premium, styled full-screen loading layout while validating session
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-pulse">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  // If no user and finished loading, show blank while router redirects in useEffect
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
