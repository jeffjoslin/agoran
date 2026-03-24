import Link from 'next/link';
import {
  GLASS_CARD,
  GLASS_CARD_ELEVATED,
  GLASS_BADGE_ACCENT,
  GLASS_BODY_SMALL,
  GLASS_PRICE,
  GLASS_BUTTON_PRIMARY,
  GLASS_HEADING_3,
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

export function ProductCard({
  slug,
  title,
  shortDescription,
  sector,
  productType,
  priceCents,
}: ProductCardProps) {
  const typeLabel = PRODUCT_TYPE_LABELS[productType] ?? productType;

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <article
        className={`${GLASS_CARD} group-hover:${GLASS_CARD_ELEVATED} p-6 flex flex-col gap-4 h-full transition-all duration-200`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={GLASS_BADGE_ACCENT}>{sector}</span>
          <span className={`${GLASS_BADGE_ACCENT} opacity-70`}>{typeLabel}</span>
        </div>

        <div className="flex-1">
          <h3 className={`${GLASS_HEADING_3} mb-2 line-clamp-2`}>{title}</h3>
          {shortDescription && (
            <p className={`${GLASS_BODY_SMALL} line-clamp-3`}>{shortDescription}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className={GLASS_PRICE}>{formatPrice(priceCents)}</span>
          <span className={`${GLASS_BUTTON_PRIMARY} text-sm py-2 px-4`} aria-label={`View ${title}`}>
            View
          </span>
        </div>
      </article>
    </Link>
  );
}
