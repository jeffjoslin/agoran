import Link from 'next/link';
import {
  DAZZLING_CARD_OUTER,
  DAZZLING_CARD_INNER,
  GLASS_HEADING_3,
  GLASS_BODY_SMALL,
  SECTOR_BADGE,
  SECTOR_PRICE_GLOW,
} from '@/styles/design-tokens';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  PDF_GUIDE: 'PDF Guide',
  CHECKLIST: 'Checklist',
  TEMPLATE: 'Template',
  SWIPE_FILE: 'Swipe File',
  MINI_COURSE: 'Mini Course',
  TOOLKIT: 'Toolkit',
};

interface ProductCardProps {
  slug: string;
  title: string;
  shortDescription: string | null;
  sector: string;
  productType: string;
  priceCents: number;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getSectorKey(sector: string): string {
  return sector.toLowerCase();
}

export function ProductCard({
  slug,
  title,
  shortDescription,
  sector,
  productType,
  priceCents,
}: ProductCardProps) {
  const typeLabel = PRODUCT_TYPE_LABELS[productType] ?? productType;
  const sectorKey = getSectorKey(sector);
  const badgeClass = SECTOR_BADGE[sectorKey] ?? SECTOR_BADGE['default'] ?? '';
  const priceGlow = SECTOR_PRICE_GLOW[sectorKey] ?? SECTOR_PRICE_GLOW['default'] ?? 'text-white';

  return (
    <Link href={`/products/${slug}`} className={`${DAZZLING_CARD_OUTER} scroll-reveal`}>
      <article className={DAZZLING_CARD_INNER}>
        {/* Sector badge + type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`backdrop-blur-sm border text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            {sector}
          </span>
          <span className="backdrop-blur-sm bg-white/6 border border-white/12 text-white/45 text-xs font-medium px-2.5 py-1 rounded-full">
            {typeLabel}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex-1 min-h-0">
          <h3 className={`${GLASS_HEADING_3} mb-2 line-clamp-2 leading-snug`}>{title}</h3>
          {shortDescription && (
            <p className={`${GLASS_BODY_SMALL} line-clamp-3`}>{shortDescription}</p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/6">
          <span className={`text-2xl font-bold ${priceGlow}`}>
            {formatPrice(priceCents)}
          </span>
          <span
            className="text-sm font-semibold text-white px-4 py-2 rounded-xl bg-white/8 border border-white/15 group-hover:bg-white/14 group-hover:border-violet-400/40 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all duration-200"
            aria-label={`View ${title}`}
          >
            View →
          </span>
        </div>
      </article>
    </Link>
  );
}
