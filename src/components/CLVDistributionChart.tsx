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
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">CLV Distribuce zákazníků</h2>

      {/* Chart */}
      <div className="h-80 sm:h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={{ fontSize: '12px' }}
            />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">{data.name}</p>
                      <p className="text-gray-600">Počet: {data.count.toLocaleString('cs-CZ')}</p>
                      <p className="text-gray-600">Podíl: {data.percentage}%</p>
                      <p className="text-gray-600">Prům. CLV: {data.avgCLV.toLocaleString('cs-CZ')} Kč</p>
                      <p className="text-gray-600">Celkové CLV: {data.totalCLV.toLocaleString('cs-CZ')} Kč</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
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
              className="rounded-xl p-4 sm:p-6 border-2"
              style={{
                borderColor: color,
                backgroundColor: `${color}15`
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg" style={{ color }}>
                  {segment.name}
                </span>
                <span className="text-3xl font-bold" style={{ color }}>{segment.count}</span>
              </div>

              <div className="space-y-2">
                <div className="bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
                <p className="text-sm font-medium" style={{ color }}>{segment.percentage}% zákazníků</p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Průměrné CLV</p>
                  <p className="text-lg font-bold" style={{ color }}>
                    {segment.avgCLV.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-600">Celkové CLV segmentu</p>
                  <p className="text-lg font-bold" style={{ color }}>
                    {segment.totalCLV.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-emerald-600 text-xl">💡</div>
          <div>
            <p className="text-sm text-emerald-900 font-medium">
              CLV segmentace rozděluje zákazníky podle jejich celkové hodnoty
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              High Value = Top 20% zákazníků | Medium Value = Střední 50% | Low Value = Spodních 30%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
