'use client';

import { useState, useMemo } from 'react';
import { FileSpreadsheet, Users, AlertCircle, X, Search } from 'lucide-react';
import { DataFilters } from '@/types';

interface DataPreviewProps {
  data: any[];
  columnMapping: {
    customerEmail: string;
    customerName: string;
    orderValue: string;
  };
  onConfirm: (filters: DataFilters) => void;
  onCancel: () => void;
}

interface CustomerRecord {
  email: string;
  name: string;
  orderCount: number;
  totalValue: number;
}

export default function DataPreview({ data, columnMapping, onConfirm, onCancel }: DataPreviewProps) {
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
      const name = (row[columnMapping.customerName] || '').toString().trim();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Kontrola dat před analýzou
          </h2>
          <p className="text-gray-600">
            Zkontroluj a vylučte testovací objednávky pro přesnější RFM analýzu
          </p>
        </div>

        {/* Statistiky */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileSpreadsheet className="text-blue-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Celkem řádků</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {analysis.totalRows.toLocaleString('cs-CZ')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-green-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Unikátní zákazníci</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {analysis.uniqueCustomers.toLocaleString('cs-CZ')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-orange-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Suspektní záznamy</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {analysis.suspiciousCount}
            </p>
          </div>
        </div>

        {/* Nastavení keywordů */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
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

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeywordAndExclude()}
                  placeholder="např. michal@example.com, test, demo..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-600"
                />
                <button
                  onClick={addKeywordAndExclude}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Search size={16} />
                  Najít a vyloučit
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ⚠️ Detekované testovací objednávky
                </h3>
                <p className="text-sm text-gray-600">
                  Kliknutím na řádek přepneš vyloučení/zahrnutí zákazníka
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allEmails = analysis.suspiciousRecords.map(r => r.email);
                    setFilters(prev => ({ ...prev, manualExcludeEmails: allEmails }));
                  }}
                  className="px-4 py-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-medium"
                >
                  Vyloučit vše
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, manualExcludeEmails: [] }));
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Zrušit výběr
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
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
                          {record.name}
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

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-900">
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
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            ← Nahrát jiný soubor
          </button>
          <button
            onClick={() => onConfirm(filters)}
            className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
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
