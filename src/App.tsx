import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import {
  Newspaper,
  ArrowUpLeft,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  FlaskConical,
  UserCheck,
  UserPlus,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume1,
  Volume2,
  PhoneCall,
} from 'lucide-react';
import {
  Language,
  NavTab,
  CoffeePrice,
  CatalogItem,
  CoffeeBean,
  CoffeeBlend,
  ArticleCategory,
  Article,
  OrderRecord,
  CustomerAccount,
  AudioClip,
  AdBanner,
} from './types/coffee';
import {
  getCoffeePrices,
  getCatalogItems,
  getCoffeeBeans,
  getCoffeeBlends,
  getArticleCategories,
  getArticles,
  getOrders,
  getAudioClips,
  getAds,
  resolveAudioClipUrl,
  getStoredCustomerAuth,
  logoutCustomerAccount,
} from './services/base44Api';
import { SearchBar } from './components/SearchBar';
import { AdBannerSection } from './components/AdBannerSection';
import { BookCoverflow } from './components/BookCoverflow';
import { BlendCalculator } from './components/BlendCalculator';
import { BeansEncyclopedia } from './components/BeansEncyclopedia';
import { BlendsEncyclopedia } from './components/BlendsEncyclopedia';
import { ArticlesSection } from './components/ArticlesSection';
import { CoursesSection } from './components/CoursesSection';
import { StoreSection } from './components/StoreSection';
import { OrdersSection } from './components/OrdersSection';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { DockNav } from './components/DockNav';
import { MarketTicker } from './components/MarketTicker';
import {
  AboutUsPage,
  ContactUsPage,
  PrivacyTermsPage,
  NotFoundPage,
  SOCIAL_LINKS,
  WhatsAppBrandIcon,
  FacebookBrandIcon,
  InstagramBrandIcon,
  TikTokBrandIcon,
  YouTubeBrandIcon,
} from './components/StaticPages';
import { useGlobalUiverseButtons } from './components/UiverseButtonVines';
import {
  SITE_URL,
  ParsedRoute,
  CalculatorSubRoute,
  parseAppRoute,
  getArticlePath,
  getArticleCategoryPath,
  getBookPath,
  getCoursePath,
  getCatalogItemSlug,
  matchesCatalogItemSlug,
  matchesArticleSlug,
  matchesCategorySlug,
  matchesBeanSlug,
  matchesBlendSlug,
} from './utils/slugs';
import {
  initAnalytics,
  trackPageView,
  trackInitiateCheckout,
  trackConfirmedPurchaseIfEligible,
} from './utils/analytics';
import {
  updatePageSeo,
  buildBreadcrumbSchema,
  buildCatalogItemJsonLd,
  buildArticleJsonLd,
  buildBeanJsonLd,
  buildBlendJsonLd,
} from './utils/seo';

function navTabToPath(tab: NavTab): string {
  switch (tab) {
    case 'home':
      return '/';
    case 'store':
      return '/marckt';
    case 'beans':
      return '/coffee-beans';
    case 'blends':
      return '/coffee-blends';
    case 'library':
      return '/books';
    case 'calculator':
      return '/calculators';
    case 'articles':
      return '/articles';
    case 'courses':
      return '/courses';
    case 'orders':
      return '/orders';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'privacy':
      return '/privacy';
    default:
      return '/';
  }
}

function routeToNavTab(route: ParsedRoute): NavTab {
  switch (route.section) {
    case 'home':
      return 'home';
    case 'marckt':
    case 'store':
      return 'store';
    case 'books':
      return 'library';
    case 'courses':
      return 'courses';
    case 'articles':
      return 'articles';
    case 'coffee-beans':
      return 'beans';
    case 'coffee-blends':
      return 'blends';
    case 'calculators':
      return 'calculator';
    case 'orders':
    case 'track-order':
      return 'orders';
    case 'about':
      return 'about';
    case 'contact':
      return 'contact';
    case 'privacy':
      return 'privacy';
    default:
      return 'home';
  }
}

interface GatesNavProps {
  lang: Language;
  activeTab: NavTab;
  ordersCount: number;
  currentCustomer: CustomerAccount | null;
  onOpenAuth: () => void;
  onNavigate: (tab: NavTab) => void;
  onToggleLang: () => void;
  variant?: 'hero' | 'light';
}

function GatesNav({
  lang,
  activeTab,
  ordersCount,
  currentCustomer,
  onOpenAuth,
  onNavigate,
  onToggleLang,
  variant = 'hero',
}: GatesNavProps) {
  const isLight = variant === 'light';
  const navLinks: { tab: NavTab; href: string; label_ar: string; label_en: string }[] = [
    { tab: 'home', href: '/', label_ar: 'الرئيسية', label_en: 'Home' },
    { tab: 'store', href: '/marckt', label_ar: 'المتجر', label_en: 'Store' },
    { tab: 'beans', href: '/coffee-beans', label_ar: 'موسوعة البن', label_en: 'Bean Origins' },
    { tab: 'blends', href: '/coffee-blends', label_ar: 'التوليفات', label_en: 'Blends' },
    { tab: 'library', href: '/books', label_ar: 'الكتب السبعة', label_en: 'The 7 Books' },
    {
      tab: 'calculator',
      href: '/calculators',
      label_ar: 'حاسبة التوليفات',
      label_en: 'Blend Calculator',
    },
    { tab: 'articles', href: '/articles', label_ar: 'المقالات', label_en: 'Research' },
    { tab: 'courses', href: '/courses', label_ar: 'الدورات', label_en: 'Courses' },
    {
      tab: 'orders',
      href: '/orders',
      label_ar: ordersCount > 0 ? `طلباتي (${ordersCount})` : 'طلباتي',
      label_en: ordersCount > 0 ? `Orders (${ordersCount})` : 'Orders',
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="reveal flex items-center justify-between gap-4"
    >
      {/* Brand mark */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('home');
        }}
        className={`flex items-center gap-3 text-[18px] sm:text-[20px] font-semibold tracking-[-0.03em] select-none shrink-0 ${
          isLight ? 'text-[var(--text)]' : 'text-white'
        }`}
      >
        <picture className="shrink-0">
          <source srcSet="/media/logo-96w.webp" type="image/webp" />
          <img
            src="/assets/aistudio/_______20013552.png"
            alt="تجـــارة القهـــوة المصـــرية"
            width={64}
            height={76}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-14 h-16 sm:w-16 sm:h-[76px] object-contain shrink-0 ${
              !isLight ? 'drop-shadow-[0_1px_8px_rgba(255,255,255,0.5)]' : ''
            }`}
          />
        </picture>
        <span
          className={`whitespace-nowrap text-right text-[14px] sm:text-[15px] leading-[32.5px] rounded-[100px] ${
            !isLight ? 'text-[#fef3f3] font-bold italic' : ''
          }`}
        >
          {lang === 'ar' ? 'تجـــارة القهـــوة المصـــرية' : 'Egyptian Coffee Trade'}
        </span>
      </a>

      {/* Center navigation links — Transparent without colors */}
      <ul
        className={`hidden lg:flex items-center gap-1.5 text-[13px] font-medium ${
          isLight ? 'text-[var(--text)]' : 'text-white'
        }`}
      >
        {navLinks.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <li key={item.tab}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.tab);
                }}
                className={`bg-transparent rounded-[8px] py-1.5 px-3 text-[12.5px] whitespace-nowrap transition-colors cursor-pointer inline-block ${
                  isLight
                    ? isActive
                      ? 'border border-black/30 text-[#111111] font-semibold'
                      : 'border border-transparent text-[#111111]/80 hover:text-[#111111] hover:border-black/15'
                    : isActive
                    ? 'border border-white/55 text-white font-semibold'
                    : 'border border-transparent text-white/85 hover:text-white hover:border-white/25'
                }`}
              >
                {lang === 'ar' ? item.label_ar : item.label_en}
              </a>
            </li>
          );
        })}
      </ul>

      {/* End actions: Icon-only Customer Account + Transparent Language switch */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAuth}
          aria-label={
            currentCustomer
              ? lang === 'ar'
                ? 'حسابي المسجل'
                : 'My Account'
              : lang === 'ar'
              ? 'تسجيل الدخول'
              : 'Sign In'
          }
          title={
            currentCustomer
              ? currentCustomer.name
              : lang === 'ar'
              ? 'تسجيل دخول اختياري لحفظ المشتريات'
              : 'Optional Sign-In to Save Purchases'
          }
          className={`relative bg-transparent rounded-[8px] w-9 h-9 transition-colors cursor-pointer border inline-flex items-center justify-center ${
            currentCustomer
              ? isLight
                ? 'border-emerald-600/50 bg-emerald-500/10 text-emerald-600 hover:border-emerald-600'
                : 'border-emerald-400/75 bg-emerald-500/15 text-emerald-400 hover:border-emerald-300'
              : isLight
              ? 'border-black/20 hover:border-black/50 text-[#111111]'
              : 'border-white/35 hover:border-white/75 text-white'
          }`}
        >
          {currentCustomer ? (
            <>
              <UserCheck size={17} strokeWidth={2.2} className="text-emerald-500 shrink-0" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </>
          ) : (
            <UserPlus size={16} strokeWidth={1.8} className="shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleLang}
          aria-label={
            lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
          }
          className={`bg-transparent rounded-[8px] w-9 h-9 text-[12px] transition-colors cursor-pointer border inline-flex items-center justify-center ${
            isLight
              ? 'border-black/20 hover:border-black/50 text-[#111111]'
              : 'border-white/35 hover:border-white/75 text-white'
          }`}
        >
          <span
            className={`fi ${
              lang === 'ar' ? 'fi-eg' : 'fi-us'
            } text-xs rounded-[2px]`}
          />
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  useGlobalUiverseButtons();
  const [lang, setLang] = useState<Language>('ar');
  const [route, setRoute] = useState<ParsedRoute>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const legacyArticle = params.get('article');
      if (legacyArticle) {
        const cleanArticlePath = `/articles/${encodeURIComponent(legacyArticle)}`;
        try {
          window.history.replaceState({}, '', cleanArticlePath);
        } catch {
          // Ignore history error
        }
        return parseAppRoute(cleanArticlePath, '');
      }
      return parseAppRoute(window.location.pathname, window.location.hash);
    }
    return { section: 'home', canonicalPath: '/' };
  });

  const activeTab: NavTab = routeToNavTab(route);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [prices, setPrices] = useState<CoffeePrice[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [blends, setBlends] = useState<CoffeeBlend[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.6);

  const [presetBlend, setPresetBlend] = useState<CoffeeBlend | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<CatalogItem | null>(null);
  const [currentCustomer, setCurrentCustomer] =
    useState<CustomerAccount | null>(() => {
      const saved = getStoredCustomerAuth();
      return saved ? saved.customer : null;
    });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize GTM & Meta Pixel once on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Listen to browser Back / Forward and hash changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleLocationChange = () => {
      const nextRoute = parseAppRoute(window.location.pathname, window.location.hash);
      setRoute(nextRoute);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToPath = useCallback((path: string, searchQuery = '') => {
    setGlobalSearchQuery(searchQuery);
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    try {
      if (window.location.pathname !== cleanPath || window.location.hash) {
        window.history.pushState({}, '', cleanPath);
      }
    } catch {
      // Ignore history API errors
    }
    const nextRoute = parseAppRoute(cleanPath, '');
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback(
    (tab: NavTab, query = '') => {
      navigateToPath(navTabToPath(tab), query);
    },
    [navigateToPath]
  );

  // Dynamic SEO, Canonical, Open Graph, JSON-LD & GTM/Meta PageView on route or data updates
  useEffect(() => {
    const section = route.section;
    const slug = route.slug;
    const catSlug = route.categorySlug;

    if (section === 'home') {
      updatePageSeo({
        title: 'تجارة البن في مصر | Egyptian Coffee Trade — الكتب السبعة وموسوعة البن وحاسبة التوليفات',
        description:
          'المرجع العلمي والتجاري الأول لتجارة وصناعة البن في مصر والعالم العربي. الكتب السبعة المرجعية، موسوعة 200 سلالة بن، حاسبة التوليفات وهدر التحميص، والدورات التدريبية.',
        canonicalPath: '/',
        ogType: 'website',
        jsonLd: buildBreadcrumbSchema([{ name: 'الرئيسية', path: '/' }]),
      });
      trackPageView('/', document.title);
      return;
    }

    if (section === 'marckt' || section === 'store' || section === 'books' || section === 'courses') {
      if (slug && catalogItems.length > 0) {
        const matched = catalogItems.find((item) => matchesCatalogItemSlug(item, slug));
        if (matched) {
          const itemPath =
            section === 'books'
              ? `/books/${getCatalogItemSlug(matched)}`
              : section === 'courses'
              ? `/courses/${getCatalogItemSlug(matched)}`
              : section === 'store'
              ? `/store/${getCatalogItemSlug(matched)}`
              : `/marckt/${getCatalogItemSlug(matched)}`;

          updatePageSeo({
            title: `${matched.title_ar || matched.title_en} | تجارة البن في مصر`,
            description:
              matched.description_ar ||
              matched.subtitle_ar ||
              matched.description_en ||
              matched.title_ar,
            canonicalPath: itemPath,
            ogType: matched.type === 'book' ? 'book' : 'product',
            ogImage: matched.cover_image,
            jsonLd: buildCatalogItemJsonLd(matched, itemPath),
          });
          trackPageView(itemPath, document.title);
          return;
        }
      }

      if (section === 'books') {
        updatePageSeo({
          title: 'الكتب السبعة المرجعية والباقة الشاملة | تجارة البن في مصر',
          description:
            'تصفح وحمّل سلسلة الكتب السبعة المرجعية في تجارة البن الأخضر، هندسة التحميص، وتأسيس المحامص والعلامات التجارية في مصر.',
          canonicalPath: '/books',
          ogType: 'website',
          jsonLd: buildBreadcrumbSchema([
            { name: 'الرئيسية', path: '/' },
            { name: 'الكتب السبعة', path: '/books' },
          ]),
        });
        trackPageView('/books', document.title);
        return;
      }

      if (section === 'courses') {
        updatePageSeo({
          title: 'الدورات التدريبية ودبلومات التحميص وتجارة البن | تجارة البن في مصر',
          description:
            'برامج تدريبية عملية مصورة من داخل المحامص وخطوط الإنتاج في مصر لتأهيلك لاحتراف التحميص وهندسة التوليفات وتأسيس علامتك التجارية.',
          canonicalPath: '/courses',
          ogType: 'website',
          jsonLd: buildBreadcrumbSchema([
            { name: 'الرئيسية', path: '/' },
            { name: 'الدورات التدريبية', path: '/courses' },
          ]),
        });
        trackPageView('/courses', document.title);
        return;
      }

      const storeCanonical = section === 'store' ? '/store' : '/marckt';
      updatePageSeo({
        title: 'متجر تجارة البن في مصر | الكتب والدورات والمنتجات — Egyptian Coffee Trade Store',
        description:
          'متجر تجارة البن في مصر: احصل على الكتب السبعة المرجعية، الباقة الكاملة، الدورات التدريبية، ومنتجات القهوة المختصة والتجارية.',
        canonicalPath: storeCanonical,
        ogType: 'website',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'المتجر', path: storeCanonical },
        ]),
      });
      trackPageView(storeCanonical, document.title);
      return;
    }

    if (section === 'articles') {
      if (slug && articles.length > 0) {
        const matchedArt = articles.find((a) => matchesArticleSlug(a, slug));
        if (matchedArt) {
          const artPath = getArticlePath(matchedArt);
          updatePageSeo({
            title: `${matchedArt.seo_title || matchedArt.title_ar} | مقالات تجارة البن في مصر`,
            description:
              matchedArt.seo_description ||
              matchedArt.summary_ar ||
              matchedArt.excerpt_ar ||
              matchedArt.title_ar,
            canonicalPath: artPath,
            ogType: 'article',
            ogImage: matchedArt.cover_image,
            jsonLd: buildArticleJsonLd(matchedArt),
          });
          trackPageView(artPath, document.title);
          return;
        }
      }

      if (catSlug && categories.length > 0) {
        const matchedCat = categories.find((c) => matchesCategorySlug(c, catSlug));
        if (matchedCat) {
          const catPath = getArticleCategoryPath(matchedCat);
          updatePageSeo({
            title: `${matchedCat.name_ar} | مقالات وأبحاث تجارة البن في مصر`,
            description:
              matchedCat.description_ar ||
              `تصفح جميع المقالات والدراسات المتخصصة في قسم ${matchedCat.name_ar} على منصة تجارة البن في مصر.`,
            canonicalPath: catPath,
            ogType: 'website',
            jsonLd: buildBreadcrumbSchema([
              { name: 'الرئيسية', path: '/' },
              { name: 'المقالات', path: '/articles' },
              { name: matchedCat.name_ar, path: catPath },
            ]),
          });
          trackPageView(catPath, document.title);
          return;
        }
      }

      updatePageSeo({
        title: 'المقالات والدراسات المتخصصة في صناعة وتجارة القهوة | تجارة البن في مصر',
        description:
          'مركز الأبحاث والدراسات العلمية والتجارية لصناع وتجار القهوة: تخزين البن الأخضر، فيزياء التحميص، هندسة التوليفات، وإدارة المحامص.',
        canonicalPath: '/articles',
        ogType: 'website',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'المقالات', path: '/articles' },
        ]),
      });
      trackPageView('/articles', document.title);
      return;
    }

    if (section === 'coffee-beans') {
      if (slug && beans.length > 0) {
        const matchedBean = beans.find((b) => matchesBeanSlug(b, slug));
        if (matchedBean) {
          const beanPath = `/coffee-beans/${slug}`;
          updatePageSeo({
            title: `${matchedBean.name_ar} (${matchedBean.name_en || matchedBean.country_ar}) | موسوعة حبوب البن`,
            description:
              matchedBean.sensory_profile_ar ||
              matchedBean.commercial_traits_ar ||
              `مواصفات وأسعار سلالة ${matchedBean.name_ar} (${matchedBean.country_ar}) في السوق المصري.`,
            canonicalPath: beanPath,
            ogType: 'article',
            jsonLd: buildBeanJsonLd(matchedBean),
          });
          trackPageView(beanPath, document.title);
          return;
        }
      }

      updatePageSeo({
        title: 'موسوعة حبوب البن العالمية (200 سلالة أرابيكا وروبوستا) | تجارة البن في مصر',
        description:
          'الدليل المرجعي الشامل لأكثر من 200 سلالة بن أخضر من جميع دول العالم: الإيحاءات الحسية، درجات التحميص، الكثافة، والاستخدام التجاري.',
        canonicalPath: '/coffee-beans',
        ogType: 'website',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'موسوعة البن', path: '/coffee-beans' },
        ]),
      });
      trackPageView('/coffee-beans', document.title);
      return;
    }

    if (section === 'coffee-blends') {
      if (slug && blends.length > 0) {
        const matchedBlend = blends.find((bl) => matchesBlendSlug(bl, slug));
        if (matchedBlend) {
          const blendPath = `/coffee-blends/${slug}`;
          updatePageSeo({
            title: `${matchedBlend.name_ar} | موسوعة التوليفات التجارية — تجارة البن في مصر`,
            description:
              matchedBlend.characteristics_ar ||
              matchedBlend.flavor_profile_ar ||
              `تركيبة ونسب توليفة ${matchedBlend.name_ar} للقهوة التركي والإسبريسو.`,
            canonicalPath: blendPath,
            ogType: 'article',
            jsonLd: buildBlendJsonLd(matchedBlend),
          });
          trackPageView(blendPath, document.title);
          return;
        }
      }

      updatePageSeo({
        title: 'موسوعة التوليفات التجارية الجاهزة (100% نسب معتمدة) | تجارة البن في مصر',
        description:
          'توليفات قهوة تركي وإسبريسو تجارية ومختصة جاهزة للتشغيل الفوري في المحامص والكافيهات بنسب دقيقة 100%.',
        canonicalPath: '/coffee-blends',
        ogType: 'website',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'التوليفات', path: '/coffee-blends' },
        ]),
      });
      trackPageView('/coffee-blends', document.title);
      return;
    }

    if (section === 'calculators') {
      const sub = route.calculatorSubRoute || 'blend-calculator';
      const calcTitles: Record<CalculatorSubRoute, { title: string; desc: string; path: string }> = {
        'blend-calculator': {
          title: 'حاسبة هندسة التوليفات والتحليل الحسي | تجارة البن في مصر',
          desc: 'صمّم توليفة القهوة الخاصة بمحمضتك واحسب التكلفة الدقيقة والنسب المئوية مع تحليل التوليفة الفوري.',
          path: route.canonicalPath === '/calculators' ? '/calculators' : '/calculators/blend-calculator',
        },
        'roasting-loss': {
          title: 'حاسبة نسبة الفقد وهدر التحميص | تجارة البن في مصر',
          desc: 'احسب نسبة الفقد في الوزن أثناء التحميص وتأثيرها المباشر على صافي الإنتاج وتكلفة الكيلو.',
          path: '/calculators/roasting-loss',
        },
        'roasted-coffee-cost': {
          title: 'حاسبة تكلفة البن المحمص الصافية | تجارة البن في مصر',
          desc: 'احسب التكلفة الفعلية لكيلو البن بعد التحميص شامل الهدر والتشغيل والتعبئة لتسعير منتجاتك بدقة.',
          path: '/calculators/roasted-coffee-cost',
        },
      };
      const meta = calcTitles[sub];
      updatePageSeo({
        title: meta.title,
        description: meta.desc,
        canonicalPath: meta.path,
        ogType: 'website',
        jsonLd: [
          buildBreadcrumbSchema([
            { name: 'الرئيسية', path: '/' },
            { name: 'الحاسبات الذكية', path: '/calculators' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: meta.title,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: `${SITE_URL}${meta.path}`,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EGP',
            },
          },
        ],
      });
      trackPageView(meta.path, document.title);
      return;
    }

    if (section === 'orders' || section === 'track-order') {
      const path = section === 'track-order' ? '/track-order' : '/orders';
      updatePageSeo({
        title: 'متابعة الطلبات والمشتريات الرقمية | تجارة البن في مصر',
        description: 'تابع حالة طلبك وحمّل الكتب والملفات الرقمية المعتمدة من منصة تجارة البن في مصر.',
        canonicalPath: path,
        noindex: true,
      });
      trackPageView(path, document.title);
      return;
    }

    if (section === 'about') {
      updatePageSeo({
        title: 'من نحن | تجارة البن في مصر — Egyptian Coffee Trade',
        description:
          'تعرف على منصة تجارة البن في مصر ورؤيتها العلمية والتجارية لتطوير صناعة التحميص وتجارة البن الأخضر في مصر والعالم العربي.',
        canonicalPath: '/about',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'من نحن', path: '/about' },
        ]),
      });
      trackPageView('/about', document.title);
      return;
    }

    if (section === 'contact') {
      updatePageSeo({
        title: 'تواصل معنا | تجارة البن في مصر — خدمة العملاء والاستشارات',
        description:
          'تواصل مباشرة مع فريق تجارة البن في مصر عبر واتساب أو القنوات الرسمية للاستفسار عن الكتب السبعة والدورات التدريبية.',
        canonicalPath: '/contact',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'تواصل معنا', path: '/contact' },
        ]),
      });
      trackPageView('/contact', document.title);
      return;
    }

    if (section === 'privacy') {
      updatePageSeo({
        title: 'سياسة الخصوصية والشروط والأحكام | تجارة البن في مصر',
        description:
          'سياسة الخصوصية، حقوق الملكية الفكرية، وشروط الاستخدام والدفع والاستلام الرقمي لمنصة تجارة البن في مصر.',
        canonicalPath: '/privacy',
        jsonLd: buildBreadcrumbSchema([
          { name: 'الرئيسية', path: '/' },
          { name: 'الخصوصية والشروط', path: '/privacy' },
        ]),
      });
      trackPageView('/privacy', document.title);
      return;
    }

    updatePageSeo({
      title: 'الصفحة غير موجودة (404) | تجارة البن في مصر',
      description: 'عذراً، هذا الرابط غير متوفر أو تم نقله. تصفح أقسام منصة تجارة البن في مصر.',
      canonicalPath: route.canonicalPath,
      noindex: true,
    });
    trackPageView(route.canonicalPath, document.title);
  }, [route, catalogItems, articles, categories, beans, blends]);

  // Confirmed Purchase Tracking: ONLY fire Purchase when an order is confirmed paid/completed
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    for (const ord of orders) {
      trackConfirmedPurchaseIfEligible(ord);
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const saveData = Boolean(
      conn?.saveData ||
        conn?.effectiveType === 'slow-2g' ||
        conn?.effectiveType === '2g'
    );
    if (!reduceMotion && !saveData) {
      setShouldLoadHeroVideo(true);
    }
  }, []);

  useEffect(() => {
    if (route.section !== 'home') {
      setIsPastHero(true);
      return;
    }
    const checkScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
      setIsPastHero(window.scrollY >= heroHeight - 140);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [route.section]);

  const activeAudioTitle =
    audioClips[currentTrackIndex]?.title_ar ||
    (lang === 'ar' ? 'مقطع صوتي' : 'Audio Track');

  // Pre-set audio element src when audioClips load or track index changes (while paused)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    const clip = audioClips[currentTrackIndex];
    if (clip?.audio_url && /^https?:\/\//i.test(clip.audio_url)) {
      if (audio.src !== clip.audio_url) {
        audio.src = clip.audio_url;
      }
    }
  }, [audioClips, currentTrackIndex]);

  const playClipAtIndex = useCallback(
    async (index: number, forceFreshUrl = false) => {
      const audio = audioRef.current;
      if (!audio) return;

      let clipsList = audioClips;
      if (clipsList.length === 0) {
        try {
          const fetched = await getAudioClips();
          if (fetched.length > 0) {
            clipsList = fetched;
            setAudioClips(fetched);
          }
        } catch {
          // Ignore
        }
      }

      const clip = clipsList[index] || clipsList[0];
      const resolvedUrl = await resolveAudioClipUrl(clip, forceFreshUrl);
      if (audio.src !== resolvedUrl && !audio.src.endsWith(resolvedUrl)) {
        audio.src = resolvedUrl;
      }
      audio.volume = musicVolume;
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch {
        if (!forceFreshUrl && clip?.file_uri) {
          const freshUrl = await resolveAudioClipUrl(clip, true);
          if (freshUrl && freshUrl !== resolvedUrl) {
            audio.src = freshUrl;
            audio
              .play()
              .then(() => setIsMusicPlaying(true))
              .catch(() => setIsMusicPlaying(false));
            return;
          }
        }
        setIsMusicPlaying(false);
      }
    },
    [audioClips, musicVolume]
  );

  const handleToggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playClipAtIndex(currentTrackIndex);
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, [currentTrackIndex, playClipAtIndex]);

  const handleSwitchTrack = useCallback(
    (direction: 'next' | 'prev') => {
      const total = audioClips.length;
      if (total <= 1) {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        playClipAtIndex(0);
        return;
      }
      const nextIndex =
        direction === 'next'
          ? (currentTrackIndex + 1) % total
          : (currentTrackIndex - 1 + total) % total;
      setCurrentTrackIndex(nextIndex);
      playClipAtIndex(nextIndex);
    },
    [audioClips.length, currentTrackIndex, playClipAtIndex]
  );

  const handleAdjustVolume = useCallback((delta: number) => {
    setMusicVolume((prev) => {
      const next = Math.max(0.05, Math.min(1, Number((prev + delta).toFixed(2))));
      if (audioRef.current) {
        audioRef.current.volume = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // GSAP 3 On-Load Entrance Timeline for the Gates Hero
  useEffect(() => {
    if (route.section !== 'home' || !heroRef.current) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(
        'nav.reveal',
        { y: -14, autoAlpha: 0, duration: 0.7 },
        0.05
      )
        .from(
          '[data-r="headline"] .line',
          { yPercent: 118, duration: 1.15, stagger: 0.12 },
          0.15
        )
        .from(
          '[data-r="body"]',
          { y: 16, autoAlpha: 0, duration: 0.8 },
          0.55
        )
        .from(
          '[data-r="cta"]',
          { y: 14, autoAlpha: 0, duration: 0.75 },
          0.7
        );
    }, heroRef);

    return () => ctx.revert();
  }, [route.section]);

  const refreshOrders = useCallback(async (phone?: string) => {
    const data = await getOrders(phone);
    setOrders(data);
  }, []);

  const syncAllFromBase44 = useCallback(async () => {
    try {
      // Phase 1: Critical home-page content + audio clips first so initial render and audio player are ready immediately
      const [
        catalogData,
        beansData,
        blendsData,
        catsData,
        artsData,
        adsData,
        audioData,
      ] = await Promise.all([
        getCatalogItems(),
        getCoffeeBeans(),
        getCoffeeBlends(),
        getArticleCategories(),
        getArticles(),
        getAds(),
        getAudioClips(),
      ]);
      setCatalogItems(catalogData);
      setBeans(beansData);
      setBlends(blendsData);
      setCategories(catsData);
      setArticles(artsData);
      setAds(adsData);
      if (audioData.length > 0) {
        setAudioClips(audioData);
        setCurrentTrackIndex((prev) => (prev < audioData.length ? prev : 0));
      }

      // Phase 2: Below-the-fold / secondary data after initial render
      setTimeout(async () => {
        try {
          const [pricesData, ordersData] = await Promise.all([
            getCoffeePrices(),
            getOrders(),
          ]);
          setPrices(pricesData);
          setOrders(ordersData);
        } catch {
          // Silent background sync
        }
      }, 600);
    } catch {
      // Silent background sync
    }
  }, []);

  useEffect(() => {
    syncAllFromBase44();
  }, [syncAllFromBase44]);

  const books = catalogItems.filter(
    (item) => (item.item_type || item.type) === 'book'
  );
  const bundleItem = catalogItems.find(
    (item) => (item.item_type || item.type) === 'bundle'
  );
  const courses = catalogItems.filter(
    (item) => (item.item_type || item.type) === 'course'
  );

  const handleOpenCheckout = useCallback((item: CatalogItem) => {
    setCheckoutItem(item);
    trackInitiateCheckout({
      id: item.id,
      name: item.title_ar || item.title_en || item.id,
      category: String(item.type || item.item_type || 'product'),
      price: Number(item.price ?? item.price_egp) || 0,
      currency: item.currency || 'EGP',
    });
  }, []);

  const handleOpenArticleDirect = (article: Article) => {
    navigateToPath(getArticlePath(article));
  };

  const handleLoadBlendIntoCalculator = (blend: CoffeeBlend) => {
    setPresetBlend(blend);
    navigateToPath('/calculators/blend-calculator');
  };

  const handleOrderCreated = (newOrder: OrderRecord) => {
    setOrders((prev) => [
      newOrder,
      ...prev.filter((o) => o.id !== newOrder.id),
    ]);
    // Note: trackConfirmedPurchaseIfEligible checks payment_status === 'paid' || order_status === 'completed'
    trackConfirmedPurchaseIfEligible(newOrder);
  };

  const ArrowIcon = lang === 'ar' ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-white bg-coffee-sketch text-[var(--text)] pb-24">
      {/* When viewing internal pages outside the home hero, render the crisp white sticky top bar */}
      {route.section !== 'home' && (
        <header className="sticky top-0 z-40 px-6 py-4 sm:px-12 lg:px-20 bg-white/95 backdrop-blur-md border-b border-[var(--line)]">
          <GatesNav
            lang={lang}
            activeTab={activeTab}
            ordersCount={orders.length}
            currentCustomer={currentCustomer}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigate={(tab) => handleNavigate(tab)}
            onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            variant="light"
          />
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {route.section === 'home' && (
          <>
            {/* GATES 5SDESIGN FULLSCREEN HERO */}
            <section
              ref={heroRef}
              id="home"
              aria-label="Hero"
              className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--color-bg)]"
            >
              {/* Layer 1 — Full-bleed background video (Gates cloud portal) with WebP poster fallback */}
              <video
                ref={videoRef}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
                src={shouldLoadHeroVideo ? '/media/gates.mp4' : undefined}
                poster="/media/gates-poster.webp"
                autoPlay={shouldLoadHeroVideo}
                loop
                muted
                playsInline
                preload="none"
              />

              {/* Layer 2 — Contrast scrims so white type stays crisp over bright clouds */}
              <div
                aria-hidden="true"
                className="hero-scrim pointer-events-none absolute inset-0"
              />
              <div
                aria-hidden="true"
                className="hero-topwash pointer-events-none absolute inset-x-0 top-0 h-28"
              />

              {/* Layer 3 — Foreground layout */}
              <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 pt-6 pb-10 sm:px-12 sm:pt-7 sm:pb-12 lg:px-20 lg:pb-14">
                <GatesNav
                  lang={lang}
                  activeTab={activeTab}
                  ordersCount={orders.length}
                  currentCustomer={currentCustomer}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onNavigate={(tab) => handleNavigate(tab)}
                  onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                />

                {/* Upper-middle headline block */}
                <div className="mt-14 sm:mt-16 lg:mt-20 max-w-[860px]">
                  <h1
                    data-r="headline"
                    className="text-white font-normal tracking-[-0.03em] leading-[1.18] text-[clamp(2.1rem,4.8vw,4.1rem)]"
                  >
                    <span className="block overflow-hidden pb-1.5">
                      <span className="line block will-change-transform font-['Readex_Pro']">
                        {lang === 'ar'
                          ? 'بوابتك لعالم'
                          : 'Your gateway to the world of'}
                      </span>
                    </span>
                    <span className="block overflow-hidden pb-1.5">
                      <span className="line block will-change-transform font-['Readex_Pro'] font-semibold text-[#f8f8f8]">
                        {lang === 'ar' ? 'القهــوة' : 'Coffee'}
                      </span>
                    </span>
                    <span className="block overflow-hidden pb-1.5">
                      <span className="line block will-change-transform font-['Readex_Pro'] text-right no-underline italic font-bold ml-[6px] mt-[1px] mr-[6px] text-[#f5ecec]">
                        {lang === 'ar'
                          ? 'تبدأ من تجـــارة القهـــوة المصـــرية'
                          : 'Starts at Egyptian Coffee Trade'}
                      </span>
                    </span>
                  </h1>
                </div>

                {/* Lower cluster — body copy and 3 organized transparent CTAs */}
                <div className="mt-auto pt-12 max-w-[560px]">
                  <div data-r="body">
                    <p className="text-[14.5px] sm:text-[15.5px] leading-[1.65] font-normal text-white/90 max-w-[490px]">
                      {lang === 'ar'
                        ? 'منصة رقمية موحدة تجمع أسعار وسلالات البن الأخضر العالمي، الكتب السبعة المرجعية، وحاسبة التوليفات الاحترافية في طبقة واحدة واضحة لصناع وتجار القهوة.'
                        : 'A unified platform bringing green coffee origins, the 7 Reference Volumes, and professional blend engineering into one accessible layer for roasters and traders.'}
                    </p>
                  </div>

                  {/* CTA row: 3 transparent buttons side-by-side on mobile & desktop */}
                  <div
                    data-r="cta"
                    className="mt-7 grid grid-cols-3 gap-2 sm:gap-3 w-full"
                  >
                    <a
                      href="/marckt"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPath('/marckt');
                      }}
                      className="uiverse-btn uiverse-btn-transparent rounded-[8px] font-medium flex items-center justify-center text-center leading-snug w-full"
                    >
                      <span>
                        {lang === 'ar'
                          ? 'تصفح الكتب ومتجرنا'
                          : 'Store & Books'}
                      </span>
                    </a>

                    <a
                      href="/coffee-beans"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPath('/coffee-beans');
                      }}
                      className="bg-transparent border border-white/55 hover:bg-white/15 hover:border-white text-white rounded-[8px] px-2 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center text-center leading-snug"
                    >
                      <span>
                        {lang === 'ar'
                          ? 'موسوعة القهوة'
                          : 'Coffee Encyclopedia'}
                      </span>
                    </a>

                    <a
                      href="/coffee-blends"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPath('/coffee-blends');
                      }}
                      className="bg-transparent border border-white/55 hover:bg-white/15 hover:border-white text-white rounded-[8px] px-2 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-center leading-snug"
                    >
                      <Layers
                        size={14}
                        strokeWidth={1.6}
                        className="text-amber-300 shrink-0 hidden sm:inline"
                      />
                      <span>
                        {lang === 'ar' ? 'قسم التوليفات' : 'Coffee Blends'}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* SEARCH BAR SECTION IMMEDIATELY AFTER THE HERO */}
            <section
              aria-label={lang === 'ar' ? 'شريط البحث السريع' : 'Quick Search'}
              className="py-6 sm:py-8 px-6 bg-[var(--bg-soft)] border-b border-[var(--line)]"
            >
              <div className="max-w-[1200px] mx-auto">
                <SearchBar
                  lang={lang}
                  catalogItems={catalogItems}
                  beans={beans}
                  articles={articles}
                  onNavigate={handleNavigate}
                  onSelectOrderItem={(item) => handleOpenCheckout(item)}
                />
              </div>
            </section>

            {/* 3D COVERFLOW DIGITAL LIBRARY SECTION */}
            <BookCoverflow
              books={books}
              bundleItem={bundleItem}
              lang={lang}
              onBuyItem={(item) => handleOpenCheckout(item)}
              onOpenStore={() => navigateToPath('/marckt')}
              onOpenBookDetail={(item) => navigateToPath(getBookPath(item))}
            />

            {/* SMART BLEND COST CALCULATOR & ANALYZER SECTION */}
            <BlendCalculator
              lang={lang}
              beans={beans}
              presetBlend={presetBlend}
              onClearPreset={() => setPresetBlend(null)}
              activeSubRoute="blend-calculator"
              onSelectSubRoute={(sub) => navigateToPath(`/calculators/${sub}`)}
            />

            {/* LIVE BLENDS PREVIEW SECTION ON HOME PAGE */}
            <section className="py-12 md:py-20 bg-[var(--bg)] border-t border-[var(--line)] overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-[1200px] mx-auto px-6 space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                      <Layers
                        size={18}
                        strokeWidth={1.6}
                        className="text-purple-600"
                      />
                      <span>
                        {lang === 'ar'
                          ? `موسوعة التوليفات التجارية (${blends.length} توليفة · 100%)`
                          : `Commercial Blends (${blends.length} Blends · 100%)`}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text)]">
                      {lang === 'ar' ? 'قسم التوليفات' : 'Coffee Blends'}
                    </h2>
                  </div>

                  <a
                    href="/coffee-blends"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/coffee-blends');
                    }}
                    className="btn-secondary text-xs sm:text-sm px-5 py-2.5 self-start sm:self-auto"
                  >
                    <span>
                      {lang === 'ar'
                        ? 'تصفح جميع التوليفات'
                        : 'Browse All Coffee Blends'}
                    </span>
                    <ArrowIcon
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#950101]"
                    />
                  </a>
                </div>

                {blends.length === 0 ? (
                  <div className="surface-card p-10 text-center text-sm text-[var(--muted)]">
                    {lang === 'ar'
                      ? 'جاري تحميل التوليفات...'
                      : 'Loading coffee blends...'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blends.slice(0, 3).map((blend) => {
                      const totalPct =
                        blend.ingredients.reduce(
                          (sum, ing) => sum + (Number(ing.percentage) || 0),
                          0
                        ) || 100;

                      return (
                        <div
                          key={blend.id}
                          className="surface-card p-6 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#950101]">
                                  #{blend.blend_number || blend.code}
                                </span>
                                <span>·</span>
                                <span className="font-medium text-[var(--text)]">
                                  {lang === 'ar'
                                    ? blend.category_ar
                                    : blend.category_en}
                                </span>
                              </div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {totalPct}%
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-[var(--text)]">
                              {lang === 'ar' ? blend.name_ar : blend.name_en}
                            </h3>
                            <p className="text-xs text-[var(--muted)] line-clamp-2">
                              {lang === 'ar'
                                ? blend.characteristics_ar ||
                                  blend.flavor_profile_ar
                                : blend.flavor_profile_en ||
                                  blend.characteristics_ar}
                            </p>
                            <div className="bg-[var(--bg-soft)] rounded-[10px] p-3 border border-[var(--line)] divide-y divide-[var(--line)]">
                              {blend.ingredients.map((ing, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between py-1 text-xs"
                                >
                                  <span className="text-[var(--text)] font-medium truncate">
                                    {lang === 'ar'
                                      ? ing.bean_name_ar
                                      : ing.bean_name_en}
                                  </span>
                                  <span className="font-bold text-[#950101] shrink-0 ms-2">
                                    {ing.percentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleLoadBlendIntoCalculator(blend)
                              }
                              className="btn-primary text-xs px-4 py-2 w-full justify-center"
                            >
                              <FlaskConical
                                size={16}
                                strokeWidth={1.6}
                                className="text-amber-400"
                              />
                              <span>
                                {lang === 'ar'
                                  ? 'فتح في حاسبة التوليفات'
                                  : 'Load in Blend Calculator'}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </section>

            {/* LIVE CATEGORIES & ARTICLES SECTION PREVIEW (Editorial List Layout) */}
            <section className="py-12 md:py-20 bg-[var(--bg-soft)] border-t border-[var(--line)] overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-[1200px] mx-auto px-6 space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                      <Newspaper
                        size={18}
                        strokeWidth={1.6}
                        className="text-blue-600"
                      />
                      <span>
                        {lang === 'ar'
                          ? `مركز الأبحاث والدراسات (${categories.length} أقسام معرفية)`
                          : `Research & Knowledge Center (${categories.length} Categories)`}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text)]">
                      {lang === 'ar'
                        ? 'أقسام ومقالات صناعة وتجارة القهوة'
                        : 'Specialized Coffee Trade Categories & Articles'}
                    </h2>
                  </div>

                  <a
                    href="/articles"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/articles');
                    }}
                    className="btn-secondary text-xs sm:text-sm px-5 py-2.5 self-start sm:self-auto"
                  >
                    <span>
                      {lang === 'ar'
                        ? 'تصفح جميع المقالات والأقسام'
                        : 'Browse All Articles & Categories'}
                    </span>
                    <ArrowIcon
                      size={18}
                      strokeWidth={1.5}
                      className="border-[#e51414] text-[#2bbe34]"
                    />
                  </a>
                </div>

                {/* Categories Pills */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, idx) => {
                      const pillBgClasses = [
                        '!bg-[#ffd69c]',
                        '!bg-[#edb1b1]',
                        '!bg-[#e0c297]',
                        '!bg-[#9a9efb]',
                        '!bg-[#b58ff4]',
                        '!bg-[#ffb4e0]',
                        '!bg-[#a3ffde]',
                      ];
                      const bgClass = pillBgClasses[idx] || '';
                      const catHref = getArticleCategoryPath(cat);
                      return (
                        <a
                          key={cat.id}
                          href={catHref}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToPath(catHref);
                          }}
                          className={`chip-pill text-xs ${bgClass}`}
                        >
                          {lang === 'ar'
                            ? cat.name_ar
                            : cat.name_en || cat.name_ar}
                        </a>
                      );
                    })}
                  </div>
                )}

                {articles.length === 0 ? (
                  <div className="surface-card p-10 text-center text-sm text-[var(--muted)]">
                    {lang === 'ar'
                      ? 'لا توجد مقالات منشورة حالياً.'
                      : 'No published articles yet.'}
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                    {articles.slice(0, 6).map((art) => {
                      const directHref = getArticlePath(art);
                      return (
                        <div
                          key={art.id}
                          onClick={() => handleOpenArticleDirect(art)}
                          className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                        >
                          <div className="space-y-1 max-w-3xl">
                            <div className="text-xs text-[var(--accent)] font-medium">
                              {lang === 'ar'
                                ? art.category_name || art.category_name_ar
                                : art.category_name_en || art.category_name}
                              {art.published_date ? (
                                <span className="text-[var(--muted)]">
                                  {' '}
                                  · {art.published_date}
                                </span>
                              ) : (
                                ''
                              )}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-[var(--text)] group-hover:opacity-75 transition-opacity">
                              {lang === 'ar'
                                ? art.title_ar
                                : art.title_en || art.title_ar}
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-2">
                              {lang === 'ar'
                                ? art.summary_ar || art.excerpt_ar
                                : art.excerpt_en || art.summary_ar}
                            </p>
                          </div>

                          <a
                            href={directHref}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenArticleDirect(art);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] shrink-0"
                          >
                            <span>
                              {lang === 'ar' ? 'اقرأ الدراسة' : 'Read Study'}
                            </span>
                            <ArrowIcon size={18} strokeWidth={1.5} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </section>

            {/* LIVE COFFEE MARKET EXCHANGE TICKER BELOW THE LAST SECTION */}
            <MarketTicker prices={prices} beans={beans} lang={lang} />

            {/* DYNAMIC HOMEPAGE ADVERTISING BANNER (CONNECTED TO BASE44 Ad ENTITY) */}
            <AdBannerSection
              ads={ads}
              lang={lang}
              onNavigatePath={navigateToPath}
            />
          </>
        )}

        {(route.section === 'marckt' || route.section === 'store') && (
          <StoreSection
            catalogItems={catalogItems}
            lang={lang}
            onBuyItem={(item) => handleOpenCheckout(item)}
            activeSlug={route.slug}
            routePrefix={route.section}
            onNavigatePath={navigateToPath}
          />
        )}

        {route.section === 'books' &&
          (route.slug ? (
            <StoreSection
              catalogItems={catalogItems}
              lang={lang}
              onBuyItem={(item) => handleOpenCheckout(item)}
              activeSlug={route.slug}
              initialFilter="books"
              routePrefix="books"
              onNavigatePath={navigateToPath}
            />
          ) : (
            <>
              <BookCoverflow
                books={books}
                bundleItem={bundleItem}
                lang={lang}
                onBuyItem={(item) => handleOpenCheckout(item)}
                onOpenStore={() => navigateToPath('/marckt')}
                onOpenBookDetail={(item) => navigateToPath(getBookPath(item))}
              />
              <StoreSection
                catalogItems={catalogItems}
                lang={lang}
                onBuyItem={(item) => handleOpenCheckout(item)}
                initialFilter="books"
                routePrefix="books"
                onNavigatePath={navigateToPath}
              />
            </>
          ))}

        {route.section === 'courses' &&
          (route.slug ? (
            <StoreSection
              catalogItems={catalogItems}
              lang={lang}
              onBuyItem={(item) => handleOpenCheckout(item)}
              activeSlug={route.slug}
              initialFilter="courses"
              routePrefix="courses"
              onNavigatePath={navigateToPath}
            />
          ) : (
            <CoursesSection
              courses={courses}
              lang={lang}
              onBuyCourse={(course) => handleOpenCheckout(course)}
              onOpenCourse={(course) => navigateToPath(getCoursePath(course))}
            />
          ))}

        {route.section === 'calculators' && (
          <BlendCalculator
            lang={lang}
            beans={beans}
            presetBlend={presetBlend}
            onClearPreset={() => setPresetBlend(null)}
            activeSubRoute={route.calculatorSubRoute || 'blend-calculator'}
            onSelectSubRoute={(sub) => navigateToPath(`/calculators/${sub}`)}
          />
        )}

        {route.section === 'coffee-beans' && (
          <BeansEncyclopedia
            beans={beans}
            lang={lang}
            initialSearch={globalSearchQuery}
            activeSlug={route.slug}
            onNavigatePath={navigateToPath}
          />
        )}

        {route.section === 'coffee-blends' && (
          <BlendsEncyclopedia
            blends={blends}
            lang={lang}
            initialSearch={globalSearchQuery}
            onLoadInCalculator={handleLoadBlendIntoCalculator}
            activeSlug={route.slug}
            onNavigatePath={navigateToPath}
          />
        )}

        {route.section === 'articles' && (
          <ArticlesSection
            categories={categories}
            articles={articles}
            lang={lang}
            initialSearch={globalSearchQuery}
            initialArticleSlug={route.slug || ''}
            initialCategorySlug={route.categorySlug || ''}
            onClearInitialArticle={() => navigateToPath('/articles')}
            onNavigatePath={navigateToPath}
          />
        )}

        {(route.section === 'orders' || route.section === 'track-order') && (
          <OrdersSection
            orders={orders}
            catalogItems={catalogItems}
            lang={lang}
            initialQuery={globalSearchQuery}
            currentCustomer={currentCustomer}
            onOpenCustomerAuth={() => setIsAuthModalOpen(true)}
            onLogoutCustomer={() => {
              logoutCustomerAccount();
              setCurrentCustomer(null);
              refreshOrders('');
            }}
            onRefreshOrders={refreshOrders}
            onNewOrderClick={(item) => handleOpenCheckout(item)}
          />
        )}

        {route.section === 'about' && <AboutUsPage lang={lang} />}

        {route.section === 'contact' && <ContactUsPage lang={lang} />}

        {route.section === 'privacy' && <PrivacyTermsPage lang={lang} />}

        {route.section === 'not-found' && (
          <NotFoundPage
            lang={lang}
            onGoHome={() => navigateToPath('/')}
          />
        )}
      </main>

      {/* Footer: Crisp White with Transparent Black Drawn Line-Art, 4 Columns */}
      <footer className="border-t border-[var(--line)] bg-white bg-coffee-sketch pt-12 pb-20 w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand + Short Blurb */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <picture className="shrink-0">
                  <source srcSet="/media/logo-96w.webp" type="image/webp" />
                  <img
                    src="/assets/aistudio/_______20013552.png"
                    alt="Egyptian Coffee Trade"
                    width={80}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 sm:w-20 sm:h-24 object-contain shrink-0"
                  />
                </picture>
                <div className="min-w-0">
                  <div className="font-display text-lg sm:text-xl font-semibold text-[var(--text)]">
                    {lang === 'ar'
                      ? 'تجـــارة القهـــوة المصـــرية'
                      : 'Egyptian Coffee Trade'}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted)]">
                {lang === 'ar'
                  ? 'المرجع العلمي والتجاري الأول لصناع وتجار البن في مصر والعالم العربي: موسوعة البن، حاسبة التوليفات الاحترافية، والكتب السبعة.'
                  : 'The premier scientific and commercial reference for coffee roasters and traders: Bean Encyclopedia, Smart Blend Calculator, and the 7 Books.'}
              </p>
            </div>

            {/* Column 2: روابط الصفحات — شفاف بدون ألوان */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-[var(--text)]">
                {lang === 'ar' ? 'روابط الصفحات' : 'Page Links'}
              </h3>
              <ul className="flex flex-wrap gap-2 text-xs">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'الرئيسية' : 'Home'}
                  </a>
                </li>
                <li>
                  <a
                    href="/marckt"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/marckt');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'متجرنا الشامل' : 'Our Store'}
                  </a>
                </li>
                <li>
                  <a
                    href="/coffee-beans"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/coffee-beans');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'موسوعة البن' : 'Bean Encyclopedia'}
                  </a>
                </li>
                <li>
                  <a
                    href="/coffee-blends"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/coffee-blends');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'قسم التوليفات' : 'Coffee Blends'}
                  </a>
                </li>
                <li>
                  <a
                    href="/calculators"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/calculators');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'حاسبة التوليفات' : 'Blend Calculator'}
                  </a>
                </li>
                <li>
                  <a
                    href="/books"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/books');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'الكتب السبعة' : 'The Seven Books'}
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/courses');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar' ? 'الدورات التدريبية' : 'Courses'}
                  </a>
                </li>
                <li>
                  <a
                    href="/articles"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/articles');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar'
                      ? 'الأقسام السبعة والمقالات'
                      : 'Articles & 7 Pillars'}
                  </a>
                </li>
                <li>
                  <a
                    href="/orders"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToPath('/orders');
                    }}
                    className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer inline-block"
                  >
                    {lang === 'ar'
                      ? `طلباتي (${orders.length})`
                      : `Orders (${orders.length})`}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: قنوات التواصل — أيقونات فقط بشكل أفقي ومرتب */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-[var(--text)]">
                {lang === 'ar' ? 'قنوات التواصل' : 'Contact Channels'}
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={SOCIAL_LINKS.whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${SOCIAL_LINKS.whatsappGeneralDisplay}`}
                  title={SOCIAL_LINKS.whatsappGeneralDisplay}
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <WhatsAppBrandIcon className="w-7 h-7" />
                </a>

                <a
                  href={SOCIAL_LINKS.whatsappBusiness}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp Business ${SOCIAL_LINKS.whatsappBusinessDisplay}`}
                  title={SOCIAL_LINKS.whatsappBusinessDisplay}
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <WhatsAppBrandIcon className="w-7 h-7" />
                </a>

                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook - Egyptian Coffee Trade"
                  title="Facebook"
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <FacebookBrandIcon className="w-7 h-7" />
                </a>

                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram @${SOCIAL_LINKS.instagramHandle}`}
                  title={`@${SOCIAL_LINKS.instagramHandle}`}
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <InstagramBrandIcon className="w-7 h-7" />
                </a>

                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TikTok ${SOCIAL_LINKS.tiktokHandle}`}
                  title={SOCIAL_LINKS.tiktokHandle}
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <TikTokBrandIcon className="w-7 h-7" />
                </a>

                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`YouTube ${SOCIAL_LINKS.youtubeHandle}`}
                  title={SOCIAL_LINKS.youtubeHandle}
                  className="inline-flex items-center justify-center rounded-xl p-1.5 border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-black hover:-translate-y-0.5 transition-all"
                >
                  <YouTubeBrandIcon className="w-7 h-7" />
                </a>
              </div>
            </div>

            {/* Column 4: Legal Links — شفاف بدون ألوان */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-[var(--text)]">
                {lang === 'ar'
                  ? 'الشؤون القانونية والتعريفية'
                  : 'Legal & About'}
              </h3>
              <div className="flex flex-col items-start gap-2 text-xs">
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPath('/about');
                  }}
                  className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-2 px-3.5 w-full flex items-center justify-between text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'من نحن' : 'About Us'}</span>
                  <ArrowIcon
                    size={16}
                    strokeWidth={1.6}
                    className="text-amber-600"
                  />
                </a>

                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPath('/contact');
                  }}
                  className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-2 px-3.5 w-full flex items-center justify-between text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
                  <PhoneCall
                    size={16}
                    strokeWidth={1.6}
                    className="text-sky-600 shrink-0"
                  />
                </a>

                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPath('/privacy');
                  }}
                  className="bg-transparent border border-black/15 hover:border-black/45 text-[var(--text)] rounded-[8px] py-2 px-3.5 w-full flex items-center justify-between text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>
                    {lang === 'ar'
                      ? 'سياسة الخصوصية والشروط والأحكام'
                      : 'Privacy Policy & Terms'}
                  </span>
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.6}
                    className="text-emerald-600 shrink-0"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
            <div className="text-center sm:text-start">
              {lang === 'ar' ? (
                <>
                  جميع الحقوق محفوظة ©{' '}
                  <span className="font-medium text-[var(--text)]">2026</span>{' '}
                  تجـــارة القهـــوة المصـــرية
                </>
              ) : (
                <>
                  All rights reserved ©{' '}
                  <span className="font-medium text-[var(--text)]">2026</span>{' '}
                  Egyptian Coffee Trade
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/about');
                }}
                className="bg-transparent border border-transparent hover:border-black/25 text-[var(--text)] rounded-[8px] py-1 px-3 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'من نحن' : 'About Us'}
              </a>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/contact');
                }}
                className="bg-transparent border border-transparent hover:border-black/25 text-[var(--text)] rounded-[8px] py-1 px-3 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('/privacy');
                }}
                className="bg-transparent border border-transparent hover:border-black/25 text-[var(--text)] rounded-[8px] py-1 px-3 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'ar'
                  ? 'سياسة الخصوصية والشروط والأحكام'
                  : 'Privacy Policy & Terms'}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal for Books, Full Bundle, Courses & Other Products */}
      <CheckoutModal
        item={checkoutItem}
        lang={lang}
        currentCustomer={currentCustomer}
        onOpenCustomerAuth={() => setIsAuthModalOpen(true)}
        onClose={() => setCheckoutItem(null)}
        onOrderSuccess={(ord) => {
          handleOrderCreated(ord);
        }}
        onGoToOrders={(orderNumber) => navigateToPath('/orders', orderNumber)}
      />

      {/* Optional Customer Login / Register Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        lang={lang}
        currentCustomer={currentCustomer}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthChange={(cust) => {
          setCurrentCustomer(cust);
          refreshOrders('');
        }}
      />

      {/* Persistent Audio Player from Base44 AudioClip & Clean Icon-Only Bottom Controller */}
      <audio
        ref={audioRef}
        loop={audioClips.length <= 1}
        preload="none"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onEnded={() => {
          if (audioClips.length > 1) {
            handleSwitchTrack('next');
          }
        }}
      />

      <div
        dir="ltr"
        title={activeAudioTitle}
        className={`fixed bottom-20 left-3 sm:bottom-20 sm:left-6 z-50 rounded-full px-2 py-1.5 shadow-lg backdrop-blur-md border bg-white/95 text-[#111111] border-black/15 hover:border-black/35 transition-all duration-300 flex items-center gap-1 select-none ${
          isPastHero
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Play / Pause Button (Icon Only — No Text, Same Clean Color) */}
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={
            isMusicPlaying
              ? lang === 'ar'
                ? 'إيقاف الصوت'
                : 'Pause Audio'
              : lang === 'ar'
              ? 'تشغيل الصوت'
              : 'Play Audio'
          }
          title={activeAudioTitle}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-[#950101]/10 hover:bg-[#950101]/20 text-[#950101]"
        >
          {isMusicPlaying ? (
            <Pause size={15} strokeWidth={2.4} className="text-[#950101] shrink-0" />
          ) : (
            <Play size={15} strokeWidth={2.4} className="text-[#950101] fill-[#950101] ml-0.5 shrink-0" />
          )}
        </button>

        {/* Track Switching Controls (Prev / Next AudioClip) */}
        <div className="flex items-center gap-0.5 px-1 border-x border-black/10">
          <button
            type="button"
            onClick={() => handleSwitchTrack('prev')}
            aria-label={lang === 'ar' ? 'المقطع السابق' : 'Previous Track'}
            title={lang === 'ar' ? 'المقطع السابق' : 'Previous Track'}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 text-[#111111]/80 hover:text-[#111111]"
          >
            <SkipBack size={13} strokeWidth={2.1} />
          </button>

          {isMusicPlaying && (
            <span className="flex items-end gap-[2px] h-3 px-1">
              <span className="w-[2px] h-full bg-[#950101] rounded-full music-bar-1" />
              <span className="w-[2px] h-full bg-[#950101] rounded-full music-bar-2" />
              <span className="w-[2px] h-full bg-[#950101] rounded-full music-bar-3" />
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSwitchTrack('next')}
            aria-label={lang === 'ar' ? 'المقطع التالي' : 'Next Track'}
            title={lang === 'ar' ? 'المقطع التالي' : 'Next Track'}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 text-[#111111]/80 hover:text-[#111111]"
          >
            <SkipForward size={13} strokeWidth={2.1} />
          </button>
        </div>

        {/* Volume Down / Volume Level / Volume Up Controls */}
        <div className="flex items-center gap-0.5 pl-0.5">
          <button
            type="button"
            onClick={() => handleAdjustVolume(-0.15)}
            aria-label={lang === 'ar' ? 'خفض الصوت' : 'Volume Down'}
            title={lang === 'ar' ? 'خفض الصوت' : 'Volume Down'}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 text-[#111111]/75 hover:text-[#111111]"
          >
            <Volume1 size={14} strokeWidth={2} />
          </button>

          {/* Mini 4-step volume level indicator */}
          <div className="flex items-end gap-[2px] h-3 px-0.5" aria-hidden="true">
            {[0.25, 0.5, 0.75, 1].map((threshold, idx) => {
              const active = musicVolume >= threshold - 0.1;
              return (
                <span
                  key={threshold}
                  style={{ height: `${(idx + 1) * 25}%` }}
                  className={`w-[2px] rounded-full transition-colors ${
                    active ? 'bg-[#950101]' : 'bg-black/15'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleAdjustVolume(0.15)}
            aria-label={lang === 'ar' ? 'رفع الصوت' : 'Volume Up'}
            title={lang === 'ar' ? 'رفع الصوت' : 'Volume Up'}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 text-[#111111]/75 hover:text-[#111111]"
          >
            <Volume2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <DockNav
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        lang={lang}
        ordersCount={orders.length}
      />
    </div>
  );
}
