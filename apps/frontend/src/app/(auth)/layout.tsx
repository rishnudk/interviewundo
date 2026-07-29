import React from 'react';
import CommunityTestimonials from '@/components/CommunityTestimonials/CommunityTestimonials';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[#09090B] text-[#ffffff] relative overflow-hidden font-sans">
      {/* Left Side: Auth Form (centered) */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative z-10 w-full min-h-screen lg:w-1/2">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Right Side: Community Testimonials (hidden on mobile, sticky on desktop) */}
      <div className="hidden lg:block lg:w-[48%] xl:w-[45%] h-screen sticky top-0 p-6 self-start">
        <CommunityTestimonials />
      </div>
    </div>
  );
}
