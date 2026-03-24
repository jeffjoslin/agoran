import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/storefront/ProductCard';
import { PageViewTracker } from '@/components/storefront/PageViewTracker';
import {
  GLASS_CONTAINER,
  GLASS_SECTION,
  GLASS_CARD,
  GLASS_PANEL,
  GLASS_HEADING_1,
  GLASS_HEADING_2,
  GLASS_HEADING_3,
  GLASS_BODY,
  GLASS_BODY_SMALL,
  GLASS_BADGE_ACCENT,
  GLASS_BADGE_LIVE,
  GLASS_BUTTON_PRIMARY,
  GLASS_PRICE,
  GLASS_DIVIDER,
  GLASS_ALERT_SUCCESS,
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
  return products.map((p) => ({ slug: p.slug }));
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.status !== 'LIVE') {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.sector, slug);
  const typeLabel = PRODUCT_TYPE_LABELS[product.productType] ?? product.productType;

  return (
    <>
      <PageViewTracker productId={product.id} />

      <main>
        {/* Hero */}
        <section className={`${GLASS_SECTION} pb-8`}>
          <div className={GLASS_CONTAINER}>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={GLASS_BADGE_ACCENT}>{product.sector}</span>
              <span className={`${GLASS_BADGE_ACCENT} opacity-70`}>{typeLabel}</span>
              <span className={GLASS_BADGE_LIVE}>Live</span>
            </div>

            <h1 className={`${GLASS_HEADING_1} mb-4`}>
              {product.heroHeadline ?? product.title}
            </h1>

            {(product.heroSubheadline ?? product.shortDescription) && (
              <p className={`${GLASS_BODY} text-lg md:text-xl max-w-3xl`}>
                {product.heroSubheadline ?? product.shortDescription}
              </p>
            )}
          </div>
        </section>

        {/* Main content + sidebar */}
        <section className={`${GLASS_SECTION} pt-0`}>
          <div className={GLASS_CONTAINER}>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Content */}
              <div className="flex-1 space-y-10">
                {/* Bullet points */}
                {product.bulletPoints.length > 0 && (
                  <div className={`${GLASS_CARD} p-8`}>
                    <h2 className={`${GLASS_HEADING_2} mb-6`}>What You Get</h2>
                    <ul className="space-y-3">
                      {product.bulletPoints.map((point, i) => (
                        <li key={i} className={`${GLASS_ALERT_SUCCESS} flex items-start gap-3`}>
                          <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Audience statement */}
                {product.audienceStatement && (
                  <div className={`${GLASS_PANEL} p-8`}>
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

              {/* Purchase sidebar */}
              <div className="lg:w-80 shrink-0">
                <div className={`${GLASS_CARD} p-6 sticky top-24`}>
                  <h3 className={`${GLASS_HEADING_3} mb-2`}>{product.title}</h3>
                  {product.shortDescription && (
                    <p className={`${GLASS_BODY_SMALL} mb-6`}>{product.shortDescription}</p>
                  )}

                  <div className="mb-6">
                    <span className={GLASS_PRICE}>{formatPrice(product.priceCents)}</span>
                  </div>

                  <button
                    disabled
                    className={`${GLASS_BUTTON_PRIMARY} w-full opacity-60 cursor-not-allowed`}
                    title="Checkout coming soon"
                  >
                    Buy Now
                  </button>

                  <p className={`${GLASS_BODY_SMALL} text-center mt-3`}>
                    Checkout available soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <>
            <div className={`${GLASS_DIVIDER} mx-8`} />
            <section className={GLASS_SECTION}>
              <div className={GLASS_CONTAINER}>
                <h2 className={`${GLASS_HEADING_2} mb-8`}>More in {product.sector}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related) => (
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
