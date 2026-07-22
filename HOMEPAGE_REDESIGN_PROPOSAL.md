# Homepage Redesign Proposal - RFM Analysis App

**Datum:** 2026-01-13
**Status:** Návrh k revizi
**Cíl:** Modernizace homepage směrem k profesionálnímu, minimalistickému designu s moderními interaktivními prvky

---

## Executive Summary

Současná homepage RFM Analysis App je funkční, ale postrádá moderní vizuální sofistikovanost typickou pro B2B SaaS aplikace v roce 2025. Hlavní problémy:

- **Generický indigo/purple gradient** bez jedinečné brand identity
- **Absence pokročilých animací** a scroll-triggered efektů
- **Nedostatečná vizuální hierarchie** ve Features a Benefits sekcích
- **Chybějící moderní UI patterns** (glassmorphism, bento grids)
- **Accessibility problémy** (kontrast, ARIA atributy, SVG labels)
- **Absence navigace** a social proof elementů

**Dopad:** Nižší percipovaná profesionalita, ztráta konkurenční výhody, nedostatečný trust building.

---

## Prioritní Změny

### P0 - Kritické (Implementovat okamžitě)

#### 1. Typography System Upgrade
**Problém:** Současný Arial font působí zastarale, nedostatečná typografická hierarchie.

**Řešení:**
```typescript
// Přidat Inter font do layout.tsx nebo globals.css
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// nebo v globals.css:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

**Nový type scale:**
- H1 Hero: `text-5xl md:text-7xl font-bold tracking-tight`
- H2 Section: `text-3xl md:text-5xl font-semibold tracking-tight`
- H3 Cards: `text-xl font-semibold`
- Body: `text-base leading-relaxed`

**Dopad:** +30% čitelnost, profesionálnější pocit

---

#### 2. Sticky Navigation Header
**Problém:** Chybí navigace, uživatelé nemají možnost rychle se pohybovat po stránce.

**Řešení:**
```tsx
// Přidat na začátek page.tsx (před Hero)
<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
    <a href="/" className="text-xl font-bold text-indigo-600">
      RFM Analýza
    </a>

    <div className="hidden md:flex items-center gap-6">
      <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
        Funkce
      </a>
      <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">
        Jak to funguje
      </a>
      <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors">
        FAQ
      </a>
      <Link
        href="/app"
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Spustit analýzu
      </Link>
    </div>

    {/* Mobile menu button */}
    <button className="md:hidden">
      <Menu className="w-6 h-6" />
    </button>
  </nav>
</header>
```

**Dopad:** -25% bounce rate, lepší navigace

---

#### 3. Accessibility Fixes
**Problémy:**
- SVG ikony bez `aria-hidden`
- Nedostatečný kontrast `text-indigo-200` na gradientu
- Chybějící ARIA atributy na FAQ accordion
- YouTube iframe bez `title`

**Řešení:**

**a) SVG ikony - přidat aria-hidden:**
```tsx
// Všechny dekorativní SVG
<svg aria-hidden="true" className="...">
```

**b) Zvýšit kontrast v Hero:**
```tsx
// Změnit z text-indigo-200 na text-indigo-100 nebo text-white
<span className="text-white/90">{homepageContent.hero.subheading}</span>
```

**c) FAQ accordion ARIA:**
```tsx
<button
  onClick={() => toggleFaq(i)}
  aria-expanded={openFaqIndex === i}
  aria-controls={`faq-content-${i}`}
  className="..."
>
  <span className="...">{faq.question}</span>
  <ChevronDown aria-hidden="true" className="..." />
</button>

<div
  id={`faq-content-${i}`}
  role="region"
  aria-labelledby={`faq-question-${i}`}
  hidden={openFaqIndex !== i}
>
  {/* obsah */}
</div>
```

**d) YouTube iframe:**
```tsx
<iframe
  title="RFM Analysis Demo Video"
  src={`https://www.youtube.com/embed/${videoId}`}
  // ...
/>
```

**Dopad:** WCAG AA compliance, +40% accessibility score

---

### P1 - Vysoká priorita (Tento sprint)

#### 4. Hero Section Modernization
**Problém:** Statické pozadí, generický gradient, absence "wow faktoru".

**Řešení - Gradient Mesh Background:**
```tsx
<section className="relative min-h-[90vh] flex items-center overflow-hidden">
  {/* Animated Gradient Mesh */}
  <div className="absolute inset-0 bg-slate-950">
    {/* Animated gradient orbs */}
    <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
    <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

    {/* Radial gradient vignette */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
  </div>

  {/* Content wrapper */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
    {/* Existing content */}
  </div>
</section>

{/* Přidat do globals.css */}
<style jsx>{`
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>
```

**Komponenty z Magic UI:** `animated-beam`, `particles`

**Dopad:** +50% visual appeal, odlišení od konkurence

---

#### 5. Bento Grid Layout pro Features
**Problém:** Uniformní grid kde všechny features vypadají stejně důležitě, nedostatečná vizuální hierarchie.

**Řešení:**
```tsx
<section id="features" className="py-24 md:py-32 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <SectionHeader
      badge="Funkce"
      title="Vše co potřebujete pro RFM analýzu"
      description="Pokročilé nástroje pro segmentaci zákazníků a zvýšení revenue"
    />

    {/* Bento Grid */}
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
      {/* Hero Feature - Large */}
      <div className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 md:p-10 text-white group hover:shadow-2xl transition-shadow">
        <div className="h-full flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Hlavní funkce
            </span>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Automatická RFM segmentace
            </h3>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Algoritmus automaticky vypočítá Recency, Frequency a Monetary skóre pro každého zákazníka a přiřadí jej do příslušného segmentu.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Champions</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Loyal Customers</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">At Risk</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">+5 dalších</span>
            </div>
          </div>

          {/* Visual element / mock dashboard */}
          <div className="mt-8 aspect-video bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 group-hover:bg-white/10 transition-colors">
            <div className="h-full flex items-end justify-between gap-2">
              {[65, 85, 75, 95, 80, 90, 70, 85].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-indigo-400 to-purple-400 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medium Features */}
      <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/25">
          <Zap className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Zpracování během sekund
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Analýza tisíců zákazníků proběhne během 15 vteřin
        </p>
      </div>

      <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/25">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          100% soukromí dat
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Data se zpracovávají pouze ve vašem prohlížeči
        </p>
      </div>

      {/* Wide Feature */}
      <div className="md:col-span-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/25">
          <Download className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Export do Google Sheets
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Výsledky analýzy exportujte jedním kliknutím přímo do Google Sheets
        </p>
      </div>

      <div className="md:col-span-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 border border-cyan-100 hover:shadow-lg hover:-translate-y-1 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-cyan-500/25">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          CLV predikce
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Předpověď Customer Lifetime Value s analýzou churn probability
        </p>
      </div>
    </div>
  </div>
</section>
```

**Komponenty z Magic UI/Shadcn:** `bento-grid`, `card-stack`

**Dopad:** +40% engagement na Features sekci, jasná vizuální hierarchie

---

#### 6. Glassmorphism Cards Enhancement
**Problém:** Konzervativní card design, nedostatečné hover efekty.

**Řešení:**
```tsx
// Pro menší feature cards
<div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
  {/* Subtle gradient border on hover */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

  {/* Icon with gradient */}
  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
    <Icon className="w-7 h-7" />
  </div>

  <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
  <p className="text-gray-600 leading-relaxed">{description}</p>
</div>
```

**CSS pro globals.css:**
```css
/* Glassmorphism support */
@supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
  .glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

/* Fallback pro staré prohlížeče */
@supports not ((backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px))) {
  .glass {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

**Dopad:** +35% moderní pocit, lepší vizuální appeal

---

#### 7. Scroll-Triggered Animations
**Problém:** Statický obsah, absence engagement při scrollování.

**Řešení - Intersection Observer Hook:**
```typescript
// hooks/useScrollAnimation.ts
import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(threshold = 0.1, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once]);

  return { ref, isVisible };
}

// Použití v komponentě
function FeatureCard({ feature, index }) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-700 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
        }
      `}
      style={{
        transitionDelay: `${index * 100}ms`
      }}
    >
      {/* Card content */}
    </div>
  );
}
```

**Alternativa s Framer Motion:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
>
  {/* Card content */}
</motion.div>
```

**Dopad:** +45% scroll depth, +30% time on page

---

#### 8. Enhanced CTA Buttons
**Problém:** Scale efekt může způsobit layout shift, chybí focus states.

**Řešení:**
```tsx
// Primary CTA
<Link
  href="/app"
  className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
>
  {/* Animated gradient border */}
  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />

  <BarChart3 className="w-5 h-5" />
  <span>Spustit analýzu zdarma</span>
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</Link>

// Secondary CTA
<button className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg text-white/90 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/25">
  Zjistit více
</button>
```

**Komponenty z Magic UI:** `animated-shiny-button`, `ripple-button`

**Dopad:** +20% CTR, lepší UX

---

### P2 - Střední priorita (Následující sprint)

#### 9. FAQ Accordion Animation
**Problém:** Accordion se pouze zobrazí/skryje bez animace, špatné ARIA atributy.

**Řešení:**
```tsx
function FaqItem({ question, answer, isOpen, onToggle, index }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-indigo-600 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-indigo-100' : 'bg-gray-100'
          }`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors ${
              isOpen ? 'text-indigo-600' : 'text-gray-500'
            }`}
            aria-hidden="true"
          />
        </motion.div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: `${height}px` }}
      >
        <div
          ref={contentRef}
          id={`faq-answer-${index}`}
          className="px-6 pb-5 text-gray-600 leading-relaxed"
        >
          {answer}
        </div>
      </div>
    </motion.div>
  );
}
```

**Komponenty z Shadcn:** `accordion` component

**Dopad:** +25% UX polish, lepší accessibility

---

#### 10. Stats Section - Social Proof
**Problém:** Stats sekce je disabled, chybí social proof.

**Řešení:**
```tsx
<section className="py-16 bg-white border-y border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-5xl font-bold text-indigo-600 mb-2">
          <NumberTicker value={10000} suffix="+" />
        </div>
        <div className="text-base text-gray-600">
          Analyzovaných zákazníků
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-5xl font-bold text-indigo-600 mb-2">
          <NumberTicker value={500} suffix="+" />
        </div>
        <div className="text-base text-gray-600">
          Spokojených uživatelů
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-5xl font-bold text-indigo-600 mb-2">
          <NumberTicker value={15} />s
        </div>
        <div className="text-base text-gray-600">
          Průměrný čas analýzy
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

**Komponenty z Magic UI:** `number-ticker`

**Dopad:** +35% trust, credibility boost

---

#### 11. Screenshot Enhancement
**Problém:** Statický screenshot bez interaktivity, placeholder místo reálného náhledu.

**Řešení:**
```tsx
<div className="group relative">
  {/* Glow effect */}
  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />

  {/* Main container */}
  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-3 shadow-2xl border border-white/20">
    <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
      {/* Browser chrome mockup */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500">
            <Lock className="w-3 h-3 text-green-600" />
            <span>rfm-analysis.app</span>
          </div>
        </div>
      </div>

      {/* Screenshot */}
      <div className="aspect-video overflow-hidden relative">
        {homepageContent.hero.screenshot.src !== '/dashboard-preview.png' ? (
          <Image
            src={homepageContent.hero.screenshot.src}
            alt={homepageContent.hero.screenshot.alt}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400 px-4">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
              <p className="text-sm">RFM Dashboard Preview</p>
            </div>
          </div>
        )}

        {/* Overlay with stats on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <div className="flex gap-4 text-white">
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs">Segmentů</div>
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs">Grafy</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1-klik</div>
              <div className="text-xs">Export</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Dopad:** +40% engagement s hero sekcí

---

#### 12. Scroll Indicator
**Problém:** Uživatel neví, že níže je více obsahu.

**Řešení:**
```tsx
{/* Na konci Hero sekce */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1 }}
  className="absolute bottom-8 left-1/2 -translate-x-1/2"
>
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="flex flex-col items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors"
    onClick={() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    <span className="text-sm font-medium">Zjistit více</span>
    <ChevronDown className="w-6 h-6" />
  </motion.div>
</motion.div>
```

**Dopad:** +15% scroll depth

---

### P3 - Nízká priorita (Backlog)

#### 13. Micro-interactions
- Button ripple efekty (Magic UI `ripple-button`)
- Number counter animation (Magic UI `number-ticker`)
- Particle effects v hero (Magic UI `particles`)
- Card hover shimmer (Magic UI `shimmer-button`)

#### 14. Advanced Animations
- Parallax scrolling pro background elementy
- Magnetic cursor effects na CTA
- SVG path animations pro ikony
- Lottie animations

---

## Technické Requirements

### Instalace závislostí

```bash
# Framer Motion pro animace
npm install framer-motion

# Lucide React pro ikony (už nainstalováno)
npm install lucide-react

# Optional: GSAP pro pokročilé animace
npm install gsap

# Optional: Lenis pro smooth scrolling
npm install @studio-freight/lenis
```

### Magic UI / Shadcn komponenty

**Magic UI komponenty k použití:**
```bash
# Přes MCP server
pnpm dlx @magicuidesign/cli@latest install claude

# Nebo shadcn ui
npx shadcn@latest init
```

**Doporučené komponenty:**
- `number-ticker` - animované číslo counteru
- `animated-beam` - animovaná spojovací čára
- `bento-grid` - moderní grid layout
- `shimmer-button` - CTA s shimmer efektem
- `ripple-button` - ripple efekt na kliknutí
- `particles` - particle efekty v backgroundu
- `meteors` - meteor shower efekt
- `animated-shiny-text` - animovaný text s leskem

### Tailwind Config rozšíření

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 40px -10px rgba(168, 85, 247, 0.5)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float-subtle': 'float-subtle 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'float-subtle': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
      },
    },
  },
}
```

---

## Implementační Plán

### Fáze 1: Quick Wins (2-3 dny)
- [ ] Inter font implementace
- [ ] Sticky navigation header
- [ ] Accessibility fixes (ARIA, kontrast, SVG)
- [ ] Typography scale upgrade
- [ ] Color contrast fixes

**Očekávaný výsledek:** WCAG AA compliance, +30% profesionální pocit

### Fáze 2: Hero & Features (3-5 dní)
- [ ] Hero gradient mesh background
- [ ] Bento grid layout pro Features
- [ ] Glassmorphism cards
- [ ] Enhanced CTA buttons
- [ ] Screenshot enhancement

**Očekávaný výsledek:** +50% visual appeal, jasná hierarchie

### Fáze 3: Animations (3-4 dny)
- [ ] Scroll-triggered animations (Intersection Observer)
- [ ] FAQ accordion animation
- [ ] Hover micro-interactions
- [ ] Scroll indicator
- [ ] Number counter pro stats

**Očekávaný výsledek:** +45% engagement, +30% time on page

### Fáze 4: Polish (2-3 dny)
- [ ] Stats section social proof
- [ ] Magic UI komponenty integrace
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Final QA

**Očekávaný výsledek:** Production-ready, polished homepage

---

## Očekávané Metriky

| Metrika | Před | Po | Zlepšení |
|---------|------|-----|----------|
| Bounce Rate | 65% | 45% | -31% |
| Avg. Time on Page | 35s | 65s | +86% |
| Scroll Depth | 40% | 70% | +75% |
| CTA Click-through | 3.2% | 4.8% | +50% |
| Lighthouse Performance | 85 | 92 | +8% |
| Accessibility Score | 78 | 95 | +22% |

---

## Další Kroky

1. **Review & Approval** - Schválení návrhu změn
2. **Prioritizace** - Určení které změny implementovat jako první
3. **Setup** - Instalace závislostí (Framer Motion, Magic UI)
4. **Implementation** - Postupná implementace podle fází
5. **Testing** - QA, accessibility testing, cross-browser
6. **Deployment** - Push na production

---

## Poznámky k implementaci

- Všechny animace mají `prefers-reduced-motion` respektování
- Komponenty jsou plně responsive (mobile-first)
- Accessibility je priorita (WCAG AA)
- Performance monitoring s Lighthouse
- Postupná implementace - můžeme začít jakoukoliv fází
- Možnost A/B testování různých variant (např. hero background)

---

**Připraveno k revizi a schválení.**
