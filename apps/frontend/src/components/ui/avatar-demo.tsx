'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
const AVATARS = [
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    alt: 'Developer 1',
    fallback: 'SW',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    alt: 'Developer 2',
    fallback: 'AM',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    alt: 'Developer 3',
    fallback: 'ER',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    alt: 'Developer 4',
    fallback: 'DK',
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
}

interface TrustedDevelopersBadgeProps {
  initialCount?: number | null;
  recentUsers?: Array<{ name: string; image: string | null }>;
}

function Component({ initialCount, recentUsers }: TrustedDevelopersBadgeProps = {}) {
  const [userCount, setUserCount] = React.useState<number | null>(initialCount ?? null);
  const [users, setUsers] = React.useState<Array<{ name: string; image: string | null }>>(() => {
    return recentUsers ?? [];
  });

  React.useEffect(() => {
    if (initialCount !== undefined && initialCount !== null && recentUsers !== undefined) return;

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/stats/public`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.userCount === 'number' && data.userCount > 0) {
          setUserCount(data.userCount);
        }
        if (Array.isArray(data.recentUsers)) {
          setUsers(data.recentUsers);
        }
      })
      .catch(() => {
        // Fallback silently if API is offline or unreachable
      });
  }, [initialCount, recentUsers]);

  const displayAvatars =
    users.length > 0
      ? users.map((user) => ({
          src: user.image || undefined,
          alt: user.name,
          fallback: getInitials(user.name),
        }))
      : AVATARS;

  return (
    <div className="flex items-center rounded-full border border-fey-mist/20 bg-[#131313]/80 backdrop-blur-md py-1.5 px-3 shadow-lg shadow-black/20">
      <div className="flex -space-x-2">
        {displayAvatars.map((avatar, i) => (
          <div key={i} className="relative group hover:z-30">
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#18181b] border border-fey-mist/20 text-fey-white text-[10px] font-medium rounded shadow-lg shadow-black/50 opacity-0 scale-95 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 ease-out whitespace-nowrap z-40">
              {avatar.alt}
            </div>

            {/* Avatar */}
            <Avatar className="h-6 w-6 ring-2 ring-[#131313] transition-transform duration-150 group-hover:scale-105">
              <AvatarImage src={avatar.src} alt={avatar.alt} />
              <AvatarFallback className="bg-fey-charcoal text-[9px] text-fey-white font-medium">
                {avatar.fallback}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 px-2.5">
        <Users className="w-3.5 h-3.5 text-[#ffa16c]" />
        <p className="text-xs text-fey-graphite">
          Trusted by{' '}
          <strong className="font-semibold text-fey-white">
            {userCount ? `${userCount.toLocaleString()}+` : '20+'}
          </strong>{' '}
          developers.
        </p>
      </div>
    </div>
  );
}

export { Component };
