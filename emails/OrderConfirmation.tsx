import * as React from 'react'

interface OrderConfirmationProps {
  productTitle: string
  amountFormatted: string
  downloadUrl: string
  isFirstPurchase: boolean
}

export function OrderConfirmation({
  productTitle,
  amountFormatted,
  downloadUrl,
  isFirstPurchase,
}: OrderConfirmationProps): React.ReactElement {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Header */}
          <tr>
            <td style={{ backgroundColor: '#4f46e5', padding: '32px 40px', textAlign: 'center' as const }}>
              <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 700 }}>
                Purchase Confirmed
              </h1>
              <p style={{ color: '#c7d2fe', margin: '8px 0 0', fontSize: '16px' }}>
                Thank you for your purchase!
              </p>
            </td>
          </tr>

          {/* Body */}
          <tr>
            <td style={{ padding: '40px' }}>
              {isFirstPurchase && (
                <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px', marginBottom: '24px', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ margin: 0, color: '#1d4ed8', fontWeight: 600 }}>Welcome to Agoran!</p>
                  <p style={{ margin: '4px 0 0', color: '#3b82f6', fontSize: '14px' }}>
                    We're thrilled to have you as a new customer.
                  </p>
                </div>
              )}

              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginTop: 0 }}>
                Order Summary
              </h2>

              <table width="100%" style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', margin: '16px 0', padding: '16px 0' }}>
                <tr>
                  <td style={{ color: '#6b7280', fontSize: '14px', paddingBottom: '8px' }}>Product</td>
                  <td style={{ textAlign: 'right' as const, color: '#111827', fontWeight: 500, fontSize: '14px', paddingBottom: '8px' }}>{productTitle}</td>
                </tr>
                <tr>
                  <td style={{ color: '#6b7280', fontSize: '14px' }}>Amount Paid</td>
                  <td style={{ textAlign: 'right' as const, color: '#111827', fontWeight: 700, fontSize: '14px' }}>{amountFormatted}</td>
                </tr>
              </table>

              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                Your Download Link
              </h2>
              <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6 }}>
                Click the button below to download your purchase. This link expires in <strong>24 hours</strong>.
              </p>

              <div style={{ textAlign: 'center' as const, margin: '32px 0' }}>
                <a
                  href={downloadUrl}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '14px 32px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  Download Now
                </a>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center' as const }}>
                Or copy this link: <a href={downloadUrl} style={{ color: '#4f46e5' }}>{downloadUrl}</a>
              </p>

              <div style={{ backgroundColor: '#fef3c7', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
                  ⚠️ <strong>Important:</strong> Your download link expires in 24 hours. If it expires, please contact us at <a href="mailto:admin@bizooku.com" style={{ color: '#92400e' }}>admin@bizooku.com</a>.
                </p>
              </div>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{ backgroundColor: '#f9fafb', padding: '24px 40px', textAlign: 'center' as const, borderTop: '1px solid #e5e7eb' }}>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
                © 2026 Agoran. All rights reserved.
              </p>
              <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: '13px' }}>
                Questions? Email us at <a href="mailto:admin@bizooku.com" style={{ color: '#6b7280' }}>admin@bizooku.com</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

export default OrderConfirmation
