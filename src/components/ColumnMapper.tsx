'use client';

import { useState } from 'react';
import { ArrowRight, Table, AlertCircle } from 'lucide-react';
import { ColumnMapping, CSVRow } from '@/types';

interface ColumnMapperProps {
  columns: string[];
  previewData: CSVRow[];
  onMapping: (mapping: ColumnMapping) => void;
  onBack: () => void;
}

export default function ColumnMapper({ columns, previewData, onMapping, onBack }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({
    orderNumber: '',
    orderDate: '',
    orderValue: '',
    customerName: '',
    customerEmail: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Auto-detect columns based on common names
  const autoDetectColumns = () => {
    const detected: Partial<ColumnMapping> = {};

    columns.forEach(col => {
      const lower = col.toLowerCase();

      if (lower.includes('email') || lower.includes('e-mail')) {
        detected.customerEmail = col;
      } else if (lower.includes('jméno') || lower.includes('jmeno') || lower.includes('name')) {
        detected.customerName = col;
      } else if (lower.includes('číslo objednávky') || lower.includes('cislo objednavky') || lower.includes('order number') || lower.includes('id')) {
        detected.orderNumber = col;
      } else if (lower.includes('datum') || lower.includes('date')) {
        detected.orderDate = col;
      } else if (lower.includes('hodnota') || lower.includes('cena') || lower.includes('price') || lower.includes('value') || lower.includes('amount')) {
        detected.orderValue = col;
      }
    });

    setMapping(prev => ({ ...prev, ...detected }));
  };

  // Auto-detect on mount
  useState(() => {
    autoDetectColumns();
  });

  const handleChange = (field: keyof ColumnMapping, value: string) => {
    setMapping(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateAndSubmit = () => {
    const newErrors: string[] = [];

    if (!mapping.orderNumber) newErrors.push('Vyberte sloupec pro číslo objednávky');
    if (!mapping.orderDate) newErrors.push('Vyberte sloupec pro datum objednávky');
    if (!mapping.orderValue) newErrors.push('Vyberte sloupec pro hodnotu objednávky');
    if (!mapping.customerName) newErrors.push('Vyberte sloupec pro jméno zákazníka');
    if (!mapping.customerEmail) newErrors.push('Vyberte sloupec pro email zákazníka');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onMapping(mapping);
  };

  const fields = [
    { key: 'orderNumber' as keyof ColumnMapping, label: 'Číslo objednávky', description: 'Unikátní identifikátor objednávky' },
    { key: 'orderDate' as keyof ColumnMapping, label: 'Datum objednávky', description: 'Datum vytvoření objednávky' },
    { key: 'orderValue' as keyof ColumnMapping, label: 'Hodnota objednávky', description: 'Celková hodnota objednávky (bez DPH)' },
    { key: 'customerName' as keyof ColumnMapping, label: 'Jméno zákazníka', description: 'Celé jméno nebo příjmení zákazníka' },
    { key: 'customerEmail' as keyof ColumnMapping, label: 'Email zákazníka', description: 'Emailová adresa zákazníka' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Table className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mapování sloupců CSV
          </h2>
          <p className="text-gray-600">
            Přiřaďte sloupce z vašeho CSV souboru k požadovaným polím
          </p>
        </div>

        {/* Column Mapping Form */}
        <div className="space-y-6 mb-8">
          {fields.map(field => (
            <div key={field.key} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                {field.label}
              </label>
              <p className="text-xs text-gray-600 mb-3">{field.description}</p>
              <select
                value={mapping[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Vyberte sloupec --</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>

              {/* Preview */}
              {mapping[field.key] && previewData.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-md p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Náhled dat:</p>
                  <div className="space-y-1">
                    {previewData.slice(0, 3).map((row, idx) => (
                      <p key={idx} className="text-xs text-gray-600 truncate">
                        {row[mapping[field.key]] || '(prázdné)'}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">Chyba v mapování:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview Table */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Náhled CSV dat (první 3 řádky):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-blue-300">
                  {columns.slice(0, 6).map(col => (
                    <th key={col} className="text-left py-2 px-2 font-semibold text-blue-900">
                      {col}
                    </th>
                  ))}
                  {columns.length > 6 && (
                    <th className="text-left py-2 px-2 font-semibold text-blue-900">...</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 3).map((row, idx) => (
                  <tr key={idx} className="border-b border-blue-200">
                    {columns.slice(0, 6).map(col => (
                      <td key={col} className="py-2 px-2 text-blue-800">
                        {row[col] || '-'}
                      </td>
                    ))}
                    {columns.length > 6 && (
                      <td className="py-2 px-2 text-blue-800">...</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Celkem sloupců: {columns.length} | Celkem řádků: {previewData.length}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            ← Zpět
          </button>
          <button
            onClick={validateAndSubmit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            Analyzovat data
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
