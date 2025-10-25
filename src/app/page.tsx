'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

// Import JSON content
import homepageContent from '@/content/homepage.json';
import featuresContent from '@/content/features.json';
import howItWorksContent from '@/content/how-it-works.json';
import benefitsContent from '@/content/benefits.json';
import faqContent from '@/content/faq.json';
import settingsContent from '@/content/settings.json';

// Icon mapping helper
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Upload: LucideIcons.Upload,
  Zap: LucideIcons.Zap,
  BarChart3: LucideIcons.BarChart3,
  Download: LucideIcons.Download,
  Shield: LucideIcons.Shield,
  Sparkles: LucideIcons.Sparkles,
  Settings: LucideIcons.Settings,
  TrendingUp: LucideIcons.TrendingUp,
  ChevronDown: LucideIcons.ChevronDown,
  ChevronUp: LucideIcons.ChevronUp,
};

// Helper function to get icon component
const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className="w-6 h-6" /> : null;
};

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 md:items-center">
            {/* Top: Badge + Heading (mobile order 1, desktop order 1) */}
            <div className="text-center md:text-left order-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">{homepageContent.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight">
                {homepageContent.hero.heading}
                <br />
                <span className="text-indigo-200">{homepageContent.hero.subheading}</span>
              </h1>

              {/* Description, CTA, Trust badges - shown on desktop only here */}
              <div className="hidden md:block">
                <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
                  {homepageContent.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href={homepageContent.hero.primaryCta.link}
                    className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {homepageContent.hero.primaryCta.text}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <a
                    href={homepageContent.hero.secondaryCta.link}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    {homepageContent.hero.secondaryCta.text}
                  </a>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-start text-sm text-indigo-200">
                  {homepageContent.hero.trustBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Screenshot (mobile order 2, desktop order 2) */}
            <div className="relative order-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-inner">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {homepageContent.hero.screenshot.src !== '/dashboard-preview.png' ? (
                      <Image
                        src={homepageContent.hero.screenshot.src}
                        alt={homepageContent.hero.screenshot.alt}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-400 px-4">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-xs sm:text-sm">{homepageContent.hero.screenshot.alt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-float hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">Champions</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">142</div>
              </div>

              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-float-delayed hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">At Risk</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-600">89</div>
              </div>
            </div>

            {/* Bottom: Description + CTA + Trust badges (mobile only, order 3) */}
            <div className="text-center md:hidden order-3">
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 leading-relaxed">
                {homepageContent.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={homepageContent.hero.primaryCta.link}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {homepageContent.hero.primaryCta.text}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href={homepageContent.hero.secondaryCta.link}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  {homepageContent.hero.secondaryCta.text}
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 justify-center text-sm text-indigo-200">
                {homepageContent.hero.trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section (Optional) */}
      {homepageContent.video.enabled && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {homepageContent.video.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                {homepageContent.video.description}
              </p>
            </div>

            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-200">
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

      {/* Stats Section (Optional) */}
      {homepageContent.stats.enabled && (
        <section className="py-12 sm:py-16 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {homepageContent.stats.items.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {featuresContent.sectionTitle}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {featuresContent.sectionDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuresContent.features.map((feature, i) => {
              const Icon = iconMap[feature.icon];
              return (
                <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-4`}>
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {howItWorksContent.sectionTitle}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {howItWorksContent.sectionDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" />

            {howItWorksContent.steps.map((step, i) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={i} className="relative">
                  <div className={`bg-gradient-to-br from-${step.color}-50 to-purple-50 rounded-2xl p-6 sm:p-8 text-center border-2 border-${step.color}-100`}>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-${step.color}-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg`}>
                      {step.number}
                    </div>

                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow">
                      {Icon && <Icon className="w-8 h-8" />}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {benefitsContent.sectionTitle}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {benefitsContent.sectionDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefitsContent.benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl sm:text-5xl mb-4">{benefit.emoji}</div>
                <div className={`text-3xl sm:text-4xl font-bold text-${benefit.color}-600 mb-2`}>
                  {benefit.metric}
                </div>
                <div className="text-sm text-gray-500 mb-4">{benefit.metricLabel}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Optional) */}
      {faqContent.enabled && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {faqContent.sectionTitle}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                {faqContent.sectionDescription}
              </p>
            </div>

            <div className="space-y-4">
              {faqContent.faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-8">
                      {faq.question}
                    </span>
                    {openFaqIndex === i ? (
                      <LucideIcons.ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <LucideIcons.ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === i && (
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
            {homepageContent.finalCta.heading}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-10">
            {homepageContent.finalCta.description}
          </p>

          <Link
            href={homepageContent.finalCta.buttonLink}
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {homepageContent.finalCta.buttonText}
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
