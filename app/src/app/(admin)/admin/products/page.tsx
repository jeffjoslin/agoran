import Link from 'next/link';
import { db } from '@/lib/db';
import { formatCents } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { ProductStatus } from '@/generated/prisma';
import {
  GLASS_HEADING_2,
  GLASS_TABLE,
  GLASS_TABLE_HEADER,
  GLASS_TABLE_ROW,
  GLASS_TABLE_CELL,
  GLASS_BADGE_LIVE,
  GLASS_BADGE_DRAFT,
  GLASS_BADGE_ARCHIVED,
  GLASS_BUTTON_PRIMARY,
  GLASS_BUTTON_SECONDARY,
  GLASS_BUTTON_DESTRUCTIVE,
  GLASS_CAPTION,
  GLASS_BODY_SMALL,
} from '@/styles/design-tokens';
import { ChevronUp, ChevronDown, ChevronsUpDown, Edit } from 'lucide-react';

type SortKey = 'title' | 'sector' | 'status' | 'priceCents' | 'views' | 'purchases' | 'revenue';
type SortDir = 'asc' | 'desc';

function statusBadge(status: string) {
  if (status === 'LIVE') return <span className={GLASS_BADGE_LIVE}>LIVE</span>;
  if (status === 'DRAFT') return <span className={GLASS_BADGE_DRAFT}>DRAFT</span>;
  return <span className={GLASS_BADGE_ARCHIVED}>{status}</span>;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="opacity-30" />;
  return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}

async function toggleStatus(id: string, current: ProductStatus) {
  'use server';
  const next: ProductStatus = current === 'LIVE' ? 'UNPUBLISHED' : 'LIVE';
  await db.product.update({
    where: { id },
    data: {
      status: next,
      publishedAt: next === 'LIVE' ? new Date() : undefined,
    },
  });
  revalidatePath('/admin/products');
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  const params = await searchParams;
  const sortKey = (params.sort as SortKey) ?? 'title';
  const sortDir = (params.dir as SortDir) ?? 'asc';

  // Fetch all products with analytics aggregates
  const products = await db.product.findMany({
    include: {
      orders: {
        where: { status: 'COMPLETED' },
        select: { amountPaidCents: true },
      },
      pageViews: { select: { id: true } },
    },
  });

  // Compute derived fields
  const rows = products.map((p) => ({
    id: p.id,
    title: p.title,
    sector: p.sector,
    status: p.status,
    priceCents: p.priceCents,
    views: p.pageViews.length,
    purchases: p.orders.length,
    revenue: p.orders.reduce((s, o) => s + o.amountPaidCents, 0),
  }));

  // Sort
  rows.sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    const an = av as number;
    const bn = bv as number;
    return sortDir === 'asc' ? an - bn : bn - an;
  });

  function sortHref(col: SortKey) {
    const nextDir = col === sortKey && sortDir === 'asc' ? 'desc' : 'asc';
    return `/admin/products?sort=${col}&dir=${nextDir}`;
  }

  const COLS: { key: SortKey; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'sector', label: 'Sector' },
    { key: 'status', label: 'Status' },
    { key: 'priceCents', label: 'Price' },
    { key: 'views', label: 'Views' },
    { key: 'purchases', label: 'Sales' },
    { key: 'revenue', label: 'Revenue' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={GLASS_HEADING_2}>Products</h1>
        <p className={GLASS_BODY_SMALL}>{rows.length} total</p>
      </div>

      <div className={GLASS_TABLE}>
        <table className="w-full">
          <thead>
            <tr className={GLASS_TABLE_HEADER}>
              {COLS.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-left">
                  <Link
                    href={sortHref(key)}
                    className="flex items-center gap-1 hover:text-white/80 transition-colors"
                  >
                    {label}
                    <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                  </Link>
                </th>
              ))}
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className={`${GLASS_TABLE_CELL} text-center py-8`}>
                  No products yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className={GLASS_TABLE_ROW}>
                <td className={GLASS_TABLE_CELL}>
                  <span className="font-medium text-white/90 line-clamp-1 max-w-[200px] block">
                    {row.title}
                  </span>
                </td>
                <td className={GLASS_TABLE_CELL}>
                  <span className={GLASS_CAPTION}>{row.sector}</span>
                </td>
                <td className={GLASS_TABLE_CELL}>{statusBadge(row.status)}</td>
                <td className={GLASS_TABLE_CELL}>{formatCents(row.priceCents)}</td>
                <td className={GLASS_TABLE_CELL}>{row.views.toLocaleString()}</td>
                <td className={GLASS_TABLE_CELL}>{row.purchases.toLocaleString()}</td>
                <td className={GLASS_TABLE_CELL}>{formatCents(row.revenue)}</td>
                <td className={`${GLASS_TABLE_CELL} whitespace-nowrap`}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${row.id}`}
                      className={`${GLASS_BUTTON_SECONDARY} px-3 py-1.5 text-xs flex items-center gap-1`}
                    >
                      <Edit size={12} />
                      Edit
                    </Link>
                    <form action={toggleStatus.bind(null, row.id, row.status)}>
                      <button
                        type="submit"
                        className={
                          row.status === 'LIVE'
                            ? `${GLASS_BUTTON_DESTRUCTIVE} px-3 py-1.5 text-xs`
                            : `${GLASS_BUTTON_PRIMARY} px-3 py-1.5 text-xs`
                        }
                      >
                        {row.status === 'LIVE' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
