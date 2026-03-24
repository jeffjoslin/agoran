import { db } from '@/lib/db';
import {
  GLASS_HEADING_2,
  GLASS_HEADING_3,
  GLASS_STAT_CARD,
  GLASS_STAT_VALUE,
  GLASS_STAT_LABEL,
  GLASS_CARD,
  GLASS_BODY_SMALL,
  GLASS_BADGE_LIVE,
  GLASS_BADGE_DRAFT,
  GLASS_BADGE_ARCHIVED,
  GLASS_CAPTION,
} from '@/styles/design-tokens';
import { formatCents } from '@/lib/utils';

async function getOverviewData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    todayOrders,
    last7DaysOrders,
    productCounts,
    recentPipelineRuns,
  ] = await Promise.all([
    // Today's completed orders
    db.order.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: todayStart },
      },
      select: { amountPaidCents: true },
    }),

    // Last 7 days completed orders
    db.order.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: sevenDaysAgo },
      },
      select: { amountPaidCents: true, completedAt: true },
    }),

    // Product counts by status
    db.product.groupBy({
      by: ['status'],
      _count: { id: true },
    }),

    // Last 5 pipeline runs
    db.pipelineRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const todayRevenue = todayOrders.reduce((s, o) => s + o.amountPaidCents, 0);
  const todaySales = todayOrders.length;

  // Build 7-day chart data
  const days: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayOrders = last7DaysOrders.filter((o) => {
      const t = o.completedAt ? new Date(o.completedAt) : null;
      return t && t >= d && t < nextDay;
    });
    const revenue = dayOrders.reduce((s, o) => s + o.amountPaidCents, 0);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue,
    });
  }

  const statusMap: Record<string, number> = {};
  for (const row of productCounts) {
    statusMap[row.status] = row._count.id;
  }

  return { todayRevenue, todaySales, days, statusMap, recentPipelineRuns };
}

function MiniBarChart({ days }: { days: { label: string; revenue: number }[] }) {
  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1);
  const chartH = 80;
  const barW = 28;
  const gap = 8;
  const totalW = days.length * (barW + gap) - gap;

  return (
    <div className="mt-4">
      <svg width={totalW} height={chartH + 20} className="overflow-visible">
        {days.map((d, i) => {
          const barH = Math.max(2, (d.revenue / maxRevenue) * chartH);
          const x = i * (barW + gap);
          const y = chartH - barH;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                className="fill-white/20 hover:fill-white/35 transition-colors"
              />
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                className="fill-white/40 text-[9px]"
                fontSize={9}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const { todayRevenue, todaySales, days, statusMap, recentPipelineRuns } =
    await getOverviewData();

  return (
    <div className="space-y-6">
      <h1 className={GLASS_HEADING_2}>Overview</h1>

      {/* Today stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Today&apos;s Revenue</p>
          <p className={GLASS_STAT_VALUE}>{formatCents(todayRevenue)}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Today&apos;s Sales</p>
          <p className={GLASS_STAT_VALUE}>{todaySales}</p>
        </div>
      </div>

      {/* Last 7 days chart */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-1`}>Revenue — Last 7 Days</h2>
        <p className={GLASS_BODY_SMALL}>
          Total: {formatCents(days.reduce((s, d) => s + d.revenue, 0))}
        </p>
        <MiniBarChart days={days} />
      </div>

      {/* Product counts */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-4`}>Products</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className={GLASS_BADGE_LIVE}>LIVE</span>
            <span className="text-white font-semibold">{statusMap['LIVE'] ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={GLASS_BADGE_DRAFT}>DRAFT</span>
            <span className="text-white font-semibold">{statusMap['DRAFT'] ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={GLASS_BADGE_ARCHIVED}>UNPUBLISHED</span>
            <span className="text-white font-semibold">{statusMap['UNPUBLISHED'] ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={GLASS_BADGE_ARCHIVED}>ARCHIVED</span>
            <span className="text-white font-semibold">{statusMap['ARCHIVED'] ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Last 5 pipeline runs */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-4`}>Recent Pipeline Runs</h2>
        {recentPipelineRuns.length === 0 ? (
          <p className={GLASS_BODY_SMALL}>No pipeline runs yet.</p>
        ) : (
          <div className="space-y-2">
            {recentPipelineRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between py-2 border-b border-white/6 last:border-0"
              >
                <div>
                  <p className="text-white/80 text-sm font-mono">{run.runId}</p>
                  <p className={GLASS_CAPTION}>
                    {run.createdAt.toLocaleString()} · {run.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">
                    {run.productsPublished} published
                  </p>
                  {run.totalCostCents != null && (
                    <p className={GLASS_CAPTION}>{formatCents(run.totalCostCents)} cost</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
