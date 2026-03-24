import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import {
  GLASS_CONTAINER,
  GLASS_SECTION,
  GLASS_HEADING_1,
  GLASS_BODY,
} from '@/styles/design-tokens';

export const revalidate = 3600;

interface SectorPageProps {
  params: Promise<{ sector: string }>;
}

async function getLiveSectors(): Promise<string[]> {
  const result = await db.product.findMany({
    where: { status: 'LIVE' },
    select: { sector: true },
    distinct: ['sector'],
  });
  return result.map((r) => r.sector.toLowerCase());
}

async function getProductsBySector(sector: string) {
  return db.product.findMany({
    where: {
      status: 'LIVE',
      sector: { equals: sector, mode: 'insensitive' },
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

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { sector } = await params;
  const title = sector.charAt(0).toUpperCase() + sector.slice(1);
  return {
    title: `${title} Products — Agoran`,
    description: `Browse digital products in the ${title} sector.`,
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { sector } = await params;
  const decodedSector = decodeURIComponent(sector).toLowerCase();

  const liveSectors = await getLiveSectors();

  if (!liveSectors.includes(decodedSector)) {
    // Unknown sector — redirect to homepage rather than hard 404
    redirect('/');
  }

  const products = await getProductsBySector(decodedSector);

  if (products.length === 0) {
    notFound();
  }

  const displayName = decodedSector.charAt(0).toUpperCase() + decodedSector.slice(1);

  return (
    <main>
      <section className={`${GLASS_SECTION} pb-8`}>
        <div className={GLASS_CONTAINER}>
          <h1 className={`${GLASS_HEADING_1} mb-4`}>{displayName}</h1>
          <p className={`${GLASS_BODY} text-lg`}>
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </section>

      <section className={GLASS_SECTION}>
        <div className={GLASS_CONTAINER}>
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
