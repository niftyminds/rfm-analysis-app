'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SegmentChartProps {
  segments: Record<string, number>;
  total: number;
}

const SEGMENT_COLORS: Record<string, string> = {
  'Champions': '#10b981',
  'Loyal Customers': '#3b82f6',
  'Potential Loyalists': '#06b6d4',
  'New Customers': '#8b5cf6',
  'Promising': '#eab308',
  'Need Attention': '#f97316',
  'At Risk': '#ef4444',
  'Cant Lose Them': '#ec4899',
  'Lost': '#6b7280'
};

export default function SegmentChart({ segments, total }: SegmentChartProps) {
  const data = Object.entries(segments)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Segmentace zákazníků</h2>
      
      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={120}
              interval={0}
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
                      <p className="text-gray-600">Počet: {data.count}</p>
                      <p className="text-gray-600">Podíl: {data.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((segment) => {
          const color = SEGMENT_COLORS[segment.name] || '#6b7280';
          return (
            <div 
              key={segment.name}
              className="rounded-xl p-4 border-2 transition-transform hover:scale-105"
              style={{ 
                borderColor: color,
                backgroundColor: `${color}15`
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color }}>{segment.name}</span>
                <span className="text-2xl font-bold" style={{ color }}>{segment.count}</span>
              </div>
              <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2">
                <div 
                  className="rounded-full h-2 transition-all duration-500"
                  style={{ 
                    width: `${segment.percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1 font-medium" style={{ color }}>{segment.percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}