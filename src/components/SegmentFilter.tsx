'use client';

import { Filter, X } from 'lucide-react';

interface SegmentFilterProps {
  segments: string[];
  selectedSegments: string[];
  onSegmentChange: (segments: string[]) => void;
  totalCount: number;
  filteredCount: number;
}

const SEGMENT_COLORS: Record<string, string> = {
  'Champions': 'bg-green-100 text-green-800 border-green-300',
  'Loyal Customers': 'bg-blue-100 text-blue-800 border-blue-300',
  'Potential Loyalists': 'bg-purple-100 text-purple-800 border-purple-300',
  'New Customers': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'Promising': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Need Attention': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'At Risk': 'bg-orange-100 text-orange-800 border-orange-300',
  'Cant Lose Them': 'bg-red-100 text-red-800 border-red-300',
  'Lost': 'bg-gray-100 text-gray-800 border-gray-300'
};

export default function SegmentFilter({
  segments,
  selectedSegments,
  onSegmentChange,
  totalCount,
  filteredCount
}: SegmentFilterProps) {
  const handleToggleSegment = (segment: string) => {
    if (selectedSegments.includes(segment)) {
      onSegmentChange(selectedSegments.filter(s => s !== segment));
    } else {
      onSegmentChange([...selectedSegments, segment]);
    }
  };

  const handleSelectAll = () => {
    onSegmentChange(segments);
  };

  const handleClearAll = () => {
    onSegmentChange([]);
  };

  const isFiltered = selectedSegments.length > 0 && selectedSegments.length < segments.length;

  return (
    <div className="card-brand p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="text-ink" size={20} />
          <h3 className="text-lg font-black uppercase tracking-tight text-ink">Filtrovat podle segmentu</h3>
          {selectedSegments.length > 0 && selectedSegments.length < segments.length && (
            <span className="bg-lime text-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] font-medium">
              {selectedSegments.length} vybraných
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-ink font-medium px-3 py-1 hover:bg-lime transition-colors duration-200 ease-brand"
          >
            Vybrat vše
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm text-mute hover:text-ink font-medium px-3 py-1 hover:bg-cream-deep transition-colors duration-200 ease-brand flex items-center gap-1"
          >
            <X size={14} />
            Zrušit výběr
          </button>
        </div>
      </div>

      {/* Segment Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {segments.map(segment => {
          const isSelected = selectedSegments.includes(segment);
          const colorClass = SEGMENT_COLORS[segment] || 'bg-gray-100 text-gray-800 border-gray-300';

          return (
            <label
              key={segment}
              className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-all duration-200 ease-brand ${
                isSelected
                  ? `${colorClass} border-opacity-100`
                  : 'bg-cream-deep text-mute border-black/10 hover:border-black/30'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleSegment(segment)}
                className="w-4 h-4 accent-ink border-black/10 focus:ring-ink"
              />
              <span className="text-sm font-medium flex-1">{segment}</span>
            </label>
          );
        })}
      </div>

      {/* Filter Status */}
      {isFiltered && (
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-sm text-mute">
            Zobrazeno <span className="font-mono font-semibold text-ink">{filteredCount.toLocaleString('cs-CZ')}</span> z{' '}
            <span className="font-mono font-semibold text-ink">{totalCount.toLocaleString('cs-CZ')}</span> zákazníků
          </p>
        </div>
      )}
    </div>
  );
}

export { SEGMENT_COLORS };
