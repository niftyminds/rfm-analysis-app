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
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-600 rounded-lg p-2">
          <DollarSign className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">CLV Nastavení</h3>
          <p className="text-sm text-gray-600">Konfigurace predikce Customer Lifetime Value</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profit Margin */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="flex-1 h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="bg-emerald-100 rounded-lg px-4 py-2 min-w-[80px] text-center">
              <span className="text-2xl font-bold text-emerald-700">
                {(settings.profitMargin * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Jaká část z tržeb je čistý zisk? Typicky 20-40% pro e-commerce.
          </p>
        </div>

        {/* Projection Months */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Projekce na měsíců
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[6, 12, 18, 24].map((months) => (
              <button
                key={months}
                onClick={() => handleProjectionMonthsChange(months)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  settings.projectionMonths === months
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {months}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Predikce budoucí hodnoty zákazníka na vybraný počet měsíců.
          </p>
        </div>

        {/* Churn Analysis Toggle */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="churnAnalysis"
              checked={settings.includeChurnAnalysis}
              onChange={handleChurnAnalysisToggle}
              className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="churnAnalysis" className="block text-sm font-semibold text-gray-700 cursor-pointer">
                Zahrnout analýzu churn rizika
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Vypočítá pravděpodobnost odchodu zákazníka na základě recency a průměrného intervalu mezi objednávkami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-xs text-blue-900 font-medium">
              Tato nastavení ovlivňují výpočet predikovaného CLV
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Po změně nastavení bude nutné znovu zpracovat data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
