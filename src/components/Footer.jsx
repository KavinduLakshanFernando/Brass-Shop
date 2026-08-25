'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { pageRoute, withBasePath } from '@/lib/utils';

const ALL_PAGES = ['home', 'products', 'about', 'contact'];

function NavLabel({ pageKey, value }) {
  if (pageKey === 'home') return <span data-preview-field-path="common.navLabels.home">{value}</span>;
  if (pageKey === 'products') return <span data-preview-field-path="common.navLabels.products">{value}</span>;
  if (pageKey === 'about') return <span data-preview-field-path="common.navLabels.about">{value}</span>;
  return <span data-preview-field-path="common.navLabels.contact">{value}</span>;
}

export default function Footer() {
  const router = useRouter();
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const common = contentObject(content.common);
  const navLabels = contentObject(common.navLabels);
  const enabledPages = siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ?? ALL_PAGES;

  const websiteTitle = contentText(common.websiteTitle) || 'AURELIA BRASS';
  const footerText = contentText(common.footerText) || 'Handcrafting solid brass architectural door hardware.';
  const copyright = contentText(common.copyright) || '© 2026 Aurelia Brass Co.';
  const address = contentText(common.address) || '742 Artisan Foundry Row, Colombo 03';
  const contactPhone = contentText(common.contactPhone) || '075 565 4663';
  const contactEmail = contentText(common.contactEmail) || 'inquiries@aureliabrass.com';
  const defaultLabels = { home: 'Home', products: 'Products & Catalog', about: 'Artisan & Heritage', contact: 'Contact & Custom Quotes' };

  return (
    <footer className="bg-white dark:bg-[#07080b] border-t border-amber-800/20 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#a3a8b5] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <button type="button" data-target-page="home" onClick={() => { router.push(pageRoute('home')); }} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#c59b27] to-[#8b5a2b] p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#fdfbf7] dark:bg-[#0b0d12] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" />
                </div>
              </div>
              <span data-preview-field-path="common.websiteTitle" className="font-serif-luxury text-xl font-bold tracking-wider text-slate-900 dark:text-white">
                {websiteTitle}
              </span>
            </button>

            <p data-preview-field-path="common.footerText" className="text-xs leading-relaxed text-slate-600 dark:text-[#a3a8b5]">
              {footerText}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-preview-static="footer-nav-title">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {ALL_PAGES.map((pageKey) => {
                const label = contentText(navLabels[pageKey]) || defaultLabels[pageKey];
                return enabledPages.includes(pageKey) ? (
                  <li key={pageKey}>
                    <button type="button" data-target-page={pageKey} onClick={() => { router.push(pageRoute(pageKey)); }}
                      className="hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors bg-transparent border-0 cursor-pointer text-inherit text-xs p-0">
                      <NavLabel pageKey={pageKey} value={label} />
                    </button>
                  </li>
                ) : (
                  <li key={pageKey}>
                    <span data-target-page={pageKey} className="opacity-30 pointer-events-none">
                      <NavLabel pageKey={pageKey} value={label} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Studio & Foundry Contact */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-preview-static="footer-contact-title">
              Studio &amp; Foundry
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" data-preview-static="footer-map-icon" />
                <span data-preview-field-path="common.address">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="footer-phone-icon" />
                <span data-preview-field-path="common.contactPhone">{contactPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="footer-mail-icon" />
                <span data-preview-field-path="common.contactEmail">{contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Guarantee & Quality */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-preview-static="footer-guarantee-title">
              Craft Guarantee
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#a3a8b5] leading-relaxed" data-preview-static="footer-guarantee-desc">
              Every brass piece is backed by our 25-year structural guarantee, individually stamped by our foundry master craftsman.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amber-800/15 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-gray-400">
          <p data-preview-field-path="common.copyright">{copyright}</p>
          <div className="flex items-center gap-4">
            <span data-preview-static="legal-link-1">Privacy Policy</span>
            <span data-preview-static="legal-link-2">Terms of Service</span>
            <span data-preview-static="legal-link-3">Trade Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

