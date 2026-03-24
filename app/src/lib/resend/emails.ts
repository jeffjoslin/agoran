import { Resend } from 'resend'
import { OrderConfirmation } from '@/emails/OrderConfirmation'
import { createElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@agoran.ai'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://agoran.ai'

interface SendOrderConfirmationEmailParams {
  to: string
  productTitle: string
  amountPaidCents: number
  downloadToken: string
  isFirstPurchase: boolean
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams): Promise<void> {
  const { to, productTitle, amountPaidCents, downloadToken, isFirstPurchase } = params
  const downloadUrl = `${APP_URL}/download/${downloadToken}`
  const amountFormatted = `$${(amountPaidCents / 100).toFixed(2)}`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your purchase: ${productTitle}`,
      react: createElement(OrderConfirmation, {
        productTitle,
        amountFormatted,
        downloadUrl,
        isFirstPurchase,
      }),
    })
    console.log('[resend] Confirmation email sent to:', to)
  } catch (err) {
    // Log but don't throw — order is already created
    console.error('[resend] Failed to send confirmation email:', err)
  }
}
