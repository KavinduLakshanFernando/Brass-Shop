'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Quote
} from 'lucide-react';
import { contentList, contentObject, contentText, useSiteData } from '@/lib/siteDataContext';

export default function CustomerReviews() {
  const siteData = useSiteData();
  const content = contentObject(siteData.content);
  const home = contentObject(content.home);

  const rawReviews = contentList(home.reviews);
  const reviewsBadge = contentText(home.reviewsBadge) || 'Verified Client Stories & Testimonials';
  const reviewsHeading = contentText(home.reviewsHeading) || 'Trusted by Leading Architects, Designers & Discerning Homeowners';
  const reviewsSubtitle = contentText(home.reviewsSubtitle) || 'Read authentic reviews from clients across Sri Lanka and worldwide who have commissioned our solid brass door hardware, spun lighting fixtures, and bespoke architectural metalwork.';

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isReviewsAutoplayActive, setIsReviewsAutoplayActive] = useState(true);

  // Responsive items per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allReviews = useMemo(() => {
    return rawReviews.map((raw, idx) => {
      const obj = contentObject(raw);
      return {
        id: contentText(obj.id) || `site-rev-${idx}`,
        author: contentText(obj.author) || 'Verified Client',
        rating: Number(obj.rating || 5),
        comment: contentText(obj.comment) || '',
        originalIndex: idx
      };
    });
  }, [rawReviews]);

  // Max slide index
  const maxSlideIndex = Math.max(0, allReviews.length - itemsPerPage);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlideIndex));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlideIndex ? prev + 1 : 0));
  };

  // Autoplay for reviews slider
  useEffect(() => {
    if (!isReviewsAutoplayActive || maxSlideIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev < maxSlideIndex ? prev + 1 : 0));
    }, 5000); // cycle every 5 seconds

    return () => clearInterval(interval);
  }, [isReviewsAutoplayActive, maxSlideIndex, currentSlide]);

  // Touch and Drag swipe gestures for reviews slider
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
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
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
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }
  };

  return (
    <section 
      onMouseEnter={() => setIsReviewsAutoplayActive(false)}
      onMouseLeave={() => setIsReviewsAutoplayActive(true)}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" 
      id="customer-reviews"
    >
      
      {/* Centered Topic Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 dark:bg-[#d4af37]/10 border border-amber-800/30 dark:border-[#d4af37]/30 text-[#b8860b] dark:text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" data-preview-static="rev-sparkle" />
          <span data-preview-field-path="home.reviewsBadge">{reviewsBadge}</span>
        </div>
        <h2 
          data-preview-field-path="home.reviewsHeading"
          className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-3"
        >
          {reviewsHeading}
        </h2>
        <p 
          data-preview-field-path="home.reviewsSubtitle"
          className="text-xs sm:text-sm text-slate-600 dark:text-[#a3a8b5] leading-relaxed"
        >
          {reviewsSubtitle}
        </p>
      </div>

      {/* REVIEWS SLIDER CAROUSEL TRACK */}
      <div 
        className="relative overflow-clip py-2 touch-pan-y select-none cursor-grab active:cursor-grabbing"
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
          data-preview-list-path="home.reviews"
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)`
          }}
        >
          {allReviews.map((rev, index) => {
            // Get author initials for luxury monogram badge
            const initials = rev.author
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'AB';

            return (
              <div
                key={rev.id || index}
                data-preview-item-path={`home.reviews[${rev.originalIndex ?? index}]`}
                className="shrink-0 bg-white dark:bg-[#131720] border border-amber-800/20 dark:border-[#d4af37]/20 hover:border-[#b8860b] dark:hover:border-[#d4af37]/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-amber-900/5 dark:shadow-2xl relative"
                style={{
                  width: `calc(${100 / itemsPerPage}% - ${(gapSize(itemsPerPage))}px)`
                }}
              >
                {/* Decorative Quote Icon Watermark */}
                <div className="absolute top-6 right-6 opacity-10 dark:opacity-5 pointer-events-none">
                  <Quote className="w-12 h-12 text-[#b8860b] dark:text-[#d4af37]" />
                </div>

                <div className="relative z-10">
                  {/* Stars Only */}
                  <div className="flex items-center gap-1 text-[#b8860b] dark:text-[#d4af37] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'fill-[#b8860b] dark:fill-[#d4af37]'
                            : 'text-slate-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                    <span 
                      data-preview-field-path={`home.reviews[${rev.originalIndex ?? index}].rating`}
                      className="text-xs font-bold text-slate-800 dark:text-white ml-1.5"
                    >
                      {rev.rating}.0
                    </span>
                  </div>

                  {/* Comment Only */}
                  <p 
                    data-preview-field-path={`home.reviews[${rev.originalIndex ?? index}].comment`}
                    className="text-xs sm:text-sm text-slate-700 dark:text-[#cbd5e1] leading-relaxed mb-6 font-normal italic"
                  >
                    "{rev.comment}"
                  </p>
                </div>

                {/* Person Name & Avatar Only */}
                <div className="pt-4 border-t border-amber-800/15 dark:border-[#d4af37]/15 flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c59b27] to-[#8b5a2b] p-[1px] shrink-0">
                    <div className="w-full h-full bg-white dark:bg-[#0b0d12] rounded-full flex items-center justify-center font-serif-luxury font-bold text-xs text-[#b8860b] dark:text-[#d4af37]">
                      {initials}
                    </div>
                  </div>

                  <div>
                    <span 
                      data-preview-field-path={`home.reviews[${rev.originalIndex ?? index}].author`}
                      className="font-serif-luxury font-bold text-sm text-slate-900 dark:text-white block"
                    >
                      {rev.author}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Arrows & Pagination Dots */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          data-preview-static="prev-review-btn"
          onClick={handlePrevSlide}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-700 dark:text-gray-200 hover:border-[#b8860b] dark:hover:border-[#d4af37] hover:text-[#b8860b] dark:hover:text-[#d4af37] flex items-center justify-center transition-all shadow-md cursor-pointer"
          title="Previous Review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {[...Array(maxSlideIndex + 1)].map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              data-preview-static={`review-dot-${dotIdx}`}
              onClick={() => setCurrentSlide(dotIdx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === dotIdx
                  ? 'w-8 bg-[#d4af37]'
                  : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-[#d4af37]/60'
              }`}
              title={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          data-preview-static="next-review-btn"
          onClick={handleNextSlide}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#131720] border border-amber-800/30 dark:border-[#d4af37]/30 text-slate-700 dark:text-gray-200 hover:border-[#b8860b] dark:hover:border-[#d4af37] hover:text-[#b8860b] dark:hover:text-[#d4af37] flex items-center justify-center transition-all shadow-md cursor-pointer"
          title="Next Review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </section>
  );
}

function gapSize(itemsPerPage) {
  if (itemsPerPage === 1) return 0;
  if (itemsPerPage === 2) return 12;
  return 16;
}
