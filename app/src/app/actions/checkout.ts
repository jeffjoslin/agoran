'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe/client'
import { db } from '@/lib/db'

export async function createCheckoutSession(productId: string): Promise<never> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { stripePriceId: true, slug: true, status: true },
  })

  if (!product || product.status !== 'LIVE' || !product.stripePriceId) {
    redirect('/products')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
    customer_creation: 'always',
    payment_intent_data: {
      metadata: {
        productId,
        productSlug: product.slug,
      },
    },
    metadata: {
      productId,
      productSlug: product.slug,
    },
  })

  redirect(session.url!)
}
