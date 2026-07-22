'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check } from 'lucide-react';

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

const MONO_TICK = { fill: '#6B6760', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono), monospace' };

export default function SegmentChart({ segments, total, selectedSegments = [], onSegmentClick, filteredCount }: SegmentChartProps) {
  const data = Object.entries(segments)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  const handleCardClick = (segmentName: string) => {
    if (onSegmentClick) {
      onSegmentClick(segmentName);
    }
  };

  return (
    <div className="card-brand p-8">
      <h2 className="text-2xl font-black uppercase tracking-tight text-ink mb-6">Segmentace zákazníků</h2>

      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              interval={0}
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
                      <p className="text-ink-soft font-mono text-sm">Počet: {data.count}</p>
                      <p className="text-ink-soft font-mono text-sm">Podíl: {data.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Instrukční box */}
      <div className="mb-6 p-4 bg-cream-deep border border-line">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div>
            <p className="text-sm text-ink font-medium">
              Klikněte na 1 nebo více karet pro výběr segmentů
            </p>
            <p className="text-xs text-mute mt-1">
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
              className={`relative p-4 border-2 transition-all duration-200 ease-brand cursor-pointer ${
                isActive
                  ? 'border-4'
                  : 'hover:-translate-y-0.5'
              }`}
              style={{
                borderColor: color,
                backgroundColor: isActive ? `${color}20` : `${color}15`
              }}
              title="Klikni pro filtrování"
            >
              {/* Checkmark badge */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 bg-card p-1"
                  style={{ borderColor: color, borderWidth: '2px' }}
                >
                  <Check className="w-4 h-4" style={{ color }} />
                </div>
              )}

              <div className="flex justify-between items-center pr-8">
                <span className={isActive ? 'font-bold' : 'font-semibold'} style={{ color }}>
                  {segment.name}
                </span>
                <span className="text-2xl font-black tracking-tight" style={{ color }}>{segment.count}</span>
              </div>
              <div className="mt-2 bg-card h-2">
                <div
                  className="h-2 transition-all duration-500 ease-brand"
                  style={{
                    width: `${segment.percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1 font-mono font-medium" style={{ color }}>{segment.percentage}%</p>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      {selectedSegments.length > 0 && (
        <div className="mt-6 p-4 bg-cream-deep border border-line">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-ink">
                → Vybráno: {selectedSegments.length} {selectedSegments.length === 1 ? 'segment' : selectedSegments.length < 5 ? 'segmenty' : 'segmentů'}
              </span>
              <div className="flex gap-1 flex-wrap">
                {selectedSegments.map(seg => (
                  <span
                    key={seg}
                    className="px-2 py-1 bg-card text-xs font-medium border"
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
              <span className="text-sm text-mute font-mono">
                Zobrazeno {filteredCount.toLocaleString('cs-CZ')} z {total.toLocaleString('cs-CZ')} zákazníků
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}