import { GLASS_PAGE_BG } from '@/styles/design-tokens';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${GLASS_PAGE_BG} flex items-center justify-center min-h-screen`}>
      {children}
    </div>
  );
}
