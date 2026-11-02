import {
  ArticleItem,
  ArticleCategoryItem,
  CatalogItemSlugInput,
  CoffeeBeanItem,
  CoffeeBlendItem,
} from '../types/coffee';

export const SITE_URL = 'https://www.egcoffee.pro';

/**
 * Dictionary of common Arabic coffee & trade phrases to clean English SEO terms
 */
const ARABIC_WORD_MAP: Record<string, string> = {
  'القهوة': 'coffee',
  'قهوة': 'coffee',
  'البن': 'coffee-beans',
  'بن': 'coffee',
  'الأخضر': 'green',
  'الاخضر': 'green',
  'أخضر': 'green',
  'اخضر': 'green',
  'التحميص': 'roasting',
  'تحميص': 'roasting',
  'المحمصة': 'roastery',
  'محمصة': 'roastery',
  'المحامص': 'roasteries',
  'توليفة': 'blend',
  'التوليفة': 'blend',
  'توليفات': 'blends',
  'التوليفات': 'blends',
  'خلطة': 'blend',
  'الخلطة': 'blend',
  'تخزين': 'storage',
  'التخزين': 'storage',
  'تجارة': 'trading',
  'التجارة': 'trading',
  'كتاب': 'book',
  'الكتاب': 'book',
  'كتب': 'books',
  'الكتب': 'books',
  'موسوعة': 'encyclopedia',
  'الموسوعة': 'encyclopedia',
  'باقة': 'bundle',
  'الباقة': 'bundle',
  'كاملة': 'complete',
  'الكاملة': 'complete',
  'شاملة': 'complete',
  'الشاملة': 'complete',
  'دورة': 'course',
  'الدورة': 'course',
  'كورس': 'course',
  'الكورس': 'course',
  'أساسيات': 'basics',
  'اساسيات': 'basics',
  'احتراف': 'mastery',
  'الاحتراف': 'mastery',
  'سوق': 'market',
  'السوق': 'market',
  'مصر': 'egypt',
  'المصري': 'egyptian',
  'المصرية': 'egyptian',
  'إسبريسو': 'espresso',
  'اسبريسو': 'espresso',
  'تركي': 'turkish',
  'التركي': 'turkish',
  'تركية': 'turkish',
  'مختصة': 'specialty',
  'المختصة': 'specialty',
  'أرابيكا': 'arabica',
  'ارابيكا': 'arabica',
  'روبوستا': 'robusta',
  'البرازيل': 'brazil',
  'برازيلي': 'brazilian',
  'إثيوبيا': 'ethiopia',
  'اثيوبيا': 'ethiopia',
  'إثيوبي': 'ethiopian',
  'اثيوبي': 'ethiopian',
  'كولومبيا': 'colombia',
  'كولومبي': 'colombian',
  'فيتنام': 'vietnam',
  'فيتنامي': 'vietnamese',
  'إندونيسيا': 'indonesia',
  'اندونيسيا': 'indonesia',
  'اليمن': 'yemen',
  'يمني': 'yemeni',
  'كينيا': 'kenya',
  'كيني': 'kenyan',
  'غواتيمالا': 'guatemala',
  'أوغندا': 'uganda',
  'اوغندا': 'uganda',
  'الهند': 'india',
  'هندي': 'indian',
  'عيوب': 'defects',
  'العيوب': 'defects',
  'جودة': 'quality',
  'الجودة': 'quality',
  'رطوبة': 'moisture',
  'الرطوبة': 'moisture',
  'كثافة': 'density',
  'الكثافة': 'density',
  'استخلاص': 'extraction',
  'الاستخلاص': 'extraction',
  'طحن': 'grinding',
  'الطحن': 'grinding',
  'درجات': 'degrees',
  'درجة': 'degree',
  'حرارة': 'temperature',
  'الحرارة': 'temperature',
  'تسعير': 'pricing',
  'التسعير': 'pricing',
  'تكلفة': 'cost',
  'التكلفة': 'cost',
  'ربح': 'profit',
  'الربح': 'profit',
  'هامش': 'margin',
  'الهدر': 'loss',
  'هدر': 'loss',
  'فقد': 'loss',
  'الفقد': 'loss',
  'إدارة': 'management',
  'ادارة': 'management',
  'مشروع': 'business',
  'تأسيس': 'starting',
  'تاسيس': 'starting',
  'كافيه': 'cafe',
  'مقهى': 'cafe',
  'تذوق': 'cupping',
  'التذوق': 'cupping',
  'سلسلة': 'series',
  'السلسلة': 'series',
  'جزء': 'part',
  'الجزء': 'part',
  'أول': '1',
  'الأول': '1',
  'الاول': '1',
  'ثاني': '2',
  'الثاني': '2',
  'ثالث': '3',
  'الثالث': '3',
  'رابع': '4',
  'الرابع': '4',
  'خامس': '5',
  'الخامس': '5',
  'دليل': 'guide',
  'الدليل': 'guide',
  'شامل': 'comprehensive',
  'الشامل': 'comprehensive',
  'كامل': 'complete',
  'الكامل': 'complete',
  'سر': 'secret',
  'أسرار': 'secrets',
  'اسرار': 'secrets',
  'كيف': 'how-to',
  'طريقة': 'method',
  'أفضل': 'best',
  'افضل': 'best',
  'انواع': 'types',
  'أنواع': 'types',
  'الفرق': 'difference',
  'بين': 'between',
  'تاريخ': 'history',
  'معدات': 'equipment',
  'أدوات': 'tools',
  'ادوات': 'tools',
  'ماكينة': 'machine',
  'تعبئة': 'packaging',
  'تغليف': 'packaging',
  'استيراد': 'importing',
  'تصدير': 'exporting',
  'بورصة': 'exchange',
  'أسعار': 'prices',
  'اسعار': 'prices',
};

/**
 * Arabic character to Latin phonetic transliteration map
 */
const ARABIC_CHAR_MAP: Record<string, string> = {
  'ا': 'a',
  'أ': 'a',
  'إ': 'e',
  'آ': 'aa',
  'ب': 'b',
  'ت': 't',
  'ث': 'th',
  'ج': 'g',
  'ح': 'h',
  'خ': 'kh',
  'د': 'd',
  'ذ': 'z',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sh',
  'ص': 's',
  'ض': 'd',
  'ط': 't',
  'ظ': 'z',
  'ع': 'a',
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'ة': 'a',
  'و': 'w',
  'ؤ': 'o',
  'ي': 'y',
  'ى': 'a',
  'ئ': 'e',
  'ء': '',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

const STOP_WORDS = new Set([
  'في', 'من', 'إلى', 'الى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك',
  'الذي', 'التي', 'كل', 'بعض', 'أو', 'او', 'ثم', 'بل', 'لا', 'ما', 'هل',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'and', 'or', 'the', 'a', 'an',
]);

/**
 * Converts any string (English or Arabic) into a clean, lowercase, hyphen-separated ASCII slug.
 */
export function slugifyText(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';

  // Remove Arabic diacritics (tashkeel) and tatweel
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

  // If the string already looks like a clean ASCII slug or English phrase
  const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
  if (!hasArabic) {
    return cleaned
      .replace(/['"’`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  // Tokenize words, translate known Arabic coffee vocabulary first, transliterate remaining
  const rawTokens = cleaned
    .replace(/[^\u0600-\u06FFa-z0-9\s-]+/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean);

  const translatedTokens: string[] = [];

  for (const token of rawTokens) {
    if (STOP_WORDS.has(token) && rawTokens.length > 2) {
      continue;
    }

    // Check direct match
    if (ARABIC_WORD_MAP[token]) {
      translatedTokens.push(ARABIC_WORD_MAP[token]);
      continue;
    }

    // Check without leading "و" (and) or "ب" / "ل" / "ك"
    if (token.length > 3 && (token.startsWith('و') || token.startsWith('ب') || token.startsWith('ل'))) {
      const stripped = token.slice(1);
      if (ARABIC_WORD_MAP[stripped]) {
        translatedTokens.push(ARABIC_WORD_MAP[stripped]);
        continue;
      }
    }

    // Check if pure ASCII
    if (/^[a-z0-9]+$/.test(token)) {
      translatedTokens.push(token);
      continue;
    }

    // Transliterate Arabic characters to Latin ASCII
    let latin = '';
    let wordToTranslit = token;
    if (wordToTranslit.startsWith('ال') && wordToTranslit.length > 3) {
      wordToTranslit = wordToTranslit.slice(2);
    }
    for (const ch of wordToTranslit) {
      if (ARABIC_CHAR_MAP[ch] !== undefined) {
        latin += ARABIC_CHAR_MAP[ch];
      } else if (/[a-z0-9]/.test(ch)) {
        latin += ch;
      }
    }
    if (latin) {
      translatedTokens.push(latin);
    }
  }

  // Deduplicate adjacent identical tokens (e.g., "coffee-coffee")
  const deduped: string[] = [];
  for (const t of translatedTokens) {
    const parts = t.split('-').filter(Boolean);
    for (const p of parts) {
      if (deduped[deduped.length - 1] !== p) {
        deduped.push(p);
      }
    }
  }

  return deduped
    .slice(0, 8)
    .join('-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Generates or normalizes a deterministic, clean slug for a CatalogItem (Book, Bundle, Course, Product)
 */
export function getCatalogItemSlug(item: CatalogItemSlugInput): string {
  if (item.slug && typeof item.slug === 'string' && item.slug.trim()) {
    const cleanExplicit = slugifyText(item.slug);
    if (cleanExplicit) return cleanExplicit;
  }
  const fromEn = slugifyText(item.title_en);
  if (fromEn && fromEn.length >= 3) return fromEn;

  const fromAr = slugifyText(item.title_ar);
  if (fromAr && fromAr.length >= 3) return fromAr;

  return slugifyText(item.id) || `item-${item.volume_number || 1}`;
}

/**
 * Generates or normalizes a deterministic, clean slug for an ArticleItem
 */
export function getArticleSlug(article: ArticleItem): string {
  if (article.slug && typeof article.slug === 'string' && article.slug.trim()) {
    const cleanExplicit = slugifyText(article.slug);
    if (cleanExplicit) return cleanExplicit;
  }
  const fromEn = slugifyText(article.title_en);
  if (fromEn && fromEn.length >= 3) return fromEn;

  const fromAr = slugifyText(article.title_ar);
  if (fromAr && fromAr.length >= 3) return fromAr;

  return slugifyText(article.id) || 'article';
}

/**
 * Generates or normalizes a deterministic, clean slug for an ArticleCategoryItem
 */
export function getArticleCategorySlug(category: ArticleCategoryItem | string): string {
  if (typeof category === 'string') {
    return slugifyText(category) || 'general';
  }
  if (category.slug && typeof category.slug === 'string' && category.slug.trim()) {
    const cleanExplicit = slugifyText(category.slug);
    if (cleanExplicit) return cleanExplicit;
  }
  const fromEn = slugifyText(category.name_en);
  if (fromEn) return fromEn;

  const fromAr = slugifyText(category.name_ar);
  if (fromAr) return fromAr;

  return slugifyText(category.id) || 'category';
}

/**
 * Generates or normalizes a deterministic, clean slug for a CoffeeBeanItem
 */
export function getBeanSlug(bean: CoffeeBeanItem): string {
  const anyBean = bean as CoffeeBeanItem & { slug?: string };
  if (anyBean.slug && typeof anyBean.slug === 'string' && anyBean.slug.trim()) {
    const cleanExplicit = slugifyText(anyBean.slug);
    if (cleanExplicit) return cleanExplicit;
  }
  const fromEn = slugifyText(bean.name_en);
  if (fromEn) return fromEn;

  const fromAr = slugifyText(bean.name_ar);
  if (fromAr) return fromAr;

  return slugifyText(bean.id) || 'bean';
}

/**
 * Generates or normalizes a deterministic, clean slug for a CoffeeBlendItem
 */
export function getBlendSlug(blend: CoffeeBlendItem): string {
  const anyBlend = blend as CoffeeBlendItem & { slug?: string };
  if (anyBlend.slug && typeof anyBlend.slug === 'string' && anyBlend.slug.trim()) {
    const cleanExplicit = slugifyText(anyBlend.slug);
    if (cleanExplicit) return cleanExplicit;
  }
  const fromEn = slugifyText(blend.name_en);
  if (fromEn) return fromEn;

  const fromAr = slugifyText(blend.name_ar);
  if (fromAr) return fromAr;

  return slugifyText(blend.id) || 'blend';
}

/**
 * Matches a record by slug (checking explicit slug, generated slug, raw Arabic slug, or ID for backward compatibility)
 */
export function matchesCatalogItemSlug(item: CatalogItemSlugInput, targetSlug: string): boolean {
  const decoded = decodeURIComponent(targetSlug).trim().toLowerCase();
  const normalizedTarget = slugifyText(decoded);
  const itemSlug = getCatalogItemSlug(item);

  return (
    itemSlug === decoded ||
    itemSlug === normalizedTarget ||
    (item.slug ? item.slug.trim().toLowerCase() === decoded : false) ||
    slugifyText(item.title_en) === normalizedTarget ||
    slugifyText(item.title_ar) === normalizedTarget ||
    item.id.toLowerCase() === decoded
  );
}

export function matchesArticleSlug(article: ArticleItem, targetSlug: string): boolean {
  const decoded = decodeURIComponent(targetSlug).trim().toLowerCase();
  const normalizedTarget = slugifyText(decoded);
  const articleSlug = getArticleSlug(article);

  return (
    articleSlug === decoded ||
    articleSlug === normalizedTarget ||
    (article.slug ? article.slug.trim().toLowerCase() === decoded : false) ||
    slugifyText(article.title_en) === normalizedTarget ||
    slugifyText(article.title_ar) === normalizedTarget ||
    article.id.toLowerCase() === decoded
  );
}

export function matchesCategorySlug(category: ArticleCategoryItem, targetSlug: string): boolean {
  const decoded = decodeURIComponent(targetSlug).trim().toLowerCase();
  const normalizedTarget = slugifyText(decoded);
  const catSlug = getArticleCategorySlug(category);

  return (
    catSlug === decoded ||
    catSlug === normalizedTarget ||
    (category.slug ? category.slug.trim().toLowerCase() === decoded : false) ||
    slugifyText(category.name_en) === normalizedTarget ||
    slugifyText(category.name_ar) === normalizedTarget ||
    category.name_ar.trim().toLowerCase() === decoded ||
    category.id.toLowerCase() === decoded
  );
}

export function matchesBeanSlug(bean: CoffeeBeanItem, targetSlug: string): boolean {
  const decoded = decodeURIComponent(targetSlug).trim().toLowerCase();
  const normalizedTarget = slugifyText(decoded);
  const beanSlug = getBeanSlug(bean);

  return (
    beanSlug === decoded ||
    beanSlug === normalizedTarget ||
    slugifyText(bean.name_en) === normalizedTarget ||
    slugifyText(bean.name_ar) === normalizedTarget ||
    bean.id.toLowerCase() === decoded
  );
}

export function matchesBlendSlug(blend: CoffeeBlendItem, targetSlug: string): boolean {
  const decoded = decodeURIComponent(targetSlug).trim().toLowerCase();
  const normalizedTarget = slugifyText(decoded);
  const blendSlug = getBlendSlug(blend);

  return (
    blendSlug === decoded ||
    blendSlug === normalizedTarget ||
    slugifyText(blend.name_en) === normalizedTarget ||
    slugifyText(blend.name_ar) === normalizedTarget ||
    blend.id.toLowerCase() === decoded
  );
}

/**
 * Canonical URL path builders
 */
export function getCatalogItemPath(item: CatalogItemSlugInput, preferredPrefix?: 'marckt' | 'books' | 'courses' | 'store'): string {
  const slug = getCatalogItemSlug(item);
  if (preferredPrefix) {
    return `/${preferredPrefix}/${slug}`;
  }
  return `/marckt/${slug}`;
}

export function getBookPath(item: CatalogItemSlugInput): string {
  return `/books/${getCatalogItemSlug(item)}`;
}

export function getCoursePath(item: CatalogItemSlugInput): string {
  return `/courses/${getCatalogItemSlug(item)}`;
}

export function getArticlePath(article: ArticleItem): string {
  return `/articles/${getArticleSlug(article)}`;
}

export function getArticleCategoryPath(category: ArticleCategoryItem | string): string {
  return `/articles/category/${getArticleCategorySlug(category)}`;
}

export function getBeanPath(bean: CoffeeBeanItem): string {
  return `/coffee-beans/${getBeanSlug(bean)}`;
}

export function getBlendPath(blend: CoffeeBlendItem): string {
  return `/coffee-blends/${getBlendSlug(blend)}`;
}

export type CalculatorSubRoute = 'blend-calculator' | 'roasting-loss' | 'roasted-coffee-cost';

export interface ParsedRoute {
  section:
    | 'home'
    | 'marckt'
    | 'store'
    | 'books'
    | 'courses'
    | 'articles'
    | 'coffee-beans'
    | 'coffee-blends'
    | 'calculators'
    | 'orders'
    | 'track-order'
    | 'about'
    | 'contact'
    | 'privacy'
    | 'not-found';
  slug?: string;
  categorySlug?: string;
  calculatorSubRoute?: CalculatorSubRoute;
  canonicalPath: string;
}

/**
 * Parses either a browser pathname (`/marckt/green-coffee-trading`) or hash (`#/marckt/green-coffee-trading`)
 * into a structured route state.
 */
export function parseAppRoute(pathname: string = window.location.pathname, hash: string = window.location.hash): ParsedRoute {
  // Support hash routes like #/marckt/slug or #/articles/slug cleanly
  let effectivePath = pathname || '/';
  if (hash && (hash.startsWith('#/') || hash.startsWith('#!'))) {
    effectivePath = hash.replace(/^#!?/, '');
  }

  // Strip trailing slashes (except root)
  const cleanPath = effectivePath.replace(/\/+$/, '') || '/';
  const segments = cleanPath.split('/').filter(Boolean).map((s) => decodeURIComponent(s));

  if (segments.length === 0) {
    return { section: 'home', canonicalPath: '/' };
  }

  const [first, second, third] = segments;
  const root = first.toLowerCase();

  // Store / Market routes (/marckt and /marckt/:slug)
  if (root === 'marckt') {
    if (!second) {
      return { section: 'marckt', canonicalPath: '/marckt' };
    }
    return {
      section: 'marckt',
      slug: second,
      canonicalPath: `/marckt/${slugifyText(second) || second}`,
    };
  }

  if (root === 'store') {
    if (!second) {
      return { section: 'store', canonicalPath: '/store' };
    }
    return {
      section: 'store',
      slug: second,
      canonicalPath: `/store/${slugifyText(second) || second}`,
    };
  }

  // Books routes (/books and /books/:slug)
  if (root === 'books') {
    if (!second) {
      return { section: 'books', canonicalPath: '/books' };
    }
    return {
      section: 'books',
      slug: second,
      canonicalPath: `/books/${slugifyText(second) || second}`,
    };
  }

  // Courses routes (/courses and /courses/:slug)
  if (root === 'courses') {
    if (!second) {
      return { section: 'courses', canonicalPath: '/courses' };
    }
    return {
      section: 'courses',
      slug: second,
      canonicalPath: `/courses/${slugifyText(second) || second}`,
    };
  }

  // Articles routes (/articles, /articles/category/:slug, /articles/:slug)
  if (root === 'articles') {
    if (!second) {
      return { section: 'articles', canonicalPath: '/articles' };
    }
    if (second.toLowerCase() === 'category' && third) {
      return {
        section: 'articles',
        categorySlug: third,
        canonicalPath: `/articles/category/${slugifyText(third) || third}`,
      };
    }
    return {
      section: 'articles',
      slug: second,
      canonicalPath: `/articles/${slugifyText(second) || second}`,
    };
  }

  // Coffee Beans routes (/coffee-beans, /coffee-beans/:slug, and alias /beans)
  if (root === 'coffee-beans' || root === 'beans') {
    if (!second) {
      return { section: 'coffee-beans', canonicalPath: '/coffee-beans' };
    }
    return {
      section: 'coffee-beans',
      slug: second,
      canonicalPath: `/coffee-beans/${slugifyText(second) || second}`,
    };
  }

  // Coffee Blends routes (/coffee-blends, /coffee-blends/:slug, and alias /blends)
  if (root === 'coffee-blends' || root === 'blends') {
    if (!second) {
      return { section: 'coffee-blends', canonicalPath: '/coffee-blends' };
    }
    return {
      section: 'coffee-blends',
      slug: second,
      canonicalPath: `/coffee-blends/${slugifyText(second) || second}`,
    };
  }

  // Calculators routes (/calculators, /calculators/blend-calculator, /calculators/roasting-loss, /calculators/roasted-coffee-cost)
  if (root === 'calculators' || root === 'calculator') {
    if (!second) {
      return {
        section: 'calculators',
        calculatorSubRoute: 'blend-calculator',
        canonicalPath: '/calculators',
      };
    }
    const sub = second.toLowerCase();
    if (sub === 'blend-calculator' || sub === 'roasting-loss' || sub === 'roasted-coffee-cost') {
      return {
        section: 'calculators',
        calculatorSubRoute: sub as CalculatorSubRoute,
        canonicalPath: `/calculators/${sub}`,
      };
    }
    return {
      section: 'calculators',
      calculatorSubRoute: 'blend-calculator',
      canonicalPath: '/calculators',
    };
  }

  // Orders & Track Order
  if (root === 'orders') {
    return { section: 'orders', canonicalPath: '/orders' };
  }
  if (root === 'track-order') {
    return { section: 'track-order', canonicalPath: '/track-order' };
  }

  // Static pages
  if (root === 'about') {
    return { section: 'about', canonicalPath: '/about' };
  }
  if (root === 'contact') {
    return { section: 'contact', canonicalPath: '/contact' };
  }
  if (root === 'privacy') {
    return { section: 'privacy', canonicalPath: '/privacy' };
  }

  return { section: 'not-found', canonicalPath: cleanPath };
}
