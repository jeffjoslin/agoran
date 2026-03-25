import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { createCheckoutSession } from '@/app/actions/checkout';
import { ProductCard } from '@/components/storefront/ProductCard';
import { PageViewTracker } from '@/components/storefront/PageViewTracker';
import {
  GLASS_CONTAINER,
  GLASS_HEADING_2,
  GLASS_HEADING_3,
  GLASS_BODY,
  GLASS_BODY_SMALL,
  GLASS_BADGE_LIVE,
  GLASS_DIVIDER,
  GLASS2_CARD,
  GRADIENT_TEXT,
  GLOW_BUTTON_PRIMARY,
  SECTOR_BADGE,
  SECTOR_PRICE_GLOW,
} from '@/styles/design-tokens';

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      description: true,
      sector: true,
      productType: true,
      priceCents: true,
      status: true,
      heroHeadline: true,
      heroSubheadline: true,
      bulletPoints: true,
      audienceStatement: true,
      metaTitle: true,
      metaDescription: true,
      ogImageUrl: true,
      publishedAt: true,
    },
  });
}

async function getRelatedProducts(sector: string, excludeSlug: string) {
  return db.product.findMany({
    where: {
      status: 'LIVE',
      sector: { equals: sector, mode: 'insensitive' },
      slug: { not: excludeSlug },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
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

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { status: 'LIVE' },
    select: { slug: true },
  });
  return products.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.status !== 'LIVE') {
    return { title: 'Product Not Found — Agoran' };
  }

  return {
    title: product.metaTitle ?? `${product.title} — Agoran`,
    description: product.metaDescription ?? product.shortDescription ?? product.description,
    openGraph: {
      title: product.metaTitle ?? product.title,
      description: product.metaDescription ?? product.shortDescription ?? product.description ?? undefined,
      images: product.ogImageUrl ? [{ url: product.ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle ?? product.title,
      description: product.metaDescription ?? product.shortDescription ?? undefined,
      images: product.ogImageUrl ? [product.ogImageUrl] : [],
    },
  };
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  PDF_GUIDE: 'PDF Guide',
  CHECKLIST: 'Checklist',
  TEMPLATE: 'Template',
  SWIPE_FILE: 'Swipe File',
  MINI_COURSE: 'Mini Course',
  TOOLKIT: 'Toolkit',
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getSectorAuroraColors(sector: string): { from: string; via: string; to: string } {
  const s = sector.toLowerCase();
  if (s === 'ai')           return { from: 'rgba(37,99,235,0.5)',   via: 'rgba(6,182,212,0.4)',   to: 'rgba(5,8,16,0)' };
  if (s === 'finance')      return { from: 'rgba(5,150,105,0.5)',   via: 'rgba(16,185,129,0.35)', to: 'rgba(5,8,16,0)' };
  if (s === 'health')       return { from: 'rgba(225,29,72,0.5)',   via: 'rgba(244,63,94,0.35)',  to: 'rgba(5,8,16,0)' };
  if (s === 'marketing')    return { from: 'rgba(109,40,217,0.5)',  via: 'rgba(124,58,237,0.4)',  to: 'rgba(5,8,16,0)' };
  if (s === 'productivity') return { from: 'rgba(217,119,6,0.5)',   via: 'rgba(245,158,11,0.35)', to: 'rgba(5,8,16,0)' };
  return { from: 'rgba(124,58,237,0.45)', via: 'rgba(37,99,235,0.35)', to: 'rgba(5,8,16,0)' };
}

function getSectorBulletClass(sector: string): string {
  const s = sector.toLowerCase();
  if (s === 'ai')           return 'feature-bullet-ai';
  if (s === 'finance')      return 'feature-bullet-finance';
  if (s === 'health')       return 'feature-bullet-health';
  if (s === 'marketing')    return 'feature-bullet-marketing';
  if (s === 'productivity') return 'feature-bullet-productivity';
  return 'feature-bullet-default';
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.status !== 'LIVE') {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.sector, slug);
  const typeLabel = PRODUCT_TYPE_LABELS[product.productType] ?? product.productType;
  const auroraColors = getSectorAuroraColors(product.sector);
  const bulletClass = getSectorBulletClass(product.sector);
  const sectorKey = product.sector.toLowerCase();
  const badgeClass = SECTOR_BADGE[sectorKey] ?? SECTOR_BADGE['default'] ?? '';
  const priceGlow = SECTOR_PRICE_GLOW[sectorKey] ?? SECTOR_PRICE_GLOW['default'] ?? 'text-white';

  return (
    <>
      <PageViewTracker productId={product.id} />

      <main>
        {/* ─── HERO — full-bleed aurora gradient per sector ─── */}
        <section
          className="relative overflow-hidden py-28 md:py-40"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${auroraColors.from} 0%, ${auroraColors.via} 40%, ${auroraColors.to} 70%), #050810`,
          }}
        >
          {/* Subtle noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
            aria-hidden="true"
          />

          <div className={`${GLASS_CONTAINER} relative z-10`}>
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className={`backdrop-blur-sm border text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
              >
                {product.sector}
              </span>
              <span className="backdrop-blur-sm bg-white/6 border border-white/12 text-white/45 text-xs font-medium px-2.5 py-1 rounded-full">
                {typeLabel}
              </span>
              <span className={GLASS_BADGE_LIVE}>Live</span>
            </div>

            {/* Giant headline */}
            <h1
              className="font-extrabold tracking-tight leading-[1.05] mb-5 text-white max-w-4xl"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
            >
              {product.heroHeadline ? (
                <>
                  <span className={GRADIENT_TEXT}>{product.heroHeadline}</span>
                </>
              ) : (
                product.title
              )}
            </h1>

            {(product.heroSubheadline ?? product.shortDescription) && (
              <p
                className="text-white/60 max-w-3xl leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
              >
                {product.heroSubheadline ?? product.shortDescription}
              </p>
            )}
          </div>
        </section>

        {/* ─── MAIN CONTENT + SIDEBAR ─── */}
        <section className="py-16 md:py-24 relative z-10">
          <div className={GLASS_CONTAINER}>
            <div className="flex flex-col lg:flex-row gap-10">

              {/* ─── Left column: features + audience + description ─── */}
              <div className="flex-1 space-y-10">

                {/* Bullet points as glass cards */}
                {product.bulletPoints.length > 0 && (
                  <div className={`${GLASS2_CARD} p-8`}>
                    <h2 className={`${GLASS_HEADING_2} mb-6`}>What You Get</h2>
                    <ul className="space-y-3">
                      {product.bulletPoints.map((point: string, i: number) => (
                        <li
                          key={i}
                          className={`backdrop-blur-md bg-white/4 border-l border-white/8 rounded-r-xl px-5 py-4 flex items-start gap-3 ${bulletClass}`}
                        >
                          <span className="text-white/50 mt-0.5 shrink-0 text-lg leading-none">✓</span>
                          <span className="text-white/80 text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Audience statement */}
                {product.audienceStatement && (
                  <div className={`${GLASS2_CARD} p-8`}>
                    <h2 className={`${GLASS_HEADING_2} mb-4`}>Who This Is For</h2>
                    <p className={GLASS_BODY}>{product.audienceStatement}</p>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div>
                    <h2 className={`${GLASS_HEADING_3} mb-4`}>About This Product</h2>
                    <p className={GLASS_BODY}>{product.description}</p>
                  </div>
                )}
              </div>

              {/* ─── Purchase sidebar ─── */}
              <div className="lg:w-80 shrink-0">
                <div className={`${GLASS2_CARD} p-6 sticky top-24`}>
                  <h3 className={`${GLASS_HEADING_3} mb-2 line-clamp-2`}>{product.title}</h3>
                  {product.shortDescription && (
                    <p className={`${GLASS_BODY_SMALL} mb-6`}>{product.shortDescription}</p>
                  )}

                  {/* Price with sector glow */}
                  <div className="mb-6">
                    <span className={`text-3xl font-bold ${priceGlow}`}>
                      {formatPrice(product.priceCents)}
                    </span>
                    <span className="text-white/30 text-sm ml-2">one-time</span>
                  </div>

                  {/* Glowing Buy Now button */}
                  <form action={createCheckoutSession.bind(null, product.id)}>
                    <button
                      type="submit"
                      className={`${GLOW_BUTTON_PRIMARY} w-full text-base`}
                    >
                      Buy Now — {formatPrice(product.priceCents)}
                    </button>
                  </form>

                  {/* Trust micro-copy */}
                  <p className="text-white/25 text-xs text-center mt-4 leading-relaxed">
                    Instant download · Secure checkout · 30-day guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RELATED PRODUCTS ─── */}
        {relatedProducts.length > 0 && (
          <>
            <div className={`${GLASS_DIVIDER} mx-8`} />
            <section className="py-16 md:py-24 relative z-10">
              <div className={GLASS_CONTAINER}>
                <h2 className={`${GLASS_HEADING_2} mb-8`}>
                  More in{' '}
                  <span className={GRADIENT_TEXT}>{product.sector}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related: { id: string; slug: string; title: string; shortDescription: string | null; sector: string; productType: string; priceCents: number }) => (
                    <ProductCard
                      key={related.id}
                      slug={related.slug}
                      title={related.title}
                      shortDescription={related.shortDescription}
                      sector={related.sector}
                      productType={related.productType}
                      priceCents={related.priceCents}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
