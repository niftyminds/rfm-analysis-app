# 📦 Kompletní Setup Guide - RFM Analýza

Tento dokument obsahuje **kompletní** návod od A do Z pro vytvoření a nasazení RFM analýzy aplikace.

## 📋 Obsah

1. [Vytvoření projektu](#1-vytvoření-projektu)
2. [Struktura souborů](#2-struktura-souborů)
3. [Lokální vývoj](#3-lokální-vývoj)
4. [Testování](#4-testování)
5. [Deploy na Vercel](#5-deploy-na-vercel)
6. [DNS konfigurace](#6-dns-konfigurace)
7. [Finální checklist](#7-finální-checklist)

---

## 1. Vytvoření projektu

### Krok 1.1: Inicializace

```bash
# Vytvoř složku projektu
mkdir rfm-analysis-app
cd rfm-analysis-app

# Inicializuj npm projekt
npm init -y
```

### Krok 1.2: Instalace závislostí

```bash
# Hlavní závislosti
npm install next@14.2.5 react@18.3.1 react-dom@18.3.1

# Utility knihovny
npm install papaparse@5.4.1 recharts@2.12.7 lucide-react@0.263.1 date-fns@3.6.0

# Dev závislosti
npm install -D typescript @types/node @types/react @types/react-dom @types/papaparse eslint eslint-config-next autoprefixer postcss tailwindcss

# TypeScript config
npx tsc --init
```

---

## 2. Struktura souborů

### Krok 2.1: Vytvoř strukturu

```bash
# Vytvoř hlavní složky
mkdir -p src/app src/components src/types src/utils
mkdir -p .vscode public

# Vytvoř soubory
touch src/app/layout.tsx
touch src/app/page.tsx
touch src/app/globals.css
touch src/components/FileUpload.tsx
touch src/components/Dashboard.tsx
touch src/components/SegmentChart.tsx
touch src/components/CustomerTable.tsx
touch src/types/index.ts
touch src/utils/rfmAnalysis.ts
touch next.config.js
touch tailwind.config.ts
touch postcss.config.mjs
touch tsconfig.json
touch .gitignore
touch .env.example
touch README.md
touch DEPLOYMENT.md
touch QUICKSTART.md
```

### Krok 2.2: Zkopíruj obsah souborů

Zkopíruj obsah všech souborů, které jsem ti vytvořil výše do odpovídajících souborů v tvém projektu.

**Seznam všech souborů:**

```
✅ package.json
✅ next.config.js
✅ tailwind.config.ts
✅ tsconfig.json
✅ postcss.config.mjs
✅ .gitignore
✅ .env.example
✅ src/app/globals.css
✅ src/app/layout.tsx
✅ src/app/page.tsx
✅ src/types/index.ts
✅ src/utils/rfmAnalysis.ts
✅ src/components/FileUpload.tsx
✅ src/components/Dashboard.tsx
✅ src/components/SegmentChart.tsx
✅ src/components/CustomerTable.tsx
✅ .vscode/settings.json
✅ .vscode/extensions.json
✅ README.md
✅ DEPLOYMENT.md
✅ QUICKSTART.md
```

---

## 3. Lokální vývoj

### Krok 3.1: První spuštění

```bash
# Nainstaluj všechny závislosti
npm install

# Zkontroluj, že není chyba
npm run lint

# Spusť dev server
npm run dev
```

Otevři http://localhost:3000 - měl bys vidět upload stránku!

### Krok 3.2: Test s CSV

Vytvoř testovací CSV soubor `test-data.csv`:

```csv
Číslo objednávky,Datum pořízení,Hodnota obj. bez DPH celkem,Jméno,Email
23000010,27. prosinec 2023 22:57:12,2022.31,Jan Novák,jan.novak@test.cz
23000011,27. prosinec 2023 22:57:12,632.23,Petra Svobodová,petra.svobodova@test.cz
23000012,27. prosinec 2023 22:57:12,1359.50,Martin Dvořák,martin.dvorak@test.cz
23000013,28. prosinec 2023 10:55:44,454.55,Jan Novák,jan.novak@test.cz
23000014,28. prosinec 2023 10:55:44,1200.00,Petra Svobodová,petra.svobodova@test.cz
```

Nahraj ho do aplikace a ověř, že:
- ✅ Soubor se nahraje
- ✅ Dashboard se zobrazí
- ✅ Grafy fungují
- ✅ Tabulka se zobrazí
- ✅ Export funguje

---

## 4. Testování

### Krok 4.1: Production build

```bash
# Vytvoř production build
npm run build

# Spusť production build lokálně
npm run start
```

Otevři http://localhost:3000 a otestuj všechny funkce.

### Krok 4.2: Kontrola chyb

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Zkontroluj velikost buildu
ls -lh .next/static/chunks/
```

---

## 5. Deploy na Vercel

### Krok 5.1: GitHub setup

```bash
# Inicializuj git
git init

# Přidej všechny soubory
git add .

# První commit
git commit -m "Initial commit: RFM Analysis App"

# Vytvoř repozitář na GitHubu (https://github.com/new)
# Pojmenuj ho: rfm-analysis-app

# Připoj remote
git remote add origin https://github.com/TVOJE_JMENO/rfm-analysis-app.git

# Push
git branch -M main
git push -u origin main
```

### Krok 5.2: Vercel deploy

**Varianta A: Web UI (jednodušší)**

1. Jdi na [vercel.com](https://vercel.com)
2. Sign up / Login (nejlépe přes GitHub)
3. Klikni **"Add New..."** → **"Project"**
4. **Import Git Repository**
5. Vyber `rfm-analysis-app` repozitář
6. Vercel automaticky detekuje Next.js - nic neměň
7. Klikni **"Deploy"**
8. Počkej 2-3 minuty na build
9. ✅ Aplikace je live!

**Varianta B: CLI**

```bash
# Nainstaluj Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Krok 5.3: První test

Vercel ti dá URL: `https://rfm-analysis-app-xxx.vercel.app`

Otevři ji a otestuj, že vše funguje!

---

## 6. DNS konfigurace

### Krok 6.1: Přidej doménu ve Vercelu

1. Vercel Dashboard → tvůj projekt
2. **Settings** → **Domains**
3. **Add** → zadej `rfm.niftyminds.agency`
4. Klikni **Add**

Vercel ti ukáže DNS záznamy:

```
Type: CNAME
Name: rfm
Value: cname.vercel-dns.com
```

### Krok 6.2: Nastav DNS

Přihlaš se ke svému DNS provideru pro `niftyminds.agency`:

**Cloudflare (doporučeno):**

1. Dashboard → DNS → Add record
2. **Type**: CNAME
3. **Name**: rfm
4. **Target**: cname.vercel-dns.com
5. **Proxy status**: DNS only (šedý mráček) ⚠️
6. **TTL**: Auto
7. Save

**Jiný provider:**

- Vytvoř CNAME záznam
- Host: `rfm`
- Points to: `cname.vercel-dns.com`
- TTL: 3600

### Krok 6.3: Ověř doménu

```bash
# Zkontroluj DNS (počkej 5-10 minut)
nslookup rfm.niftyminds.agency

# Mělo by vrátit CNAME na Vercel
```

Ve Vercelu klikni **Refresh** u domény - měl bys vidět ✅

---

## 7. Finální checklist

### ✅ Před spuštěním do produkce

- [ ] Lokální build funguje bez chyb
- [ ] Všechny TypeScript typy jsou správně
- [ ] CSV upload funguje s testovacími daty
- [ ] Dashboard zobrazuje správné segmenty
- [ ] Grafy se zobrazují správně
- [ ] Tabulka řazení a filtrování funguje
- [ ] Export CSV funguje
- [ ] Aplikace je responzivní (mobile friendly)
- [ ] Vercel build prošel bez chyb
- [ ] Doména `rfm.niftyminds.agency` funguje
- [ ] HTTPS certifikát je aktivní
- [ ] Otestováno s reálnými daty

### 🚀 Po spuštění

- [ ] Google Analytics (volitelné)
- [ ] Monitoring nastavený
- [ ] Backup plán
- [ ] Dokumentace pro uživatele

---

## 🎉 Gratulujeme!

Tvoje RFM analýza aplikace je nyní live na:

**🌐 https://rfm.niftyminds.agency**

### Co dál?

1. **Sdílej s týmem** - pošli odkaz kolegům
2. **Testuj s reálnými daty** - nahraj skutečná data
3. **Monitoruj performance** - Vercel Analytics
4. **Iteruj** - přidávej nové funkce podle potřeby

---

## 📞 Podpora

Máš problémy? Zkontroluj:

1. **DEPLOYMENT.md** - detailní deploy instrukce
2. **QUICKSTART.md** - lokální development
3. **README.md** - kompletní dokumentace

Nebo kontaktuj:
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs

---

**Vytvořeno pro NiftyMinds Agency** 🚀