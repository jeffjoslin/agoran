import { db } from '@/lib/db';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { SectorNav } from '@/components/storefront/SectorNav';
import {
  GLASS_CONTAINER,
  GLASS_HEADING_2,
  GRADIENT_TEXT,
  GLASS2_HERO_BADGE,
  GLOW_BUTTON_PRIMARY,
  GLOW_BUTTON_SECONDARY,
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
      {/* ─── HERO — Aurora mesh background ─── */}
      <section className="aurora-hero noise-overlay relative min-h-[88vh] flex items-center justify-center py-28 md:py-40">
        {/* Aurora orb layers */}
        <span className="aurora-orb aurora-orb-1" aria-hidden="true" />
        <span className="aurora-orb aurora-orb-2" aria-hidden="true" />
        <span className="aurora-orb aurora-orb-3" aria-hidden="true" />

        <div className={`${GLASS_CONTAINER} relative z-10 text-center`}>
          {/* Glass pill badge */}
          <div className="flex justify-center mb-8">
            <span className={GLASS2_HERO_BADGE}>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              AI-powered digital products — live now
            </span>
          </div>

          {/* Giant fluid headline */}
          <h1
            className="font-extrabold tracking-tight leading-[1.04] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
          >
            <span className="text-white">The Future of</span>
            <br />
            <span className={GRADIENT_TEXT}>Digital Products</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            Agent-crafted guides, templates, and tools — built for the modern era.
            Discover what AI-powered creators are shipping.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className={GLOW_BUTTON_PRIMARY}>
              Browse All Products
            </a>
            <a href="#sectors" className={GLOW_BUTTON_SECONDARY}>
              Explore Sectors
            </a>
          </div>

          {/* Floating trust stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-white/40 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold text-base">∞</span>
              AI-generated daily
            </span>
            <span className="flex items-center gap-2">
              <span className="text-violet-400 font-semibold text-base">5</span>
              sectors covered
            </span>
            <span className="flex items-center gap-2">
              <span className="text-rose-400 font-semibold text-base">🔒</span>
              Instant download
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTOR NAV ─── */}
      {sectors.length > 0 && (
        <section id="sectors" className="py-20 md:py-28 relative z-10">
          <div className={GLASS_CONTAINER}>
            <div className="text-center mb-12">
              <h2
                className={`${GLASS_HEADING_2} mb-3`}
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
              >
                Browse by{' '}
                <span className={GRADIENT_TEXT}>Sector</span>
              </h2>
              <p className="text-white/40 text-sm">Curated intelligence across every domain</p>
            </div>
            <SectorNav sectors={sectors} />
          </div>
        </section>
      )}

      {sectors.length > 0 && <div className={`${GLASS_DIVIDER} mx-8`} />}

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20 md:py-28 relative z-10">
        <div className={GLASS_CONTAINER}>
          <div className="text-center mb-12">
            <h2
              className={`${GLASS_HEADING_2} mb-3`}
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
            >
              Featured{' '}
              <span className={GRADIENT_TEXT}>Products</span>
            </h2>
            <p className="text-white/40 text-sm">Hand-picked by our AI pipeline — ready for you today</p>
          </div>
          <ProductGrid
            products={featuredProducts}
            emptyMessage="No products available yet. Check back soon."
          />
        </div>
      </section>
    </main>
  );
}
