import { db } from '@/lib/db';
import { formatCents } from '@/lib/utils';
import {
  GLASS_HEADING_2,
  GLASS_TABLE,
  GLASS_TABLE_HEADER,
  GLASS_TABLE_ROW,
  GLASS_TABLE_CELL,
  GLASS_BADGE_LIVE,
  GLASS_BADGE_DRAFT,
  GLASS_BADGE_ARCHIVED,
  GLASS_CAPTION,
  GLASS_BODY_SMALL,
  GLASS_STAT_CARD,
  GLASS_STAT_VALUE,
  GLASS_STAT_LABEL,
} from '@/styles/design-tokens';

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'success') return <span className={GLASS_BADGE_LIVE}>{status}</span>;
  if (s === 'running' || s === 'pending') return <span className={GLASS_BADGE_DRAFT}>{status}</span>;
  return <span className={GLASS_BADGE_ARCHIVED}>{status}</span>;
}

function formatDuration(start: Date, end: Date | null): string {
  if (!end) return 'In progress';
  const ms = end.getTime() - start.getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export default async function AdminPipelinePage() {
  const runs = await db.pipelineRun.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const totalPublished = runs.reduce((s, r) => s + r.productsPublished, 0);
  const totalCost = runs.reduce((s, r) => s + (r.totalCostCents ?? 0), 0);

  return (
    <div className="space-y-6">
      <h1 className={GLASS_HEADING_2}>Pipeline Runs</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Total Runs</p>
          <p className={GLASS_STAT_VALUE}>{runs.length}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Products Published</p>
          <p className={GLASS_STAT_VALUE}>{totalPublished}</p>
        </div>
        <div className={GLASS_STAT_CARD}>
          <p className={GLASS_STAT_LABEL}>Total Cost</p>
          <p className={GLASS_STAT_VALUE}>{formatCents(totalCost)}</p>
        </div>
      </div>

      {runs.length === 0 ? (
        <p className={GLASS_BODY_SMALL}>No pipeline runs recorded yet.</p>
      ) : (
        <div className={GLASS_TABLE}>
          <table className="w-full">
            <thead>
              <tr className={GLASS_TABLE_HEADER}>
                <th className="px-4 py-3 text-left">Run ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Started</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className={GLASS_TABLE_ROW}>
                  <td className={GLASS_TABLE_CELL}>
                    <span className="font-mono text-white/80 text-xs">{run.runId}</span>
                    {run.agentId && (
                      <p className={GLASS_CAPTION}>{run.agentId}</p>
                    )}
                  </td>
                  <td className={GLASS_TABLE_CELL}>{statusBadge(run.status)}</td>
                  <td className={GLASS_TABLE_CELL}>
                    <span className={GLASS_CAPTION}>
                      {run.startedAt.toLocaleString()}
                    </span>
                  </td>
                  <td className={GLASS_TABLE_CELL}>
                    <span className={GLASS_CAPTION}>
                      {formatDuration(run.startedAt, run.completedAt)}
                    </span>
                  </td>
                  <td className={GLASS_TABLE_CELL}>{run.productsCreated}</td>
                  <td className={GLASS_TABLE_CELL}>{run.productsPublished}</td>
                  <td className={GLASS_TABLE_CELL}>
                    {run.totalCostCents != null ? formatCents(run.totalCostCents) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
