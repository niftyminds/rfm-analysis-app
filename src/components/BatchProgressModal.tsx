'use client';

import React from 'react';
import { Upload } from 'lucide-react';

interface BatchProgressModalProps {
  isOpen: boolean;
  currentBatch: number;
  totalBatches: number;
  phase: string;
}

export default function BatchProgressModal({
  isOpen,
  currentBatch,
  totalBatches,
  phase
}: BatchProgressModalProps) {
  if (!isOpen) return null;

  const progress = totalBatches > 0 ? (currentBatch / totalBatches) * 100 : 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fadeIn" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-card border border-black/10 max-w-md w-full p-8 animate-slideUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-cream-deep border border-black/10 flex items-center justify-center">
              <Upload className="w-10 h-10 text-ink" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black uppercase tracking-tight text-ink text-center mb-2">
            Probíhá export
          </h2>
          <p className="text-ink-soft text-center mb-6">
            {phase || `Exportuji dávku ${currentBatch} z ${totalBatches}...`}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between font-mono text-xs uppercase tracking-[0.14em] text-mute mb-2">
              <span>Dávka {currentBatch} / {totalBatches}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-cream-deep h-3 overflow-hidden">
              <div
                className="h-full bg-lime-deep transition-all duration-500 ease-brand"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-cream-deep border border-black/10 p-4">
            <p className="text-sm text-ink-soft text-center">
              <strong>Velký dataset detekován</strong>
              <br />
              Export probíhá po dávkách pro zajištění stability
            </p>
          </div>

          {/* Tip */}
          <p className="text-xs text-mute text-center mt-4 flex items-center justify-center gap-1">
            <span>⏱️</span>
            <span>Tato operace může trvat několik minut</span>
          </p>
        </div>
      </div>
    </>
  );
}
