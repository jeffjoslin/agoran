import * as React from 'react'

interface WelcomeBuyerProps {
  buyerEmail?: string
}

export function WelcomeBuyer({ buyerEmail }: WelcomeBuyerProps): React.ReactElement {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <tr>
            <td style={{ backgroundColor: '#4f46e5', padding: '32px 40px', textAlign: 'center' as const }}>
              <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 700 }}>
                Welcome to Agoran!
              </h1>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '40px' }}>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
                Hi{buyerEmail ? ` ${buyerEmail}` : ''},
              </p>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
                Thank you for your first purchase on Agoran — the agent-native digital product marketplace. We&apos;re thrilled to have you as a customer.
              </p>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
                Explore more high-quality digital products built for your business at <a href="https://agoran.ai" style={{ color: '#4f46e5' }}>agoran.ai</a>.
              </p>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
                Questions or feedback? We&apos;d love to hear from you at <a href="mailto:admin@bizooku.com" style={{ color: '#4f46e5' }}>admin@bizooku.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ backgroundColor: '#f9fafb', padding: '24px 40px', textAlign: 'center' as const, borderTop: '1px solid #e5e7eb' }}>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
                © 2026 Agoran. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

export default WelcomeBuyer
