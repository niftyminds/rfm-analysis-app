'use client';

import React from 'react';
import { X, ExternalLink, CheckCircle } from 'lucide-react';

interface ExportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetUrl: string;
}

export default function ExportSuccessModal({
  isOpen,
  onClose,
  spreadsheetUrl
}: ExportSuccessModalProps) {
  if (!isOpen) return null;

  const handleOpenSheet = () => {
    window.open(spreadsheetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Zavřít"
          >
            <X size={24} />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin opacity-30"></div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Export dokončen! 🎉
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Vaše RFM a CLV analýza byla úspěšně exportována do Google Sheets
          </p>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 font-medium mb-2">
              📊 Spreadsheet obsahuje:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Zákazníci</strong> - kompletní RFM data</li>
              <li>• <strong>CLV Analýza</strong> - customer lifetime value metriky</li>
              <li>• <strong>Statistiky</strong> - celkové přehledy</li>
              <li>• <strong>Segmenty</strong> - distribuce zákazníků</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Primary Action - Plná šířka */}
            <button
              onClick={handleOpenSheet}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-base"
            >
              <ExternalLink size={20} />
              Otevřít Google Sheet
            </button>

            {/* Secondary Action - Text link */}
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors py-2"
            >
              Zavřít
            </button>
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <span>💡</span>
            <span>Tip: Spreadsheet najdete také v Google Drive</span>
          </p>
        </div>
      </div>
    </>
  );
}
