'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setIsVisible(true);
    }
  }, []);

  const acknowledge = () => {
    localStorage.setItem(STORAGE_KEY, 'acknowledged');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Informace o cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-cream border-t border-white/10 animate-slideUp"
    >
      <div className="max-w-page mx-auto px-5 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="text-sm text-cream/70 leading-relaxed flex-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime block mb-1">
            Cookies
          </span>
          Tato aplikace používá pouze technické cookies nezbytné pro její fungování
          (např. přihlášení ke Google účtu při exportu). Žádné sledovací ani marketingové
          cookies nepoužíváme — vaše data zůstávají ve vašem prohlížeči.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/privacy"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/60 hover:text-lime transition-colors duration-200 ease-brand underline underline-offset-4"
          >
            Více informací
          </Link>
          <button
            onClick={acknowledge}
            className="bg-lime text-ink px-6 py-3 font-black uppercase tracking-[0.1em] text-xs hover:bg-lime-deep hover:-translate-y-0.5 transition-all duration-200 ease-brand"
          >
            Rozumím
          </button>
        </div>
      </div>
    </div>
  );
}
