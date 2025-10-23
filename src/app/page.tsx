'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';
import ColumnMapper from '@/components/ColumnMapper';
import DataPreview from '@/components/DataPreview';
import Dashboard from '@/components/Dashboard';
import { Customer, CSVRow, ColumnMapping, DataFilters } from '@/types';
import { processCSVData } from '@/utils/rfmAnalysis';

type AppStep = 'upload' | 'mapping' | 'preview' | 'dashboard';

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentMapping, setCurrentMapping] = useState<ColumnMapping | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCSVLoaded = (data: CSVRow[], cols: string[]) => {
    setCSVData(data);
    setColumns(cols);
    setStep('mapping');
  };

  const handleMapping = (mapping: ColumnMapping) => {
    setCurrentMapping(mapping);
    setStep('preview');
  };

  const handlePreviewConfirm = (filters: DataFilters) => {
    if (!currentMapping) return;

    setLoading(true);
    try {
      // Filtruj data podle vybraných kritérií
      const filteredData = csvData.filter(row => {
        const email = (row[currentMapping.customerEmail] || '').toString().toLowerCase().trim();
        const name = (row[currentMapping.customerName] || '').toString().toLowerCase().trim();

        if (!email) return false;

        // Vyloučit podle manuálního výběru (HLAVNÍ METODA)
        if (filters.manualExcludeEmails.includes(email)) {
          return false;
        }

        // Vyloučit podle keywordů (pokud není v manuálním výběru)
        if (filters.excludeTestData) {
          const hasKeyword = filters.excludeByKeywords.some(keyword =>
            email.includes(keyword) || (name && name.includes(keyword))
          );
          if (hasKeyword) {
            return false;
          }
        }

        return true;
      });

      // TEPRVE TEĎ spusť RFM analýzu
      const processedCustomers = processCSVData(filteredData, currentMapping);
      setCustomers(processedCustomers);
      setStep('dashboard');
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Chyba při zpracování dat. Zkontrolujte mapování sloupců.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewCancel = () => {
    setStep('upload');
    setCSVData([]);
    setColumns([]);
    setCurrentMapping(null);
  };

  const handleReset = () => {
    setStep('upload');
    setCSVData([]);
    setColumns([]);
    setCurrentMapping(null);
    setCustomers([]);
  };

  const handleBackToUpload = () => {
    setStep('upload');
    setCSVData([]);
    setColumns([]);
    setCurrentMapping(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RFM Analýza</h1>
              <p className="text-gray-600 mt-1">Zákaznická segmentace & marketing insights</p>
            </div>
            <div className="flex items-center justify-center" style={{ width: '200px', height: 'auto' }}>
              <img
                src="/logo-niftyminds.png"
                alt="NiftyMinds Agency"
                style={{ width: '150px', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'upload' && (
          <FileUpload onCSVLoaded={handleCSVLoaded} setLoading={setLoading} />
        )}

        {step === 'mapping' && (
          <ColumnMapper
            columns={columns}
            previewData={csvData.slice(0, 10)}
            onMapping={handleMapping}
            onBack={handleBackToUpload}
          />
        )}

        {step === 'preview' && currentMapping && (
          <DataPreview
            data={csvData}
            columnMapping={currentMapping}
            onConfirm={handlePreviewConfirm}
            onCancel={handlePreviewCancel}
          />
        )}

        {step === 'dashboard' && (
          <Dashboard customers={customers} onReset={handleReset} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 <span className="font-semibold">HNK CZ s.r.o.</span>
            </p>
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <a
                href="https://niftyminds.cz/?utm_source=rfm-analysis&utm_medium=app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors underline"
              >
                niftyminds.cz
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}