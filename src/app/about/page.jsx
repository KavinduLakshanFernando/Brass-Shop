'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Flame, Recycle, ArrowRight } from 'lucide-react';
import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { pageRoute, withBasePath } from '@/lib/utils';

export default function AboutPage() {
  const router = useRouter();
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const about = contentObject(content.about);
  const requiredPages = siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ?? ['home', 'products', 'about', 'contact'];

  const badge = contentText(about.badge) || 'Foundry History & Philosophy';
  const heading = contentText(about.heading) || 'Four Decades of Master Metalworking & Pure Brass Innovation';
  const subtitle = contentText(about.subtitle) || 'Founded in 1991, Aurelia Brass Co. has pioneered architectural brass fabrication.';
  const storyTitle = contentText(about.storyTitle) || 'Born from Fire, Shaped by Hand';
  const storyBody = contentText(about.storyBody) || 'What began as an independent foundry workshop in Colombo has evolved into an internationally acclaimed architectural metal studio.';
  const storyImage = contentText(about.storyImage) || '/images/hero.jpg';
  const statYears = contentText(about.statYears) || '35+';
  const statAlloy = contentText(about.statAlloy) || '100%';
  const statBespoke = contentText(about.statBespoke) || '2,500+';
  const sustainabilityHeading = contentText(about.sustainabilityHeading) || 'Zero-Waste Closed Loop Foundry';
  const sustainabilityBody = contentText(about.sustainabilityBody) || 'Brass is inherently 100% infinitely recyclable without any loss of structural integrity.';
  const ctaLabel = contentText(about.ctaLabel) || 'Consult Our Metallurgists';

  return (
    <div data-preview-page-key="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      
      {/* Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" data-preview-static="header-icon" />
          <span data-preview-field-path="about.badge">{badge}</span>
        </div>
        <h1 data-preview-field-path="about.heading" className="font-serif-luxury text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
          {heading}
        </h1>
        <p data-preview-field-path="about.subtitle" className="text-sm sm:text-base text-slate-600 dark:text-[#a3a8b5]">
          {subtitle}
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b8860b] dark:text-[#d4af37]">
            <Flame className="w-4 h-4" data-preview-static="flame-icon" />
            <span data-preview-static="origin-badge">The Foundry Origins</span>
          </div>
          <h2 data-preview-field-path="about.storyTitle" className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {storyTitle}
          </h2>
          <p data-preview-field-path="about.storyBody" className="text-sm sm:text-base text-slate-700 dark:text-[#a3a8b5] leading-relaxed">
            {storyBody}
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-800/15 dark:border-white/10">
            <div>
              <span data-preview-field-path="about.statYears" className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#b8860b] dark:text-[#d4af37] block">
                {statYears}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block" data-preview-static="stat-label">Foundry History</span>
            </div>
            <div>
              <span data-preview-field-path="about.statAlloy" className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#b8860b] dark:text-[#d4af37] block">
                {statAlloy}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block" data-preview-static="stat-label">Virgin Alloy</span>
            </div>
            <div>
              <span data-preview-field-path="about.statBespoke" className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#b8860b] dark:text-[#d4af37] block">
                {statBespoke}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block" data-preview-static="stat-label">Architect Projects</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-clip border border-amber-800/20 dark:border-[#d4af37]/20 shadow-2xl">
            <img src={withBasePath(storyImage)} alt="Foundry Workshop" data-preview-field-path="about.storyImage" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Zero Waste Sustainability Section */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-50/90 dark:from-[#131720] dark:via-[#181d29] dark:to-[#131720] border border-amber-800/20 dark:border-[#d4af37]/30 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b8860b] dark:text-[#d4af37]">
            <Recycle className="w-4 h-4" data-preview-static="eco-icon" />
            <span data-preview-static="eco-label">Eco Metallurgy</span>
          </div>
          <h3 data-preview-field-path="about.sustainabilityHeading" className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {sustainabilityHeading}
          </h3>
          <p data-preview-field-path="about.sustainabilityBody" className="text-sm sm:text-base text-slate-700 dark:text-[#a3a8b5] leading-relaxed">
            {sustainabilityBody}
          </p>
          {requiredPages.includes('contact') ? (
            <div className="pt-4">
              <button type="button" data-target-page="contact" onClick={() => { router.push(pageRoute('contact')); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-brand-primary text-xs border-0 cursor-pointer">
                <span data-preview-field-path="about.ctaLabel">{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" data-preview-static="arrow-icon" />
              </button>
            </div>
          ) : (
            <div className="pt-4">
              <span data-target-page="contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-brand-primary text-xs opacity-30 pointer-events-none">
                <span data-preview-field-path="about.ctaLabel">{ctaLabel}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

