'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { CommunityTestimonialsProps } from './types';
import { useTestimonials } from './useTestimonials';
import AvatarStrip from './AvatarStrip';
import TestimonialCard from './TestimonialCard';

export default function CommunityTestimonials({
  users = [],
  testimonials = [],
}: CommunityTestimonialsProps) {
  const {
    activeSlides,
    activeIndex,
    activeTestimonial,
    activeUser,
    totalPages,
    goToIndex,
    goToUserId,
    pause,
    resume,
  } = useTestimonials(users, testimonials);

  // Set of user IDs who have approved testimonials for fast lookup
  const usersWithTestimonials = React.useMemo(() => {
    return new Set(activeSlides.map((slide) => slide.user.id));
  }, [activeSlides]);

  const [userCount, setUserCount] = React.useState<number>(1284);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/stats/public`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.userCount === 'number' && data.userCount > 0) {
          setUserCount(data.userCount);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col justify-between items-center py-12 px-6 lg:px-8 relative overflow-hidden rounded-[24px] bg-[#09090B] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
      {/* Background System */}
      {/* 1. Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.07),transparent_75%)] pointer-events-none" />
      {/* 2. Sleek Grid Texture with Radial Masking */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Small Green Badge */}
        <span className="text-[10px] tracking-[0.25em] font-black text-[#22C55E] uppercase mb-3">
          Testimonials
        </span>

        {/* Large Heading */}
        <h2 className="text-3.5xl lg:text-4xl font-black tracking-tight text-white leading-none">
          What builders are saying
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-500 text-xs md:text-sm mt-3.5 leading-relaxed">
          Real feedback from Real{' '}
          <span className="font-mono text-[#22C55E] font-semibold">&lt;Developers /&gt;</span> on
          InterviewUndo
        </p>
      </div>

      {/* AVATAR STRIP SECTION */}
      <div className="w-full relative z-10 my-8 flex flex-col items-center">
        {/* Count Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-zinc-400 text-[11px] font-medium font-mono mb-2 shadow-inner">
          <Users size={12} className="text-[#22C55E]" />
          <span>{userCount.toLocaleString()} Developers Joined</span>
        </div>

        {/* Avatar Strip */}
        <AvatarStrip
          users={users}
          activeUserId={activeUser?.id || null}
          usersWithTestimonials={usersWithTestimonials}
          onSelectUser={goToUserId}
        />
      </div>

      {/* TESTIMONIAL CARD SECTION */}
      <div className="w-full relative z-10 flex justify-center">
        {activeTestimonial && activeUser && (
          <TestimonialCard
            testimonial={activeTestimonial}
            user={activeUser}
            activeIndex={activeIndex}
            totalPages={totalPages}
            onSelectPage={goToIndex}
            onMouseEnter={pause}
            onMouseLeave={resume}
          />
        )}
      </div>
    </div>
  );
}
