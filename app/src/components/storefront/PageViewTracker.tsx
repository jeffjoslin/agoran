'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/app/actions/pageview';

interface PageViewTrackerProps {
  productId: string;
}

export function PageViewTracker({ productId }: PageViewTrackerProps) {
  useEffect(() => {
    // Fire-and-forget — do not await
    void trackPageView(productId);
  }, [productId]);

  return null;
}
