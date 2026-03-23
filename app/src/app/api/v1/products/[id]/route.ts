import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth'
import { errors } from '@/lib/api/errors'
import { db } from '@/lib/db'

export async function GET(
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

  return NextResponse.json({ product })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(req)
  if (!auth) return errors.unauthorized()

  const { id } = await params

  const product = await db.product.findUnique({ where: { id } })
  if (!product) return errors.notFound('Product')

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const updates = body as Record<string, unknown>

  // Cannot change sector or productType if LIVE
  if (product.status === 'LIVE') {
    if ('sector' in updates) return errors.validation('Cannot change sector of a live product')
    if ('product_type' in updates) return errors.validation('Cannot change product_type of a live product')
  }

  const data: Record<string, unknown> = {}

  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || updates.title.length < 10 || updates.title.length > 200) {
      return errors.validation('title must be between 10 and 200 characters')
    }
    data.title = updates.title
  }
  if (updates.description !== undefined) data.description = updates.description
  if (updates.price_cents !== undefined) {
    if (typeof updates.price_cents !== 'number' || updates.price_cents < 100) {
      return errors.validation('price_cents must be at least 100')
    }
    data.priceCents = updates.price_cents
  }
  if (updates.target_audience !== undefined) {
    // targetAudience is String[] in schema
    if (Array.isArray(updates.target_audience)) {
      data.targetAudience = updates.target_audience
    } else if (typeof updates.target_audience === 'string') {
      data.targetAudience = [updates.target_audience]
    }
  }

  if (product.status !== 'LIVE') {
    if (updates.sector !== undefined) data.sector = updates.sector
    if (updates.product_type !== undefined) data.productType = updates.product_type
  }

  const updated = await db.product.update({
    where: { id },
    data,
  })

  return NextResponse.json({ product: updated })
}
