'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';
import ColumnMapper from '@/components/ColumnMapper';
import Dashboard from '@/components/Dashboard';
import { Customer, CSVRow, ColumnMapping } from '@/types';
import { processCSVData } from '@/utils/rfmAnalysis';

type AppStep = 'upload' | 'mapping' | 'dashboard';

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCSVLoaded = (data: CSVRow[], cols: string[]) => {
    setCSVData(data);
    setColumns(cols);
    setStep('mapping');
  };

  const handleMapping = (mapping: ColumnMapping) => {
    setLoading(true);
    try {
      const processedCustomers = processCSVData(csvData, mapping);
      setCustomers(processedCustomers);
      setStep('dashboard');
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Chyba při zpracování dat. Zkontrolujte mapování sloupců.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setCSVData([]);
    setColumns([]);
    setCustomers([]);
  };

  const handleBackToUpload = () => {
    setStep('upload');
    setCSVData([]);
    setColumns([]);
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
            <div className="flex items-center">
              <Image
                src="/logo-niftyminds.svg"
                alt="NiftyMinds Agency"
                width={300}
                height={67}
                priority
                className="h-auto w-auto max-w-[300px]"
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
              Powered by <span className="text-indigo-600 font-semibold">NiftyMinds Agency</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}