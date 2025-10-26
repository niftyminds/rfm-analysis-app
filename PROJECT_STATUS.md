# RFM Analýza - Aktuální Stav Aplikace

**Verze:** 1.0.0
**Datum:** 26. ledna 2025
**Production URL:** https://rfm.niftyminds.agency

---

## 📋 Obsah

1. [O Projektu](#o-projektu)
2. [Funkce](#funkce)
3. [Tech Stack](#tech-stack)
4. [Struktura Projektu](#struktura-projektu)
5. [Spuštění Projektu](#spuštění-projektu)
6. [Content Management](#content-management)
7. [Deployment](#deployment)
8. [Nedávné Změny](#nedávné-změny)

---

## 🎯 O Projektu

RFM Analýza je webová aplikace pro segmentaci zákazníků e-shopů pomocí RFM (Recency, Frequency, Monetary) metodologie. Aplikace umožňuje uživatelům nahrát CSV data z jejich e-shopu a získat profesionální analýzu zákaznických segmentů.

### Klíčové Vlastnosti

- ✅ **100% client-side zpracování** - data neukládáme na server
- ✅ **Bez registrace** - okamžitý přístup
- ✅ **Google Sheets export** - jedním kliknutím
- ✅ **Interaktivní dashboard** - grafy a vizualizace
- ✅ **Automatická detekce** - sloupců v CSV
- ✅ **Filtrace testovacích dat** - vyloučení spam emailů
- ✅ **Content Management** - editovatelný obsah přes JSON

---

## ✨ Funkce

### 1. Landing Page
- **Profesionální hero sekce** s screenshot aplikace
- **YouTube video integrace** - tutorial video
- **Features sekce** - 6 hlavních funkcí
- **How it works** - 3 kroky k analýze
- **Benefits** - 3 výhody použití
- **FAQ sekce** - často kladené otázky
- **Responzivní design** - optimalizováno pro mobil i desktop
- **Content Management System** - editovatelný obsah přes JSON soubory

### 2. CSV Upload & Mapování
- **Drag & drop upload** CSV souborů
- **Automatická detekce sloupců** (email, datum, hodnota)
- **Manuální mapování** - přiřazení sloupců k polím
- **Náhled dat** - prvních 3 řádky
- **Dodatečné sloupce** - volitelné další pole

### 3. Data Preview & Filtrace
- **Detekce testovacích emailů** - automatická identifikace
- **Klíčová slova** - test, demo, admin, spam, example
- **Manuální výběr** - checkbox pro vyloučení konkrétních emailů
- **Vlastní klíčová slova** - přidání vlastních filtrů
- **Statistiky** - celkový počet zákazníků, suspektní záznamy

### 4. RFM Dashboard
- **9 RFM segmentů:**
  - Champions (nejlepší zákazníci)
  - Loyal Customers (věrní zákazníci)
  - Potential Loyalists (potenciálně věrní)
  - Recent Customers (noví zákazníci)
  - Promising (slibní)
  - Need Attention (vyžadují pozornost)
  - At Risk (v riziku odchodu)
  - Can't Lose Them (nesmíme ztratit)
  - Lost (ztracení)

- **Vizualizace:**
  - Segmentace chart (sloupcový graf)
  - RFM Score distribution (rozložení skóre)
  - Interaktivní grafy (Recharts)

- **Statistiky:**
  - Celkový počet zákazníků
  - Celkové tržby
  - Průměrná hodnota objednávky
  - Průměrný počet objednávek

- **Tabulka zákazníků:**
  - Filtrace podle segmentů
  - Třídění podle různých kritérií
  - Export do CSV
  - Export do Google Sheets

### 5. Google Sheets Export
- **OAuth 2.0 integrace**
- **Popup window pro autorizaci**
- **Automatické vytvoření tabulky**
- **Formátování:**
  - Barevné záhlaví podle segmentů
  - Bold formátování pro důležité sloupce
  - Měnový formát pro hodnoty
  - Datový formát pro datum

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14.2.5** - React framework s App Router
- **React 18.3.1** - UI knihovna
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4.4** - Utility-first CSS
- **Lucide React 0.263.1** - Ikony

### Data Processing
- **PapaParse 5.4.1** - CSV parsing
- **date-fns 3.6.0** - Manipulace s datumy

### Vizualizace
- **Recharts 2.12.7** - Grafy a charty

### Backend (API Routes)
- **Google APIs 164.1.0** - Google Sheets integration
- **OAuth 2.0** - Autentizace

### Deployment
- **Vercel** - Hosting a CI/CD
- **GitHub** - Version control

---

## 📁 Struktura Projektu

```
rfm-analysis-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── app/                      # Aplikace
│   │   │   └── page.tsx              # Hlavní aplikace
│   │   ├── terms/                    # Podmínky
│   │   ├── privacy/                  # Ochrana údajů
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── google/           # OAuth endpoint
│   │   │   │   └── check/            # Auth check
│   │   │   └── sheets/
│   │   │       └── export/           # Export do Sheets
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React komponenty
│   │   ├── FileUpload.tsx            # CSV upload
│   │   ├── ColumnMapper.tsx          # Mapování sloupců
│   │   ├── DataPreview.tsx           # Náhled a filtrace
│   │   ├── Dashboard.tsx             # RFM dashboard
│   │   └── Footer.tsx                # Footer
│   │
│   ├── content/                      # Content Management (JSON)
│   │   ├── homepage.json             # Landing page obsah
│   │   ├── features.json             # Features sekce
│   │   ├── how-it-works.json         # Jak to funguje
│   │   ├── benefits.json             # Výhody
│   │   ├── faq.json                  # FAQ
│   │   └── settings.json             # Site settings
│   │
│   ├── types/                        # TypeScript types
│   │   └── index.ts
│   │
│   └── utils/                        # Utility funkce
│       └── rfmAnalysis.ts            # RFM kalkulace
│
├── public/                           # Statické soubory
│   ├── logo-niftyminds.png
│   └── images/
│       └── dashboard-preview.png
│
├── .env.local                        # Env variables (git-ignored)
├── CONTENT_EDITING.md                # Návod pro marketing team
├── PROJECT_STATUS.md                 # Tento soubor
├── tailwind.config.ts                # Tailwind konfigurace
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── next.config.mjs                   # Next.js config
```

---

## 🚀 Spuštění Projektu

### Předpoklady
- Node.js 18+
- npm nebo yarn
- Google Cloud Project (pro Sheets export)

### Lokální vývoj

1. **Klonování repozitáře:**
```bash
git clone https://github.com/niftyminds/rfm-analysis-app.git
cd rfm-analysis-app
```

2. **Instalace dependencies:**
```bash
npm install
```

3. **Nastavení environment variables:**
```bash
# .env.local
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Spuštění dev serveru:**
```bash
npm run dev
```

5. **Otevření v prohlížeči:**
```
http://localhost:3000
```

### Build pro production

```bash
npm run build
npm run start
```

---

## 📝 Content Management

### Editace obsahu landing page

Veškerý obsah landing page je uložen v JSON souborech ve složce `src/content/`.

**Pro marketing team:**
- Přečtěte si kompletní návod v souboru `CONTENT_EDITING.md`
- Editujte JSON soubory přímo na GitHubu nebo lokálně
- Po uložení změn se automaticky nasadí na produkci (Vercel)

**Dostupné JSON soubory:**

1. **homepage.json** - Hero sekce, video, CTA
2. **features.json** - 6 feature karet
3. **how-it-works.json** - 3 kroky
4. **benefits.json** - 3 výhody
5. **faq.json** - FAQ otázky
6. **settings.json** - Meta tagy, kontakty

**Příklad změny:**
```json
// src/content/homepage.json
{
  "hero": {
    "heading": "RFM analýza vašeho e-shopu za 15 vteřin",
    "description": "..."
  }
}
```

### Dostupné ikony

Upload, Zap, BarChart3, Download, Shield, Sparkles, Settings, TrendingUp, ChevronDown, ChevronUp

### Dostupné barvy

indigo, blue, purple, green, red, yellow, orange

---

## 🌐 Deployment

### Vercel (Production)

- **URL:** https://rfm.niftyminds.agency
- **Auto-deploy:** Push na `main` branch
- **Build command:** `npm run build`
- **Output directory:** `.next`

### Environment Variables (Vercel)

Následující proměnné jsou nastaveny v Vercel dashboard:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=https://rfm.niftyminds.agency
```

### Monitoring

- **Build logy:** Vercel dashboard
- **Analytics:** Vercel Analytics
- **Errors:** Browser console

---

## 📅 Nedávné Změny

### 26. ledna 2025

#### Content Management System
- ✅ Přidán Content Management System s JSON soubory
- ✅ Vytvořena dokumentace `CONTENT_EDITING.md` pro marketing team
- ✅ Dynamické načítání obsahu z JSON
- ✅ Support pro video sekci (YouTube/Vimeo)
- ✅ FAQ sekce s expand/collapse
- ✅ Tailwind safelist pro dynamické barvy

#### UI/UX Vylepšení
- ✅ Přidána ikonka domečku v headeru pro navigaci zpět
- ✅ Odstraněno samostatné tlačítko "Zpět na hlavní stránku"
- ✅ Instant scroll místo smooth (prevence motion sickness)
- ✅ Tmavší barvy placeholderů (text-gray-700) pro lepší čitelnost
- ✅ Minimalistický design video embedu (bez shadow-2xl)
- ✅ Mobilní optimalizace Hero sekce (screenshot hned pod nadpisem)
- ✅ Screenshot zarovnán top-left místo centrovaného
- ✅ Zmenšen padding kolem screenshotu (8px/10px)

#### Landing Page
- ✅ Profesionální landing page na `/`
- ✅ Aplikace přesunuta na `/app`
- ✅ YouTube video integrace
- ✅ Hero sekce s responzivním layoutem
- ✅ Features, How it works, Benefits, FAQ sekce

#### OAuth & Export
- ✅ Opravena nekonečná smyčka OAuth popup
- ✅ Google Sheets export s formátováním
- ✅ OAuth 2.0 popup window

---

## 📊 Statistiky

- **Celkem commits:** 30+
- **Řádků kódu:** ~5000+
- **Komponenty:** 5 hlavních
- **API Routes:** 3
- **JSON Content Files:** 6
- **Deployment time:** ~2-3 minuty

---

## 🤝 Kontakt

**Vyvinuto:** NiftyMinds Agency
**Email:** info@niftyminds.agency
**Web:** https://niftyminds.agency
**Production:** https://rfm.niftyminds.agency

---

## 📄 Licence

Copyright © 2025 NiftyMinds Agency. Všechna práva vyhrazena.

---

**Powered by [Claude Code](https://claude.com/claude-code)** 🤖
