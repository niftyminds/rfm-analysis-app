'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Customer } from '@/types';

interface CLVDistributionChartProps {
  customers: Customer[];
}

const CLV_SEGMENT_COLORS: Record<string, string> = {
  'High Value': '#10b981',
  'Medium Value': '#eab308',
  'Low Value': '#6b7280'
};

const MONO_TICK = { fill: '#6B6760', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono), monospace' };

export default function CLVDistributionChart({ customers }: CLVDistributionChartProps) {
  // Calculate CLV segment distribution
  const clvSegments: Record<string, number> = {};
  const clvTotals: Record<string, number> = {};

  customers.forEach(c => {
    clvSegments[c.clvSegment] = (clvSegments[c.clvSegment] || 0) + 1;
    clvTotals[c.clvSegment] = (clvTotals[c.clvSegment] || 0) + c.lifetimeCLV;
  });

  const data = Object.entries(clvSegments)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / customers.length) * 100).toFixed(1),
      avgCLV: Math.round(clvTotals[name] / count),
      totalCLV: Math.round(clvTotals[name])
    }))
    .sort((a, b) => {
      const order = { 'High Value': 0, 'Medium Value': 1, 'Low Value': 2 };
      return order[a.name as keyof typeof order] - order[b.name as keyof typeof order];
    });

  return (
    <div className="card-brand p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-6">CLV Distribuce zákazníků</h2>

      {/* Chart */}
      <div className="h-80 sm:h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="name"
              tick={MONO_TICK}
            />
            <YAxis tick={MONO_TICK} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card p-4 border border-black/10">
                      <p className="font-bold text-ink">{data.name}</p>
                      <p className="text-ink-soft font-mono text-sm">Počet: {data.count.toLocaleString('cs-CZ')}</p>
                      <p className="text-ink-soft font-mono text-sm">Podíl: {data.percentage}%</p>
                      <p className="text-ink-soft font-mono text-sm">Prům. CLV: {data.avgCLV.toLocaleString('cs-CZ')} Kč</p>
                      <p className="text-ink-soft font-mono text-sm">Celkové CLV: {data.totalCLV.toLocaleString('cs-CZ')} Kč</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CLV_SEGMENT_COLORS[entry.name] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CLV Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((segment) => {
          const color = CLV_SEGMENT_COLORS[segment.name] || '#6b7280';

          return (
            <div
              key={segment.name}
              className="p-4 sm:p-6 border-2"
              style={{
                borderColor: color,
                backgroundColor: `${color}15`
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg" style={{ color }}>
                  {segment.name}
                </span>
                <span className="text-3xl font-black tracking-tight" style={{ color }}>{segment.count}</span>
              </div>

              <div className="space-y-2">
                <div className="bg-card h-2">
                  <div
                    className="h-2 transition-all duration-500 ease-brand"
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
                <p className="text-sm font-mono font-medium" style={{ color }}>{segment.percentage}% zákazníků</p>

                <div className="mt-4 pt-4 border-t border-line">
                  <p className="font-mono text-xs uppercase tracking-wide text-mute">Průměrné CLV</p>
                  <p className="text-lg font-black tracking-tight" style={{ color }}>
                    {segment.avgCLV.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>

                <div className="mt-2">
                  <p className="font-mono text-xs uppercase tracking-wide text-mute">Celkové CLV segmentu</p>
                  <p className="text-lg font-black tracking-tight" style={{ color }}>
                    {segment.totalCLV.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-cream-deep border border-line">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div>
            <p className="text-sm text-ink font-medium">
              CLV segmentace rozděluje zákazníky podle jejich celkové hodnoty
            </p>
            <p className="text-xs text-mute mt-1">
              High Value = Top 20% zákazníků | Medium Value = Střední 50% | Low Value = Spodních 30%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
