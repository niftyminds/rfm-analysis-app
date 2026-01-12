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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-blue-600 animate-bounce" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Probíhá export
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {phase || `Exportuji dávku ${currentBatch} z ${totalBatches}...`}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Dávka {currentBatch} / {totalBatches}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 text-center">
              <strong>Velký dataset detekován</strong>
              <br />
              Export probíhá po dávkách pro zajištění stability
            </p>
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
            <span>⏱️</span>
            <span>Tato operace může trvat několik minut</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}
