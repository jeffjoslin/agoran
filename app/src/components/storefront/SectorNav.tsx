import Link from 'next/link';
import { GLASS2_CARD, GLASS_BODY_SMALL, GLASS_HEADING_3 } from '@/styles/design-tokens';

const SECTOR_ICONS: Record<string, string> = {
  ai: '🤖',
  marketing: '📣',
  productivity: '⚡',
  finance: '💰',
  health: '🏃',
  business: '📊',
  technology: '💻',
  education: '📚',
  creativity: '🎨',
};

const SECTOR_ACCENT: Record<string, string> = {
  ai: 'hover:border-cyan-400/40 hover:shadow-[0_0_24px_rgba(6,182,212,0.3)]',
  finance: 'hover:border-emerald-400/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]',
  health: 'hover:border-rose-400/40 hover:shadow-[0_0_24px_rgba(244,63,94,0.3)]',
  marketing: 'hover:border-violet-400/40 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]',
  productivity: 'hover:border-amber-400/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.3)]',
  default: 'hover:border-violet-400/40 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]',
};

const SECTOR_ICON_BG: Record<string, string> = {
  ai: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
  finance: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  health: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
  marketing: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
  productivity: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  default: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
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
        const key = sector.toLowerCase();
        const icon = SECTOR_ICONS[key] ?? '🗂️';
        const accentClass = SECTOR_ACCENT[key] ?? SECTOR_ACCENT['default'] ?? '';
        const iconBgClass = SECTOR_ICON_BG[key] ?? SECTOR_ICON_BG['default'] ?? '';

        return (
          <Link key={sector} href={`/${encodeURIComponent(key)}`} className="group block">
            <div
              className={`${GLASS2_CARD} p-5 text-center hover:scale-[1.03] hover:-translate-y-1 transition-all duration-250 cursor-pointer ${accentClass}`}
            >
              {/* Sector icon with colored background pill */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border mb-3 text-2xl ${iconBgClass}`}>
                {icon}
              </div>
              <h4 className={`${GLASS_HEADING_3} text-base`}>
                <span className="group-hover:[&]:bg-gradient-to-r group-hover:[&]:from-violet-400 group-hover:[&]:to-cyan-400 group-hover:[&]:bg-clip-text group-hover:[&]:text-transparent">
                  {toTitleCase(sector)}
                </span>
              </h4>
              <p className={`${GLASS_BODY_SMALL} mt-1 text-xs`}>Browse products</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
