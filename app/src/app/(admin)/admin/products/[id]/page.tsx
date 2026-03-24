import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { formatCents } from '@/lib/utils';
import { ProductStatus } from '@/generated/prisma';
import {
  GLASS_HEADING_2,
  GLASS_HEADING_3,
  GLASS_CARD,
  GLASS_LABEL,
  GLASS_INPUT,
  GLASS_TEXTAREA,
  GLASS_SELECT,
  GLASS_BUTTON_PRIMARY,
  GLASS_BUTTON_SECONDARY,
  GLASS_BUTTON_DESTRUCTIVE,
  GLASS_BADGE_LIVE,
  GLASS_BADGE_DRAFT,
  GLASS_BADGE_ARCHIVED,
  GLASS_STAT_CARD,
  GLASS_STAT_VALUE,
  GLASS_STAT_LABEL,
  GLASS_BODY_SMALL,
  GLASS_CAPTION,
  GLASS_ALERT_SUCCESS,
} from '@/styles/design-tokens';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function updateProduct(id: string, formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priceCents = Math.round(parseFloat(formData.get('price') as string) * 100);
  const sector = formData.get('sector') as string;
  const tagsRaw = formData.get('tags') as string;
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const status = formData.get('status') as ProductStatus;

  await db.product.update({
    where: { id },
    data: {
      title,
      description,
      priceCents,
      sector,
      tags,
      status,
      publishedAt: status === 'LIVE' ? new Date() : undefined,
    },
  });
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/admin/products');
}

async function archiveProduct(id: string) {
  'use server';
  await db.product.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  });
  redirect('/admin/products');
}

export default async function AdminProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      assets: true,
      orders: {
        where: { status: 'COMPLETED' },
        select: { amountPaidCents: true, createdAt: true, buyerEmail: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      pageViews: { select: { id: true } },
    },
  });

  if (!product) notFound();

  const totalRevenue = product.orders.reduce((s, o) => s + o.amountPaidCents, 0);
  const updateWithId = updateProduct.bind(null, id);
  const archiveWithId = archiveProduct.bind(null, id);

  function statusBadge(status: string) {
    if (status === 'LIVE') return <span className={GLASS_BADGE_LIVE}>LIVE</span>;
    if (status === 'DRAFT') return <span className={GLASS_BADGE_DRAFT}>DRAFT</span>;
    return <span className={GLASS_BADGE_ARCHIVED}>{status}</span>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Link
        href="/admin/products"
        className={`${GLASS_BUTTON_SECONDARY} inline-flex items-center gap-2 px-3 py-1.5 text-sm`}
      >
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      <div className="flex items-center gap-3">
        <h1 className={GLASS_HEADING_2}>{product.title}</h1>
        {statusBadge(product.status)}
      </div>

      {sp.saved && (
        <p className={GLASS_ALERT_SUCCESS}>Changes saved successfully.</p>
      )}

      {/* Analytics summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Total Revenue</p>
          <p className={GLASS_STAT_VALUE}>{formatCents(totalRevenue)}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Sales</p>
          <p className={GLASS_STAT_VALUE}>{product.orders.length}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Page Views</p>
          <p className={GLASS_STAT_VALUE}>{product.pageViews.length}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className={`${GLASS_CARD} p-6`}>
        <h2 className={`${GLASS_HEADING_3} mb-5`}>Edit Product</h2>
        <form action={updateWithId} className="space-y-4">
          <div>
            <label className={GLASS_LABEL}>Title</label>
            <input name="title" defaultValue={product.title} required className={GLASS_INPUT} />
          </div>
          <div>
            <label className={GLASS_LABEL}>Description</label>
            <textarea
              name="description"
              defaultValue={product.description}
              rows={4}
              required
              className={GLASS_TEXTAREA}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={GLASS_LABEL}>Price (USD)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={(product.priceCents / 100).toFixed(2)}
                required
                className={GLASS_INPUT}
              />
            </div>
            <div>
              <label className={GLASS_LABEL}>Status</label>
              <select name="status" defaultValue={product.status} className={GLASS_SELECT}>
                <option value="DRAFT">Draft</option>
                <option value="LIVE">Live</option>
                <option value="UNPUBLISHED">Unpublished</option>
              </select>
            </div>
          </div>
          <div>
            <label className={GLASS_LABEL}>Sector</label>
            <input name="sector" defaultValue={product.sector} required className={GLASS_INPUT} />
          </div>
          <div>
            <label className={GLASS_LABEL}>Tags (comma-separated)</label>
            <input
              name="tags"
              defaultValue={product.tags.join(', ')}
              className={GLASS_INPUT}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <button type="submit" className={GLASS_BUTTON_PRIMARY}>
            Save Changes
          </button>
        </form>
      </div>

      {/* Generated content */}
      {(product.heroHeadline || product.bulletPoints.length > 0) && (
        <div className={`${GLASS_CARD} p-6`}>
          <h2 className={`${GLASS_HEADING_3} mb-4`}>Generated Landing Page Content</h2>
          {product.heroHeadline && (
            <div className="mb-3">
              <p className={GLASS_LABEL}>Headline</p>
              <p className="text-white/80">{product.heroHeadline}</p>
            </div>
          )}
          {product.heroSubheadline && (
            <div className="mb-3">
              <p className={GLASS_LABEL}>Subheadline</p>
              <p className="text-white/80">{product.heroSubheadline}</p>
            </div>
          )}
          {product.bulletPoints.length > 0 && (
            <div className="mb-3">
              <p className={GLASS_LABEL}>Bullet Points</p>
              <ul className="list-disc list-inside space-y-1">
                {product.bulletPoints.map((bp, i) => (
                  <li key={i} className={GLASS_BODY_SMALL}>{bp}</li>
                ))}
              </ul>
            </div>
          )}
          {product.audienceStatement && (
            <div>
              <p className={GLASS_LABEL}>Audience Statement</p>
              <p className="text-white/80">{product.audienceStatement}</p>
            </div>
          )}
        </div>
      )}

      {/* Assets */}
      {product.assets.length > 0 && (
        <div className={`${GLASS_CARD} p-6`}>
          <h2 className={`${GLASS_HEADING_3} mb-4`}>Assets ({product.assets.length})</h2>
          <div className="space-y-2">
            {product.assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
                <div>
                  <p className="text-white/80 text-sm">{asset.filename}</p>
                  <p className={GLASS_CAPTION}>
                    {asset.assetType} · {(asset.sizeBytes / 1024).toFixed(1)} KB · {asset.mimeType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {product.orders.length > 0 && (
        <div className={`${GLASS_CARD} p-6`}>
          <h2 className={`${GLASS_HEADING_3} mb-4`}>Recent Sales</h2>
          <div className="space-y-2">
            {product.orders.map((order, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
                <div>
                  <p className="text-white/80 text-sm">{order.buyerEmail}</p>
                  <p className={GLASS_CAPTION}>{order.createdAt.toLocaleString()}</p>
                </div>
                <p className="text-white font-medium">{formatCents(order.amountPaidCents)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className={`${GLASS_CARD} p-6 border-red-500/20`}>
        <h2 className={`${GLASS_HEADING_3} mb-2 text-red-400`}>Danger Zone</h2>
        <p className={`${GLASS_BODY_SMALL} mb-4`}>
          Archiving removes this product from the storefront permanently. This cannot be undone easily.
        </p>
        <form action={archiveWithId}>
          <button type="submit" className={GLASS_BUTTON_DESTRUCTIVE}>
            Archive Product
          </button>
        </form>
      </div>
    </div>
  );
}
