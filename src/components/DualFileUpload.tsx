'use client';

import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Link as LinkIcon } from 'lucide-react';
import Papa from 'papaparse';
import { detectCommonColumns, suggestMergeKey, validateMergeKey, mergeCSVData } from '@/utils/csvMerge';

interface DualFileUploadProps {
  onDataReady: (data: any[], headers: string[]) => void;
}

export default function DualFileUpload({ onDataReady }: DualFileUploadProps) {
  // File states
  const [ordersFile, setOrdersFile] = useState<File | null>(null);
  const [customersFile, setCustomersFile] = useState<File | null>(null);

  // Parsed data
  const [ordersData, setOrdersData] = useState<any[] | null>(null);
  const [customersData, setCustomersData] = useState<any[] | null>(null);
  const [ordersHeaders, setOrdersHeaders] = useState<string[]>([]);
  const [customersHeaders, setCustomersHeaders] = useState<string[]>([]);

  // Merge settings
  const [commonColumns, setCommonColumns] = useState<string[]>([]);
  const [selectedMergeKey, setSelectedMergeKey] = useState<string>('');
  const [mergeStats, setMergeStats] = useState<any>(null);

  // UI states
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'select-key' | 'preview'>('upload');

  // Handle file selection
  const handleFileSelect = async (file: File, type: 'orders' | 'customers') => {
    setError('');

    if (type === 'orders') {
      setOrdersFile(file);
      await parseFile(file, 'orders');
    } else {
      setCustomersFile(file);
      await parseFile(file, 'customers');
    }
  };

  // Parse CSV file
  const parseFile = async (file: File, type: 'orders' | 'customers') => {
    return new Promise<void>((resolve) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const data = results.data;

          if (type === 'orders') {
            setOrdersData(data);
            setOrdersHeaders(headers);
            console.log(`📦 Objednávky: ${data.length} řádků, ${headers.length} sloupců`);
          } else {
            setCustomersData(data);
            setCustomersHeaders(headers);
            console.log(`👥 Zákazníci: ${data.length} řádků, ${headers.length} sloupců`);
          }

          resolve();
        },
        error: (error) => {
          setError(`Chyba při čtení souboru: ${error.message}`);
          resolve();
        }
      });
    });
  };

  // Auto-detect when both files are uploaded
  React.useEffect(() => {
    if (ordersData && customersData && ordersHeaders.length && customersHeaders.length) {
      const common = detectCommonColumns(ordersHeaders, customersHeaders);
      setCommonColumns(common);

      if (common.length > 0) {
        const suggested = suggestMergeKey(common);
        if (suggested) {
          setSelectedMergeKey(suggested);
        }
        setStep('select-key');
      } else {
        setError('Soubory nemají žádný společný sloupec pro spojení dat.');
      }
    }
  }, [ordersData, customersData, ordersHeaders, customersHeaders]);

  // Handle merge
  const handleMerge = () => {
    if (!ordersData || !customersData || !selectedMergeKey) {
      setError('Chybí data nebo merge klíč');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Validace
    const validation = validateMergeKey(ordersData, customersData, selectedMergeKey);
    if (!validation.valid) {
      setError(validation.error || 'Neplatný merge klíč');
      setIsProcessing(false);
      return;
    }

    // Merge
    try {
      const result = mergeCSVData(ordersData, customersData, selectedMergeKey);
      setMergeStats(result.stats);
      setStep('preview');

      // Po krátkém delay pokračuj na další krok
      setTimeout(() => {
        // Kombinované headery (z obou souborů, unikátní)
        const allHeaders = Array.from(new Set([...ordersHeaders, ...customersHeaders]));
        onDataReady(result.mergedData, allHeaders);
      }, 2000);

    } catch (err: any) {
      setError(`Chyba při slučování dat: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove file
  const handleRemoveFile = (type: 'orders' | 'customers') => {
    if (type === 'orders') {
      setOrdersFile(null);
      setOrdersData(null);
      setOrdersHeaders([]);
    } else {
      setCustomersFile(null);
      setCustomersData(null);
      setCustomersHeaders([]);
    }
    setStep('upload');
    setCommonColumns([]);
    setSelectedMergeKey('');
    setMergeStats(null);
    setError('');
  };

  // File drop zone component
  const FileDropZone = ({
    type,
    file,
    data,
    onSelect,
    onRemove
  }: {
    type: 'orders' | 'customers';
    file: File | null;
    data: any[] | null;
    onSelect: (file: File) => void;
    onRemove: () => void;
  }) => {
    const title = type === 'orders' ? '📦 Soubor s objednávkami' : '👥 Soubor se zákazníky';
    const description = type === 'orders'
      ? 'Obsahuje: číslo obj., datum, hodnota, email/ID'
      : 'Obsahuje: email/ID, jméno, příjmení, telefon, adresa';

    return (
      <div className="border-2 border-dashed border-black/20 p-6 hover:border-ink transition-colors duration-200 ease-brand">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelect(file);
          }}
          className="hidden"
          id={`file-${type}`}
        />

        {!file ? (
          <label
            htmlFor={`file-${type}`}
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-mute mb-3" />
            <h3 className="font-black uppercase tracking-tight text-ink mb-1">{title}</h3>
            <p className="text-sm text-mute text-center mb-4">{description}</p>
            <span className="text-sm text-ink font-medium underline">
              Klikněte pro výběr souboru
            </span>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-ink" />
                <div>
                  <p className="font-medium text-ink flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-deep flex-shrink-0"></span>
                    {file.name}
                  </p>
                  <p className="text-xs font-mono text-mute">
                    {data?.length || 0} řádků
                  </p>
                </div>
              </div>
              <button
                onClick={onRemove}
                className="p-1 hover:bg-cream-deep transition-colors duration-200 ease-brand"
              >
                <X className="w-5 h-5 text-mute" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Upload Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileDropZone
          type="orders"
          file={ordersFile}
          data={ordersData}
          onSelect={(file) => handleFileSelect(file, 'orders')}
          onRemove={() => handleRemoveFile('orders')}
        />

        <FileDropZone
          type="customers"
          file={customersFile}
          data={customersData}
          onSelect={(file) => handleFileSelect(file, 'customers')}
          onRemove={() => handleRemoveFile('customers')}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-card border border-red-600/40 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700">Chyba</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step 2: Select Merge Key */}
      {step === 'select-key' && commonColumns.length > 0 && (
        <div className="bg-cream-deep border border-black/10 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <LinkIcon className="w-6 h-6 text-ink flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-black uppercase tracking-tight text-ink mb-2">
                Vyberte klíč pro spojení dat
              </h3>
              <p className="text-sm text-mute mb-4">
                Nalezeno {commonColumns.length} společných sloupců. Vyberte, podle kterého se mají data sloučit.
              </p>

              <div className="space-y-2">
                {commonColumns.map((column) => (
                  <label
                    key={column}
                    className="flex items-center gap-3 p-3 bg-card border border-black/10 hover:border-ink cursor-pointer transition-colors duration-200 ease-brand"
                  >
                    <input
                      type="radio"
                      name="mergeKey"
                      value={column}
                      checked={selectedMergeKey === column}
                      onChange={(e) => setSelectedMergeKey(e.target.value)}
                      className="w-4 h-4 accent-ink"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-ink">{column}</span>
                      {column === suggestMergeKey(commonColumns) && (
                        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.16em] bg-lime text-ink px-2 py-1">
                          Doporučeno
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleMerge}
                disabled={!selectedMergeKey || isProcessing}
                className="btn-brand btn-ink mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-lime"></div>
                    Slučuji data...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    Sloučit data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Merge Preview */}
      {step === 'preview' && mergeStats && (
        <div className="bg-lime/20 border border-black/10 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-ink flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-black uppercase tracking-tight text-ink mb-2">
                ✅ Sloučení dokončeno
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Celkem objednávek</p>
                  <p className="text-2xl font-black tracking-tight text-ink">{mergeStats.totalOrders}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Spárováno</p>
                  <p className="text-2xl font-black tracking-tight text-ink">{mergeStats.matchedCustomers}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Nespárováno</p>
                  <p className="text-2xl font-black tracking-tight text-ink">{mergeStats.unmatchedOrders}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Úspěšnost</p>
                  <p className="text-2xl font-black tracking-tight text-ink">{mergeStats.matchRate.toFixed(1)}%</p>
                </div>
              </div>
              <p className="text-sm text-ink-soft mt-4">
                Pokračuji na mapování sloupců...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
