'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Customer } from '@/types';

interface CLVTrendChartProps {
  customers: Customer[];
}

const MONO_TICK = { fill: '#6B6760', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono), monospace' };

export default function CLVTrendChart({ customers }: CLVTrendChartProps) {
  // Group customers by lifetime cohorts
  const cohortData = new Map<string, { total: number; count: number; predicted: number; historical: number }>();

  customers.forEach(c => {
    const lifetimeMonths = Math.floor(c.lifetime / 30);
    let cohort: string;

    if (lifetimeMonths < 3) cohort = '0-3 měsíce';
    else if (lifetimeMonths < 6) cohort = '3-6 měsíců';
    else if (lifetimeMonths < 12) cohort = '6-12 měsíců';
    else if (lifetimeMonths < 24) cohort = '1-2 roky';
    else if (lifetimeMonths < 36) cohort = '2-3 roky';
    else cohort = '3+ roky';

    if (!cohortData.has(cohort)) {
      cohortData.set(cohort, { total: 0, count: 0, predicted: 0, historical: 0 });
    }

    const data = cohortData.get(cohort)!;
    data.total += c.lifetimeCLV;
    data.predicted += c.predictedCLV;
    data.historical += c.historicalCLV;
    data.count += 1;
  });

  // Order cohorts correctly
  const cohortOrder = ['0-3 měsíce', '3-6 měsíců', '6-12 měsíců', '1-2 roky', '2-3 roky', '3+ roky'];

  const chartData = cohortOrder
    .filter(cohort => cohortData.has(cohort))
    .map(cohort => {
      const data = cohortData.get(cohort)!;
      return {
        cohort,
        avgCLV: Math.round(data.total / data.count),
        avgPredicted: Math.round(data.predicted / data.count),
        avgHistorical: Math.round(data.historical / data.count),
        customerCount: data.count
      };
    });

  return (
    <div className="card-brand p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-6">CLV Trend podle délky vztahu</h2>

      {/* Chart */}
      <div className="h-80 sm:h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="cohort"
              tick={MONO_TICK}
            />
            <YAxis
              tick={MONO_TICK}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card p-4 border border-black/10">
                      <p className="font-bold text-ink mb-2">{data.cohort}</p>
                      <p className="text-ink-soft font-mono text-sm">Počet zákazníků: {data.customerCount.toLocaleString('cs-CZ')}</p>
                      <p className="font-mono text-sm font-semibold" style={{ color: '#10b981' }}>Prům. CLV: {data.avgCLV.toLocaleString('cs-CZ')} Kč</p>
                      <p className="font-mono text-sm" style={{ color: '#14b8a6' }}>Historické: {data.avgHistorical.toLocaleString('cs-CZ')} Kč</p>
                      <p className="font-mono text-sm" style={{ color: '#6366f1' }}>Predikované: {data.avgPredicted.toLocaleString('cs-CZ')} Kč</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            />
            <Line
              type="monotone"
              dataKey="avgCLV"
              stroke="#10b981"
              strokeWidth={3}
              name="Průměrné CLV"
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="avgHistorical"
              stroke="#14b8a6"
              strokeWidth={2}
              name="Historické CLV"
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="avgPredicted"
              stroke="#6366f1"
              strokeWidth={2}
              name="Predikované CLV"
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {chartData.map((cohort, index) => (
          <div
            key={cohort.cohort}
            className="bg-cream-deep p-3 sm:p-4 border border-black/10"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-mute mb-1">{cohort.cohort}</p>
            <p className="text-lg sm:text-xl font-black tracking-tight text-ink">
              {(cohort.avgCLV / 1000).toFixed(0)}k
            </p>
            <p className="font-mono text-[10px] sm:text-xs text-mute mt-1">
              {cohort.customerCount} zákazníků
            </p>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-cream-deep border border-line">
        <div className="flex items-start gap-3">
          <div className="text-xl">📈</div>
          <div>
            <p className="text-sm text-ink font-medium">
              CLV trend ukazuje, jak se mění průměrná hodnota zákazníků podle délky jejich vztahu
            </p>
            <p className="text-xs text-mute mt-1">
              Delší vztah obvykle znamená vyšší CLV díky opakovaným nákupům a nižšímu churn riziku
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
