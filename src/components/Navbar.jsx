'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Menu, X, ArrowUpRight, Sun, Moon, Home, Layers, Briefcase, User, MoreHorizontal } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { pageRoute, withBasePath } from '@/lib/utils';

const ALL_PAGES = ['home', 'products', 'about', 'contact'];

function NavLabel({ pageKey, value }) {
  if (pageKey === 'home') return <span data-preview-field-path="common.navLabels.home">{value}</span>;
  if (pageKey === 'products') return <span data-preview-field-path="common.navLabels.products">{value}</span>;
  if (pageKey === 'about') return <span data-preview-field-path="common.navLabels.about">{value}</span>;
  return <span data-preview-field-path="common.navLabels.contact">{value}</span>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const common = contentObject(content.common);
  const navLabels = contentObject(common.navLabels);
  
  const enabledPages = siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ?? ALL_PAGES;

  const websiteTitle = contentText(common.websiteTitle) || 'AURELIA BRASS';
  const headerCtaLabel = contentText(common.headerCtaLabel) || 'Request Quote';
  const logoUrl = contentText(common.logoUrl);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLabels = { home: 'Home', products: 'Products', about: 'About', contact: 'Contact' };

  return (
    <>
      {/* Header element (Main Navigation & Branding) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0b0d12]/90 backdrop-blur-md border-b border-amber-800/15 dark:border-[#d4af37]/20 py-3.5 shadow-sm dark:shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <button type="button" data-target-page="home" onClick={() => { router.push(pageRoute('home')); }} className="flex items-center gap-3 group bg-transparent border-0 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#c59b27] to-[#8b5a2b] p-[1px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md shadow-amber-900/10">
                <div className="w-full h-full bg-[#fdfbf7] dark:bg-[#0b0d12] rounded-[11px] flex items-center justify-center overflow-clip">
                  {logoUrl ? (
                    <img src={withBasePath(logoUrl)} alt={websiteTitle} data-preview-field-path="common.logoUrl" className="w-full h-full object-cover" />
                  ) : (
                    <span data-preview-field-path="common.logoUrl" className="inline-flex">
                      <Sparkles className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37]" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span data-preview-field-path="common.websiteTitle" className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-slate-900 dark:text-white block leading-none">
                  {websiteTitle}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-8 max-md:[display:none]">
              {ALL_PAGES.map((pageKey) => {
                const isSelected = enabledPages.includes(pageKey);
                const route = pageRoute(pageKey);
                const isActive = pathname === route;
                const label = contentText(navLabels[pageKey]) || defaultLabels[pageKey];

                return isSelected ? (
                  <button
                    key={pageKey}
                    type="button"
                    data-target-page={pageKey}
                    onClick={() => { router.push(route); }}
                    className={`text-sm font-semibold transition-colors duration-200 relative py-1 bg-transparent border-0 cursor-pointer ${
                      isActive
                        ? 'text-[#b8860b] dark:text-[#d4af37]'
                        : 'text-slate-700 dark:text-[#a3a8b5] hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <NavLabel pageKey={pageKey} value={label} />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full" data-preview-static="active-indicator" />
                    )}
                  </button>
                ) : (
                  <span
                    key={pageKey}
                    data-target-page={pageKey}
                    className="text-sm font-semibold py-1 opacity-30 pointer-events-none text-slate-400 dark:text-gray-600"
                  >
                    <NavLabel pageKey={pageKey} value={label} />
                  </span>
                );
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="flex items-center gap-3 max-md:[display:none]">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  data-preview-static="theme-toggle"
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/30 text-slate-700 dark:text-[#d4af37] hover:border-[#b8860b] dark:hover:border-[#d4af37] transition-all flex items-center justify-center shadow-sm cursor-pointer hover:scale-105"
                  aria-label="Toggle Light/Dark Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d4af37]" /> : <Moon className="w-4 h-4 text-[#b8860b]" />}
                </button>
              )}

              {enabledPages.includes('contact') ? (
                <button
                  type="button"
                  data-target-page="contact"
                  onClick={() => { router.push(pageRoute('contact')); }}
                  className="px-6 py-2.5 rounded-full btn-brand-primary text-sm flex items-center gap-2 border-0 cursor-pointer"
                >
                  <span data-preview-field-path="common.headerCtaLabel">{headerCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" data-preview-static="action-icon" />
                </button>
              ) : (
                <span
                  data-target-page="contact"
                  className="px-6 py-2.5 rounded-full btn-brand-primary text-sm opacity-30 pointer-events-none flex items-center gap-2"
                >
                  <span data-preview-field-path="common.headerCtaLabel">{headerCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" data-preview-static="action-icon" />
                </span>
              )}
            </div>

            {/* Mobile Header Right Theme Controls */}
            <div className="flex items-center gap-2 md:[display:none]">
              {mounted && (
                <button 
                  onClick={toggleTheme} 
                  className="w-10 h-10 rounded-2xl text-[#b8860b] dark:text-[#d4af37] bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/30 flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-105"
                  aria-label="Toggle Light/Dark Theme"
                  data-preview-static="theme-toggle"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d4af37]" /> : <Moon className="w-4 h-4 text-[#b8860b]" />}
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar for Mobile Devices */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md md:[display:none]">
        <div className="bg-white/95 dark:bg-[#131720]/95 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 rounded-[28px] py-3.5 px-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] flex items-center justify-between">
          
          {/* Home Tab */}
          {enabledPages.includes('home') && (
            <button 
              type="button" 
              data-target-page="home"
              onClick={() => { router.push(pageRoute('home')); }} 
              className={`flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors ${
                pathname === pageRoute('home') ? 'text-[#b8860b] dark:text-[#d4af37]' : 'text-slate-400 dark:text-gray-500'
              }`}
            >
              <Home className="w-5.5 h-5.5" data-preview-static="nav-icon" />
              <span className="text-[10px] font-bold tracking-wide" data-preview-static="nav-text">Home</span>
            </button>
          )}

          {/* Products (Services) Tab */}
          {enabledPages.includes('products') && (
            <button 
              type="button" 
              data-target-page="products"
              onClick={() => { router.push(pageRoute('products')); }} 
              className={`flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors ${
                pathname === pageRoute('products') ? 'text-[#b8860b] dark:text-[#d4af37]' : 'text-slate-400 dark:text-gray-500'
              }`}
            >
              <Layers className="w-5.5 h-5.5" data-preview-static="nav-icon" />
              <span className="text-[10px] font-bold tracking-wide" data-preview-static="nav-text">Products</span>
            </button>
          )}

          {/* About (Work / Artisan) Tab */}
          {enabledPages.includes('about') && (
            <button 
              type="button" 
              data-target-page="about"
              onClick={() => { router.push(pageRoute('about')); }} 
              className={`flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors ${
                pathname === pageRoute('about') ? 'text-[#b8860b] dark:text-[#d4af37]' : 'text-slate-400 dark:text-gray-500'
              }`}
            >
              <User className="w-5.5 h-5.5" data-preview-static="nav-icon" />
              <span className="text-[10px] font-bold tracking-wide" data-preview-static="nav-text">About</span>
            </button>
          )}

          {/* Contact Tab */}
          {enabledPages.includes('contact') && (
            <button 
              type="button" 
              data-target-page="contact"
              onClick={() => { router.push(pageRoute('contact')); }} 
              className={`flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors ${
                pathname === pageRoute('contact') ? 'text-[#b8860b] dark:text-[#d4af37]' : 'text-slate-400 dark:text-gray-500'
              }`}
            >
              <Briefcase className="w-5.5 h-5.5" data-preview-static="nav-icon" />
              <span className="text-[10px] font-bold tracking-wide" data-preview-static="nav-text">Contact</span>
            </button>
          )}

          {/* More Options Tab (Triggers custom actions or quick-links) */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors ${
              mobileMenuOpen ? 'text-[#b8860b] dark:text-[#d4af37]' : 'text-slate-400 dark:text-gray-500'
            }`}
          >
            <MoreHorizontal className="w-5.5 h-5.5" data-preview-static="nav-icon" />
            <span className="text-[10px] font-bold tracking-wide" data-preview-static="nav-text">More</span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu (Slide overlay triggered by "More") */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-[96px] z-40 mx-auto w-[92%] max-w-md bg-white/95 dark:bg-[#131720]/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-250 md:[display:none]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500" data-preview-static="drawer-heading">Quick Controls</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 bg-transparent border-0 cursor-pointer" data-preview-static="close-btn">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/15 dark:border-white/5 text-slate-800 dark:text-white font-medium text-xs cursor-pointer"
              data-preview-static="theme-option"
            >
              <span className="flex items-center gap-2.5">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d4af37]" /> : <Moon className="w-4 h-4 text-[#b8860b]" />}
                <span>Theme Mode</span>
              </span>
              <span className="text-[#b8860b] dark:text-[#d4af37] font-bold uppercase">{theme}</span>
            </button>
            <button 
              onClick={() => { router.push(pageRoute('contact')); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-3 rounded-2xl btn-brand-primary text-xs border-0 cursor-pointer"
              data-preview-static="quote-option"
            >
              <span>Instant WhatsApp Concierge</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
