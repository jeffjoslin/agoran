import {
  GLASS_PAGE_BG,
  GLASS_CONTAINER,
  GLASS_CARD,
  GLASS_HEADING_1,
  GLASS_BODY,
  GLASS_BADGE_LIVE,
} from '@/styles/design-tokens';

export default function Home() {
  return (
    <main className={`${GLASS_PAGE_BG} flex items-center justify-center`}>
      <div
        className={`${GLASS_CONTAINER} flex flex-col items-center justify-center min-h-screen py-20`}
      >
        <div className={`${GLASS_CARD} p-12 max-w-2xl w-full text-center`}>
          <h1 className={`${GLASS_HEADING_1} mb-4`}>Agoran</h1>
          <p className={`${GLASS_BODY} text-lg mb-8`}>
            The agent-native digital product marketplace
          </p>
          <span className={GLASS_BADGE_LIVE}>Coming Soon</span>
        </div>
      </div>
    </main>
  );
}
