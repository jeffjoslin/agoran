export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { db } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/resend/emails'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text()
  const sig = request.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  // During development with placeholder secret, skip signature verification
  let event: Stripe.Event
  if (webhookSecret === 'whsec_placeholder_will_be_set_in_production') {
    try {
      event = JSON.parse(rawBody) as Stripe.Event
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  } else {
    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
      console.error('[stripe-webhook] Signature verification failed:', message)
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const stripeSessionId = session.id

  // Idempotency: skip if order already exists
  const existing = await db.order.findUnique({ where: { stripeSessionId } })
  if (existing) {
    console.log('[stripe-webhook] Order already exists for session:', stripeSessionId)
    return
  }

  const productId = session.metadata?.productId
  if (!productId) {
    console.error('[stripe-webhook] No productId in session metadata:', stripeSessionId)
    return
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, title: true, priceCents: true },
  })
  if (!product) {
    console.error('[stripe-webhook] Product not found:', productId)
    return
  }

  const buyerEmail = session.customer_details?.email ?? session.customer_email ?? ''
  const amountPaidCents = session.amount_total ?? product.priceCents
  const downloadToken = crypto.randomUUID()
  const downloadExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const order = await db.order.create({
    data: {
      productId: product.id,
      buyerEmail,
      stripeSessionId,
      amountPaidCents,
      downloadToken,
      downloadExpiresAt,
      status: 'COMPLETED',
    },
  })

  console.log('[stripe-webhook] Order created:', order.id, 'for', buyerEmail)

  // Check if this is buyer's first purchase (for WelcomeBuyer email)
  const previousOrders = await db.order.count({
    where: {
      buyerEmail,
      status: 'COMPLETED',
      id: { not: order.id },
    },
  })

  await sendOrderConfirmationEmail({
    to: buyerEmail,
    productTitle: product.title,
    amountPaidCents,
    downloadToken,
    isFirstPurchase: previousOrders === 0,
  })
}
