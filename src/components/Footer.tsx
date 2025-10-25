import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">RFM Analýza</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Moderní nástroj pro segmentaci zákazníků pomocí RFM analýzy.
              Zpracování dat probíhá pouze ve vašem prohlížeči bez ukládání na serverech.
            </p>
          </div>

          {/* Právní odkazy */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Právní informace</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Podmínky používání
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Ochrana osobních údajů
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="mailto:info@niftyminds.agency"
                  className="hover:text-indigo-600 transition-colors"
                >
                  info@niftyminds.agency
                </a>
              </li>
              <li>
                <a
                  href="https://niftyminds.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors"
                >
                  niftyminds.agency
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} NiftyMinds Agency. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
