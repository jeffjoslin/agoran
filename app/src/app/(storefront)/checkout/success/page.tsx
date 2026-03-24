import { Suspense } from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

async function SuccessContent({ sessionId }: { sessionId: string | undefined }) {
  if (!sessionId) {
    return (
      <div className="text-center">
        <p className="text-red-400">Invalid session. Please contact support.</p>
        <Link href="/products" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
          Browse products →
        </Link>
      </div>
    )
  }

  const order = await db.order.findUnique({
    where: { stripeSessionId: sessionId },
    select: { id: true, buyerEmail: true, status: true },
  })

  if (!order || order.status !== 'COMPLETED') {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-2">Processing your order...</h1>
        <p className="text-gray-400 mb-6">
          Your payment is being processed. Please check your email shortly for your download link.
        </p>
        <Link href="/products" className="text-indigo-400 hover:text-indigo-300">
          Continue browsing →
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-3xl font-bold text-white mb-3">Purchase Confirmed!</h1>
      <p className="text-gray-300 text-lg mb-2">
        Thank you for your purchase.
      </p>
      <p className="text-gray-400 mb-8">
        Check your email at <strong className="text-white">{order.buyerEmail}</strong> for your download link.
      </p>
      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 mb-8">
        <p className="text-indigo-300 text-sm">
          Your download link will expire in 24 hours. If you need assistance, email{' '}
          <a href="mailto:admin@bizooku.com" className="underline">admin@bizooku.com</a>.
        </p>
      </div>
      <Link
        href="/products"
        className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Browse more products
      </Link>
    </div>
  )
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
          <SuccessContent sessionId={sessionId} />
        </Suspense>
      </div>
    </div>
  )
}
