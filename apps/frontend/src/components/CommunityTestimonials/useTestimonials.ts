'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Testimonial } from './types';

export function useTestimonials(users: User[], testimonials: Testimonial[], intervalTime = 5000) {
  // Filter approved testimonials
  const approvedTestimonials = testimonials.filter((t) => t.approved);

  // Map approved testimonials to their users (for fast lookup and slide data)
  const activeSlides = approvedTestimonials
    .map((testimonial) => {
      const user = users.find((u) => u.id === testimonial.userId);
      return {
        testimonial,
        user: user || {
          id: testimonial.userId,
          name: 'Unknown User',
          username: 'unknown',
          avatar: '',
          role: 'Developer',
        },
      };
    })
    .filter((slide) => !!slide.user);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < activeSlides.length) {
        setActiveIndex(index);
      }
    },
    [activeSlides.length],
  );

  const goToUserId = useCallback(
    (userId: string) => {
      const index = activeSlides.findIndex((slide) => slide.user.id === userId);
      if (index !== -1) {
        setActiveIndex(index);
      }
    },
    [activeSlides],
  );

  // Reset or start the rotation timer based on current play/pause state
  useEffect(() => {
    if (activeSlides.length === 0 || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, intervalTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [nextSlide, isPaused, intervalTime, activeSlides.length]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const activeSlide = activeSlides[activeIndex] || null;

  return {
    activeSlides,
    activeIndex,
    activeTestimonial: activeSlide?.testimonial || null,
    activeUser: activeSlide?.user || null,
    totalPages: activeSlides.length,
    nextSlide,
    prevSlide,
    goToIndex,
    goToUserId,
    pause,
    resume,
    isPaused,
  };
}
export type UseTestimonialsReturn = ReturnType<typeof useTestimonials>;
