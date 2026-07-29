'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import { User, Testimonial } from './types';
import { AvatarImage } from './AvatarStrip';

interface TestimonialCardProps {
  testimonial: Testimonial;
  user: User;
  activeIndex: number;
  totalPages: number;
  onSelectPage: (index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const slideVariants: Variants = {
  enter: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

export default function TestimonialCard({
  testimonial,
  user,
  activeIndex,
  totalPages,
  onSelectPage,
  onMouseEnter,
  onMouseLeave,
}: TestimonialCardProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full max-w-[480px] min-h-[220px] flex flex-col justify-between p-7 bg-transparent border border-dashed border-zinc-800 relative transition-all duration-300 hover:border-[#22C55E]/30"
    >
      {/* Terminal Wireframe Corner Plus Marks */}
      <span className="absolute -top-2.5 -left-1.5 text-zinc-700 font-mono text-sm pointer-events-none select-none">
        +
      </span>
      <span className="absolute -top-2.5 -right-1.5 text-zinc-700 font-mono text-sm pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -left-1.5 text-zinc-700 font-mono text-sm pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -right-1.5 text-zinc-700 font-mono text-sm pointer-events-none select-none">
        +
      </span>

      {/* Main animated testimonial block */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={testimonial.id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-between"
          >
            {/* Top Row: Author details & Stars */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/5 shrink-0 bg-zinc-900">
                  <AvatarImage src={user.avatar} alt={user.name} name={user.name} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight leading-none">
                    {user.name}
                  </h4>
                  <p className="text-zinc-500 text-xs font-mono mt-1">𝕏 @{user.username}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mt-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${
                      i < testimonial.rating
                        ? 'fill-[#22C55E] text-[#22C55E] filter drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]'
                        : 'text-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-zinc-300 text-sm leading-relaxed mb-6">
              &ldquo;{testimonial.message}&rdquo;
            </blockquote>

            {/* Role & Company Metadata footer */}
            <div className="text-[11px] text-zinc-500 font-mono mt-auto pt-2 border-t border-dashed border-zinc-900 flex items-center gap-1.5">
              <span>{user.role}</span>
              {user.company && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>{user.company}</span>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPage(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 outline-none ${
              idx === activeIndex
                ? 'bg-[#22C55E] w-3.5 shadow-[0_0_6px_rgba(34,197,94,0.5)]'
                : 'bg-zinc-800 hover:bg-zinc-600 w-1.5 cursor-pointer'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
