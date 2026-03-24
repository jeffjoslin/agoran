import { db } from '@/lib/db';
import { formatCents } from '@/lib/utils';
import {
  GLASS_HEADING_2,
  GLASS_HEADING_3,
  GLASS_CARD,
  GLASS_BODY_SMALL,
  GLASS_STAT_CARD,
  GLASS_STAT_VALUE,
  GLASS_STAT_LABEL,
  GLASS_TABLE,
  GLASS_TABLE_HEADER,
  GLASS_TABLE_ROW,
  GLASS_TABLE_CELL,
  GLASS_BADGE_ACCENT,
} from '@/styles/design-tokens';

async function getAnalyticsData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [orders, products] = await Promise.all([
    db.order.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: thirtyDaysAgo },
      },
      select: {
        amountPaidCents: true,
        completedAt: true,
        productId: true,
        product: { select: { title: true, sector: true } },
      },
    }),
    db.product.findMany({
      where: { status: 'LIVE' },
      include: {
        pageViews: { select: { id: true } },
        orders: {
          where: { status: 'COMPLETED' },
          select: { amountPaidCents: true },
        },
      },
    }),
  ]);

  // Revenue over last 30 days (daily)
  const days: { label: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayOrders = orders.filter((o) => {
      const t = o.completedAt ? new Date(o.completedAt) : null;
      return t && t >= d && t < nextDay;
    });
    days.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((s, o) => s + o.amountPaidCents, 0),
    });
  }

  // Top 10 products by revenue
  const productRevenue: Record<string, { title: string; sector: string; revenue: number; sales: number }> = {};
  for (const o of orders) {
    if (!productRevenue[o.productId]) {
      productRevenue[o.productId] = {
        title: o.product.title,
        sector: o.product.sector,
        revenue: 0,
        sales: 0,
      };
    }
    productRevenue[o.productId]!.revenue += o.amountPaidCents;
    productRevenue[o.productId]!.sales += 1;
  }
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Top sectors by sales
  const sectorSales: Record<string, { sales: number; revenue: number; views: number }> = {};
  for (const p of products) {
    const s = p.sector;
    if (!sectorSales[s]) sectorSales[s] = { sales: 0, revenue: 0, views: 0 };
    sectorSales[s].sales += p.orders.length;
    sectorSales[s].revenue += p.orders.reduce((sum, o) => sum + o.amountPaidCents, 0);
    sectorSales[s].views += p.pageViews.length;
  }
  const topSectors = Object.entries(sectorSales)
    .map(([sector, data]) => ({ sector, ...data }))
    .sort((a, b) => b.sales - a.sales);

  // Conversion rate by sector (sales / views)
  const conversionBySector = topSectors.map((s) => ({
    sector: s.sector,
    views: s.views,
    sales: s.sales,
    conversionRate: s.views > 0 ? ((s.sales / s.views) * 100).toFixed(2) : '0.00',
  }));

  const totalRevenue = orders.reduce((s, o) => s + o.amountPaidCents, 0);
  const totalSales = orders.length;

  return { days, topProducts, topSectors, conversionBySector, totalRevenue, totalSales };
}

function RevenueChart({ days }: { days: { label: string; revenue: number }[] }) {
  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1);
  const chartH = 100;
  const barW = 16;
  const gap = 4;
  const totalW = days.length * (barW + gap) - gap;

  return (
    <div className="overflow-x-auto mt-4">
      <svg width={totalW} height={chartH + 24} className="overflow-visible min-w-full">
        {days.map((d, i) => {
          const barH = Math.max(2, (d.revenue / maxRevenue) * chartH);
          const x = i * (barW + gap);
          const y = chartH - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                className="fill-white/20 hover:fill-white/35 transition-colors"
              />
              {/* Only label every 5th day to avoid crowding */}
              {i % 5 === 0 && (
                <text
                  x={x + barW / 2}
                  y={chartH + 16}
                  textAnchor="middle"
                  className="fill-white/40"
                  fontSize={8}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const { days, topProducts, topSectors, conversionBySector, totalRevenue, totalSales } =
    await getAnalyticsData();

  return (
    <div className="space-y-6">
      <h1 className={GLASS_HEADING_2}>Analytics</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Revenue (30 days)</p>
          <p className={GLASS_STAT_VALUE}>{formatCents(totalRevenue)}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Sales (30 days)</p>
          <p className={GLASS_STAT_VALUE}>{totalSales}</p>
        </div>
      </div>

      {/* Revenue over time */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-1`}>Revenue — Last 30 Days</h2>
        <p className={GLASS_BODY_SMALL}>Daily revenue from completed orders</p>
        <RevenueChart days={days} />
      </div>

      {/* Top 10 products */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-4`}>Top Products by Revenue</h2>
        {topProducts.length === 0 ? (
          <p className={GLASS_BODY_SMALL}>No sales data in the last 30 days.</p>
        ) : (
          <div className={GLASS_TABLE}>
            <table className="w-full">
              <thead>
                <tr className={GLASS_TABLE_HEADER}>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Sales</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className={GLASS_TABLE_ROW}>
                    <td className={GLASS_TABLE_CELL}>{i + 1}</td>
                    <td className={GLASS_TABLE_CELL}>
                      <span className="text-white/90 font-medium">{p.title}</span>
                    </td>
                    <td className={GLASS_TABLE_CELL}>
                      <span className={GLASS_BADGE_ACCENT}>{p.sector}</span>
                    </td>
                    <td className={GLASS_TABLE_CELL}>{p.sales}</td>
                    <td className={GLASS_TABLE_CELL}>{formatCents(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top sectors */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-4`}>Top Sectors by Sales</h2>
        {topSectors.length === 0 ? (
          <p className={GLASS_BODY_SMALL}>No sector data available.</p>
        ) : (
          <div className={GLASS_TABLE}>
            <table className="w-full">
              <thead>
                <tr className={GLASS_TABLE_HEADER}>
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Sales</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSectors.map((s) => (
                  <tr key={s.sector} className={GLASS_TABLE_ROW}>
                    <td className={GLASS_TABLE_CELL}>
                      <span className={GLASS_BADGE_ACCENT}>{s.sector}</span>
                    </td>
                    <td className={GLASS_TABLE_CELL}>{s.sales}</td>
                    <td className={GLASS_TABLE_CELL}>{formatCents(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversion rate by sector */}
      <div className={`${GLASS_CARD} p-5`}>
        <h2 className={`${GLASS_HEADING_3} mb-4`}>Conversion Rate by Sector</h2>
        <p className={`${GLASS_BODY_SMALL} mb-4`}>
          Conversion = sales ÷ page views (live products)
        </p>
        {conversionBySector.length === 0 ? (
          <p className={GLASS_BODY_SMALL}>No data available.</p>
        ) : (
          <div className={GLASS_TABLE}>
            <table className="w-full">
              <thead>
                <tr className={GLASS_TABLE_HEADER}>
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  <th className="px-4 py-3 text-left">Sales</th>
                  <th className="px-4 py-3 text-left">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {conversionBySector.map((s) => (
                  <tr key={s.sector} className={GLASS_TABLE_ROW}>
                    <td className={GLASS_TABLE_CELL}>
                      <span className={GLASS_BADGE_ACCENT}>{s.sector}</span>
                    </td>
                    <td className={GLASS_TABLE_CELL}>{s.views.toLocaleString()}</td>
                    <td className={GLASS_TABLE_CELL}>{s.sales}</td>
                    <td className={GLASS_TABLE_CELL}>{s.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
