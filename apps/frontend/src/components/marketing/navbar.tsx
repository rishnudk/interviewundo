import Image from 'next/image';
import Link from 'next/link';
import SparkleButton from '../ui/sparkle-button';
import SlideArrowButton from '../ui/slide-arrow-button';

export function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-fey-white text-lg font-bold tracking-[-0.053em]"
        >
          <Image
            src="/favicon.ico"
            alt="interviewUndo logo"
            width={24}
            height={24}
            className="w-6 h-6 rounded-md"
          />
          <span>interviewUndo</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <SlideArrowButton href="/login" text="Sign in" />
        <SparkleButton href="https://github.com/rishnudk/interviewundo" />
      </div>
    </nav>
  );
}
