'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from './types';

export function AvatarImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  const fallbackSvg = React.useMemo(() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#18181b"/><text x="50" y="55" font-family="sans-serif" font-weight="bold" font-size="36" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle">${name.charAt(0).toUpperCase()}</text></svg>`;
    const base64 =
      typeof window !== 'undefined'
        ? window.btoa(svgString)
        : Buffer.from(svgString).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }, [name]);

  const [imgSrc, setImgSrc] = useState(src || fallbackSvg);

  useEffect(() => {
    setImgSrc(src || fallbackSvg);
  }, [src, fallbackSvg]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="44px"
      className="object-cover"
      onError={() => {
        setImgSrc(fallbackSvg);
      }}
    />
  );
}

interface AvatarStripProps {
  users: User[];
  activeUserId: string | null;
  usersWithTestimonials: Set<string>;
  onSelectUser: (userId: string) => void;
}

export default function AvatarStrip({
  users,
  activeUserId,
  usersWithTestimonials,
  onSelectUser,
}: AvatarStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Auto-scroll the active avatar to the center of the viewport
  useEffect(() => {
    if (activeUserId && avatarRefs.current[activeUserId]) {
      const avatarEl = avatarRefs.current[activeUserId];
      const containerEl = containerRef.current;

      if (avatarEl && containerEl) {
        const containerWidth = containerEl.clientWidth;
        const avatarLeft = avatarEl.offsetLeft;
        const avatarWidth = avatarEl.clientWidth;

        // Calculate target scroll position to center the avatar
        const targetScrollLeft = avatarLeft - containerWidth / 2 + avatarWidth / 2;

        containerEl.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeUserId]);

  return (
    <div className="w-full relative px-2">
      {/* Subtle fade masks on the left and right edges for horizontal scrolling */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#09090B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#09090B] to-transparent z-10 pointer-events-none" />

      {/* Horizontally scrollable container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto flex items-center py-6 px-8 scrollbar-none [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        <div className="flex -space-x-2.5 mx-auto">
          {users.map((user) => {
            const isActive = user.id === activeUserId;
            const hasTestimonial = usersWithTestimonials.has(user.id);

            return (
              <motion.button
                key={user.id}
                ref={(el) => {
                  avatarRefs.current[user.id] = el;
                }}
                onClick={() => hasTestimonial && onSelectUser(user.id)}
                disabled={!hasTestimonial}
                whileHover={{
                  y: -6,
                  scale: isActive ? 1.25 : 1.15,
                  zIndex: 30,
                  transition: { type: 'spring', stiffness: 400, damping: 18 },
                }}
                animate={{
                  scale: isActive ? 1.2 : 1.0,
                  zIndex: isActive ? 20 : 10,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className={`relative w-11 h-11 rounded-full shrink-0 outline-none transition-all duration-300 ${
                  hasTestimonial ? 'cursor-pointer' : 'cursor-default'
                }`}
                aria-label={`View testimonial from ${user.name}`}
              >
                {/* Avatar Image */}
                <div
                  className={`w-full h-full rounded-full overflow-hidden border border-white/10 transition-all duration-300 ${
                    isActive
                      ? 'grayscale-0 opacity-100 ring-2 ring-white ring-offset-2 ring-offset-[#09090B] shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                      : 'grayscale opacity-75 hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  <AvatarImage src={user.avatar} alt={user.name} name={user.name} />
                </div>

                {/* Micro-interaction badge indicating they have an active review */}
                {hasTestimonial && !isActive && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#09090B] shadow-[0_0_4px_rgba(34,197,94,0.4)]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
