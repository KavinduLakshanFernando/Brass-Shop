'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Flame, CheckCircle2, Star, Eye, FileText, ChevronRight, ChevronLeft, Sliders, Ruler } from 'lucide-react';
import { contentList, contentObject, contentText, useSiteData } from '@/lib/siteDataContext';
import { pageRoute, withBasePath } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import CustomerReviews from '@/components/CustomerReviews';

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const home = contentObject(content.home);
  const productsContent = contentObject(content.products);
  const requiredPages = siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ?? ['home', 'products', 'about', 'contact'];

  const stats = contentList(home.stats);
  const finishes = contentList(home.finishes);
  const processSteps = contentList(home.processSteps);
  const featuredProducts = contentList(productsContent.items).slice(0, 4);
  const contactContent = contentObject(content.contact);
  const commonContent = contentObject(content.common);
  const whatsappNumber = contentText(contactContent.whatsappNumber) || contentText(commonContent.contactPhone) || '94755654663';

  const brandTitle = contentText(commonContent.websiteTitle) || 'Aurelia Brass';

  const openWhatsAppQuote = (product) => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const priceStr = Number(product.price || 0).toLocaleString();
    const brandUpper = brandTitle.toUpperCase();
    const catStr = product.category ? `\nCategory: ${product.category}` : '';
    const finishStr = product.finish ? `\nFinish: ${product.finish}` : '';
    const dimStr = product.dimensions ? `\nDimensions: ${product.dimensions}` : '';
    const leadStr = product.leadTime ? `\nLead Time: ${product.leadTime}` : '';

    const msg = `*PRODUCT INQUIRY & QUOTE REQUEST*\n*${brandUpper}*\n\nProduct: ${product.name}${catStr}\nStarting Price: Rs. ${priceStr} LKR${finishStr}${dimStr}${leadStr}\n\nHello ${brandTitle}, I would like to request a custom quote and check availability for this item.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);
  const [isFinishesAutoplayActive, setIsFinishesAutoplayActive] = useState(true);

  useEffect(() => {
    const handleFocus = (e) => {
      const path = e.detail?.fieldPath || '';
      const match = path.match(/^home\.finishes\[(\d+)\]/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (!isNaN(idx) && idx >= 0 && idx < finishes.length) {
          setSelectedFinishIndex(idx);
        }
      }
    };
    window.addEventListener('marketplace:focus-field', handleFocus);
    return () => window.removeEventListener('marketplace:focus-field', handleFocus);
  }, [finishes.length]);

  // Autoplay for finishes slider
  useEffect(() => {
    if (!isFinishesAutoplayActive || finishes.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedFinishIndex((prev) => (prev < finishes.length - 1 ? prev + 1 : 0));
    }, 3000); // cycle every 3 seconds

    return () => clearInterval(interval);
  }, [isFinishesAutoplayActive, finishes.length, selectedFinishIndex]);

  // Touch and Drag swipe gestures for finishes slider
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 40;

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      setSelectedFinishIndex((prev) => (prev < finishes.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      setSelectedFinishIndex((prev) => (prev > 0 ? prev - 1 : finishes.length - 1));
    }
  };

  const handleMouseDown = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      setSelectedFinishIndex((prev) => (prev < finishes.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      setSelectedFinishIndex((prev) => (prev > 0 ? prev - 1 : finishes.length - 1));
    }
  };

  const heroEyebrow = contentText(home.heroEyebrow) || 'Foundry Heritage & Architectural Studio';
  const heroTitle = contentText(home.heroTitle) || 'Where Pure Brass Meets Timeless Luxury & Precision.';
  const heroSubtitle = contentText(home.heroSubtitle) || 'Handcrafting solid brass architectural door hardware, spun pendant lighting fixtures, sculptural decor, and bespoke metalwork for luxury residences and commercial spaces worldwide.';
  const primaryCtaLabel = contentText(home.primaryCtaLabel) || 'Explore Products & Catalog';
  const secondaryCtaLabel = contentText(home.secondaryCtaLabel) || 'Request Custom Quote';
  const bannerImageUrl = contentText(home.bannerImageUrl) || '/images/hero.jpg';

  const productsBadge = contentText(home.productsBadge) || 'Curated Masterpieces';
  const productsHeading = contentText(home.productsHeading) || 'Signature Brass Collections';
  const finishesBadge = contentText(home.finishesBadge) || 'Material Science & Finishing Studio';
  const finishesHeading = contentText(home.finishesHeading) || 'Explore Our Signature Brass Finishes';
  const finishesSubtitle = contentText(home.finishesSubtitle) || 'Every piece in our shop is hand-treated by master patinators. Select a finish below to view its tactile character and aesthetic properties.';
  const processBadge = contentText(home.processBadge) || 'Master Metalworking';
  const processHeading = contentText(home.processHeading) || 'The Art of Pure Brass Foundry';
  const processSubtitle = contentText(home.processSubtitle) || 'From raw molten alloy to hand-polished architectural hardware, witness the meticulous stages behind every piece created in our studio.';
  const tradeBadge = contentText(home.tradeBadge) || 'Trade & Architectural Program';
  const tradeHeading = contentText(home.tradeHeading) || 'Have a Custom Architectural Blueprint or Bespoke Project?';
  const tradeSubtitle = contentText(home.tradeSubtitle) || 'We work directly with architects, interior designers, and general contractors to engineer custom brass door hardware, oversized entry handles, feature wall panels, and bespoke lighting fixtures.';
  const tradePrimaryCta = contentText(home.tradePrimaryCta) || 'Upload Blueprint / Request Quote';
  const tradeSecondaryCta = contentText(home.tradeSecondaryCta) || 'Explore Trade Benefits';

  return (
    <div 
      data-preview-page-key="home"
      className="space-y-24 sm:space-y-32 pb-20 bg-[#fdfbf7] dark:bg-[#0b0d12] text-slate-900 dark:text-[#f8f6f0] transition-colors duration-300 relative overflow-clip"
    >
      
      {/* Soft Ambient Warm Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-400/10 dark:bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-clip -mt-20 pt-28 pb-16">
        
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0 overflow-clip">
          <img
            src={withBasePath(bannerImageUrl)}
            alt="Aurelia Brass Studio & Foundry"
            data-preview-field-path="home.bannerImageUrl"
            className="w-full h-full object-cover object-center opacity-40 dark:opacity-35 scale-105 transform transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7]/55 to-[#fdfbf7]/80 dark:from-[#0b0d12] dark:via-[#0b0d12]/70 dark:to-[#0b0d12]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 dark:from-transparent via-[#fdfbf7]/40 dark:via-[#0b0d12]/50 to-[#fdfbf7] dark:to-[#0b0d12] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pointer-events-none">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 shadow-sm pointer-events-auto">
            <Sparkles className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="hero-sparkle" />
            <span data-preview-field-path="home.heroEyebrow">{heroEyebrow}</span>
          </div>

          {/* Main Title */}
          <h1 
            data-preview-field-path="home.heroTitle"
            className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1] mb-6 pointer-events-auto"
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p 
            data-preview-field-path="home.heroSubtitle"
            className="text-lg sm:text-xl text-slate-700 dark:text-[#a3a8b5] max-w-3xl mx-auto leading-relaxed font-normal dark:font-light mb-10 pointer-events-auto"
          >
            {heroSubtitle}
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 pointer-events-auto">
            {requiredPages.includes('products') ? (
              <button type="button" data-target-page="products" onClick={() => { router.push(pageRoute('products')); }}
                className="w-full sm:w-auto px-8 py-4 rounded-full btn-brand-primary text-base flex items-center justify-center gap-3 border-0 cursor-pointer">
                <span data-preview-field-path="home.primaryCtaLabel">{primaryCtaLabel}</span>
                <ArrowRight className="w-5 h-5" data-preview-static="cta-arrow" />
              </button>
            ) : (
              <span data-target-page="products" className="w-full sm:w-auto px-8 py-4 rounded-full btn-brand-primary text-base opacity-30 pointer-events-none flex items-center justify-center gap-3">
                <span data-preview-field-path="home.primaryCtaLabel">{primaryCtaLabel}</span>
                <ArrowRight className="w-5 h-5" data-preview-static="cta-arrow" />
              </span>
            )}

            {requiredPages.includes('contact') ? (
              <button type="button" data-target-page="contact" onClick={() => { router.push(pageRoute('contact')); }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 hover:border-[#b8860b] dark:hover:border-[#d4af37] text-slate-900 dark:text-white font-bold text-base shadow-lg shadow-amber-900/5 dark:shadow-none transition-all flex items-center justify-center gap-3 hover:bg-amber-50/60 dark:hover:bg-[#1b212d] cursor-pointer">
                <FileText className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="cta-icon" />
                <span data-preview-field-path="home.secondaryCtaLabel">{secondaryCtaLabel}</span>
              </button>
            ) : (
              <span data-target-page="contact" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-bold text-base opacity-30 pointer-events-none flex items-center justify-center gap-3">
                <FileText className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="cta-icon" />
                <span data-preview-field-path="home.secondaryCtaLabel">{secondaryCtaLabel}</span>
              </span>
            )}
          </div>

          {/* Key Stats Bar */}
          <div 
            data-preview-list-path="home.stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-amber-800/20 dark:border-[#d4af37]/20 max-w-4xl mx-auto pointer-events-auto"
          >
            {stats.map((rawStat, index) => {
              const stat = contentObject(rawStat);
              const val = contentText(stat.value);
              const lbl = contentText(stat.label);
              return (
                <div 
                  key={index}
                  data-preview-item-path={`home.stats[${index}]`}
                  className="p-5 rounded-2xl bg-white/95 dark:bg-white/5 border border-amber-800/20 dark:border-white/5 shadow-md shadow-amber-900/5 dark:shadow-none"
                >
                  <span 
                    data-preview-field-path={`home.stats[${index}].value`}
                    className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#b8860b] dark:text-[#d4af37] block"
                  >
                    {val}
                  </span>
                  <span 
                    data-preview-field-path={`home.stats[${index}].label`}
                    className="text-xs text-slate-700 dark:text-[#a3a8b5] mt-1 font-semibold block"
                  >
                    {lbl}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCTS CATALOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-[#b8860b] dark:text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="feat-sparkle" />
              <span data-preview-field-path="home.productsBadge">{productsBadge}</span>
            </div>
            <h2 
              data-preview-field-path="home.productsHeading"
              className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
            >
              {productsHeading}
            </h2>
          </div>
          {requiredPages.includes('products') && (
            <button type="button" data-target-page="products" onClick={() => { router.push(pageRoute('products')); }}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#b8860b] dark:text-[#d4af37] hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors group bg-transparent border-0 cursor-pointer">
              <span data-preview-static="catalog-link-label">View Complete 2026 Catalog</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" data-preview-static="catalog-link-arrow" />
            </button>
          )}
        </div>

        {/* Product Cards Grid - decorative preview, canonical markers are on /products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((rawProduct, index) => {
            const product = contentObject(rawProduct);
            const name = contentText(product.name);
            const category = contentText(product.category);
            const price = Number(product.price || 0);
            const rating = Number(product.rating || 0);
            const image = contentText(product.image);
            const tag = contentText(product.tag);
            const description = contentText(product.description);
            const dimensions = contentText(product.dimensions);
            const finish = contentText(product.finish);
            const leadTime = contentText(product.leadTime);

            return (
              <div key={index} className="group bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-3xl overflow-clip hover:border-[#b8860b] dark:hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl shadow-amber-900/5 dark:shadow-2xl hover:shadow-2xl hover:shadow-amber-900/15 flex flex-col justify-between">
                {/* Product Image Box */}
                <div className="relative h-64 w-full bg-slate-100 dark:bg-[#0b0d12] overflow-clip">
                  <img src={withBasePath(image || '/images/hero.jpg')} alt={name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-preview-static="sample-img" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/95 dark:bg-[#0b0d12]/80 backdrop-blur-md text-[#b8860b] dark:text-[#d4af37] text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-800/30 dark:border-[#d4af37]/30 shadow-md" data-preview-static="feat-tag">{tag}</span>
                  </div>
                  {requiredPages.includes('products') && (
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-[#0b0d12]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button type="button" data-target-page="products" onClick={() => { router.push(pageRoute('products') + '?id=' + index); }}
                        className="p-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b8860b] text-[#0b0d12] hover:scale-110 transition-transform shadow-lg font-bold border-0 cursor-pointer" title="View Product Specs" data-preview-static="spec-btn">
                        <Eye className="w-5 h-5" data-preview-static="eye-icon" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#a3a8b5] mb-2 font-medium">
                      <span data-preview-static="feat-category">{category}</span>
                      <div className="flex items-center gap-1 text-[#b8860b] dark:text-[#d4af37]">
                        <Star className="w-3.5 h-3.5 fill-current" data-preview-static="star-icon" />
                        <span className="font-bold text-slate-900 dark:text-white" data-preview-static="feat-rating">{rating}</span>
                      </div>
                    </div>
                    <h3 className="font-serif-luxury text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#b8860b] dark:group-hover:text-[#d4af37] transition-colors mb-2 line-clamp-1" data-preview-static="feat-title">{name}</h3>
                    <p className="text-xs text-slate-600 dark:text-[#a3a8b5] line-clamp-2 mb-3 leading-relaxed" data-preview-static="feat-desc">{description}</p>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400 space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center justify-between"><span data-preview-static="label-finish">Finish:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="val-finish">{finish}</span></div>
                      <div className="flex items-center justify-between"><span data-preview-static="label-dim">Dimensions:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="val-dim">{dimensions}</span></div>
                      <div className="flex items-center justify-between"><span data-preview-static="label-lead">Lead Time:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="val-lead">{leadTime}</span></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-amber-800/15 dark:border-[#d4af37]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-[#a3a8b5] block font-medium" data-preview-static="label-start">Starting from</span>
                      <span className="font-serif-luxury text-lg font-bold text-[#b8860b] dark:text-[#d4af37]" data-preview-static="val-price">
                        Rs. {price.toLocaleString()} <span className="text-xs font-sans text-slate-400" data-preview-static="currency-tag">LKR</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openWhatsAppQuote({ name, category, price, finish, dimensions, leadTime })}
                      className="px-3.5 py-2 rounded-xl bg-amber-800/10 dark:bg-[#d4af37]/10 hover:bg-[#b8860b] dark:hover:bg-[#d4af37] text-[#b8860b] dark:text-[#d4af37] hover:text-white dark:hover:text-[#0b0d12] text-xs font-bold transition-all border border-amber-800/30 dark:border-[#d4af37]/30 cursor-pointer"
                      data-preview-static="quote-btn"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* INTERACTIVE BRASS FINISH SLIDE EXPLORER */}
      <section 
        onMouseEnter={() => setIsFinishesAutoplayActive(false)}
        onMouseLeave={() => setIsFinishesAutoplayActive(true)}
        className="bg-gradient-to-b from-[#fbf5e8] via-[#f7eee1] to-[#fbf5e8] dark:from-[#07080b] dark:via-[#131720] dark:to-[#07080b] border-y border-amber-800/20 dark:border-[#d4af37]/20 py-20 relative overflow-clip"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header with Navigation Arrows */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#b8860b] dark:text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                <Sliders className="w-4 h-4" data-preview-static="slider-icon" />
                <span data-preview-field-path="home.finishesBadge">{finishesBadge}</span>
              </div>
              <h2 
                data-preview-field-path="home.finishesHeading"
                className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3"
              >
                {finishesHeading}
              </h2>
              <p 
                data-preview-field-path="home.finishesSubtitle"
                className="text-xs sm:text-sm text-slate-700 dark:text-[#a3a8b5]"
              >
                {finishesSubtitle}
              </p>
            </div>

            {/* Prev / Next Slide Controls */}
            <div className="flex items-center gap-2 self-start md:self-end">
              <button
                type="button"
                data-preview-static="prev-finish-btn"
                onClick={() => setSelectedFinishIndex((prev) => (prev > 0 ? prev - 1 : finishes.length - 1))}
                className="w-11 h-11 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-700 dark:text-gray-200 hover:border-[#b8860b] dark:hover:border-[#d4af37] hover:text-[#b8860b] dark:hover:text-[#d4af37] flex items-center justify-center transition-all shadow-md cursor-pointer"
                title="Previous Finish"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                data-preview-static="next-finish-btn"
                onClick={() => setSelectedFinishIndex((prev) => (prev < finishes.length - 1 ? prev + 1 : 0))}
                className="w-11 h-11 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-700 dark:text-gray-200 hover:border-[#b8860b] dark:hover:border-[#d4af37] hover:text-[#b8860b] dark:hover:text-[#d4af37] flex items-center justify-center transition-all shadow-md cursor-pointer"
                title="Next Finish"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Swatch Select Tabs */}
          <div 
            className="flex items-center gap-3 overflow-x-auto pb-3 mb-8 scrollbar-none"
          >
            {finishes.map((rawFinish, index) => {
              const finish = contentObject(rawFinish);
              const name = contentText(finish.name);
              const hex = contentText(finish.hex) || '#d4af37';

              return (
                <button
                  key={index}
                  data-preview-static={`swatch-btn-${index}`}
                  onClick={() => setSelectedFinishIndex(index)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    selectedFinishIndex === index
                      ? 'bg-white dark:bg-[#131720] border-[#b8860b] dark:border-[#d4af37] shadow-lg ring-2 ring-[#b8860b]/40 dark:ring-[#d4af37]'
                      : 'bg-white/70 dark:bg-[#0b0d12]/60 border-amber-800/15 dark:border-white/10 hover:border-[#b8860b]/40 dark:hover:border-[#d4af37]/40 hover:bg-white dark:hover:bg-[#131720]/40'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white dark:border-[#131720] shadow-sm shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span 
                    className="text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Finish Slide Track */}
          <div 
            className="relative overflow-clip rounded-3xl touch-pan-y select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDragging) handleMouseUp();
            }}
          >
            <div 
              data-preview-list-path="home.finishes"
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${selectedFinishIndex * 100}%)` }}
            >
              {finishes.map((rawFinish, index) => {
                const finish = contentObject(rawFinish);
                const name = contentText(finish.name);
                const hex = contentText(finish.hex) || '#d4af37';
                const desc = contentText(finish.desc);
                const feature1 = contentText(finish.feature1);
                const feature2 = contentText(finish.feature2);
                const feature3 = contentText(finish.feature3);
                const ctaLabel = contentText(finish.ctaLabel) || 'Order Finish Sample Swatches';
                const fixtureTag = contentText(finish.fixtureTag) || 'Sample Fixture';
                const fixtureName = contentText(finish.fixtureName) || 'Aurelia Spun Brass Pendant';
                const fixtureImage = contentText(finish.fixtureImage) || '/images/pendant.jpg';

                return (
                  <div 
                    key={index}
                    data-preview-item-path={`home.finishes[${index}]`}
                    className="w-full shrink-0 bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl shadow-amber-900/10"
                  >
                    <div className="lg:col-span-6 space-y-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-[#131720] shadow-md shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="inline-block px-3.5 py-1 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/15 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-bold" data-preview-static={`active-badge-${index}`}>
                          Finish Slide {index + 1} of {finishes.length}
                        </span>
                      </div>

                      <h3 
                        data-preview-field-path={`home.finishes[${index}].name`}
                        className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
                      >
                        {name}
                      </h3>

                      <p 
                        data-preview-field-path={`home.finishes[${index}].desc`}
                        className="text-sm sm:text-base text-slate-700 dark:text-[#a3a8b5] leading-relaxed"
                      >
                        {desc}
                      </p>

                      <div className="space-y-3 pt-2">
                        {feature1 && (
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 dark:text-gray-300 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static={`check-icon-1-${index}`} />
                            <span data-preview-field-path={`home.finishes[${index}].feature1`}>{feature1}</span>
                          </div>
                        )}
                        {feature2 && (
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 dark:text-gray-300 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static={`check-icon-2-${index}`} />
                            <span data-preview-field-path={`home.finishes[${index}].feature2`}>{feature2}</span>
                          </div>
                        )}
                        {feature3 && (
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 dark:text-gray-300 font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static={`check-icon-3-${index}`} />
                            <span data-preview-field-path={`home.finishes[${index}].feature3`}>{feature3}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                        {requiredPages.includes('contact') ? (
                          <button
                            type="button"
                            data-target-page="contact"
                            onClick={() => { router.push(pageRoute('contact') + '?finish=' + encodeURIComponent(name)); }}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b8860b] text-[#0b0d12] font-bold text-xs sm:text-sm shadow-md border-0 cursor-pointer hover:opacity-95 transition-opacity"
                          >
                            <span data-preview-field-path={`home.finishes[${index}].ctaLabel`}>{ctaLabel}</span>
                          </button>
                        ) : (
                          <span
                            data-target-page="contact"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b8860b] text-[#0b0d12] font-bold text-xs sm:text-sm shadow-md opacity-30 pointer-events-none"
                          >
                            <span data-preview-field-path={`home.finishes[${index}].ctaLabel`}>{ctaLabel}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-6">
                      <div className="relative h-72 sm:h-96 rounded-2xl overflow-clip border border-amber-800/20 dark:border-[#d4af37]/20 shadow-2xl">
                        <img
                          src={withBasePath(fixtureImage)}
                          alt={fixtureName || name}
                          data-preview-field-path={`home.finishes[${index}].fixtureImage`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#0b0d12] via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 dark:bg-[#0b0d12]/80 backdrop-blur-md border border-amber-800/30 dark:border-[#d4af37]/30 shadow-xl">
                          <span
                            data-preview-field-path={`home.finishes[${index}].fixtureTag`}
                            className="text-xs text-slate-500 dark:text-gray-400 block font-medium"
                          >
                            {fixtureTag}
                          </span>
                          <span
                            data-preview-field-path={`home.finishes[${index}].fixtureName`}
                            className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5"
                          >
                            {fixtureName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Finish Slide Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {finishes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-preview-static={`finish-dot-${idx}`}
                onClick={() => setSelectedFinishIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  selectedFinishIndex === idx
                    ? 'w-8 bg-[#d4af37]'
                    : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-[#d4af37]/60'
                }`}
                title={`Go to finish ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4-STEP CRAFTSMANSHIP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[#b8860b] dark:text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="flame-icon" />
            <span data-preview-field-path="home.processBadge">{processBadge}</span>
          </div>
          <h2 
            data-preview-field-path="home.processHeading"
            className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {processHeading}
          </h2>
          <p 
            data-preview-field-path="home.processSubtitle"
            className="text-sm sm:text-base text-slate-700 dark:text-[#a3a8b5]"
          >
            {processSubtitle}
          </p>
        </div>

        <div 
          data-preview-list-path="home.processSteps"
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {processSteps.map((rawStep, index) => {
            const step = contentObject(rawStep);
            const stepNumber = contentText(step.stepNumber) || `0${index + 1}`;
            const title = contentText(step.title);
            const description = contentText(step.description);

            return (
              <div 
                key={index}
                data-preview-item-path={`home.processSteps[${index}]`}
                className="bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-3xl p-6 relative shadow-lg shadow-amber-900/5"
              >
                <span 
                  data-preview-field-path={`home.processSteps[${index}].stepNumber`}
                  className="w-12 h-12 rounded-2xl bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] flex items-center justify-center font-serif-luxury text-xl font-bold mb-6"
                >
                  {stepNumber}
                </span>
                <h3 
                  data-preview-field-path={`home.processSteps[${index}].title`}
                  className="font-serif-luxury text-xl font-bold text-slate-900 dark:text-white mb-2"
                >
                  {title}
                </h3>
                <p 
                  data-preview-field-path={`home.processSteps[${index}].description`}
                  className="text-xs text-slate-600 dark:text-[#a3a8b5] leading-relaxed"
                >
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VERIFIED CLIENT STORIES & REVIEWS */}
      <CustomerReviews />

      {/* ARCHITECTURAL TRADE & CUSTOM FABRICATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50/90 via-amber-100/60 to-amber-50/90 dark:from-[#131720] dark:via-[#1b212d] dark:to-[#131720] border border-amber-800/30 dark:border-[#d4af37]/40 rounded-3xl p-8 sm:p-14 relative overflow-clip shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/15 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-bold">
                <Ruler className="w-4 h-4" data-preview-static="ruler-icon" />
                <span data-preview-field-path="home.tradeBadge">{tradeBadge}</span>
              </div>
              <h2 
                data-preview-field-path="home.tradeHeading"
                className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white"
              >
                {tradeHeading}
              </h2>
              <p 
                data-preview-field-path="home.tradeSubtitle"
                className="text-sm sm:text-base text-slate-700 dark:text-[#a3a8b5] leading-relaxed max-w-2xl font-normal"
              >
                {tradeSubtitle}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              {requiredPages.includes('contact') ? (
                <button type="button" data-target-page="contact" onClick={() => { router.push(pageRoute('contact')); }}
                  className="w-full px-6 py-4 rounded-xl btn-brand-primary text-center text-sm flex items-center justify-center gap-2 border-0 cursor-pointer">
                  <span data-preview-field-path="home.tradePrimaryCta">{tradePrimaryCta}</span>
                  <ArrowRight className="w-4 h-4" data-preview-static="trade-arrow" />
                </button>
              ) : (
                <span data-target-page="contact" className="w-full px-6 py-4 rounded-xl btn-brand-primary text-center text-sm opacity-30 pointer-events-none flex items-center justify-center gap-2">
                  <span data-preview-field-path="home.tradePrimaryCta">{tradePrimaryCta}</span>
                  <ArrowRight className="w-4 h-4" data-preview-static="trade-arrow" />
                </span>
              )}
              {requiredPages.includes('about') ? (
                <button type="button" data-target-page="about" onClick={() => { router.push(pageRoute('about')); }}
                  className="w-full px-6 py-4 rounded-xl bg-white dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-bold text-center text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer">
                  <span data-preview-field-path="home.tradeSecondaryCta">{tradeSecondaryCta}</span>
                </button>
              ) : (
                <span data-target-page="about" className="w-full px-6 py-4 rounded-xl bg-white dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-bold text-center text-sm opacity-30 pointer-events-none flex items-center justify-center gap-2 shadow-md">
                  <span data-preview-field-path="home.tradeSecondaryCta">{tradeSecondaryCta}</span>
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

