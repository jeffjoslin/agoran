import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth'
import { errors } from '@/lib/api/errors'
import { db } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/api/slug'
import { ProductType } from '@/generated/prisma'

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req)
  if (!auth) return errors.unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const { title, price_cents, sector, product_type, description } = body as Record<string, unknown>

  if (typeof title !== 'string' || title.length < 10 || title.length > 200) {
    return errors.validation('title must be between 10 and 200 characters')
  }
  if (typeof price_cents !== 'number' || price_cents < 100) {
    return errors.validation('price_cents must be at least 100')
  }
  if (!sector || typeof sector !== 'string') return errors.validation('sector is required')
  if (!product_type || typeof product_type !== 'string') return errors.validation('product_type is required')
  if (!description || typeof description !== 'string') return errors.validation('description is required')

  // Validate product_type is a valid enum value
  const validProductTypes = Object.values(ProductType) as string[]
  if (!validProductTypes.includes(product_type)) {
    return errors.validation(`product_type must be one of: ${validProductTypes.join(', ')}`)
  }

  const slug = await generateUniqueSlug(title)

  try {
    const product = await db.product.create({
      data: {
        agentId: auth.agentId,
        title,
        slug,
        description,
        priceCents: price_cents as number,
        sector,
        productType: product_type as ProductType,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ product_id: product.id, slug, status: product.status }, { status: 201 })
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    if (error?.code === 'P2002') {
      return errors.validation('A product with this slug already exists')
    }
    console.error('Product create error:', error?.message)
    return errors.validation('Failed to create product')
  }
}

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req)
  if (!auth) return errors.unauthorized()

  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector')
  const status = searchParams.get('status')
  const agent_id = searchParams.get('agent_id')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const products = await db.product.findMany({
    where: {
      ...(sector && { sector }),
      ...(status && { status: status as 'DRAFT' | 'LIVE' | 'UNPUBLISHED' | 'ARCHIVED' }),
      ...(agent_id && { agentId: agent_id }),
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products, limit, offset, count: products.length })
}
