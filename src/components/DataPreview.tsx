'use client';

import { useState, useMemo } from 'react';
import { FileSpreadsheet, Users, AlertCircle, X, Search } from 'lucide-react';
import { DataFilters, CLVSettings } from '@/types';
import CLVSettingsComponent from './CLVSettings';

interface DataPreviewProps {
  data: any[];
  columnMapping: {
    customerEmail: string;
    customerName?: string; // Volitelné - může být undefined
    orderValue: string;
  };
  clvSettings: CLVSettings;
  onClvSettingsChange: (settings: CLVSettings) => void;
  onConfirm: (filters: DataFilters) => void;
  onCancel: () => void;
}

interface CustomerRecord {
  email: string;
  name: string;
  orderCount: number;
  totalValue: number;
}

export default function DataPreview({ data, columnMapping, clvSettings, onClvSettingsChange, onConfirm, onCancel }: DataPreviewProps) {
  const [filters, setFilters] = useState<DataFilters>({
    excludeTestData: true,
    excludeByKeywords: ['test', 'demo', 'admin', 'spam', 'example'],
    manualExcludeEmails: []
  });

  const [customKeyword, setCustomKeyword] = useState('');

  // Analyzuj data a detekuj potenciální problémy
  const analysis = useMemo(() => {
    const uniqueCustomers = new Map<string, CustomerRecord>();
    const suspiciousRecords: CustomerRecord[] = [];

    // Agreguj podle emailu
    data.forEach(row => {
      const email = (row[columnMapping.customerEmail] || '').toString().toLowerCase().trim();
      // Jméno je volitelné - pokud není v mappingu, použij prázdný string
      const name = columnMapping.customerName ? (row[columnMapping.customerName] || '').toString().trim() : '';
      const valueStr = (row[columnMapping.orderValue] || '0').toString().replace(/\s/g, '').replace(',', '.');
      const value = parseFloat(valueStr) || 0;

      if (!email) return;

      if (!uniqueCustomers.has(email)) {
        uniqueCustomers.set(email, {
          email,
          name,
          orderCount: 0,
          totalValue: 0
        });
      }

      const customer = uniqueCustomers.get(email)!;
      customer.orderCount++;
      customer.totalValue += value;
    });

    // Detekce suspektních záznamů podle keywordů
    const keywords = filters.excludeByKeywords.map(k => k.toLowerCase());

    uniqueCustomers.forEach((customer) => {
      const emailLower = customer.email.toLowerCase();
      const nameLower = customer.name?.toLowerCase() || '';

      const isSuspicious = keywords.some(keyword =>
        emailLower.includes(keyword) || nameLower.includes(keyword)
      );

      if (isSuspicious) {
        suspiciousRecords.push(customer);
      }
    });

    // Seřaď podle hodnoty (aby test objednávky se statisíci byly nahoře)
    suspiciousRecords.sort((a, b) => b.totalValue - a.totalValue);

    return {
      totalRows: data.length,
      uniqueCustomers: uniqueCustomers.size,
      suspiciousRecords,
      suspiciousCount: suspiciousRecords.length,
      keywords,
      allCustomers: uniqueCustomers
    };
  }, [data, filters.excludeByKeywords, columnMapping]);

  // Toggle vyloučení konkrétního emailu
  const toggleExcludeEmail = (email: string) => {
    setFilters(prev => {
      const newExcluded = prev.manualExcludeEmails.includes(email)
        ? prev.manualExcludeEmails.filter(e => e !== email)
        : [...prev.manualExcludeEmails, email];
      return { ...prev, manualExcludeEmails: newExcluded };
    });
  };

  // Přidat keyword a vyloučit matching zákazníky
  const addKeywordAndExclude = () => {
    if (!customKeyword.trim()) return;

    const keyword = customKeyword.toLowerCase().trim();

    // Najdi všechny matching zákazníky
    const matchingEmails: string[] = [];
    analysis.allCustomers.forEach((customer) => {
      if (customer.email.includes(keyword) ||
        (customer.name && customer.name.toLowerCase().includes(keyword))) {
        matchingEmails.push(customer.email);
      }
    });

    // Přidej keyword (pokud ještě není)
    const keywordExists = filters.excludeByKeywords.includes(keyword);

    setFilters(prev => {
      const newKeywords = keywordExists
        ? prev.excludeByKeywords
        : [...prev.excludeByKeywords, keyword];

      const newExcluded = new Set([...prev.manualExcludeEmails, ...matchingEmails]);

      return {
        ...prev,
        excludeByKeywords: newKeywords,
        manualExcludeEmails: Array.from(newExcluded)
      };
    });

    // Feedback
    if (matchingEmails.length > 0) {
      alert(`✅ Vyloučeno ${matchingEmails.length} zákazníků obsahujících "${customKeyword}"`);
    } else {
      alert(`❌ Nebyli nalezeni žádní zákazníci s "${customKeyword}"`);
    }

    setCustomKeyword('');
  };

  // Odstranit keyword (a znovu zahrnout zákazníky s tímto keywordem)
  const removeKeyword = (keyword: string) => {
    setFilters(prev => {
      // Najdi zákazníky, kteří mají pouze tento keyword
      const emailsToReinclude: string[] = [];

      analysis.allCustomers.forEach((customer) => {
        const emailLower = customer.email.toLowerCase();
        const nameLower = customer.name?.toLowerCase() || '';

        // Pokud má tento keyword a není v jiných keywords
        if (emailLower.includes(keyword) || nameLower.includes(keyword)) {
          const hasOtherKeyword = prev.excludeByKeywords
            .filter(k => k !== keyword)
            .some(k => emailLower.includes(k) || nameLower.includes(k));

          if (!hasOtherKeyword) {
            emailsToReinclude.push(customer.email);
          }
        }
      });

      // Odstranit keyword a znovu zahrnout zákazníky
      return {
        ...prev,
        excludeByKeywords: prev.excludeByKeywords.filter(k => k !== keyword),
        manualExcludeEmails: prev.manualExcludeEmails.filter(e => !emailsToReinclude.includes(e))
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            🔍 Kontrola dat před analýzou
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Zkontroluj a vylučte testovací objednávky pro přesnější RFM analýzu
          </p>
        </div>

        {/* Statistiky */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <FileSpreadsheet className="text-blue-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Celkem řádků</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">
              {analysis.totalRows.toLocaleString('cs-CZ')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className="text-green-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Unikátní zákazníci</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">
              {analysis.uniqueCustomers.toLocaleString('cs-CZ')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Suspektní záznamy</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-900">
              {analysis.suspiciousCount}
            </p>
          </div>
        </div>

        {/* Nastavení keywordů */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔧 Nastavení detekce
          </h3>

          <div className="space-y-6">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Klíčová slova pro detekci (v názvu nebo emailu):
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {filters.excludeByKeywords.map(keyword => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeywordAndExclude()}
                  placeholder="např. michal@example.com, test, demo..."
                  className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-base text-gray-900 placeholder:text-gray-700 min-h-[48px] sm:min-h-0"
                />
                <button
                  onClick={addKeywordAndExclude}
                  className="px-4 sm:px-6 py-3 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 min-h-[48px] sm:min-h-0 whitespace-nowrap"
                >
                  <Search size={16} />
                  <span>Najít a vyloučit</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Hledání funguje v emailu i jméně (např. &quot;test&quot; najde &quot;test@example.com&quot; i &quot;Test User&quot;)
              </p>
            </div>
          </div>
        </div>

        {/* Detekované suspektní záznamy */}
        {analysis.suspiciousRecords.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  ⚠️ Detekované testovací objednávky
                </h3>
                <p className="text-sm text-gray-600">
                  Kliknutím na řádek přepneš vyloučení/zahrnutí zákazníka
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const allEmails = analysis.suspiciousRecords.map(r => r.email);
                    setFilters(prev => ({ ...prev, manualExcludeEmails: allEmails }));
                  }}
                  className="px-4 py-3 sm:py-2 text-sm bg-orange-100 hover:bg-orange-200 active:bg-orange-300 text-orange-800 rounded-lg font-medium min-h-[48px] sm:min-h-0 whitespace-nowrap"
                >
                  Vyloučit vše
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, manualExcludeEmails: [] }));
                  }}
                  className="px-4 py-3 sm:py-2 text-sm bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg font-medium min-h-[48px] sm:min-h-0 whitespace-nowrap"
                >
                  Zrušit výběr
                </button>
              </div>
            </div>

            {/* MOBILE CARD LAYOUT */}
            <div className="lg:hidden space-y-3">
              {analysis.suspiciousRecords.map((record) => {
                const isExcluded = filters.manualExcludeEmails.includes(record.email);
                return (
                  <div
                    key={record.email}
                    onClick={() => toggleExcludeEmail(record.email)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors active:scale-[0.98] ${
                      isExcluded
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={isExcluded}
                        onChange={() => { }}
                        className="w-5 h-5 text-red-600 rounded cursor-pointer mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-base truncate">
                          {record.name || record.email}
                        </h4>
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                          {record.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pl-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Objednávky</p>
                        <p className="font-semibold text-gray-900">{record.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Celková hodnota</p>
                        <p className="font-semibold text-gray-900">
                          {Math.round(record.totalValue).toLocaleString('cs-CZ')} Kč
                        </p>
                      </div>
                    </div>

                    {isExcluded && (
                      <div className="mt-3 pt-3 border-t border-red-200 pl-8">
                        <p className="text-xs font-medium text-red-800">
                          ✓ Tento záznam bude vyloučen z analýzy
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE LAYOUT */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12"></th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Jméno</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Objednávky</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Celková hodnota</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.suspiciousRecords.map((record) => {
                    const isExcluded = filters.manualExcludeEmails.includes(record.email);
                    return (
                      <tr
                        key={record.email}
                        onClick={() => toggleExcludeEmail(record.email)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors
                                  ${isExcluded ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isExcluded}
                            onChange={() => { }}
                            className="w-5 h-5 text-red-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {record.name || record.email}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {record.email}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          {record.orderCount}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          {Math.round(record.totalValue).toLocaleString('cs-CZ')} Kč
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filters.manualExcludeEmails.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900">
                  🗑️ Vyloučeno: {filters.manualExcludeEmails.length} zákazníků
                </p>
              </div>
            )}
          </div>
        )}

        {/* CLV Settings */}
        <div className="mb-4 sm:mb-6">
          <CLVSettingsComponent
            settings={clvSettings}
            onSettingsChange={onClvSettingsChange}
          />
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs sm:text-sm text-blue-900">
              <p className="font-semibold mb-2">💡 Důležité:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Testovací objednávky často mají vysoké hodnoty (statisíce Kč)</li>
                <li>Nelze je spolehlivě detekovat jen podle částky</li>
                <li>Zkontroluj detekované záznamy a ručně vylučte test objednávky</li>
                <li>Vyloučení test dat zajistí přesnější RFM segmentaci</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Akční tlačítka */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-colors min-h-[52px] text-base"
          >
            ← Nahrát jiný soubor
          </button>
          <button
            onClick={() => onConfirm(filters)}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg sm:rounded-xl font-semibold transition-colors shadow-lg min-h-[52px] text-base"
          >
            Pokračovat v analýze
            {filters.manualExcludeEmails.length > 0 &&
              ` (vyloučeno ${filters.manualExcludeEmails.length})`
            } →
          </button>
        </div>
      </div>
    </div>
  );
}
