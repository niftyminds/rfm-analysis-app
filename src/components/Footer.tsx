import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream mt-auto">
      <div className="max-w-page mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="font-black tracking-tight text-xl mb-3">
              RFM Analýza
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-niftyminds.svg"
              alt="nifty — minds"
              className="h-[17px] w-auto invert mb-5"
            />

            <p className="text-sm text-cream/60 leading-relaxed max-w-xs">
              Moderní nástroj pro segmentaci zákazníků pomocí RFM analýzy.
              Zpracování dat probíhá pouze ve vašem prohlížeči bez ukládání na serverech.
            </p>
          </div>

          {/* Právní odkazy */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40 mb-5">
              Právní informace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-cream/70 hover:text-lime transition-colors duration-200 ease-brand"
                >
                  Podmínky používání
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-cream/70 hover:text-lime transition-colors duration-200 ease-brand"
                >
                  Ochrana osobních údajů
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40 mb-5">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@niftyminds.cz"
                  className="text-cream/70 hover:text-lime transition-colors duration-200 ease-brand"
                >
                  hello@niftyminds.cz
                </a>
              </li>
              <li>
                <a
                  href="https://www.niftyminds.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-lime transition-colors duration-200 ease-brand"
                >
                  www.niftyminds.cz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40 text-center md:text-left">
              © {currentYear} HNK CZ s.r.o. · Všechna práva vyhrazena
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40 text-center md:text-right">
              Powered by{' '}
              <a
                href="https://niftyminds.cz/?utm_source=rfm-analysis&utm_medium=app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime hover:text-lime-deep transition-colors duration-200"
              >
                niftyminds.cz
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
