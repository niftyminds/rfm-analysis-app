'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Download, Shield, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, newsletter: boolean) => Promise<void>;
  exportType: 'csv' | 'sheets';
}

export default function ExportModal({
  isOpen,
  onClose,
  onSubmit,
  exportType
}: ExportModalProps) {
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset state při otevření/zavření modalu
  useEffect(() => {
    if (isOpen) {
      // Reset při otevření
      setEmail('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Zadejte prosím platný email');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email, newsletter);
      // Modal se zavře po úspěšném submitu v parent komponentě
    } catch (err: any) {
      setError(err.message || 'Něco se pokazilo. Zkuste to znovu.');
    } finally {
      // VŽDY resetovat loading stav (i při úspěchu)
      setIsSubmitting(false);
    }
  };

  const exportTypeText = exportType === 'csv'
    ? 'CSV soubor'
    : 'Google Sheets';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
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

          {/* Icon */}
          <div className="w-16 h-16 bg-cream-deep border border-black/10 flex items-center justify-center mx-auto mb-6">
            <Download className="w-8 h-8 text-ink" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black uppercase tracking-tight text-ink text-center mb-2">
            Skvělá práce! 🎉
          </h2>
          <p className="text-ink-soft text-center mb-6">
            Vaše RFM analýza je hotová. Zadejte email pro stažení výsledků do <strong>{exportTypeText}</strong>.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-[0.14em] text-mute mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mute" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-card border border-black/10 focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none transition-colors duration-200 ease-brand"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Newsletter checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 w-5 h-5 accent-ink border-black/10 focus:ring-1 focus:ring-ink"
                disabled={isSubmitting}
              />
              <span className="text-sm text-ink-soft group-hover:text-ink transition-colors duration-200 ease-brand">
                Chci dostávat tipy pro lepší customer retention a RFM analýzu (1x týdně, kdykoli se odhlásíte)
              </span>
            </label>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand btn-ink w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-lime-deep"></div>
                  Zpracovávám...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Stáhnout {exportTypeText}
                </>
              )}
            </button>

            {/* Trust signals */}
            <div className="pt-4 border-t border-line space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                <Shield size={14} />
                <span>GDPR compliant • Žádný spam</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                <Check size={14} />
                <span>2,000+ spokojených uživatelů</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
