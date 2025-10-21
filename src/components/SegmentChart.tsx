'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, X } from 'lucide-react';

interface SegmentChartProps {
  segments: Record<string, number>;
  total: number;
  selectedSegments?: string[];
  onSegmentClick?: (segment: string) => void;
  filteredCount?: number;
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

export default function SegmentChart({ segments, total, selectedSegments = [], onSegmentClick, filteredCount }: SegmentChartProps) {
  const data = Object.entries(segments)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  const allSegments = data.map(s => s.name);

  const handleCardClick = (segmentName: string) => {
    if (onSegmentClick) {
      onSegmentClick(segmentName);
    }
  };

  const handleSelectAll = () => {
    if (onSegmentClick) {
      // Toggle všech segmentů - pokud jsou všechny vybrané, odeber všechny
      if (selectedSegments.length === allSegments.length) {
        allSegments.forEach(() => onSegmentClick(allSegments[0])); // Clear
      } else {
        allSegments.forEach(seg => {
          if (!selectedSegments.includes(seg)) {
            onSegmentClick(seg);
          }
        });
      }
    }
  };

  const handleClearAll = () => {
    if (onSegmentClick && selectedSegments.length > 0) {
      // Klikni na všechny vybrané pro toggle
      selectedSegments.forEach(seg => onSegmentClick(seg));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Segmentace zákazníků</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Vybrat vše
          </button>
          <button
            onClick={handleClearAll}
            disabled={selectedSegments.length === 0}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={14} />
            Zrušit výběr
          </button>
        </div>
      </div>
      
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

      {/* Instrukční box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Klikněte na 1 nebo více karet pro výběr segmentů
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Vybrané segmenty budou zobrazeny v tabulce a budete je moci exportovat do CSV
            </p>
          </div>
        </div>
      </div>

      {/* Segment karty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((segment) => {
          const color = SEGMENT_COLORS[segment.name] || '#6b7280';
          const isActive = selectedSegments.includes(segment.name);

          return (
            <div
              key={segment.name}
              onClick={() => handleCardClick(segment.name)}
              className={`relative rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-4 shadow-xl ring-2 ring-offset-2 scale-105'
                  : 'hover:scale-105 hover:shadow-lg'
              }`}
              style={{
                borderColor: color,
                backgroundColor: isActive ? `${color}20` : `${color}15`,
                ...(isActive && { '--tw-ring-color': color } as any)
              }}
              title="Klikni pro filtrování"
            >
              {/* Checkmark badge */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  style={{ borderColor: color, borderWidth: '2px' }}
                >
                  <Check className="w-4 h-4" style={{ color }} />
                </div>
              )}

              <div className="flex justify-between items-center pr-8">
                <span className={isActive ? 'font-bold' : 'font-semibold'} style={{ color }}>
                  {segment.name}
                </span>
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

      {/* Status bar */}
      {selectedSegments.length > 0 && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-indigo-900">
                → Vybráno: {selectedSegments.length} {selectedSegments.length === 1 ? 'segment' : selectedSegments.length < 5 ? 'segmenty' : 'segmentů'}
              </span>
              <div className="flex gap-1 flex-wrap">
                {selectedSegments.map(seg => (
                  <span
                    key={seg}
                    className="px-2 py-1 bg-white rounded text-xs font-medium border"
                    style={{
                      color: SEGMENT_COLORS[seg] || '#6b7280',
                      borderColor: SEGMENT_COLORS[seg] || '#6b7280'
                    }}
                  >
                    {seg}
                  </span>
                ))}
              </div>
            </div>
            {filteredCount !== undefined && (
              <span className="text-sm text-indigo-700">
                Zobrazeno {filteredCount.toLocaleString('cs-CZ')} z {total.toLocaleString('cs-CZ')} zákazníků
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}