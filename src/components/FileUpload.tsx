'use client';

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { CSVRow } from '@/types';

interface FileUploadProps {
  onCSVLoaded: (data: CSVRow[], columns: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function FileUpload({ onCSVLoaded, setLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setLoading(true);

    if (!file.name.endsWith('.csv')) {
      setError('Prosím nahrajte CSV soubor');
      setLoading(false);
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (results) => {
        try {
          const data = results.data as CSVRow[];
          if (data.length === 0) {
            setError('CSV soubor je prázdný');
            setLoading(false);
            return;
          }

          const columns = Object.keys(data[0]);
          if (columns.length === 0) {
            setError('CSV soubor neobsahuje žádné sloupce');
            setLoading(false);
            return;
          }

          onCSVLoaded(data, columns);
          setLoading(false);
        } catch (err) {
          setError('Chyba při zpracování souboru. Zkontrolujte formát CSV.');
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Chyba při načítání souboru: ${err.message}`);
        setLoading(false);
      }
    });
  }, [onCSVLoaded, setLoading]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <FileSpreadsheet className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Nahrajte CSV soubor
          </h2>
          <p className="text-gray-600">
            Nahrajte soubor s objednávkami pro RFM analýzu
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Přetáhněte CSV soubor sem
          </p>
          <p className="text-sm text-gray-500 mb-4">
            nebo klikněte pro výběr souboru
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Vybrat soubor
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Požadovaná data v CSV:</h3>
          <p className="text-sm text-blue-800 mb-2">
            CSV soubor musí obsahovat následující informace (v dalším kroku namapujete sloupce):
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Číslo/ID objednávky</strong> - unikátní identifikátor</li>
            <li>• <strong>Datum objednávky</strong> - datum vytvoření</li>
            <li>• <strong>Hodnota objednávky</strong> - částka (ideálně bez DPH)</li>
            <li>• <strong>Jméno zákazníka</strong> - celé jméno nebo příjmení</li>
            <li>• <strong>Email zákazníka</strong> - emailová adresa</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            💡 Po nahrání budete moci namapovat sloupce z vašeho CSV na požadovaná pole.
          </p>
        </div>
      </div>
    </div>
  );
}