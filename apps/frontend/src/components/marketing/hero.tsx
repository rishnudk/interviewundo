import Link from 'next/link';
import LightRays from '@/components/ui/LightRays';

export function Hero() {
  return (
    <section className="relative flex flex-col items-center text-center pt-24 pb-20 px-6 max-w-[1200px] mx-auto w-full">
      <div className="absolute inset-0 top-[-100px] pointer-events-none z-0 w-full flex justify-center overflow-hidden">
        <div className="w-[800px] h-[600px] relative">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffa16c"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>
      </div>

      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fey-charcoal border border-fey-mist/10 mb-8 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <span className="text-fey-mist text-xs font-medium">
          🚀 Full-Stack Interview Preparation Platform
        </span>
      </div>

      <h1 className="relative z-10 text-5xl md:text-[54px] font-bold text-fey-white leading-[1.1] tracking-[-0.08em] max-w-3xl mb-6">
        Ace <span className="text-[#ffa16c]">JavaScript</span> &<br />
        Full-Stack Interviews.
      </h1>

      <p className="relative z-10 text-fey-graphite text-lg max-w-2xl mb-10 leading-relaxed">
        Practice real interview questions, solve coding challenges in an integrated editor, execute
        solutions securely inside isolated environments, and track your progress through a beautiful
        analytics dashboard.
      </p>

      <div className="relative z-10 flex items-center gap-4">
        <Link
          href="/register"
          className="text-fey-white text-sm font-medium px-6 py-3 rounded-full border border-fey-mist/20 bg-[#131313] hover:bg-[#191919] transition-colors shadow-[0_0_14px_rgba(255,255,255,0.25)]"
        >
          Get Started
        </Link>
        <Link
          href="https://github.com"
          className="text-fey-white text-sm font-medium px-6 py-3 rounded-full border border-fey-mist/20 hover:bg-fey-charcoal transition-colors"
        >
          View Source
        </Link>
      </div>
    </section>
  );
}
