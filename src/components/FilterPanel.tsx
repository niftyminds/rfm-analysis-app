'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { AdvancedFilters } from '@/types';

interface FilterPanelProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  minValue: number;
  maxValue: number;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount,
  minValue,
  maxValue
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRFMMinChange = (value: number) => {
    onFiltersChange({ ...filters, rfmScoreMin: Math.min(value, filters.rfmScoreMax) });
  };

  const handleRFMMaxChange = (value: number) => {
    onFiltersChange({ ...filters, rfmScoreMax: Math.max(value, filters.rfmScoreMin) });
  };

  const handleValueMinChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, valueMin: Math.min(numValue, filters.valueMax) });
  };

  const handleValueMaxChange = (value: string) => {
    const numValue = parseInt(value) || Infinity;
    onFiltersChange({ ...filters, valueMax: Math.max(numValue, filters.valueMin) });
  };

  const handleOrderMinChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({ ...filters, orderCountMin: Math.min(numValue, filters.orderCountMax) });
  };

  const handleOrderMaxChange = (value: string) => {
    const numValue = parseInt(value) || Infinity;
    onFiltersChange({ ...filters, orderCountMax: Math.max(numValue, filters.orderCountMin) });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, dateFrom: value ? new Date(value) : null });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, dateTo: value ? new Date(value) : null });
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="card-brand mb-6">
      {/* Header - Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-cream-deep transition-colors duration-200 ease-brand"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-ink" size={20} />
          <h3 className="text-lg font-black uppercase tracking-tight text-ink">Pokročilé filtry</h3>
          {activeFilterCount > 0 && (
            <span className="bg-lime text-ink px-3 py-1 font-mono text-xs uppercase tracking-wide">
              {activeFilterCount} aktivní
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className="text-sm text-mute hover:text-ink font-medium px-3 py-1 hover:bg-cream-deep transition-colors duration-200 ease-brand flex items-center gap-1"
            >
              <X size={14} />
              Vymazat filtry
            </button>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-ink-soft" /> : <ChevronDown size={20} className="text-ink-soft" />}
        </div>
      </button>

      {/* Expanded Filter Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-line pt-6">
          {/* RFM Score Range */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-3">
              RFM skóre: {filters.rfmScoreMin} - {filters.rfmScoreMax}
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-wide text-mute w-12">Min:</span>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={filters.rfmScoreMin}
                  onChange={(e) => handleRFMMinChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-cream-deep appearance-none cursor-pointer accent-ink"
                />
                <span className="font-mono text-sm font-medium text-ink w-8">{filters.rfmScoreMin}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-wide text-mute w-12">Max:</span>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={filters.rfmScoreMax}
                  onChange={(e) => handleRFMMaxChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-cream-deep appearance-none cursor-pointer accent-ink"
                />
                <span className="font-mono text-sm font-medium text-ink w-8">{filters.rfmScoreMax}</span>
              </div>
            </div>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-3">
              Hodnota objednávek (Kč)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Od:</label>
                <input
                  type="number"
                  value={filters.valueMin === 0 ? '' : filters.valueMin}
                  onChange={(e) => handleValueMinChange(e.target.value)}
                  placeholder={minValue.toLocaleString('cs-CZ')}
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink placeholder:text-mute"
                />
              </div>
              <span className="text-mute mt-6">—</span>
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Do:</label>
                <input
                  type="number"
                  value={filters.valueMax === Infinity ? '' : filters.valueMax}
                  onChange={(e) => handleValueMaxChange(e.target.value)}
                  placeholder={maxValue.toLocaleString('cs-CZ')}
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink placeholder:text-mute"
                />
              </div>
            </div>
          </div>

          {/* Order Count Range */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-3">
              Počet objednávek
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Min:</label>
                <input
                  type="number"
                  value={filters.orderCountMin === 0 ? '' : filters.orderCountMin}
                  onChange={(e) => handleOrderMinChange(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink placeholder:text-mute"
                />
              </div>
              <span className="text-mute mt-6">—</span>
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Max:</label>
                <input
                  type="number"
                  value={filters.orderCountMax === Infinity ? '' : filters.orderCountMax}
                  onChange={(e) => handleOrderMaxChange(e.target.value)}
                  placeholder="∞"
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink placeholder:text-mute"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-3">
              Datum poslední objednávky
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Od:</label>
                <input
                  type="date"
                  value={formatDateForInput(filters.dateFrom)}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink"
                />
              </div>
              <span className="text-mute mt-6">—</span>
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-wide text-mute mb-1">Do:</label>
                <input
                  type="date"
                  value={formatDateForInput(filters.dateTo)}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink text-ink"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
