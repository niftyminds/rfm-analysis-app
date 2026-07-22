'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Import JSON content
import homepageContent from '@/content/homepage.json';
import featuresContent from '@/content/features.json';
import howItWorksContent from '@/content/how-it-works.json';
import benefitsContent from '@/content/benefits.json';
import faqContent from '@/content/faq.json';

// Lucide icon mapping - using semantically appropriate icons
const iconMap: Record<string, LucideIcons.LucideIcon> = {
  Upload: LucideIcons.Upload,
  Zap: LucideIcons.Zap,
  BarChart3: LucideIcons.BarChart3,
  FileSpreadsheet: LucideIcons.FileSpreadsheet,
  ShieldCheck: LucideIcons.ShieldCheck,
  Sparkles: LucideIcons.Sparkles,
  Columns: LucideIcons.Columns,
  TrendingUp: LucideIcons.TrendingUp,
  Target: LucideIcons.Target,
  DollarSign: LucideIcons.DollarSign,
  // Legacy names for backwards compat with JSON
  Download: LucideIcons.FileSpreadsheet,
  Shield: LucideIcons.ShieldCheck,
  Settings: LucideIcons.Columns,
};

// Shared reveal transition (800ms, brand easing, 18px rise)
const revealClass = (isVisible: boolean) =>
  `transition-all duration-[800ms] ease-brand ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]'
  }`;

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Scroll animations for different sections
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
  const howItWorksAnimation = useScrollAnimation({ threshold: 0.1 });
  const benefitsAnimation = useScrollAnimation({ threshold: 0.1 });
  const faqAnimation = useScrollAnimation({ threshold: 0.1 });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-cream text-ink-soft">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-14 md:pt-16 border-b border-line">
        <div className="max-w-page mx-auto px-5 md:px-8 pt-14 sm:pt-20 md:pt-28 pb-16 md:pb-24">
          {/* Badge */}
          <div className="chip-mono mb-8">
            <span className="w-1.5 h-1.5 bg-lime-deep" aria-hidden="true" />
            {homepageContent.hero.badge}
          </div>

          <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-end">
            <div className="md:col-span-7">
              <h1 className="font-black uppercase text-ink tracking-[-0.03em] leading-[0.92] text-[clamp(2.75rem,8vw,6.5rem)]">
                {homepageContent.hero.heading}
                {homepageContent.hero.subheading && (
                  <>
                    <br />
                    <span className="bg-lime px-2 md:px-3 box-decoration-clone">
                      {homepageContent.hero.subheading}
                    </span>
                  </>
                )}
              </h1>
            </div>

            <div className="md:col-span-5">
              <p className="text-[clamp(1.05rem,1.2vw,1.25rem)] leading-relaxed text-ink-soft max-w-xl">
                {homepageContent.hero.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={homepageContent.hero.primaryCta.link}
                  className="btn-brand btn-ink group"
                >
                  {homepageContent.hero.primaryCta.text}
                  <LucideIcons.ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-brand"
                    aria-hidden="true"
                  />
                </Link>
                <a
                  href={homepageContent.hero.secondaryCta.link}
                  className="btn-brand btn-outline-ink"
                >
                  {homepageContent.hero.secondaryCta.text}
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-2">
                {homepageContent.hero.trustBadges.map((badge, i) => (
                  <span key={i} className="chip-mono text-mute">
                    <LucideIcons.Check className="w-3 h-3 text-ink" aria-hidden="true" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Screenshot */}
          <div className="relative mt-14 md:mt-20">
            <div className="border border-black/10 bg-card">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                  rfm-analyza.app
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute hidden sm:inline">
                  Dashboard · Live náhled
                </span>
              </div>

              <div className="bg-cream-deep overflow-hidden">
                {homepageContent.hero.screenshot.src !== '/dashboard-preview.png' ? (
                  <Image
                    src={homepageContent.hero.screenshot.src}
                    alt={homepageContent.hero.screenshot.alt}
                    width={1920}
                    height={1080}
                    className="w-full h-auto grayscale hover:grayscale-0 transition-[filter] duration-500 ease-brand"
                  />
                ) : (
                  <div className="aspect-video text-center text-mute px-4 flex flex-col items-center justify-center h-full">
                    <LucideIcons.BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 mb-4" aria-hidden="true" />
                    <p className="font-mono text-xs uppercase tracking-[0.14em]">
                      {homepageContent.hero.screenshot.alt}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-5 left-4 sm:-left-4 card-brand px-4 py-3 hidden sm:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Champions</div>
              <div className="text-2xl font-black text-ink">142</div>
            </div>
            <div className="absolute -top-5 right-4 sm:-right-4 card-brand px-4 py-3 hidden sm:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">At Risk</div>
              <div className="text-2xl font-black text-ink">89</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Social Proof */}
      {homepageContent.stats.enabled && (
        <section className="border-b border-line">
          <div className="max-w-page mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
              {homepageContent.stats.items.map((stat, i) => (
                <div key={i} className="py-10 sm:py-14 sm:px-8 first:pl-0 last:pr-0">
                  <div className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-3">
                    {stat.value}
                  </div>
                  <div className="eyebrow">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section (Optional) */}
      {homepageContent.video.enabled && (
        <section className="border-b border-line bg-cream-deep">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 sm:py-24">
            <div className="mb-10">
              <div className="eyebrow mb-4">Video / 2 minuty</div>
              <h2 className="display-heading text-[clamp(1.75rem,3.5vw,3.25rem)] mb-4">
                {homepageContent.video.title}
              </h2>
              <p className="text-lg text-mute max-w-2xl">
                {homepageContent.video.description}
              </p>
            </div>

            <div className="aspect-video bg-ink border border-black/10 overflow-hidden">
              {homepageContent.video.platform === 'youtube' && (
                <iframe
                  src={`https://www.youtube.com/embed/${homepageContent.video.videoId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {homepageContent.video.platform === 'vimeo' && (
                <iframe
                  src={`https://player.vimeo.com/video/${homepageContent.video.videoId}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Bento Grid */}
      <section id="features" className="border-b border-line scroll-mt-20">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 sm:py-24">
          <div
            ref={featuresAnimation.ref}
            className={`mb-12 sm:mb-16 ${revealClass(featuresAnimation.isVisible)}`}
          >
            <div className="eyebrow mb-4">Funkce</div>
            <h2 className="display-heading text-[clamp(1.75rem,3.5vw,3.25rem)] mb-4 max-w-3xl">
              {featuresContent.sectionTitle}
            </h2>
            <p className="text-lg text-mute max-w-2xl">
              {featuresContent.sectionDescription}
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-5">
            {featuresContent.features.map((feature, i) => {
              // Define grid spans for Bento layout
              const gridSpans = [
                'md:col-span-4 lg:col-span-6', // Feature 0 - larger featured card
                'md:col-span-2 lg:col-span-3', // Feature 1
                'md:col-span-3 lg:col-span-3', // Feature 2
                'md:col-span-3 lg:col-span-4', // Feature 3
                'md:col-span-2 lg:col-span-4', // Feature 4
                'md:col-span-4 lg:col-span-4', // Feature 5
              ];

              const isLarge = i === 0;

              return (
                <div
                  key={i}
                  className={`${gridSpans[i]} group card-brand p-6 ${isLarge ? 'sm:p-10' : 'sm:p-8'} hover:border-ink transition-colors duration-200 ease-brand`}
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 border-2 border-ink text-ink mb-6 group-hover:bg-lime transition-colors duration-200 ease-brand">
                    {iconMap[feature.icon] && React.createElement(iconMap[feature.icon], { size: isLarge ? 24 : 20 })}
                  </div>
                  <h3 className={`${isLarge ? 'text-xl sm:text-2xl' : 'text-lg'} font-black uppercase tracking-tight text-ink mb-3`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${isLarge ? 'sm:text-base' : ''} text-mute leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-line bg-cream-deep scroll-mt-20">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 sm:py-24">
          <div
            ref={howItWorksAnimation.ref}
            className={`mb-12 sm:mb-16 ${revealClass(howItWorksAnimation.isVisible)}`}
          >
            <div className="eyebrow mb-4">Postup / 3 kroky</div>
            <h2 className="display-heading text-[clamp(1.75rem,3.5vw,3.25rem)] mb-4">
              {howItWorksContent.sectionTitle}
            </h2>
            <p className="text-lg text-mute max-w-2xl">
              {howItWorksContent.sectionDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {howItWorksContent.steps.map((step, i) => (
              <div key={i} className="card-brand p-6 sm:p-8">
                <div className="flex items-start justify-between mb-8">
                  <span className="font-mono font-bold text-4xl text-ink/15">
                    {String(step.number).padStart(2, '0')}
                  </span>
                  <div className="inline-flex items-center justify-center w-11 h-11 border-2 border-ink text-ink">
                    {iconMap[step.icon] && React.createElement(iconMap[step.icon], { size: 22 })}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-mute leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-line">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 sm:py-24">
          <div
            ref={benefitsAnimation.ref}
            className={`mb-12 sm:mb-16 ${revealClass(benefitsAnimation.isVisible)}`}
          >
            <div className="eyebrow mb-4">Přínosy</div>
            <h2 className="display-heading text-[clamp(1.75rem,3.5vw,3.25rem)] mb-4">
              {benefitsContent.sectionTitle}
            </h2>
            <p className="text-lg text-mute max-w-2xl">
              {benefitsContent.sectionDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {benefitsContent.benefits.map((benefit, i) => (
              <div
                key={i}
                className="group card-brand p-8 hover:border-ink transition-colors duration-200 ease-brand"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 border-2 border-ink text-ink mb-6 group-hover:bg-lime transition-colors duration-200 ease-brand">
                  {iconMap[benefit.icon] && React.createElement(iconMap[benefit.icon], { size: 22 })}
                </div>

                {benefit.metric && (
                  <div className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-1">
                    {benefit.metric}
                  </div>
                )}
                {benefit.metricLabel && (
                  <div className="eyebrow mb-5">
                    {benefit.metricLabel}
                  </div>
                )}

                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-ink mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-mute leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Optional) */}
      {faqContent.enabled && (
        <section id="faq" className="border-b border-line scroll-mt-20">
          <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 sm:py-24">
            <div
              ref={faqAnimation.ref}
              className={`mb-12 ${revealClass(faqAnimation.isVisible)}`}
            >
              <div className="eyebrow mb-4">FAQ</div>
              <h2 className="display-heading text-[clamp(1.75rem,3.5vw,3.25rem)] mb-4">
                {faqContent.sectionTitle}
              </h2>
              <p className="text-lg text-mute">
                {faqContent.sectionDescription}
              </p>
            </div>

            <div className="border-t border-line">
              {faqContent.faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} className="border-b border-line">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full py-5 text-left flex items-center justify-between gap-6 group"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-mute shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-base sm:text-lg font-bold transition-colors duration-200 ${
                          isOpen ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                        }`}>
                          {faq.question}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 inline-flex items-center justify-center w-8 h-8 border border-ink transition-all duration-200 ease-brand ${
                          isOpen ? 'rotate-180 bg-lime' : 'rotate-0 group-hover:bg-lime'
                        }`}
                      >
                        <LucideIcons.ChevronDown className="w-4 h-4 text-ink" aria-hidden="true" />
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-brand ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pb-6 pl-9 pr-4 text-mute leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="bg-ink text-cream">
        <div className="max-w-page mx-auto px-5 md:px-8 py-20 sm:py-32">
          <div className="chip-mono border-white/15 text-cream/60 mb-8">
            <span className="w-1.5 h-1.5 bg-lime" aria-hidden="true" />
            Připraveno k použití
          </div>

          <h2 className="font-black uppercase tracking-[-0.03em] leading-[0.95] text-cream text-[clamp(2.25rem,5.5vw,5.25rem)] mb-6 max-w-4xl">
            {homepageContent.finalCta.heading}
          </h2>
          <p className="text-lg sm:text-xl text-cream/60 mb-12 max-w-2xl leading-relaxed">
            {homepageContent.finalCta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Link
              href={homepageContent.finalCta.buttonLink}
              className="btn-brand btn-lime group"
            >
              {homepageContent.finalCta.buttonText}
              <LucideIcons.ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-brand"
                aria-hidden="true"
              />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/60 hover:text-lime transition-colors duration-200 ease-brand sm:ml-4"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Zobrazit funkce
              <LucideIcons.ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3">
            {['Bez registrace', '100% zdarma', 'Data zůstávají u vás'].map((item) => (
              <div key={item} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
                <LucideIcons.Check className="w-3.5 h-3.5 text-lime" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
