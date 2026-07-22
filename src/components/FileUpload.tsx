'use client';

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { CSVRow } from '@/types';
import DualFileUpload from './DualFileUpload';

interface FileUploadProps {
  onCSVLoaded: (data: CSVRow[], columns: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function FileUpload({ onCSVLoaded, setLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'single' | 'dual'>('single');

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

  const handleDataReady = useCallback((data: any[], headers: string[]) => {
    // Handler pro dual file upload - předá data do onCSVLoaded
    onCSVLoaded(data as CSVRow[], headers);
  }, [onCSVLoaded]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-brand p-4 sm:p-6 lg:p-8">
        {/* Upload Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setUploadMode('single')}
            className={`btn-brand ${
              uploadMode === 'single'
                ? 'btn-ink'
                : 'btn-outline-ink'
            }`}
          >
            📄 Jeden soubor
          </button>
          <button
            onClick={() => setUploadMode('dual')}
            className={`btn-brand ${
              uploadMode === 'dual'
                ? 'btn-ink'
                : 'btn-outline-ink'
            }`}
          >
            📄📄 Dva soubory
          </button>
        </div>

        {/* Mode Description */}
        <div className="mb-6 text-center">
          {uploadMode === 'single' ? (
            <p className="text-sm text-mute">
              Nahrajte CSV soubor obsahující objednávky a zákaznická data
            </p>
          ) : (
            <p className="text-sm text-mute">
              Nahrajte dva soubory: objednávky + zákaznická data. Appka je automaticky sloučí.
            </p>
          )}
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <FileSpreadsheet className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-ink mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-2">
            {uploadMode === 'single' ? 'Nahrajte CSV soubor' : 'Nahrajte CSV soubory'}
          </h2>
          <p className="text-sm sm:text-base text-mute">
            {uploadMode === 'single'
              ? 'Nahrajte soubor s objednávkami pro RFM analýzu'
              : 'Nahrajte dva soubory pro automatické sloučení'
            }
          </p>
        </div>

        {/* Conditional Rendering based on mode */}
        {uploadMode === 'single' ? (
          <>
            {/* SINGLE FILE UPLOAD */}
            <div
              className={`relative border-2 border-dashed p-8 sm:p-12 text-center transition-colors duration-200 ease-brand ${
                dragActive
                  ? 'border-ink bg-lime/20'
                  : 'border-black/20 hover:border-ink active:border-ink bg-cream-deep'
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-mute mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-ink-soft mb-2">
                Přetáhněte CSV soubor sem
              </p>
              <p className="text-sm text-mute mb-4">
                nebo klikněte pro výběr souboru
              </p>
              <button className="btn-brand btn-ink min-h-[48px] pointer-events-none">
                Vybrat soubor
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-card border border-red-600/40 p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-8 bg-cream-deep border border-black/10 p-4">
              <h3 className="font-black uppercase tracking-tight text-ink mb-2">Požadovaná data v CSV:</h3>
              <p className="text-sm text-ink-soft mb-2">
                CSV soubor musí obsahovat následující informace (v dalším kroku namapujete sloupce):
              </p>
              <ul className="text-sm text-ink-soft space-y-1">
                <li>• <strong>Číslo/ID objednávky</strong> - unikátní identifikátor</li>
                <li>• <strong>Datum objednávky</strong> - datum vytvoření</li>
                <li>• <strong>Hodnota objednávky</strong> - částka (ideálně bez DPH)</li>
                <li>• <strong>Jméno zákazníka</strong> - celé jméno nebo příjmení</li>
                <li>• <strong>Email zákazníka</strong> - emailová adresa</li>
              </ul>
              <p className="text-xs text-mute mt-3">
                💡 Po nahrání budete moci namapovat sloupce z vašeho CSV na požadovaná pole.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* DUAL FILE UPLOAD */}
            <DualFileUpload onDataReady={handleDataReady} />
          </>
        )}
      </div>
    </div>
  );
}