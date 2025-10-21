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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Filtrovat podle segmentu</h3>
          {selectedSegments.length > 0 && selectedSegments.length < segments.length && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              {selectedSegments.length} vybraných
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Vybrat vše
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1"
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
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? `${colorClass} border-opacity-100`
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleSegment(segment)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium flex-1">{segment}</span>
            </label>
          );
        })}
      </div>

      {/* Filter Status */}
      {isFiltered && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Zobrazeno <span className="font-semibold text-gray-900">{filteredCount.toLocaleString('cs-CZ')}</span> z{' '}
            <span className="font-semibold text-gray-900">{totalCount.toLocaleString('cs-CZ')}</span> zákazníků
          </p>
        </div>
      )}
    </div>
  );
}

export { SEGMENT_COLORS };
