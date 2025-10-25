# 📝 Návod na editaci obsahu landing page

Tento návod je určen pro marketing team, kteří chtějí měnit texty, obrázky a další obsah na landing page **bez nutnosti zasahovat do kódu**.

---

## 📂 Struktura souborů

Veškerý obsah landing page je uložen v JSON souborech ve složce `src/content/`:

```
src/content/
├── homepage.json          ← Hero sekce, CTA tlačítka, video, statistiky
├── features.json          ← Sekce s features (6 karet)
├── how-it-works.json      ← Kroky "Jak to funguje" (3 kroky)
├── benefits.json          ← Výhody použití (3 karty)
├── faq.json              ← FAQ sekce (otázky a odpovědi)
└── settings.json         ← Obecné nastavení (kontakty, meta tagy)
```

Obrázky se ukládají do složky `public/images/`.

---

## 🛠️ Metody editace

### Metoda 1: Editace přímo na GitHubu (NEJJEDNODUŠŠÍ)

1. Jděte na GitHub repozitář
2. Navigujte do složky `src/content/`
3. Klikněte na soubor, který chcete editovat (např. `homepage.json`)
4. Klikněte na ikonu tužky (Edit) vpravo nahoře
5. Proveďte změny
6. Scroll dolů, vyplňte commit message (např. "Změna hlavního nadpisu")
7. Klikněte na **Commit changes**
8. Vercel automaticky nasadí změny na produkci (cca 2-3 minuty)

### Metoda 2: Editace ve VS Code (PRO POKROČILÉ)

1. Naklonujte repozitář: `git clone [URL_REPOZITARE]`
2. Otevřete složku ve VS Code
3. Editujte JSON soubory ve složce `src/content/`
4. Uložte změny
5. Otestujte lokálně: `npm run dev` (otevře se localhost:3000)
6. Commitněte a pushněte změny:
   ```bash
   git add src/content/
   git commit -m "Update content"
   git push
   ```
7. Vercel automaticky nasadí změny

---

## 📄 Editace jednotlivých sekcí

### 1. Homepage.json - Hero & CTA

**Co můžete změnit:**
- Hlavní nadpis
- Popisek
- Texty na tlačítkách
- Trust badges ("✓ Bez registrace", atd.)
- Video (zapnout/vypnout)
- Statistiky (zapnout/vypnout)

**Příklad změny nadpisu:**

```json
"hero": {
  "heading": "RFM Analýza pro váš e-shop",  ← ZDE ZMĚŇTE TEXT
  "subheading": "Segmentujte zákazníky za 2 minuty"
}
```

**Zapnutí video sekce:**

```json
"video": {
  "enabled": true,  ← ZMĚŇTE z false na true
  "platform": "youtube",  ← youtube nebo vimeo
  "videoId": "dQw4w9WgXcQ",  ← ID videa z YouTube URL
  "title": "Jak funguje RFM Analýza?",
  "description": "Podívejte se na krátké video..."
}
```

**Jak najít YouTube Video ID:**
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ` (text za `watch?v=`)

**Zapnutí statistik:**

```json
"stats": {
  "enabled": true,  ← ZMĚŇTE z false na true
  "items": [
    {
      "value": "10 000+",
      "label": "Analyzovaných zákazníků"
    }
  ]
}
```

---

### 2. Features.json - Funkce produktu

**Co můžete změnit:**
- Nadpis sekce
- Popisek sekce
- Text jednotlivých features
- Ikony
- Barvy

**Příklad přidání nové feature:**

```json
{
  "icon": "Zap",  ← Název ikony (viz seznam níže)
  "title": "Bleskově rychlé",
  "description": "Analýza tisíců zákazníků za pár sekund.",
  "color": "indigo"  ← Barva (viz seznam níže)
}
```

**Dostupné ikony:**
- `Upload` - nahrávání
- `Zap` - blesk
- `BarChart3` - graf
- `Download` - stahování
- `Shield` - štít
- `Sparkles` - jiskry
- `Settings` - nastavení
- `TrendingUp` - rostoucí trend

**Dostupné barvy:**
- `indigo` - fialově modrá
- `blue` - modrá
- `purple` - fialová
- `green` - zelená
- `red` - červená
- `yellow` - žlutá
- `orange` - oranžová

---

### 3. How-it-works.json - Jak to funguje

**Co můžete změnit:**
- Nadpis sekce
- Popisek
- Názvy a popisky kroků
- Ikony
- Barvy

**Příklad změny kroku:**

```json
{
  "number": 1,
  "icon": "Upload",
  "title": "Nahrajte CSV soubor",  ← TEXT KROKU
  "description": "Export dat ze svého e-shopu...",  ← POPIS
  "color": "indigo"
}
```

---

### 4. Benefits.json - Výhody

**Co můžete změnit:**
- Nadpis sekce
- Emoji
- Metriky ("+300%")
- Popisky metrik
- Texty výhod

**Příklad úpravy výhody:**

```json
{
  "emoji": "🎯",
  "title": "Cílený marketing",
  "description": "Posílejte správné nabídky správným zákazníkům...",
  "metric": "+300%",  ← ZMĚŇTE METRIKU
  "metricLabel": "conversion rate",
  "color": "indigo"
}
```

---

### 5. FAQ.json - Často kladené otázky

**Zapnutí FAQ sekce:**

```json
{
  "enabled": true,  ← ZMĚŇTE z false na true
  "sectionTitle": "Často kladené otázky",
  "faqs": [...]
}
```

**Přidání nové otázky:**

```json
{
  "question": "Je služba opravdu zdarma?",
  "answer": "Ano, je 100% zdarma bez skrytých poplatků. Můžete použít **tučný text** pomocí hvězdiček."
}
```

**Formátování odpovědí:**
- `**text**` - tučný text
- Používejte jednoduché HTML značky nejsou podporovány

---

### 6. Settings.json - Obecné nastavení

**Co můžete změnit:**
- Meta title a description (pro SEO)
- Kontaktní údaje
- Social media linky

**Příklad:**

```json
"site": {
  "title": "RFM Analýza | Segmentace zákazníků za 2 minuty",
  "description": "Profesionální RFM analýza pro e-shopy...",
  "keywords": "RFM analýza, segmentace zákazníků..."
}
```

**Zapnutí social media:**

```json
"social": {
  "enabled": true,  ← ZMĚŇTE z false na true
  "links": [
    {
      "platform": "twitter",
      "url": "https://twitter.com/niftyminds",
      "icon": "Twitter"
    }
  ]
}
```

---

## 🖼️ Práce s obrázky

### Přidání nového obrázku

1. Nahrajte obrázek do složky `public/images/`
2. Název souboru: `feature-icon-1.png` (bez mezer, lowercase)
3. V JSON souboru použijte cestu: `/images/feature-icon-1.png`

**Příklad:**

```json
"screenshot": {
  "src": "/images/dashboard-screenshot.png",  ← CESTA K OBRÁZKU
  "alt": "Ukázka RFM Analýzy dashboard"
}
```

### Doporučené velikosti obrázků

- **Hero screenshot**: 1600x900px (16:9)
- **Feature ikony**: 512x512px (čtverec)
- **Video thumbnail**: 1280x720px (16:9)
- Formát: PNG nebo JPG
- Optimalizujte obrázky (max 500KB)

---

## ⚠️ DŮLEŽITÁ PRAVIDLA

### 1. JSON syntaxe

❌ **ŠPATNĚ:**
```json
{
  "title": "Test",  ← ČÁRKA NA KONCI (chyba!)
}
```

✅ **SPRÁVNĚ:**
```json
{
  "title": "Test"  ← BEZ ČÁRKY NA POSLEDNÍM ŘÁDKU
}
```

### 2. Uvozovky

- Vždy používejte **dvojité uvozovky** `"`
- Nikdy nepoužívejte jednoduché uvozovky `'`

❌ **ŠPATNĚ:** `'text'`
✅ **SPRÁVNĚ:** `"text"`

### 3. Speciální znaky v textu

- Emoji jsou povoleny: ✓ ✓ ✓
- České znaky jsou OK: á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý, ž

### 4. Validace JSON

Po každé změně zkontrolujte, že JSON je validní:
1. Online nástroj: https://jsonlint.com/
2. Zkopírujte celý obsah souboru
3. Klikněte na "Validate JSON"
4. Pokud je chyba, opravte ji před commitem

---

## 🚀 Workflow

1. **Upravte JSON soubor** (GitHub nebo VS Code)
2. **Zkontrolujte syntaxi** (JSONLint)
3. **Commitněte změny** s popisnou zprávou
4. **Push do main** (nebo vytvořte Pull Request)
5. **Vercel automaticky nasadí** (2-3 minuty)
6. **Zkontrolujte produkci** na https://rfm.niftyminds.agency

---

## 🐛 Řešení problémů

### Problém: Změny se nezobrazují

**Řešení:**
1. Vyčistěte cache prohlížeče (Ctrl+Shift+R / Cmd+Shift+R)
2. Zkontrolujte Vercel deployment log
3. Ověřte, že jste pushli změny do správné branch (main)

### Problém: Stránka je rozbitá

**Řešení:**
1. Zkontrolujte JSON syntaxi na JSONLint.com
2. Opravte chyby (nejčastěji chybějící/přebývající čárky)
3. Commitněte opravu

### Problém: Barvy se nezobrazují správně

**Příčina:** Použili jste barvu, která není v safelist

**Řešení:**
Používejte pouze barvy ze seznamu: `indigo`, `blue`, `purple`, `green`, `red`, `yellow`, `orange`

### Problém: Ikona se nezobrazuje

**Příčina:** Název ikony není správný

**Řešení:**
Zkontrolujte seznam dostupných ikon výše a opravte název (case-sensitive!).

---

## 📞 Kontakt

Pokud máte problém nebo nejasnosti, kontaktujte vývojářský tým:
- Email: info@niftyminds.agency
- Slack: #rfm-analysis-support

---

## 📚 Další zdroje

- [JSON Tutorial (česky)](https://www.jakpsatweb.cz/json/)
- [JSON Validator](https://jsonlint.com/)
- [Lucide Icons (všechny ikony)](https://lucide.dev/icons/)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)

---

**Poslední aktualizace:** 2025-01-XX
**Verze dokumentu:** 1.0
