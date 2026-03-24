'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  BarChart2,
  Cpu,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  GLASS_NAV_ITEM,
  GLASS_NAV_ITEM_ACTIVE,
  GLASS_DIVIDER,
  GLASS_CAPTION,
} from '@/styles/design-tokens';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2, exact: false },
  { href: '/admin/pipeline', label: 'Pipeline', icon: Cpu, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full p-3">
      {/* Brand */}
      <div className="px-3 py-4 mb-2">
        <span className="text-white font-bold text-lg tracking-tight">Agoran</span>
        <p className={`${GLASS_CAPTION} mt-0.5`}>Admin Dashboard</p>
      </div>

      <div className={`${GLASS_DIVIDER} mb-3`} />

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? GLASS_NAV_ITEM_ACTIVE : GLASS_NAV_ITEM}
            >
              <Icon size={16} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={`${GLASS_DIVIDER} mt-3 mb-3`} />

      {/* Sign out */}
      <button onClick={handleSignOut} className={GLASS_NAV_ITEM}>
        <LogOut size={16} />
        <span className="text-sm">Sign out</span>
      </button>
    </div>
  );
}
