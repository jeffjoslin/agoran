import Stripe from 'stripe'

// Allow test keys in production during initial launch — swap for live keys before go-live
if (process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') && process.env.ALLOW_STRIPE_TEST_IN_PROD !== 'true') {
  console.warn('Warning: Using Stripe test key in production mode')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})
