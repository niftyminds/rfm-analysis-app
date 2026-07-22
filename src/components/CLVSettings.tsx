'use client';

import { CLVSettings } from '@/types';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface CLVSettingsProps {
  settings: CLVSettings;
  onSettingsChange: (settings: CLVSettings) => void;
}

export default function CLVSettingsComponent({ settings, onSettingsChange }: CLVSettingsProps) {
  const handleProfitMarginChange = (value: number) => {
    onSettingsChange({
      ...settings,
      profitMargin: value / 100 // Convert percentage to decimal
    });
  };

  const handleProjectionMonthsChange = (value: number) => {
    onSettingsChange({
      ...settings,
      projectionMonths: value
    });
  };

  const handleChurnAnalysisToggle = () => {
    onSettingsChange({
      ...settings,
      includeChurnAnalysis: !settings.includeChurnAnalysis
    });
  };

  return (
    <div className="bg-cream-deep p-6 border border-black/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-ink p-2">
          <DollarSign className="text-lime" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-ink">CLV Nastavení</h3>
          <p className="text-sm text-mute">Konfigurace predikce Customer Lifetime Value</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profit Margin */}
        <div className="bg-card p-4 border border-black/10">
          <label className="block text-sm font-semibold text-ink-soft mb-2">
            Profit Margin (zisková marže)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.profitMargin * 100}
              onChange={(e) => handleProfitMarginChange(Number(e.target.value))}
              className="flex-1 h-2 bg-cream-deep appearance-none cursor-pointer accent-ink"
            />
            <div className="bg-lime px-4 py-2 min-w-[80px] text-center">
              <span className="text-2xl font-black tracking-tight text-ink">
                {(settings.profitMargin * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-mute mt-2">
            Jaká část z tržeb je čistý zisk? Typicky 20-40% pro e-commerce.
          </p>
        </div>

        {/* Projection Months */}
        <div className="bg-card p-4 border border-black/10">
          <label className="block text-sm font-semibold text-ink-soft mb-2">
            Projekce na měsíců
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[6, 12, 18, 24].map((months) => (
              <button
                key={months}
                onClick={() => handleProjectionMonthsChange(months)}
                className={`py-3 px-4 font-mono font-semibold transition-all duration-200 ease-brand ${
                  settings.projectionMonths === months
                    ? 'bg-lime text-ink'
                    : 'bg-cream-deep text-ink-soft hover:bg-lime-deep'
                }`}
              >
                {months}
              </button>
            ))}
          </div>
          <p className="text-xs text-mute mt-2">
            Predikce budoucí hodnoty zákazníka na vybraný počet měsíců.
          </p>
        </div>

        {/* Churn Analysis Toggle */}
        <div className="bg-card p-4 border border-black/10">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="churnAnalysis"
              checked={settings.includeChurnAnalysis}
              onChange={handleChurnAnalysisToggle}
              className="mt-1 w-5 h-5 accent-ink focus:ring-ink cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="churnAnalysis" className="block text-sm font-semibold text-ink-soft cursor-pointer">
                Zahrnout analýzu churn rizika
              </label>
              <p className="text-xs text-mute mt-1">
                Vypočítá pravděpodobnost odchodu zákazníka na základě recency a průměrného intervalu mezi objednávkami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-card border border-line">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-ink flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-xs text-ink font-medium">
              Tato nastavení ovlivňují výpočet predikovaného CLV
            </p>
            <p className="text-xs text-mute mt-1">
              Po změně nastavení bude nutné znovu zpracovat data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
