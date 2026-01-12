'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import ColumnMapper from '@/components/ColumnMapper';
import DataPreview from '@/components/DataPreview';
import Dashboard from '@/components/Dashboard';
import { Customer, CSVRow, ColumnMapping, DataFilters, CLVSettings } from '@/types';

type AppStep = 'upload' | 'mapping' | 'preview' | 'dashboard';

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentMapping, setCurrentMapping] = useState<ColumnMapping | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState<string>('');
  const workerRef = useRef<Worker>();

  // CLV Settings - user configurable
  const [clvSettings, setClvSettings] = useState<CLVSettings>({
    profitMargin: 0.30, // 30% profit margin
    projectionMonths: 12,
    includeChurnAnalysis: true
  });

  // Initialize Web Worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('../../workers/rfm.worker.ts', import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, progress, phase, customers, error } = e.data;

      if (type === 'progress') {
        setProcessingProgress(progress);
        setProcessingPhase(phase);
      } else if (type === 'complete') {
        console.log(`✅ RFM analýza dokončena: ${customers.length} zákazníků`);

        // CLV statistics
        const avgCLV = customers.reduce((sum: number, c: Customer) => sum + c.lifetimeCLV, 0) / customers.length;
        const totalPredicted = customers.reduce((sum: number, c: Customer) => sum + c.predictedCLV, 0);
        const avgChurn = customers.reduce((sum: number, c: Customer) => sum + c.churnProbability, 0) / customers.length;
        const highValueCount = customers.filter((c: Customer) => c.clvSegment === 'High Value').length;

        console.log(`💰 CLV Metriky:`);
        console.log(`  - Průměrné CLV: ${Math.round(avgCLV).toLocaleString('cs-CZ')} Kč`);
        console.log(`  - Celkové predikované CLV: ${Math.round(totalPredicted).toLocaleString('cs-CZ')} Kč`);
        console.log(`  - Průměrná churn pravděpodobnost: ${(avgChurn * 100).toFixed(1)}%`);
        console.log(`  - High Value zákazníků: ${highValueCount} (${((highValueCount/customers.length)*100).toFixed(1)}%)`);

        setCustomers(customers);
        setStep('dashboard');
        setLoading(false);
        setProcessingProgress(0);
        setProcessingPhase('');
      } else if (type === 'error') {
        console.error('Worker error:', error);
        alert('Chyba při zpracování dat: ' + error);
        setLoading(false);
        setProcessingProgress(0);
        setProcessingPhase('');
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

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
    if (!currentMapping || !workerRef.current) return;

    setLoading(true);
    setProcessingProgress(0);
    setProcessingPhase('aggregation');

    // Filtruj data podle vybraných kritérií
    const filteredData = csvData.filter(row => {
      const email = (row[currentMapping.customerEmail] || '').toString().toLowerCase().trim();
      const name = currentMapping.customerName ? (row[currentMapping.customerName] || '').toString().toLowerCase().trim() : '';

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
    console.log(`⚙️ Spouštím Web Worker pro RFM analýzu...`);
    console.log(`💰 CLV Settings: Profit Margin ${clvSettings.profitMargin * 100}%, Projekce ${clvSettings.projectionMonths} měsíců`);

    // Pošli data do Web Workera včetně CLV settings
    workerRef.current.postMessage({
      type: 'process',
      data: filteredData,
      mapping: currentMapping,
      clvSettings: clvSettings
    });
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
            clvSettings={clvSettings}
            onClvSettingsChange={setClvSettings}
            onConfirm={handlePreviewConfirm}
            onCancel={handlePreviewCancel}
          />
        )}

        {step === 'dashboard' && (
          <Dashboard customers={customers} onReset={handleReset} />
        )}
      </div>

      {/* Loading Overlay with Progress Bar */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                {/* Rotating ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Zpracovávám RFM analýzu
              </h3>

              {/* Progress percentage */}
              <div className="text-4xl font-bold text-indigo-600">
                {Math.round(processingProgress)}%
              </div>

              {/* Phase indicator */}
              <div className="text-sm font-medium text-gray-600">
                {processingPhase === 'aggregation' && '📊 Agregace objednávek...'}
                {processingPhase === 'customer_creation' && '👥 Vytváření zákazníků...'}
                {processingPhase === 'rfm_scoring' && '🎯 Výpočet RFM skóre...'}
                {processingPhase === 'clv_segmentation' && '💰 Výpočet CLV & segmentace...'}
                {!processingPhase && 'Zahajuji zpracování...'}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>

              {/* Data info */}
              <p className="text-sm text-gray-500 mt-4">
                Zpracovávám {csvData.length.toLocaleString('cs-CZ')} řádků dat
              </p>

              {/* Animated dots */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Web Worker zajišťuje plynulý chod prohlížeče
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}