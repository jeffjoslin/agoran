import { Suspense } from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { ProductFilters } from '@/components/storefront/ProductFilters';
import {
  GLASS_CONTAINER,
  GLASS_SECTION,
  GLASS_HEADING_1,
  GLASS_BODY,
} from '@/styles/design-tokens';

export const metadata: Metadata = {
  title: 'All Products — Agoran',
  description: 'Browse all digital products on Agoran.',
};

// SSR — no revalidate, supports filter params

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    sector?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

async function getProducts(params: {
  q?: string;
  sector?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const { q, sector, type, minPrice, maxPrice } = params;

  const minCents = minPrice ? Math.round(parseFloat(minPrice) * 100) : undefined;
  const maxCents = maxPrice ? Math.round(parseFloat(maxPrice) * 100) : undefined;

  return db.product.findMany({
    where: {
      status: 'LIVE',
      ...(sector ? { sector: { equals: sector, mode: 'insensitive' } } : {}),
      ...(type ? { productType: type as never } : {}),
      ...(minCents !== undefined ? { priceCents: { gte: minCents } } : {}),
      ...(maxCents !== undefined ? { priceCents: { lte: maxCents } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { shortDescription: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      sector: true,
      productType: true,
      priceCents: true,
    },
  });
}

async function getSectors(): Promise<string[]> {
  const result = await db.product.findMany({
    where: { status: 'LIVE' },
    select: { sector: true },
    distinct: ['sector'],
    orderBy: { sector: 'asc' },
  });
  return result.map((r) => r.sector);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q ?? '';
  const sector = params.sector ?? '';
  const type = params.type ?? '';
  const minPrice = params.minPrice ?? '';
  const maxPrice = params.maxPrice ?? '';

  const [products, sectors] = await Promise.all([
    getProducts({ q, sector, type, minPrice, maxPrice }),
    getSectors(),
  ]);

  return (
    <main>
      <section className={`${GLASS_SECTION} pb-8`}>
        <div className={GLASS_CONTAINER}>
          <h1 className={`${GLASS_HEADING_1} mb-2`}>All Products</h1>
          <p className={GLASS_BODY}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      <section className={`${GLASS_SECTION} pt-0`}>
        <div className={GLASS_CONTAINER}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter sidebar */}
            <div className="md:w-64 shrink-0">
              <Suspense>
                <ProductFilters
                  sectors={sectors}
                  currentSector={sector}
                  currentType={type}
                  currentMinPrice={minPrice}
                  currentMaxPrice={maxPrice}
                  currentQuery={q}
                />
              </Suspense>
            </div>

            {/* Product grid */}
            <div className="flex-1">
              <ProductGrid
                products={products}
                emptyMessage="No products match your filters."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
