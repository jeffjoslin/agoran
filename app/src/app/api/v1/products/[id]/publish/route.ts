import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth'
import { errors } from '@/lib/api/errors'
import { db } from '@/lib/db'
import { generateLandingPage } from '@/lib/llm/landing-page'
import { stripe } from '@/lib/stripe/client'

export const maxDuration = 30

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req)
  if (!auth) return errors.unauthorized()

  const { id } = await params

  const product = await db.product.findUnique({
    where: { id },
    include: { assets: true },
  })

  if (!product) return errors.notFound('Product')
  if (product.agentId !== auth.agentId) return errors.notFound('Product')

  if (product.status === 'LIVE') return errors.alreadyPublished()

  // Validate required fields
  if (!product.title || !product.description) {
    return errors.validation('Product must have title and description before publishing')
  }
  if (!product.priceCents || product.priceCents < 100) {
    return errors.validation('Product must have a valid price before publishing')
  }

  // Validate has MAIN asset (F-005, MISSING_ASSET)
  const mainAsset = product.assets.find((a) => a.assetType === 'MAIN')
  if (!mainAsset) return errors.missingAsset()

  // Step 1: Call LLM FIRST (F-008) — fail here means no Stripe/DB writes
  let landingPage
  try {
    landingPage = await generateLandingPage({
      title: product.title,
      description: product.description,
      sector: product.sector,
      targetAudience: product.targetAudience.length > 0 ? product.targetAudience.join(', ') : undefined,
    })
  } catch (err) {
    console.error('LLM generation failed:', err)
    return errors.llmFailed()
  }

  // Step 2: Create/get Stripe product (idempotent)
  let stripeProductId = product.stripeProductId
  let stripePriceId = product.stripePriceId

  try {
    if (!stripeProductId) {
      const stripeProduct = await stripe.products.create({
        name: product.title,
        description: product.description,
        metadata: { agoran_product_id: product.id },
      })
      stripeProductId = stripeProduct.id
    }

    if (!stripePriceId) {
      const stripePrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: product.priceCents,
        currency: 'usd',
      })
      stripePriceId = stripePrice.id
    }
  } catch (err) {
    console.error('Stripe error:', err)
    return errors.stripeError()
  }

  // Step 3: Update DB
  const publishedAt = new Date()
  const updated = await db.product.update({
    where: { id },
    data: {
      status: 'LIVE',
      stripeProductId,
      stripePriceId,
      publishedAt,
      heroHeadline: landingPage.heroHeadline,
      heroSubheadline: landingPage.heroSubheadline,
      bulletPoints: landingPage.bulletPoints,
      audienceStatement: landingPage.audienceStatement,
      metaTitle: landingPage.metaTitle,
      metaDescription: landingPage.metaDescription,
    },
  })

  return NextResponse.json({
    product_id: updated.id,
    status: updated.status,
    storefront_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${updated.slug}`,
    stripe_product_id: stripeProductId,
    stripe_price_id: stripePriceId,
    published_at: publishedAt.toISOString(),
  })
}
