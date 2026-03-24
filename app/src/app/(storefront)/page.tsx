import { db } from '@/lib/db';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { SectorNav } from '@/components/storefront/SectorNav';
import {
  GLASS_CONTAINER,
  GLASS_SECTION,
  GLASS_HERO,
  GLASS_HEADING_1,
  GLASS_HEADING_2,
  GLASS_BODY,
  GLASS_DIVIDER,
} from '@/styles/design-tokens';

export const revalidate = 3600;

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { status: 'LIVE' },
    orderBy: { publishedAt: 'desc' },
    take: 6,
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

async function getSectors() {
  const result = await db.product.findMany({
    where: { status: 'LIVE' },
    select: { sector: true },
    distinct: ['sector'],
    orderBy: { sector: 'asc' },
  });
  return result.map((r) => r.sector);
}

export default async function HomePage() {
  const [featuredProducts, sectors] = await Promise.all([
    getFeaturedProducts(),
    getSectors(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className={GLASS_HERO}>
        <div className={GLASS_CONTAINER}>
          <h1 className={`${GLASS_HEADING_1} mb-6`}>
            The Future of Digital Products
          </h1>
          <p className={`${GLASS_BODY} text-lg md:text-xl max-w-2xl mx-auto`}>
            Agent-crafted guides, templates, and tools — built for the modern era.
            Discover what AI-powered creators are shipping.
          </p>
        </div>
      </section>

      {/* Sectors */}
      {sectors.length > 0 && (
        <section className={GLASS_SECTION}>
          <div className={GLASS_CONTAINER}>
            <h2 className={`${GLASS_HEADING_2} mb-8`}>Browse by Sector</h2>
            <SectorNav sectors={sectors} />
          </div>
        </section>
      )}

      {sectors.length > 0 && <div className={`${GLASS_DIVIDER} mx-8`} />}

      {/* Featured Products */}
      <section className={GLASS_SECTION}>
        <div className={GLASS_CONTAINER}>
          <h2 className={`${GLASS_HEADING_2} mb-8`}>Featured Products</h2>
          <ProductGrid
            products={featuredProducts}
            emptyMessage="No products available yet. Check back soon."
          />
        </div>
      </section>
    </main>
  );
}
