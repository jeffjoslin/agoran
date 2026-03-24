import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-5xl mb-4">↩️</div>
        <h1 className="text-3xl font-bold text-white mb-3">Checkout Cancelled</h1>
        <p className="text-gray-400 text-lg mb-8">
          No charge was made to your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
