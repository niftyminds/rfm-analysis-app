import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'RFM Analýza | Segmentace zákazníků za 2 minuty',
  description: 'Profesionální RFM analýza pro e-shopy. Segmentujte zákazníky, zvyšte retention a obrat. Bez instalace, bezpečné, export do Google Sheets.',
  keywords: 'RFM analýza, segmentace zákazníků, marketing automatizace, Google Sheets export',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Rychlá segmentace zákazníků</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Segmentujte zákazníky<br />
                <span className="text-indigo-200">za 2 minuty</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
                Profesionální RFM analýza bez instalace.
                Identifikujte Champions, At Risk a Lost zákazníky.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/app"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Spustit analýzu
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Jak to funguje
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-start text-sm text-indigo-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bez instalace</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% bezpečné</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>GDPR compliant</span>
                </div>
              </div>
            </div>

            {/* Right: Screenshot/Mockup */}
            <div className="relative mt-8 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-inner">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400 px-4">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-xs sm:text-sm">RFM Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-float hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">Champions</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">142</div>
              </div>

              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-float-delayed hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">At Risk</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-600">89</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vše, co potřebujete pro RFM analýzu
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Profesionální nástroj pro segmentaci zákazníků s exportem do Google Sheets
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'RFM Segmentace',
                description: 'Automatická kategorizace do 9 segmentů: Champions, Loyal, At Risk, Lost a další'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                ),
                title: 'Snadné nahrání',
                description: 'Přetáhněte CSV soubor nebo vyberte z počítače. Podpora českých formátů.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Přesné metriky',
                description: 'R (Recency), F (Frequency), M (Monetary) skóre pro každého zákazníka'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Export do Sheets',
                description: 'Exportujte výsledky přímo do Google Sheets s formátováním a barvami'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: '100% bezpečné',
                description: 'Data zpracována pouze ve vašem prohlížeči. Nic se neukládá na serveru.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Bleskově rychlé',
                description: 'Analýza tisíců zákazníků za pár sekund. Bez čekání.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jak to funguje
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Tři jednoduché kroky k RFM analýze
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" />

            {[
              {
                step: '1',
                title: 'Nahrajte CSV',
                description: 'Přetáhněte soubor s objednávkami. Podporujeme standardní i vlastní formáty.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )
              },
              {
                step: '2',
                title: 'Vyberte sloupce',
                description: 'Namapujte sloupce z CSV (email, datum, hodnota). Přidejte volitelná pole.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              {
                step: '3',
                title: 'Export výsledků',
                description: 'Stáhněte CSV nebo exportujte přímo do Google Sheets s formátováním.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 text-center border-2 border-indigo-100">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>

                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow">
                    {item.icon}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proč používat RFM analýzu?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: '💰',
                title: 'Zvyšte obrat',
                stat: '+40%',
                description: 'Identifikujte Champions a nabídněte jim prémiové produkty'
              },
              {
                icon: '🎯',
                title: 'Cílený marketing',
                stat: '3x ROI',
                description: 'Správná nabídka správným zákazníkům ve správný čas'
              },
              {
                icon: '⏱️',
                title: 'Ušetřete čas',
                stat: '90%',
                description: 'Automatická segmentace místo hodin manuální práce'
              }
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl sm:text-5xl mb-4">{benefit.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
            Připraveni začít?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-10">
            Spusťte svou první RFM analýzu za 2 minuty. Bez registrace, zdarma.
          </p>

          <Link
            href="/app"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Spustit RFM analýzu
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <p className="mt-6 text-sm sm:text-base text-indigo-200">
            Žádná platební karta • Žádná registrace • Okamžité spuštění
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
