# 🚀 Deployment Guide - Vercel

Tento průvodce ti pomůže nasadit RFM Analýzu aplikaci na Vercel s vlastní doménou `rfm.niftyminds.agency`.

## ✅ Předpoklady

- GitHub účet
- Vercel účet (zdarma na vercel.com)
- Přístup k DNS nastavení pro niftyminds.agency

## 📋 Krok za krokem

### 1. Příprava kódu

```bash
# Vytvoř nový repozitář na GitHubu
# Pojmenuj ho např. "rfm-analysis-app"

# Inicializuj git v projektu
git init
git add .
git commit -m "Initial commit - RFM Analysis App"

# Připoj remote a push
git remote add origin https://github.com/TVOJE_JMENO/rfm-analysis-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy na Vercel

#### Varianta A: Import z GitHubu (doporučeno)

1. Přihlaš se na [vercel.com](https://vercel.com)
2. Klikni na **"Add New..."** → **"Project"**
3. Vyber **"Import Git Repository"**
4. Najdi a vyber svůj `rfm-analysis-app` repozitář
5. Vercel automaticky detekuje Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
6. Klikni **"Deploy"**
7. Počkej na dokončení build (2-3 minuty)

#### Varianta B: CLI Deploy

```bash
# Nainstaluj Vercel CLI
npm install -g vercel

# Přihlaš se
vercel login

# Deploy
vercel

# Pro production
vercel --prod
```

### 3. Nastavení vlastní domény

Po úspěšném deployi:

1. Otevři projekt na Vercel Dashboard
2. Přejdi na **Settings** → **Domains**
3. Klikni **"Add"**
4. Zadej: `rfm.niftyminds.agency`
5. Klikni **"Add"**

Vercel ti ukáže potřebné DNS záznamy:

```
Type: CNAME
Name: rfm
Value: cname.vercel-dns.com
```

### 4. Konfigurace DNS

Přihlaš se do svého DNS providera (např. Cloudflare, GoDaddy, atd.) pro doménu `niftyminds.agency`:

**Pro Cloudflare:**
1. DNS → Add record
2. Type: `CNAME`
3. Name: `rfm`
4. Target: `cname.vercel-dns.com`
5. Proxy status: DNS only (šedý mráček)
6. Save

**Pro ostatní DNS providery:**
- Vytvoř CNAME záznam
- Host/Name: `rfm`
- Points to: `cname.vercel-dns.com`
- TTL: Auto nebo 3600

### 5. Ověření domény

1. Počkej 5-10 minut na propagaci DNS
2. Na Vercel u domény klikni **"Refresh"**
3. Když je vše v pořádku, uvidíš ✅ Valid Configuration

## 🔄 Automatický deployment

Každý push do `main` větve na GitHubu automaticky:
- Spustí build
- Spustí testy (pokud jsou)
- Nasadí novou verzi na production

### Preview deployments

Každý Pull Request automaticky vytvoří preview URL pro testování změn před mergem.

## 🔒 Environment Variables (volitelné)

Pokud budeš potřebovat environment variables:

1. Vercel Dashboard → Settings → Environment Variables
2. Přidej proměnné (např. API keys)
3. Re-deploy pro aplikování změn

## ⚡ Optimalizace

Aplikace je již optimalizovaná s:
- ✅ Automatic Static Optimization
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Gzip Compression
- ✅ CDN Distribution

## 🐛 Troubleshooting

### Build selže

```bash
# Zkontroluj lokálně
npm run build

# Zkontroluj chyby v kódu
npm run lint
```

### Doména nefunguje

1. Ověř DNS záznamy: `nslookup rfm.niftyminds.agency`
2. Počkej na DNS propagaci (až 48h, obvykle 5-10 min)
3. Zkontroluj, že CNAME míří na `cname.vercel-dns.com`

### 404 Error na refresh

Next.js App Router to řeší automatически, pokud problém přetrvává:
1. Vercel Dashboard → Settings → General
2. Zkontroluj Output Directory: `.next`

### Pomalé načítání

- Vercel automaticky cachuje a optimalizuje
- CSV parsing běží v prohlížeči (client-side)
- Pro velké soubory (10MB+) zvažte server-side processing

## 📊 Monitoring

Vercel poskytuje zdarma:
- **Analytics** - Návštěvnost a performance
- **Logs** - Runtime logy
- **Speed Insights** - Core Web Vitals

Přístup: Vercel Dashboard → tvůj projekt → Analytics/Logs

## 🔄 Update aplikace

```bash
# Udělej změny v kódu
git add .
git commit -m "Update: popis změn"
git push origin main

# Vercel automaticky nasadí novou verzi!
```

## 📱 Testování

Po deployi otestuj:

1. ✅ Upload CSV souboru
2. ✅ Zobrazení dashboardu
3. ✅ Export CSV
4. ✅ Mobilní zobrazení
5. ✅ Všechny segmenty fungují

## 🎯 Production Checklist

Před spuštěním do produkce zkontroluj:

- [ ] Aplikace funguje na `rfm.niftyminds.agency`
- [ ] SSL certifikát je aktivní (HTTPS)
- [ ] CSV upload funguje správně
- [ ] Export generuje správné výstupy
- [ ] Responzivní design funguje na mobilu
- [ ] Všechny grafy se zobrazují
- [ ] Tabulka řazení a filtrování funguje
- [ ] Testováno s reálnými daty

## 💡 Tips & Tricks

### Custom 404 stránka

Vytvoř `src/app/not-found.tsx`:

```typescript
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Stránka nenalezena</p>
        <a href="/" className="mt-8 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Zpět na hlavní stránku
        </a>
      </div>
    </div>
  );
}
```

### Performance monitoring

Přidej Google Analytics (volitelné):

1. Vytvoř `src/app/layout.tsx` s GA tracking
2. Přidej tracking ID do environment variables

### Backup dat

Uživatelé stahují CSV, ale zvažte:
- Cloudflare R2 pro ukládání uploads (volitelné)
- Database pro historii analýz (volitelné)

## 📞 Podpora

Máš-li problémy:

1. **Vercel Dokumentace**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js Dokumentace**: [nextjs.org/docs](https://nextjs.org/docs)
3. **Vercel Support**: support@vercel.com
4. **Discord**: Vercel Discord community

## 🎉 Hotovo!

Tvoje aplikace je nyní live na:
- **Production**: https://rfm.niftyminds.agency
- **Vercel URL**: https://tvuj-projekt.vercel.app

Gratulujeme k úspěšnému deployi! 🚀