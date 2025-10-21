# RFM Analýza - NiftyMinds Agency

Pokročilá webová aplikace pro RFM (Recency, Frequency, Monetary) analýzu zákaznických dat.

## 🚀 Funkce

- ✅ **Upload CSV souborů** - Drag & drop nebo výběr souboru
- 📊 **RFM Segmentace** - Automatická kategorizace zákazníků do 9 segmentů
- 📈 **Interaktivní grafy** - Vizualizace distribuce segmentů
- 🔍 **Prohledávatelná tabulka** - Filtrování a řazení zákazníků
- 💾 **Export do CSV** - Stažení výsledků s RFM metrikami
- 📱 **Responzivní design** - Funguje na všech zařízeních

## 🛠️ Technologie

- **Next.js 14** - React framework s App Router
- **TypeScript** - Type-safe kód
- **Tailwind CSS** - Styling
- **Recharts** - Grafy a vizualizace
- **Papaparse** - CSV parsing
- **Lucide React** - Ikony

## 📦 Instalace

```bash
# Klonování repozitáře
git clone <your-repo-url>
cd rfm-analysis-app

# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev
```

Aplikace poběží na `http://localhost:3000`

## 🚢 Deploy na Vercel

### Automatický deploy:

1. Push kódu na GitHub
2. Import projektu ve Vercel dashboard
3. Vercel automaticky detekuje Next.js a provede build

### Ruční deploy:

```bash
# Instalace Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Nastavení vlastní domény:

1. Ve Vercel dashboard přejdi na projekt
2. Settings → Domains
3. Přidej doménu: `rfm.niftyminds.agency`
4. Nastav DNS záznamy dle instrukcí Vercel

## 📋 Požadovaný formát CSV

CSV soubor musí obsahovat následující sloupce:

- **Číslo objednávky** - ID objednávky
- **Datum pořízení** - Datum ve formátu "27. prosinec 2023"
- **Hodnota obj. bez DPH celkem** - Částka objednávky
- **Jméno** - Jméno zákazníka
- **Email** - Email zákazníka

## 📊 RFM Segmenty

Aplikace automaticky kategorizuje zákazníky do těchto segmentů:

- **Champions** (555-544) - Nejlepší zákazníci
- **Loyal Customers** (543-433) - Věrní zákazníci
- **Potential Loyalists** (433-333) - Potenciálně věrní
- **New Customers** (511-411) - Noví zákazníci
- **Promising** (422-322) - Perspektivní
- **Need Attention** (333-313) - Potřebují pozornost
- **At Risk** (244-233) - V ohrožení
- **Can't Lose Them** (244-155) - Nesmíme ztratit
- **Lost** (255-111) - Ztracení zákazníci

## 📄 Export dat

Export obsahuje následující sloupce:

- email
- jmeno
- prijmeni
- pocet_objednavek
- hodnota_objednavek
- datum_posledni_objednavky
- RFM_skore (např. 555)
- R_skore (1-5)
- F_skore (1-5)
- M_skore (1-5)
- segment
- recency_dny

## 🔧 Skripty

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## 📝 Licence

© 2025 NiftyMinds Agency. Všechna práva vyhrazena.

## 🆘 Podpora

Pro podporu kontaktujte tým NiftyMinds Agency.