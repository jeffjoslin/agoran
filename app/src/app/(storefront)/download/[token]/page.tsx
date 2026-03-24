import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { getSignedDownloadUrl } from '@/lib/r2/client'
import {
  GLASS_ALERT_ERROR,
  GLASS_ALERT_WARNING,
  GLASS_BODY,
  GLASS_BODY_SMALL,
  GLASS_BUTTON_PRIMARY,
  GLASS_CARD,
  GLASS_CONTAINER,
  GLASS_HEADING_1,
  GLASS_HEADING_3,
  GLASS_SECTION,
} from '@/styles/design-tokens'

const MAX_DOWNLOADS = parseInt(process.env.DOWNLOAD_MAX_COUNT ?? '5', 10)

interface DownloadPageProps {
  params: Promise<{ token: string }>
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params

  const order = await db.order.findUnique({
    where: { downloadToken: token },
    select: {
      id: true,
      status: true,
      downloadExpiresAt: true,
      downloadCount: true,
      product: {
        select: {
          assets: {
            where: { assetType: 'MAIN' },
            select: { r2Key: true },
            take: 1,
          },
        },
      },
    },
  })

  if (!order || order.status !== 'COMPLETED') {
    notFound()
  }

  const now = new Date()

  if (order.downloadExpiresAt < now) {
    return <ExpiredPage />
  }

  if (order.downloadCount >= MAX_DOWNLOADS) {
    return <LimitReachedPage maxDownloads={MAX_DOWNLOADS} />
  }

  const asset = order.product.assets[0]
  if (!asset) {
    notFound()
  }

  // Increment download count before redirecting
  await db.order.update({
    where: { id: order.id },
    data: { downloadCount: { increment: 1 } },
  })

  // Generate R2 signed URL (15 min = 900 seconds)
  const signedUrl = await getSignedDownloadUrl(asset.r2Key, 900)

  // Redirect buyer directly to signed R2 URL
  redirect(signedUrl)
}

function ExpiredPage() {
  return (
    <main>
      <section className={GLASS_SECTION}>
        <div className={GLASS_CONTAINER}>
          <div className="max-w-lg mx-auto py-16">
            <div className={`${GLASS_CARD} p-10 text-center`}>
              <div className="text-5xl mb-6">⏰</div>
              <h1 className={`${GLASS_HEADING_1} mb-3`}>Link Expired</h1>
              <p className={`${GLASS_BODY} mb-6`}>
                Your download link has expired. Links are valid for 24 hours after purchase.
              </p>
              <div className={`${GLASS_ALERT_ERROR} p-4 mb-8 text-left`}>
                <h3 className={`${GLASS_HEADING_3} mb-2`}>Need a new link?</h3>
                <p className={GLASS_BODY_SMALL}>
                  Contact us at{' '}
                  <a
                    href="mailto:admin@bizooku.com"
                    className="underline text-inherit"
                  >
                    admin@bizooku.com
                  </a>{' '}
                  and we&apos;ll send you a fresh download link.
                </p>
              </div>
              <Link href="/" className={GLASS_BUTTON_PRIMARY}>
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function LimitReachedPage({ maxDownloads }: { maxDownloads: number }) {
  return (
    <main>
      <section className={GLASS_SECTION}>
        <div className={GLASS_CONTAINER}>
          <div className="max-w-lg mx-auto py-16">
            <div className={`${GLASS_CARD} p-10 text-center`}>
              <div className="text-5xl mb-6">🔒</div>
              <h1 className={`${GLASS_HEADING_1} mb-3`}>Download Limit Reached</h1>
              <p className={`${GLASS_BODY} mb-6`}>
                This link has reached the maximum of {maxDownloads} downloads.
              </p>
              <div className={`${GLASS_ALERT_WARNING} p-4 mb-8 text-left`}>
                <h3 className={`${GLASS_HEADING_3} mb-2`}>Need more downloads?</h3>
                <p className={GLASS_BODY_SMALL}>
                  Contact us at{' '}
                  <a
                    href="mailto:admin@bizooku.com"
                    className="underline text-inherit"
                  >
                    admin@bizooku.com
                  </a>{' '}
                  and we&apos;ll assist you.
                </p>
              </div>
              <Link href="/" className={GLASS_BUTTON_PRIMARY}>
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
