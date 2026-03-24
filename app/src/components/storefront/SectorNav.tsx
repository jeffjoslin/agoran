import Link from 'next/link';
import { GLASS_CARD, GLASS_BODY_SMALL, GLASS_HEADING_3 } from '@/styles/design-tokens';

const SECTOR_ICONS: Record<string, string> = {
  marketing: '📣',
  productivity: '⚡',
  finance: '💰',
  health: '🏃',
  business: '📊',
  technology: '💻',
  education: '📚',
  creativity: '🎨',
};

interface SectorNavProps {
  sectors: string[];
}

function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function SectorNav({ sectors }: SectorNavProps) {
  if (sectors.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {sectors.map((sector) => {
        const icon = SECTOR_ICONS[sector.toLowerCase()] ?? '🗂️';
        return (
          <Link key={sector} href={`/${encodeURIComponent(sector.toLowerCase())}`}>
            <div className={`${GLASS_CARD} p-5 text-center hover:scale-105 transition-transform duration-200 cursor-pointer`}>
              <div className="text-3xl mb-2">{icon}</div>
              <h4 className={GLASS_HEADING_3}>{toTitleCase(sector)}</h4>
              <p className={`${GLASS_BODY_SMALL} mt-1`}>Browse products</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
