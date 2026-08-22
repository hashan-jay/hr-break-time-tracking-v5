import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useTheme } from '../theme/ThemeContext';

function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
}

function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  return `${n % 1 === 0 ? n : n.toFixed(1)}%`;
}

function formatChange(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  const abs = Math.abs(n);
  const label = `${n > 0 ? '+' : n < 0 ? '−' : ''}${abs % 1 === 0 ? abs : abs.toFixed(1)}%`;
  return { value: n, label };
}

function formatTrendDate(value) {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ChangeBadge({ change, invert }) {
  const parsed = formatChange(change);
  if (!parsed) return null;
  const up = parsed.value > 0;
  const down = parsed.value < 0;
  const good = invert ? down : up;
  const bad = invert ? up : down;
  const tone = good ? 'up' : bad ? 'down' : 'flat';
  return (
    <span className={`headlines-metric__change is-${tone}`}>
      {up ? '↑' : down ? '↓' : '→'} {parsed.label}
    </span>
  );
}

function HeadlinesTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload || {};
  return (
    <div className="headlines-tooltip">
      <strong>{formatTrendDate(point.date)}</strong>
      <p>{formatNumber(point.breaks)} breaks</p>
      <span>{formatNumber(point.mealBreaks)} meal · {formatNumber(point.comfortBreaks)} comfort</span>
    </div>
  );
}

export default function DashboardHeadlines({ data }) {
  const { isDark } = useTheme();
  const trend = useMemo(
    () => (data?.trend || []).map((point) => ({
      ...point,
      date: point.date,
    })),
    [data?.trend],
  );
  const line = isDark ? '#93c5fd' : '#1d4ed8';
  const monthLabel = new Date().toLocaleDateString(undefined, { month: 'long' });

  return (
    <section className="headlines-card portal-widget-3d" aria-label="Break headlines">
      <header className="headlines-card__head">
        <h2>The headlines.</h2>
        <p>The numbers that matter most this month — live floor activity and {monthLabel} compliance.</p>
      </header>

      <div className="headlines-metrics">
        <article className="headlines-metric">
          <span className="headlines-metric__label">On break now</span>
          <div className="headlines-metric__row">
            <strong>{formatNumber(data.onBreakNow)}</strong>
          </div>
          <p className="headlines-metric__note">People currently away from the floor.</p>
        </article>

        <article className="headlines-metric">
          <span className="headlines-metric__label">Breaks today</span>
          <div className="headlines-metric__row">
            <strong>{formatNumber(data.breaksToday)}</strong>
            <ChangeBadge change={data.breaksChangePercent} />
          </div>
        </article>

        <article className="headlines-metric">
          <span className="headlines-metric__label">Within-limit rate</span>
          <div className="headlines-metric__row">
            <strong className={Number(data.compliancePercent) >= 90 ? 'is-good' : undefined}>
              {formatPercent(data.compliancePercent)}
            </strong>
            <ChangeBadge change={data.complianceChangePercent} />
          </div>
        </article>

        <article className="headlines-metric">
          <span className="headlines-metric__label">Limit breaches</span>
          <div className="headlines-metric__row">
            <strong className={Number(data.limitBreachesToday) > 0 ? 'is-bad' : 'is-good'}>
              {formatNumber(data.limitBreachesToday)}
            </strong>
            <ChangeBadge change={data.limitBreachesChangePercent} invert />
          </div>
        </article>
      </div>

      <div className="headlines-chart" aria-hidden={trend.length === 0}>
        <ResponsiveContainer width="100%" height={128}>
          <AreaChart data={trend} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="headlinesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line} stopOpacity={0.2} />
                <stop offset="100%" stopColor={line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              cursor={{ stroke: line, strokeOpacity: 0.25 }}
              content={<HeadlinesTooltip />}
            />
            <Area
              type="monotone"
              dataKey="breaks"
              stroke={line}
              strokeWidth={2}
              fill="url(#headlinesFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
