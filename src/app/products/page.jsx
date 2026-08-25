'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Star, 
  X, 
  ArrowRight, 
  SlidersHorizontal, 
  Info, 
  Clock, 
  Ruler, 
  ShieldCheck, 
  Tag, 
  RotateCcw 
} from 'lucide-react';
import { 
  contentList, 
  contentObject, 
  contentText, 
  useSiteData 
} from '@/lib/siteDataContext';
import { withBasePath } from '@/lib/utils';

export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-100k', label: 'Under LKR 100k', min: 0, max: 100000 },
  { id: '100k-200k', label: 'LKR 100k – 200k', min: 100000, max: 200000 },
  { id: 'above-200k', label: 'Above LKR 200k', min: 200000, max: Infinity },
];

export default function ProductsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const productsContent = contentObject(content.products);
  const requiredPages = siteData.requirements?.requiredPages ??
    siteData.template?.structure?.pages ?? ['home', 'products', 'about', 'contact'];

  const items = contentList(productsContent.items);
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

  // Dynamically derive categories from actual products items
  const productCategories = useMemo(() => {
    const categoriesSet = new Set();
    items.forEach((rawProduct) => {
      const product = contentObject(rawProduct);
      const cat = contentText(product.category)?.trim();
      if (cat) categoriesSet.add(cat);
    });
    return ['All Collections', ...Array.from(categoriesSet)];
  }, [items]);

  const [selectedCategory, setSelectedCategory] = useState('All Collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [maxPriceSlider, setMaxPriceSlider] = useState(400000);
  const [isCustomSliderActive, setIsCustomSliderActive] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which indices pass the filter
  const visibleIndices = useMemo(() => {
    const result = new Set();
    items.forEach((rawProduct, index) => {
      const product = contentObject(rawProduct);
      const name = contentText(product.name) || '';
      const category = contentText(product.category) || '';
      const description = contentText(product.description) || '';
      const price = Number(product.price || 0);

      const matchesCategory =
        selectedCategory === 'All Collections' || category === selectedCategory;

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (isCustomSliderActive) {
        matchesPrice = price <= maxPriceSlider;
      } else {
        const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
        if (range) {
          matchesPrice = price >= range.min && price <= range.max;
        }
      }

      if (matchesCategory && matchesSearch && matchesPrice) {
        result.add(index);
      }
    });
    return result;
  }, [items, selectedCategory, searchQuery, selectedPriceRange, maxPriceSlider, isCustomSliderActive]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Collections');
    setSelectedPriceRange('all');
    setMaxPriceSlider(400000);
    setIsCustomSliderActive(false);
    setSortBy('featured');
  };

  const badge = contentText(productsContent.badge) || '2026 Master Brass Catalog';
  const title = contentText(productsContent.title) || 'Handcrafted Brass Collections';
  const subtitle = contentText(productsContent.subtitle) || 'Explore our range of precision-milled architectural door pulls, hand-spun dome lights, solid brass bath fittings, and custom trade pieces.';

  return (
    <div 
      data-preview-page-key="products"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" data-preview-static="header-sparkle" />
          <span data-preview-field-path="products.badge">{badge}</span>
        </div>
        <h1 
          data-preview-field-path="products.title"
          className="font-serif-luxury text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight"
        >
          {title}
        </h1>
        <p 
          data-preview-field-path="products.subtitle"
          className="text-sm sm:text-base text-slate-600 dark:text-[#a3a8b5]"
        >
          {subtitle}
        </p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Top Row: Search, Price Select Dropdown & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" data-preview-static="search-icon" />
            <input
              type="text"
              placeholder="Search brass handles, lighting, vases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#b8860b] dark:focus:border-[#d4af37]"
              data-preview-static="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                data-preview-static="clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Range Select Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="tag-icon" />
            <div className="relative w-full">
              <select
                value={isCustomSliderActive ? 'custom' : selectedPriceRange}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomSliderActive(true);
                  } else {
                    setIsCustomSliderActive(false);
                    setSelectedPriceRange(e.target.value);
                  }
                }}
                className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-xs sm:text-sm text-slate-900 dark:text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8860b] dark:focus:border-[#d4af37] cursor-pointer"
                data-preview-static="price-select"
              >
                <option data-preview-static="opt-all" value="all">💰 Price: All Ranges (LKR)</option>
                <option data-preview-static="opt-100k" value="under-100k">💰 Price: Under LKR 100,000</option>
                <option data-preview-static="opt-200k" value="100k-200k">💰 Price: LKR 100,000 – LKR 200,000</option>
                <option data-preview-static="opt-above" value="above-200k">💰 Price: Above LKR 200,000</option>
                <option data-preview-static="opt-custom" value="custom">⚡ Custom Price Slider Range</option>
              </select>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0" data-preview-static="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0b0d12] border border-amber-800/30 dark:border-[#d4af37]/30 text-xs sm:text-sm text-slate-900 dark:text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-[#b8860b] dark:focus:border-[#d4af37] cursor-pointer"
              data-preview-static="sort-select"
            >
              <option data-preview-static="sort-feat" value="featured">Sort: Featured</option>
              <option data-preview-static="sort-low" value="price-low">Price: Low to High</option>
              <option data-preview-static="sort-high" value="price-high">Price: High to Low</option>
              <option data-preview-static="sort-rate" value="rating">Top Customer Rated</option>
            </select>
          </div>

        </div>

        {/* Second Row: Interactive Price Range Pills & Max Price Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0d12]/60 border border-amber-800/15 dark:border-white/5 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Price Preset Quick Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mr-1" data-preview-static="brackets-label">
                Price Brackets:
              </span>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => {
                    setIsCustomSliderActive(false);
                    setSelectedPriceRange(range.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    !isCustomSliderActive && selectedPriceRange === range.id
                      ? 'btn-brand-primary shadow-md'
                      : 'bg-white dark:bg-[#131720] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:border-[#b8860b]'
                  }`}
                  data-preview-static="bracket-pill"
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Interactive Slider Bar */}
            <div className="flex items-center gap-3 w-full lg:w-72">
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium whitespace-nowrap" data-preview-static="slider-label">
                Max Price:
              </span>
              <input
                type="range"
                min={25000}
                max={400000}
                step={5000}
                value={maxPriceSlider}
                onChange={(e) => {
                  setIsCustomSliderActive(true);
                  setMaxPriceSlider(Number(e.target.value));
                }}
                className="w-full accent-[#b8860b] dark:accent-[#d4af37] cursor-pointer"
                data-preview-static="range-slider"
              />
              <span className="text-xs font-bold text-[#b8860b] dark:text-[#d4af37] whitespace-nowrap min-w-[90px] text-right" data-preview-static="slider-value">
                Rs. {maxPriceSlider.toLocaleString()}
              </span>
            </div>

          </div>
        </div>

        {/* Third Row: Category Tabs & Results Counter */}
        <div className="flex items-center justify-between gap-4 border-t border-amber-800/15 dark:border-[#d4af37]/15 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#d4af37] text-[#0b0d12] shadow-md shadow-amber-900/15 font-bold'
                    : 'bg-slate-100 dark:bg-[#0b0d12] text-slate-600 dark:text-[#a3a8b5] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5'
                }`}
                data-preview-static="category-tab"
              >
                {category}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'All Collections' || searchQuery || selectedPriceRange !== 'all' || isCustomSliderActive || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline shrink-0 font-semibold cursor-pointer"
              data-preview-static="reset-filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#a3a8b5]">
        <span>
          <span data-preview-static="results-showing">Showing</span> <strong className="text-slate-900 dark:text-white font-bold">{visibleIndices.size}</strong> <span data-preview-static="results-brass">brass items</span>
        </span>
      </div>

      {/* Products Grid - ALL items always rendered so markers exist in exported HTML */}
      <div 
        data-preview-list-path="products.items"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
      >
        {items.map((rawProduct, index) => {
          const product = contentObject(rawProduct);
          const name = contentText(product.name) || '';
          const category = contentText(product.category) || '';
          const price = Number(product.price || 0);
          const rating = Number(product.rating || 0);
          const reviewsCount = Number(product.reviewsCount || 0);
          const image = contentText(product.image) || '';
          const tag = contentText(product.tag) || '';
          const description = contentText(product.description) || '';
          const dimensions = contentText(product.dimensions) || '';
          const finish = contentText(product.finish) || '';
          const leadTime = contentText(product.leadTime) || '';

          const isVisible = visibleIndices.has(index);

          return (
            <div
              key={index}
              data-preview-item-path={`products.items[${index}]`}
              style={{ display: mounted && !isVisible ? 'none' : undefined }}
              className="group bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 rounded-3xl overflow-clip hover:border-[#b8860b] dark:hover:border-[#d4af37]/60 transition-all duration-300 shadow-lg dark:shadow-2xl hover:shadow-xl hover:shadow-amber-900/10 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative h-64 w-full bg-slate-100 dark:bg-[#0b0d12] overflow-clip">
                <img
                  src={withBasePath(image || '/images/hero.jpg')}
                  alt={name}
                  data-preview-field-path={`products.items[${index}].image`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Tag Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    data-preview-field-path={`products.items[${index}].tag`}
                    className="bg-white/90 dark:bg-[#0b0d12]/80 backdrop-blur-md text-[#b8860b] dark:text-[#d4af37] text-xs font-bold px-3 py-1.5 rounded-full border border-amber-800/30 dark:border-[#d4af37]/30 shadow-sm"
                  >
                    {tag}
                  </span>
                </div>

                {/* Quick View Button */}
                <button
                  onClick={() => setQuickViewProduct({ ...product, name, category, price, rating, reviewsCount, image, tag, description, dimensions, finish, leadTime, originalIndex: index })}
                  className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#0b0d12]/90 backdrop-blur-md text-white text-xs font-medium border border-amber-800/30 dark:border-[#d4af37]/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d4af37] hover:text-[#0b0d12] cursor-pointer"
                  data-preview-static="quick-specs-btn"
                >
                  Quick Specs
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#a3a8b5] mb-2 font-medium">
                    <span data-preview-field-path={`products.items[${index}].category`}>{category}</span>
                    <div className="flex items-center gap-1 text-[#b8860b] dark:text-[#d4af37]">
                      <Star className="w-3.5 h-3.5 fill-current" data-preview-static="star-icon" />
                      <span 
                        data-preview-field-path={`products.items[${index}].rating`}
                        className="font-semibold text-slate-900 dark:text-white"
                      >
                        {rating}
                      </span>
                      <span className="text-slate-400 dark:text-gray-500 ml-0.5">
                        (<span data-preview-field-path={`products.items[${index}].reviewsCount`}>{reviewsCount}</span>)
                      </span>
                    </div>
                  </div>

                  <h3 
                    data-preview-field-path={`products.items[${index}].name`}
                    className="font-serif-luxury text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#b8860b] dark:group-hover:text-[#d4af37] transition-colors mb-2 line-clamp-1"
                  >
                    {name}
                  </h3>

                  <p 
                    data-preview-field-path={`products.items[${index}].description`}
                    className="text-xs text-slate-600 dark:text-[#a3a8b5] line-clamp-2 mb-3 leading-relaxed"
                  >
                    {description}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-gray-400 space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <span data-preview-static="finish-label">Finish:</span>
                      <span data-preview-field-path={`products.items[${index}].finish`} className="font-medium text-slate-800 dark:text-gray-200">{finish}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span data-preview-static="dim-label">Dimensions:</span>
                      <span data-preview-field-path={`products.items[${index}].dimensions`} className="font-medium text-slate-800 dark:text-gray-200">{dimensions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span data-preview-static="lead-label">Lead Time:</span>
                      <span data-preview-field-path={`products.items[${index}].leadTime`} className="font-medium text-slate-800 dark:text-gray-200">{leadTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-800/15 dark:border-[#d4af37]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#a3a8b5] block font-medium" data-preview-static="starting-label">Price starting at</span>
                    <span 
                      data-preview-field-path={`products.items[${index}].price`}
                      className="font-serif-luxury text-lg font-bold text-[#b8860b] dark:text-[#d4af37]"
                    >
                      Rs. {price.toLocaleString()} <span className="text-xs font-sans text-slate-400" data-preview-static="currency-label">LKR</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct({ ...product, name, category, price, rating, reviewsCount, image, tag, description, dimensions, finish, leadTime, originalIndex: index })}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#0b0d12] hover:bg-amber-800/10 dark:hover:bg-[#d4af37]/20 text-slate-600 dark:text-[#a3a8b5] hover:text-[#b8860b] dark:hover:text-[#d4af37] border border-slate-200 dark:border-white/10 cursor-pointer"
                      title="View Product Specifications"
                      data-preview-static="info-btn"
                    >
                      <Info className="w-4 h-4" data-preview-static="info-icon" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openWhatsAppQuote({ name, category, price, finish, dimensions, leadTime })}
                      className="px-3.5 py-2 rounded-xl btn-brand-primary text-xs border-0 cursor-pointer"
                      data-preview-static="quote-cta-btn"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK VIEW SPECIFICATION MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-[#0b0d12] text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white cursor-pointer" data-preview-static="modal-close">
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-clip border border-amber-800/20 dark:border-[#d4af37]/20 bg-slate-100 dark:bg-[#0b0d12]">
                  <img src={withBasePath(quickViewProduct.image || '/images/hero.jpg')} alt={quickViewProduct.name} className="w-full h-full object-cover" data-preview-static="modal-img" />
                </div>
              </div>
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#b8860b] dark:text-[#d4af37] font-bold uppercase tracking-wider" data-preview-static="modal-cat">{quickViewProduct.category}</span>
                  <div className="flex items-center gap-1 text-[#b8860b] dark:text-[#d4af37]">
                    <Star className="w-4 h-4 fill-current" data-preview-static="modal-star" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white" data-preview-static="modal-rate">{quickViewProduct.rating}</span>
                  </div>
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 dark:text-white" data-preview-static="modal-name">{quickViewProduct.name}</h3>
                <p className="text-xs text-slate-600 dark:text-[#a3a8b5] leading-relaxed" data-preview-static="modal-desc">{quickViewProduct.description}</p>
                <div className="space-y-2 py-3 border-y border-slate-100 dark:border-white/5 text-xs">
                  <div className="flex items-center justify-between"><span className="text-slate-500" data-preview-static="m-fin-lbl">Standard Finish:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="m-fin-val">{quickViewProduct.finish}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500" data-preview-static="m-dim-lbl">Dimensions:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="m-dim-val">{quickViewProduct.dimensions}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500" data-preview-static="m-lead-lbl">Foundry Lead Time:</span><span className="font-medium text-slate-800 dark:text-gray-200" data-preview-static="m-lead-val">{quickViewProduct.leadTime}</span></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#a3a8b5] block" data-preview-static="m-price-lbl">Starting Price</span>
                    <span className="font-serif-luxury text-xl font-bold text-[#b8860b] dark:text-[#d4af37]" data-preview-static="m-price-val">Rs. {Number(quickViewProduct.price || 0).toLocaleString()} LKR</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openWhatsAppQuote(quickViewProduct)}
                    className="px-5 py-2.5 rounded-xl btn-brand-primary text-xs cursor-pointer border-0"
                    data-preview-static="modal-quote-cta"
                  >
                    Inquire / Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
