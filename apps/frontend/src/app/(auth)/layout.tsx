import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-8">
      {/* Premium dark glow atmospheric backdrops */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[32rem] h-[32rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-[32rem] h-[32rem] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Form Container Card */}
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
