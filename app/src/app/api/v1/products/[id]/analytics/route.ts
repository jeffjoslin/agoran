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
  })

  if (!product) return errors.notFound('Product')
  if (product.agentId !== auth.agentId) return errors.notFound('Product')

  // Query analytics from PageView and Order models
  const [views, orders] = await Promise.all([
    db.pageView.count({ where: { productId: id } }),
    db.order.findMany({
      where: { productId: id, status: 'COMPLETED' },
      select: { amountPaidCents: true },
    }),
  ])

  const revenue_cents = orders.reduce((sum, o) => sum + o.amountPaidCents, 0)
  const conversion_rate = views > 0 ? orders.length / views : 0

  return NextResponse.json({
    product_id: id,
    views,
    purchases: orders.length,
    revenue_cents,
    conversion_rate,
  })
}
