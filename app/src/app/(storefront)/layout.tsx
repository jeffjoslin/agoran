'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AURORA_PAGE_BG,
  AURORA_NAVBAR,
  GLASS_CONTAINER,
  GRADIENT_TEXT,
} from '@/styles/design-tokens';
import { ScrollRevealObserver } from '@/components/storefront/ScrollRevealObserver';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={AURORA_PAGE_BG}>
      <nav
        className={`${AURORA_NAVBAR} ${
          scrolled
            ? 'backdrop-blur-2xl bg-black/50 border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className={`${GLASS_CONTAINER} flex items-center justify-between h-16`}>
          {/* Gradient logo */}
          <Link href="/" className="font-extrabold text-xl tracking-tight select-none">
            <span className={GRADIENT_TEXT}>Agoran</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="nav-link-animated text-white/60 hover:text-white text-sm font-medium transition-colors duration-150"
            >
              Browse
            </Link>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/8 border border-white/15 hover:bg-white/14 hover:border-violet-400/40 hover:shadow-[0_0_16px_rgba(124,58,237,0.3)] transition-all duration-200"
            >
              <span>Explore All</span>
              <span className="text-xs opacity-60">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content — add top padding to clear fixed navbar */}
      <div className="pt-16">
        {children}
      </div>

      {/* Scroll reveal observer — activates .scroll-reveal elements */}
      <ScrollRevealObserver />
    </div>
  );
}
