'use server';

import { db } from '@/lib/db';

export async function trackPageView(productId: string): Promise<void> {
  try {
    await db.pageView.create({
      data: { productId },
    });
  } catch {
    // Non-blocking — swallow errors so tracking never breaks page load
  }
}
