'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">RFM Analýza</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">Zákaznická segmentace & marketing insights</p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/logo-niftyminds.png"
                alt="NiftyMinds Agency"
                className="w-20 h-auto sm:w-32 lg:w-[150px]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Back to Home Link */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg border-2 border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all font-semibold text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Zpět na hlavní stránku</span>
          <span className="sm:hidden">Zpět</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </main>
  );
}