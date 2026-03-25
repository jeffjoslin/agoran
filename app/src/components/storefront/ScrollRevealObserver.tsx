'use client';

import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all .scroll-reveal elements
 * and adds .is-visible when they enter the viewport.
 * Mount once in any layout that needs scroll animations.
 */
export function ScrollRevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.scroll-reveal');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
