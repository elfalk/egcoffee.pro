import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { AdBanner, Language } from '../types/coffee';

interface AdBannerSectionProps {
  ads: AdBanner[];
  lang: Language;
  onNavigatePath: (path: string) => void;
}

interface ResolvedBannerLink {
  href: string;
  isExternal: boolean;
  internalPath?: string;
}

const KNOWN_INTERNAL_PREFIXES = [
  'marckt',
  'store',
  'books',
  'courses',
  'articles',
  'coffee-beans',
  'coffee-blends',
  'calculators',
  'orders',
  'track-order',
  'about',
  'contact',
  'privacy',
];

function resolveBannerLink(rawUrl?: string): ResolvedBannerLink | null {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return null;

  // Check if it points to our own domain (https://www.egcoffee.pro/... or https://egcoffee.pro/...)
  const ownDomainMatch = trimmed.match(
    /^https?:\/\/(?:www\.)?egcoffee\.pro(\/.*)?$/i
  );
  if (ownDomainMatch) {
    const internalPath = ownDomainMatch[1] || '/';
    return {
      href: internalPath,
      isExternal: false,
      internalPath,
    };
  }

  // Internal path starting with /
  if (trimmed.startsWith('/')) {
    return {
      href: trimmed,
      isExternal: false,
      internalPath: trimmed,
    };
  }

  // Hash-prefixed internal path (e.g. #/marckt)
  if (trimmed.startsWith('#/')) {
    const cleanInternal = trimmed.slice(1);
    return {
      href: cleanInternal,
      isExternal: false,
      internalPath: cleanInternal,
    };
  }

  // Known internal route typed without leading slash (e.g. "marckt/..." or "books")
  const firstSegment = trimmed.split('/')[0].toLowerCase();
  if (KNOWN_INTERNAL_PREFIXES.includes(firstSegment)) {
    const internalPath = `/${trimmed}`;
    return {
      href: internalPath,
      isExternal: false,
      internalPath,
    };
  }

  // Explicit protocol (http://, https://, mailto:, tel:)
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return {
      href: trimmed,
      isExternal: true,
    };
  }

  // Domain-like external URL without protocol (e.g. wa.me/... or www.example.com)
  return {
    href: `https://${trimmed}`,
    isExternal: true,
  };
}

export const AdBannerSection: React.FC<AdBannerSectionProps> = ({
  ads,
  lang,
  onNavigatePath,
}) => {
  // Filter and sort active banners by sort_order ascending (الأصغر يظهر أولًا)
  const activeAds = React.useMemo(() => {
    if (!Array.isArray(ads) || ads.length === 0) return [];
    return ads
      .filter((ad) => {
        if (!ad || ad.is_active === false) return false;
        const hasTitle = Boolean(ad.title_ar && ad.title_ar.trim());
        const hasSubtitle = Boolean(ad.subtitle_ar && ad.subtitle_ar.trim());
        return hasTitle || hasSubtitle;
      })
      .slice()
      .sort((a, b) => {
        const orderA =
          typeof a.sort_order === 'number' && Number.isFinite(a.sort_order)
            ? a.sort_order
            : 999999;
        const orderB =
          typeof b.sort_order === 'number' && Number.isFinite(b.sort_order)
            ? b.sort_order
            : 999999;
        return orderA - orderB;
      });
  }, [ads]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = activeAds.length;

  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-advance slider every 6 seconds when multiple active banners exist
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const timer = window.setInterval(goToNext, 6000);
    return () => window.clearInterval(timer);
  }, [totalSlides, isPaused, goToNext]);

  // Gracefully render nothing if there are no active banners in Base44
  if (totalSlides === 0) {
    return null;
  }

  const currentAd = activeAds[currentIndex] || activeAds[0];
  const resolvedLink = resolveBannerLink(currentAd.link_url);

  const ctaText =
    (currentAd.cta_label && currentAd.cta_label.trim()) ||
    (lang === 'ar' ? 'اكتشف التفاصيل' : 'Learn More');

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleBannerAction = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!resolvedLink) {
      e.preventDefault();
      return;
    }
    if (!resolvedLink.isExternal && resolvedLink.internalPath) {
      e.preventDefault();
      onNavigatePath(resolvedLink.internalPath);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null || totalSlides <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const diff = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(diff) < 40) return;

    if (diff > 0) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  return (
    <section
      aria-label={lang === 'ar' ? 'بانر العروض والإعلانات' : 'Featured Promotions'}
      className="py-5 sm:py-7 px-4 sm:px-6 bg-[#f8f9fa] border-t border-b border-neutral-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1200px] mx-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl bg-white border border-neutral-200/90 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Subtle top brand hairline accent */}
            <div
              aria-hidden="true"
              className="h-[3px] w-full bg-[#950101]"
            />

            <div className="p-5 sm:p-7 lg:px-10 lg:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6 lg:gap-10">
              {/* Text Hierarchy Block */}
              <div className="flex-1 min-w-0">
                {/* 1. Small optional brand/campaign label */}
                <div className="flex items-center gap-2 text-xs font-medium text-[#950101] mb-2">
                  <span>
                    {lang === 'ar' ? 'إعلان مميز' : 'Featured Partner'}
                  </span>
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                  <span className="text-neutral-500 font-normal">
                    {lang === 'ar'
                      ? 'تجارة القهوة المصرية'
                      : 'Egyptian Coffee Trade'}
                  </span>
                </div>

                {/* 2. Main promotional headline */}
                {currentAd.title_ar && (
                  <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-[#111111] leading-[1.4] tracking-tight [text-wrap:balance] break-words">
                    {currentAd.title_ar}
                  </h2>
                )}

                {/* 3. Short supporting description */}
                {currentAd.subtitle_ar && (
                  <p className="mt-2 text-sm sm:text-[15px] text-neutral-600 leading-relaxed max-w-3xl break-words">
                    {currentAd.subtitle_ar}
                  </p>
                )}
              </div>

              {/* 4. Clear call-to-action button */}
              {resolvedLink && (
                <div className="shrink-0 flex items-center md:self-center">
                  <a
                    href={resolvedLink.href}
                    onClick={handleBannerAction}
                    target={resolvedLink.isExternal ? '_blank' : undefined}
                    rel={
                      resolvedLink.isExternal
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#950101] hover:bg-[#7a0101] active:bg-[#630101] text-white font-semibold text-xs sm:text-sm px-6 py-3 sm:px-7 sm:py-3.5 shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#950101] focus-visible:ring-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{ctaText}</span>
                    {resolvedLink.isExternal ? (
                      <ExternalLink size={15} className="shrink-0" />
                    ) : (
                      <DirectionalArrow size={16} className="shrink-0" />
                    )}
                  </a>
                </div>
              )}
            </div>

            {/* Slider Controls & Indicators (Only displayed if multiple active banners exist) */}
            {totalSlides > 1 && (
              <div className="px-5 py-3 sm:px-7 lg:px-10 flex items-center justify-between gap-4 border-t border-neutral-100 bg-[#f8f9fa]/70">
                <div
                  className="flex items-center gap-1.5"
                  role="tablist"
                  aria-label={lang === 'ar' ? 'شرائح الإعلانات' : 'Banner Slides'}
                >
                  {activeAds.map((ad, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={ad.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={
                          lang === 'ar'
                            ? `الانتقال إلى الإعلان ${idx + 1}: ${ad.title_ar}`
                            : `Go to banner ${idx + 1}: ${ad.title_ar}`
                        }
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'w-6 bg-[#950101]'
                            : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={lang === 'ar' ? goToNext : goToPrev}
                    aria-label={lang === 'ar' ? 'الإعلان السابق' : 'Previous banner'}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-[#111111] inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={lang === 'ar' ? goToPrev : goToNext}
                    aria-label={lang === 'ar' ? 'الإعلان التالي' : 'Next banner'}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-[#111111] inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
