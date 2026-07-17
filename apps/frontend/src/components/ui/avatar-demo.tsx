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

function Component() {
  return (
    <div className="flex items-center rounded-full border border-fey-mist/20 bg-[#131313]/80 backdrop-blur-md py-1.5 px-3 shadow-lg shadow-black/20">
      <div className="flex -space-x-2">
        {AVATARS.map((avatar, i) => (
          <Avatar key={i} className="h-6 w-6 ring-2 ring-[#131313]">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback className="bg-fey-charcoal text-[9px] text-fey-white font-medium">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-1.5 px-2.5">
        <Users className="w-3.5 h-3.5 text-[#ffa16c]" />
        <p className="text-xs text-fey-graphite">
          Trusted by <strong className="font-semibold text-fey-white">20+</strong> developers.
        </p>
      </div>
    </div>
  );
}

export { Component };
