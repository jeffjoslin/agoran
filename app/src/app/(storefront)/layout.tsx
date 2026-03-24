import Link from 'next/link';
import {
  GLASS_NAVBAR,
  GLASS_CONTAINER,
  GLASS_PAGE_BG,
  GLASS_NAV_ITEM,
} from '@/styles/design-tokens';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={GLASS_PAGE_BG}>
      <nav className={GLASS_NAVBAR}>
        <div className={`${GLASS_CONTAINER} flex items-center justify-between h-16`}>
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            Agoran
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/products" className={GLASS_NAV_ITEM}>
              Browse
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
