import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Ochrana osobních údajů | RFM Analýza',
  description: 'Zásady ochrany osobních údajů - GDPR compliance',
  robots: 'index, follow'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Zpět na hlavní stránku */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ink-soft underline hover:text-ink mb-6 sm:mb-8 transition-colors duration-200 ease-brand font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na RFM Analýzu
        </Link>

        {/* Obsah */}
        <div className="bg-card border border-black/10 p-6 sm:p-8 md:p-12">
          <h1 className="display-heading text-3xl sm:text-4xl mb-4">
            Zásady ochrany osobních údajů
          </h1>
          <p className="eyebrow mb-8">
            Poslední aktualizace: 25. října 2025
          </p>

          {/* Důležité upozornění nahoře */}
          <div className="bg-cream-deep border border-black/10 p-4 sm:p-6 mb-8">
            <h3 className="text-lg font-bold text-ink mb-3">
              ✅ Shrnutí pro uživatele:
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span>Data zpracováváme <strong>POUZE ve vašem prohlížeči</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span><strong>NEUKLÁDÁME</strong> vaše CSV soubory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span><strong>NEUKLÁDÁME</strong> výsledky analýz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span>Export jde přímo do vašeho Google Drive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span>Po zavření aplikace je vše automaticky smazáno</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ink font-bold mt-1">✓</span>
                <span>Máte plnou kontrolu nad svými daty</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">1. Úvod</h2>
              <p className="text-ink-soft leading-relaxed">
                HNK CZ s.r.o. (dále jen "my", "nás" nebo "náš") respektuje vaše soukromí a zavazuje se chránit vaše osobní údaje. Tato zásada popisuje, jak zpracováváme osobní údaje v souvislosti s RFM Analýzou (dále jen "Aplikace").
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">2. Správce osobních údajů</h2>
              <div className="bg-cream-deep p-4 sm:p-6 border border-black/10">
                <p className="font-semibold text-ink mb-2">HNK CZ s.r.o.</p>
                <p className="text-ink-soft">IČ: 10719008</p>
                <p className="text-ink-soft">Sídlo: Piletická 486, 503 41 Hradec Králové</p>
                <p className="text-ink-soft">Email: hello@niftyminds.cz</p>
                <p className="text-ink-soft">Web: www.niftyminds.cz</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">3. Jaké údaje zpracováváme</h2>

              <h3 className="text-lg font-bold text-ink mb-3">3.1 Google Account Information</h3>
              <p className="text-ink-soft leading-relaxed mb-4">
                Při přihlášení přes Google OAuth zpracováváme:
              </p>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li>Email adresa</li>
                <li>Jméno a profilový obrázek (z Google účtu)</li>
                <li>Google User ID</li>
              </ul>

              <h3 className="text-lg font-bold text-ink mb-3">3.2 Nahrané soubory</h3>
              <div className="bg-cream-deep border border-black/10 p-4 mb-4">
                <p className="text-ink font-semibold mb-2">⚠️ Důležité:</p>
                <p className="text-ink-soft text-sm sm:text-base">
                  CSV soubory nejsou ukládány na našich serverech. Zpracování probíhá pouze ve vašem prohlížeči.
                </p>
              </div>

              <h3 className="text-lg font-bold text-ink mb-3">3.3 Technické informace</h3>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li>IP adresa</li>
                <li>Typ prohlížeče a zařízení</li>
                <li>Datum a čas přístupu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">4. Jak údaje zpracováváme</h2>

              <div className="bg-cream-deep border border-black/10 p-4 sm:p-6 mb-4">
                <h3 className="text-lg font-bold text-ink mb-3">
                  DŮLEŽITÉ: Zpracování v prohlížeči
                </h3>
                <ul className="space-y-2 text-ink-soft">
                  <li>• Veškerá RFM analýza probíhá lokálně ve vašem prohlížeči</li>
                  <li>• <strong>Neukládáme vaše CSV soubory na našich serverech</strong></li>
                  <li>• Data jsou zpracována pouze v paměti prohlížeče</li>
                  <li>• Po zavření aplikace jsou všechna data automaticky smazána</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-ink mb-3">4.1 Účel zpracování</h3>
              <p className="text-ink-soft leading-relaxed mb-4">
                Zpracováváme osobní údaje za účelem:
              </p>
              <ol className="list-decimal list-inside text-ink-soft space-y-3 mb-4 ml-4">
                <li><strong>Poskytování služby</strong> (právní základ: plnění smlouvy, čl. 6 odst. 1 písm. b) GDPR)</li>
                <li><strong>Autentizace</strong> (právní základ: oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR)</li>
                <li><strong>Technický provoz</strong> (právní základ: oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR)</li>
              </ol>

              <h3 className="text-lg font-bold text-ink mb-3">4.2 Doba uchovávání</h3>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li><strong>Nahrané soubory:</strong> 0 sekund - nejsou ukládány</li>
                <li><strong>Google OAuth token:</strong> 1 hodina - pak automaticky expiruje</li>
                <li><strong>Technické logy:</strong> 30 dní - pak automaticky mazány</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">5. Sdílení údajů s třetími stranami</h2>

              <h3 className="text-lg font-bold text-ink mb-3">5.1 Google LLC</h3>
              <p className="text-ink-soft leading-relaxed mb-4">
                Při použití Google OAuth a exportu do Google Sheets:
              </p>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li>Platí <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-ink-soft underline hover:text-ink">Google Privacy Policy</a></li>
                <li>Spreadsheets jsou uloženy ve vašem Google Drive</li>
              </ul>

              <h3 className="text-lg font-bold text-ink mb-3">5.2 Hosting - Vercel Inc.</h3>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li>Platí <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-ink-soft underline hover:text-ink">Vercel Privacy Policy</a></li>
                <li>Data center: EU region (Frankfurt, Německo)</li>
              </ul>

              <div className="bg-cream-deep border border-black/10 p-4 mt-4">
                <p className="text-ink-soft">
                  <strong>• Neprodáváme vaše osobní údaje</strong><br/>
                  • Nesdílíme vaše data s marketingovými společnostmi<br/>
                  • Nepředáváme data mimo EU (kromě Google s garancemi)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">6. Vaše práva podle GDPR</h2>
              <p className="text-ink-soft leading-relaxed mb-4">
                Máte následující práva:
              </p>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li><strong>Právo na přístup</strong> (čl. 15 GDPR) - informace o zpracování</li>
                <li><strong>Právo na opravu</strong> (čl. 16 GDPR) - oprava nepřesných údajů</li>
                <li><strong>Právo na výmaz</strong> (čl. 17 GDPR) - smazání vašich údajů</li>
                <li><strong>Právo na omezení</strong> (čl. 18 GDPR) - pozastavení zpracování</li>
                <li><strong>Právo na přenositelnost</strong> (čl. 20 GDPR) - export dat</li>
                <li><strong>Právo vznést námitku</strong> (čl. 21 GDPR)</li>
              </ul>

              <div className="bg-cream-deep p-4 sm:p-6 border border-black/10 mt-4">
                <h4 className="font-semibold text-ink mb-2">Stížnost u dozorového úřadu:</h4>
                <p className="text-ink-soft mb-2"><strong>Úřad pro ochranu osobních údajů</strong></p>
                <p className="text-ink-soft">Pplk. Sochora 27, 170 00 Praha 7</p>
                <p className="text-ink-soft">Email: posta@uoou.cz</p>
                <p className="text-ink-soft">Web: <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-ink-soft underline hover:text-ink">https://www.uoou.cz</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">7. Zabezpečení údajů</h2>

              <h3 className="text-lg font-bold text-ink mb-3">Technická opatření:</h3>
              <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4 ml-4">
                <li><strong>HTTPS šifrování</strong> - veškerá komunikace je šifrovaná (TLS 1.3)</li>
                <li><strong>HttpOnly cookies</strong> - ochrana proti XSS útokům</li>
                <li><strong>SameSite cookies</strong> - ochrana proti CSRF útokům</li>
                <li><strong>Token expirece</strong> - automatické vypršení po 1 hodině</li>
                <li><strong>Žádné ukládání na serveru</strong> - nejvyšší úroveň zabezpečení</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-4">8. Kontakt</h2>
              <p className="text-ink-soft leading-relaxed mb-4">
                Pro uplatnění vašich práv nebo dotazy kontaktujte:
              </p>
              <div className="bg-cream-deep p-4 sm:p-6 border border-black/10">
                <p className="font-semibold text-ink mb-2">Data Protection Officer</p>
                <p className="text-ink-soft">HNK CZ s.r.o., Piletická 486, 503 41 Hradec Králové</p>
                <p className="text-ink-soft">Email: <a href="mailto:hello@niftyminds.cz" className="text-ink-soft underline hover:text-ink">hello@niftyminds.cz</a></p>
                <p className="text-sm text-mute mt-2">Odpovíme do 30 dnů od obdržení žádosti.</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-line">
              <p className="text-sm text-mute italic text-center">
                Používáním Aplikace souhlasíte s těmito zásadami ochrany osobních údajů. Pokud nesouhlasíte, nepoužívejte Aplikaci.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
