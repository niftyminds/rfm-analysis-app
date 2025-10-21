'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import { Customer } from '@/types';

export default function Home() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDataProcessed = (data: Customer[]) => {
    setCustomers(data);
    setLoading(false);
  };

  const handleReset = () => {
    setCustomers(null);
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-indigo-600">NiftyMinds</span>
              <span>Agency</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!customers ? (
          <FileUpload onDataProcessed={handleDataProcessed} setLoading={setLoading} />
        ) : (
          <Dashboard customers={customers} onReset={handleReset} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 NiftyMinds Agency. Všechna práva vyhrazena.
          </p>
        </div>
      </footer>
    </main>
  );
}