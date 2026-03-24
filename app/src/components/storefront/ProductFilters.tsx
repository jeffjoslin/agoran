'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  GLASS_PANEL,
  GLASS_SELECT,
  GLASS_INPUT,
  GLASS_LABEL,
  GLASS_BUTTON_SECONDARY,
  GLASS_HEADING_3,
} from '@/styles/design-tokens';

const PRODUCT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'PDF_GUIDE', label: 'PDF Guide' },
  { value: 'CHECKLIST', label: 'Checklist' },
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'SWIPE_FILE', label: 'Swipe File' },
  { value: 'MINI_COURSE', label: 'Mini Course' },
  { value: 'TOOLKIT', label: 'Toolkit' },
];

interface ProductFiltersProps {
  sectors: string[];
  currentSector: string;
  currentType: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentQuery: string;
}

export function ProductFilters({
  sectors,
  currentSector,
  currentType,
  currentMinPrice,
  currentMaxPrice,
  currentQuery,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasFilters =
    currentSector || currentType || currentMinPrice || currentMaxPrice || currentQuery;

  return (
    <aside className={`${GLASS_PANEL} p-6 space-y-6`}>
      <h3 className={GLASS_HEADING_3}>Filters</h3>

      {/* Search */}
      <div>
        <label className={GLASS_LABEL}>Search</label>
        <input
          type="text"
          placeholder="Keywords..."
          defaultValue={currentQuery}
          className={GLASS_INPUT}
          onChange={(e) => updateParam('q', e.target.value)}
        />
      </div>

      {/* Sector */}
      <div>
        <label className={GLASS_LABEL}>Sector</label>
        <select
          className={GLASS_SELECT}
          value={currentSector}
          onChange={(e) => updateParam('sector', e.target.value)}
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product Type */}
      <div>
        <label className={GLASS_LABEL}>Product Type</label>
        <select
          className={GLASS_SELECT}
          value={currentType}
          onChange={(e) => updateParam('type', e.target.value)}
        >
          {PRODUCT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className={GLASS_LABEL}>Min Price ($)</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          defaultValue={currentMinPrice}
          className={GLASS_INPUT}
          onChange={(e) => updateParam('minPrice', e.target.value)}
        />
      </div>
      <div>
        <label className={GLASS_LABEL}>Max Price ($)</label>
        <input
          type="number"
          min="0"
          placeholder="No limit"
          defaultValue={currentMaxPrice}
          className={GLASS_INPUT}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
        />
      </div>

      {hasFilters && (
        <button onClick={clearAll} className={GLASS_BUTTON_SECONDARY}>
          Clear Filters
        </button>
      )}
    </aside>
  );
}
