'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Funkce' },
    { href: '#how-it-works', label: 'Jak to funguje' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink text-cream border-b border-white/10">
      <nav className="max-w-page mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 hover:text-lime transition-colors duration-200 ease-brand"
          >
            <span className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/RFM-FAVICON.png"
                alt=""
                className="h-5 w-auto"
                aria-hidden="true"
              />
              <span className="font-black tracking-tight text-lg leading-none">
                RFM Analýza
              </span>
            </span>
            <span className="hidden sm:block w-px h-5 bg-white/20" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-niftyminds.svg"
              alt="nifty — minds"
              className="hidden sm:block h-[15px] w-auto invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70 hover:text-lime transition-colors duration-200 ease-brand"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(link.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 bg-lime text-ink px-5 py-2.5 font-black uppercase tracking-[0.1em] text-xs hover:bg-lime-deep hover:-translate-y-0.5 transition-all duration-200 ease-brand"
            >
              Spustit analýzu
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-brand" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:text-lime transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-5 border-t border-white/10 pt-4 animate-slideUp">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-cream/70 hover:text-lime transition-colors py-3 border-b border-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 bg-lime text-ink px-6 py-3.5 font-black uppercase tracking-[0.1em] text-xs mt-4 hover:bg-lime-deep transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Spustit analýzu
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
