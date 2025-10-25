import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Podmínky používání | RFM Analýza',
  description: 'Podmínky používání aplikace RFM Analýza',
  robots: 'index, follow'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Zpět na hlavní stránku */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 sm:mb-8 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na RFM Analýzu
        </Link>

        {/* Obsah */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Podmínky používání
          </h1>
          <p className="text-gray-600 mb-8 sm:mb-12">
            Poslední aktualizace: 25. října 2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Souhlas s podmínkami</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Používáním RFM Analýzy (dále jen "Aplikace") provozované společností <strong>NiftyMinds Agency</strong> souhlasíte s těmito podmínkami používání. Pokud s podmínkami nesouhlasíte, nepoužívejte Aplikaci.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Popis služby</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                RFM Analýza je webová aplikace určená pro segmentaci zákazníků na základě metrik Recency (nedávnost), Frequency (frekvence) a Monetary (hodnota). Aplikace umožňuje:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Nahrání CSV souborů s objednávkovými daty</li>
                <li>Automatickou RFM analýzu a segmentaci zákazníků</li>
                <li>Export výsledků do CSV nebo Google Sheets</li>
                <li>Vizualizaci výsledků prostřednictvím grafů a tabulek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Registrace a účet</h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Google OAuth autentizace</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pro export do Google Sheets je vyžadováno přihlášení přes Google OAuth. Poskytnutím přístupu k vašemu Google účtu souhlasíte s:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Vytváření Google Sheets dokumentů ve vašem Google Drive</li>
                <li>Omezený přístup pouze k souborům vytvořeným Aplikací</li>
                <li>Dočasné uložení přístupového tokenu (max. 1 hodina)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Odpovědnost uživatele</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Uživatel je odpovědný za:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Zabezpečení přístupu ke svému Google účtu</li>
                <li>Legálnost nahrávaných dat</li>
                <li>Dodržování GDPR při práci se zákaznickými daty</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Zpracování dat</h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Důležité: Zpracování v prohlížeči</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Veškerá RFM analýza probíhá <strong>lokálně ve vašem prohlížeči</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span><strong>Neukládáme</strong> vaše CSV soubory na našich serverech</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Data jsou zpracována pouze v paměti RAM prohlížeče</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Po zavření aplikace jsou všechna data automaticky smazána</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Google Sheets export</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Export do Google Sheets probíhá přímo mezi vaším prohlížečem a Google Drive. Data nejsou přenášena přes naše servery.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Duševní vlastnictví</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Veškerý obsah Aplikace, včetně designu, kódu, textů, grafiky a funkcionalit, je majetkem NiftyMinds Agency a je chráněn autorským právem.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Vaše data:</strong> Nahrané CSV soubory a výsledky analýz zůstávají vaším vlastnictvím. NiftyMinds Agency na ně nemá žádný nárok.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Omezení odpovědnosti</h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Přesnost analýz</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                RFM Analýza provádí výpočty na základě vašich vstupních dat. NiftyMinds Agency nezaručuje:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>100% přesnost výsledků (závisí na kvalitě vstupních dat)</li>
                <li>Vhodnost výsledků pro konkrétní obchodní rozhodnutí</li>
                <li>Dosažení konkrétních obchodních cílů na základě analýz</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Dostupnost služby</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aplikace je poskytována "tak, jak je" (AS IS). NiftyMinds Agency negarantuje nepřetržitou dostupnost a vyhrazuje si právo na plánované odstávky pro údržbu.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Ztráta dat</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vzhledem k tomu, že data nejsou ukládána na serverech, <strong>doporučujeme pravidelně exportovat výsledky</strong>. NiftyMinds Agency nenese odpovědnost za ztrátu dat způsobenou:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Zavřením prohlížeče</li>
                <li>Výpadkem internetového připojení</li>
                <li>Technickými problémy na straně uživatele</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Zakázané užití</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Zakazuje se používání Aplikace k:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Nezákonným účelům</li>
                <li>Porušování práv třetích stran</li>
                <li>Nahrávání škodlivého kódu nebo malware</li>
                <li>Pokusu o získání neoprávněného přístupu k systémům</li>
                <li>Reverse engineering nebo kopírování zdrojového kódu</li>
                <li>Automatizovanému scrapování nebo hromadnému stahování</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Ukončení přístupu</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                NiftyMinds Agency si vyhrazuje právo kdykoli a bez předchozího upozornění:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li>Omezit nebo ukončit přístup k Aplikaci</li>
                <li>Pozastavit uživatelský účet při porušení podmínek</li>
                <li>Ukončit provoz Aplikace</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. Změny podmínek</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                NiftyMinds Agency si vyhrazuje právo kdykoli upravit tyto podmínky. O významných změnách budou uživatelé informováni prostřednictvím Aplikace. Pokračováním v používání Aplikace po změně podmínek vyjadřujete souhlas s novými podmínkami.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Rozhodné právo</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tyto podmínky se řídí právním řádem České republiky. Případné spory budou řešeny u příslušných soudů v České republice.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">11. Kontakt</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Máte-li jakékoli dotazy ohledně těchto podmínek, kontaktujte nás:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">NiftyMinds Agency</p>
                <p className="text-gray-700">Email: <a href="mailto:info@niftyminds.agency" className="text-indigo-600 hover:text-indigo-700">info@niftyminds.agency</a></p>
                <p className="text-gray-700">Web: <a href="https://niftyminds.agency" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">https://niftyminds.agency</a></p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic text-center">
                Používáním RFM Analýzy potvrzujete, že jste si přečetli tyto podmínky a souhlasíte s nimi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
