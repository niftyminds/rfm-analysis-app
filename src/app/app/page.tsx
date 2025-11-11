'use client';

import { useState, useEffect } from 'react';
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

  // Scroll to top when step changes (instant, no animation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

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

    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
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

        console.log(`📊 Zpracovávám ${filteredData.length} řádků z ${csvData.length} celkových...`);

        // TEPRVE TEĎ spusť RFM analýzu
        const processedCustomers = processCSVData(filteredData, currentMapping);

        console.log(`✅ RFM analýza dokončena: ${processedCustomers.length} zákazníků`);

        setCustomers(processedCustomers);
        setStep('dashboard');
      } catch (error) {
        console.error('Error processing data:', error);
        alert('Chyba při zpracování dat. Zkontrolujte mapování sloupců.');
      } finally {
        setLoading(false);
      }
    }, 100);
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
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">RFM Analýza</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">Zákaznická segmentace & marketing insights</p>
            </div>

            {/* Center: Home Icon */}
            <Link
              href="/"
              className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-xl transition-all hover:scale-110 shadow-sm hover:shadow-md flex-shrink-0"
              title="Zpět na hlavní stránku"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Right: Logo */}
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            {/* Spinner */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Zpracovávám RFM analýzu...
              </h3>
              <p className="text-gray-600">
                Analyzuji {csvData.length.toLocaleString('cs-CZ')} řádků dat
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>Prosím čekejte</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                U velkých souborů může zpracování trvat několik sekund
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}