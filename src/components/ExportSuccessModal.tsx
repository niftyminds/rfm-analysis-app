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
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-card border border-black/10 max-w-md w-full p-8 animate-slideUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mute hover:text-ink transition-colors duration-200 ease-brand"
            aria-label="Zavřít"
          >
            <X size={24} />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-lime flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-ink" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black uppercase tracking-tight text-ink text-center mb-2">
            Export dokončen! 🎉
          </h2>
          <p className="text-ink-soft text-center mb-6">
            Vaše RFM a CLV analýza byla úspěšně exportována do Google Sheets
          </p>

          {/* Info box */}
          <div className="bg-cream-deep border border-black/10 p-4 mb-6">
            <p className="text-sm text-ink font-semibold mb-2">
              📊 Spreadsheet obsahuje:
            </p>
            <ul className="text-sm text-ink-soft space-y-1">
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
              className="btn-brand btn-ink w-full flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Otevřít Google Sheet
            </button>

            {/* Secondary Action - Text link */}
            <button
              onClick={onClose}
              className="btn-brand btn-outline-ink w-full"
            >
              Zavřít
            </button>
          </div>

          {/* Tip */}
          <p className="text-xs text-mute text-center mt-3 flex items-center justify-center gap-1">
            <span>💡</span>
            <span>Tip: Spreadsheet najdete také v Google Drive</span>
          </p>
        </div>
      </div>
    </>
  );
}
