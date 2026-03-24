import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './_components/AdminSidebar';
import {
  GLASS_PAGE_BG,
  GLASS_SIDEBAR,
} from '@/styles/design-tokens';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check — middleware handles redirects, this is a safety net
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login');
  }

  return (
    <div className={`${GLASS_PAGE_BG} flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      <aside className={`${GLASS_SIDEBAR} w-60 shrink-0 flex flex-col`}>
        <AdminSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
