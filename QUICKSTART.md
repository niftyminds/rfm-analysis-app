# ⚡ Quick Start Guide

Rychlý průvodce pro spuštění RFM Analýzy aplikace lokálně.

## 🚀 Rychlé spuštění (5 minut)

```bash
# 1. Naklonuj/vytvoř projekt
mkdir rfm-analysis-app
cd rfm-analysis-app

# 2. Zkopíruj všechny soubory do projektu
# (package.json, src/, atd.)

# 3. Nainstaluj závislosti
npm install

# 4. Spusť development server
npm run dev

# 5. Otevři prohlížeč
# http://localhost:3000
```

## 📁 Struktura projektu

```
rfm-analysis-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── FileUpload.tsx      # CSV upload komponenta
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── SegmentChart.tsx    # Graf segmentů
│   │   └── CustomerTable.tsx   # Tabulka zákazníků
│   ├── types/
│   │   └── index.ts            # TypeScript typy
│   └── utils/
│       └── rfmAnalysis.ts      # RFM logika
├── public/                     # Statické soubory
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🛠️ Dostupné příkazy

```bash
# Development (s hot reload)
npm run dev

# Production build
npm run build

# Spuštění production buildu
npm run start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 📝 Testovací CSV data

Pro rychlé testování vytvoř `test-data.csv`:

```csv
Číslo objednávky,Datum pořízení,Hodnota obj. bez DPH celkem,Jméno,Email
1001,15. leden 2024 10:30:00,1500.50,Jan Novák,jan.novak@example.cz
1002,20. únor 2024 14:20:00,2300.00,Petra Svobodová,petra.svobodova@example.cz
1003,5. březen 2024 09:15:00,890.25,Jan Novák,jan.novak@example.cz
1004,10. duben 2024 16:45:00,3200.00,Martin Dvořák,martin.dvorak@example.cz
1005,15. květen 2024 11:30:00,1750.75,Petra Svobodová,petra.svobodova@example.cz
```

## 🎨 Customizace

### Změna barev

Uprav `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### Změna segmentů

Uprav `src/utils/rfmAnalysis.ts`:

```typescript
export function getCustomerSegment(r: number, f: number, m: number): string {
  // Vlastní logika segmentace
}
```

### Změna počtu segmentů

V `assignScore()` funkci uprav kvintily na decily (10 skupin):

```typescript
if (percentile <= 0.10) return 10;
if (percentile <= 0.20) return 9;
// atd...
```

## 🐛 Časté problémy

### Port 3000 je obsazený

```bash
# Použij jiný port
PORT=3001 npm run dev
```

### Chyba při instalaci

```bash
# Smaž node_modules a zkus znovu
rm -rf node_modules package-lock.json
npm install
```

### TypeScript chyby

```bash
# Zkontroluj TypeScript
npx tsc --noEmit

# Update závislostí
npm update
```

## 📊 Příklady použití

### 1. Základní RFM analýza

1. Nahraj CSV s objednávkami
2. Počkej na zpracování
3. Prohlédni dashboard se segmenty
4. Exportuj výsledky

### 2. Filtrace zákazníků

1. Použij vyhledávací pole v tabulce
2. Klikni na záhlaví pro řazení
3. Najdi konkrétní segmenty

### 3. Export pro marketing

1. Exportuj CSV
2. Otevři v Excelu
3. Filtruj podle segmentu
4. Použij pro email kampaně

## 💡 Tipy pro vývoj

### Hot reload

Next.js automaticky reloaduje změny - prostě uprav soubor a ulož!

### TypeScript

Používej TypeScript pro type safety:

```typescript
// Špatně
const customer = data[0];

// Dobře
const customer: Customer = data[0];
```

### Performance

Pro velké CSV soubory (100MB+) zvažte:
- Web Workers pro parsing
- Virtualizovanou tabulku
- Server-side processing

## 📚 Další kroky

1. **Přečti DEPLOYMENT.md** pro nasazení na Vercel
2. **Prohlédni README.md** pro kompletní dokumentaci
3. **Experimentuj** s kódem a RFM logikou

## 🎉 Hotovo!

Aplikace běží na `http://localhost:3000`

Zkus nahrát testovací CSV a uvidíš výsledky! 🚀