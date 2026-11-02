import {
  ArticleItem,
  CatalogItem,
  CoffeeBeanItem,
  CoffeeBlendItem,
} from '../types/coffee';
import {
  SITE_URL,
  getArticlePath,
  getBeanPath,
  getBlendPath,
  getCatalogItemPath,
} from './slugs';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article' | 'product' | 'book';
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/media/covers/complete-bundle-600w.webp`;

function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(url: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setDynamicJsonLd(data?: Record<string, unknown> | Record<string, unknown>[]): void {
  if (typeof document === 'undefined') return;
  const scriptId = 'egc-dynamic-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

/**
 * Updates document title, meta description, canonical URL, Open Graph, Twitter Cards, and JSON-LD structured data.
 */
export function updatePageSeo(config: SeoConfig): void {
  if (typeof document === 'undefined') return;

  const fullTitle = config.title.includes('تجارة البن في مصر') || config.title.includes('Egyptian Coffee Trade')
    ? config.title
    : `${config.title} | تجارة البن في مصر - Egyptian Coffee Trade`;

  const cleanDescription = (config.description || '')
    .replace(/[#*_`~>\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 165);

  const canonicalUrl = config.canonicalPath.startsWith('http')
    ? config.canonicalPath
    : `${SITE_URL}${config.canonicalPath.startsWith('/') ? config.canonicalPath : `/${config.canonicalPath}`}`;

  const imageUrl = config.ogImage
    ? config.ogImage.startsWith('http')
      ? config.ogImage
      : `${SITE_URL}${config.ogImage.startsWith('/') ? config.ogImage : `/${config.ogImage}`}`
    : DEFAULT_OG_IMAGE;

  document.title = fullTitle;

  setOrCreateMeta('name', 'description', cleanDescription);
  setOrCreateMeta('name', 'robots', config.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

  setCanonicalLink(canonicalUrl);

  // Open Graph
  setOrCreateMeta('property', 'og:title', fullTitle);
  setOrCreateMeta('property', 'og:description', cleanDescription);
  setOrCreateMeta('property', 'og:url', canonicalUrl);
  setOrCreateMeta('property', 'og:type', config.ogType || 'website');
  setOrCreateMeta('property', 'og:image', imageUrl);
  setOrCreateMeta('property', 'og:site_name', 'تجارة البن في مصر | Egyptian Coffee Trade');

  // Twitter Card
  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', fullTitle);
  setOrCreateMeta('name', 'twitter:description', cleanDescription);
  setOrCreateMeta('name', 'twitter:image', imageUrl);

  setDynamicJsonLd(config.jsonLd);
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildCatalogItemJsonLd(
  item: CatalogItem,
  canonicalPath?: string
): Record<string, unknown>[] {
  const path = canonicalPath || getCatalogItemPath(item);
  const fullUrl = `${SITE_URL}${path}`;
  const isCourse = item.type === 'course';
  const isBook = item.type === 'book';

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'الرئيسية', path: '/' },
    {
      name: isCourse ? 'الدورات التدريبية' : isBook ? 'الكتب' : 'المتجر',
      path: isCourse ? '/courses' : isBook ? '/books' : '/marckt',
    },
    { name: item.title_ar || item.title_en || '', path },
  ]);

  if (isCourse) {
    return [
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: item.title_ar || item.title_en,
        alternateName: item.title_en,
        description: item.description_ar || item.description_en,
        url: fullUrl,
        image: item.cover_image,
        provider: {
          '@type': 'Organization',
          name: 'Egyptian Coffee Trade - تجارة البن في مصر',
          sameAs: SITE_URL,
        },
        offers: {
          '@type': 'Offer',
          price: Number(item.price) || 0,
          priceCurrency: item.currency || 'EGP',
          availability: 'https://schema.org/InStock',
          url: fullUrl,
        },
      },
    ];
  }

  return [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': isBook ? ['Product', 'Book'] : 'Product',
      name: item.title_ar || item.title_en,
      alternateName: item.title_en,
      description: item.description_ar || item.description_en,
      image: item.cover_image,
      url: fullUrl,
      ...(isBook
        ? {
            author: {
              '@type': 'Person',
              name: item.author_name || 'كرم فيصل',
            },
            bookFormat: 'https://schema.org/EBook',
            inLanguage: 'ar',
            ...(item.pages_count ? { numberOfPages: item.pages_count } : {}),
          }
        : {}),
      brand: {
        '@type': 'Brand',
        name: 'Egyptian Coffee Trade - تجارة البن في مصر',
      },
      offers: {
        '@type': 'Offer',
        price: Number(item.price) || 0,
        priceCurrency: item.currency || 'EGP',
        availability: 'https://schema.org/InStock',
        url: fullUrl,
      },
    },
  ];
}

export function buildArticleJsonLd(article: ArticleItem): Record<string, unknown>[] {
  const path = getArticlePath(article);
  const fullUrl = `${SITE_URL}${path}`;

  return [
    buildBreadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'المقالات', path: '/articles' },
      { name: article.title_ar || article.title_en || '', path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title_ar || article.title_en,
      alternativeHeadline: article.title_en,
      description: article.summary_ar || article.summary_en || article.title_ar,
      image: article.cover_image ? [article.cover_image] : [`${SITE_URL}/media/covers/complete-bundle-600w.webp`],
      datePublished: article.published_at || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: article.author_name || 'كرم فيصل',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Egyptian Coffee Trade - تجارة البن في مصر',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/media/logo-96w.webp`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
    },
  ];
}

export function buildBeanJsonLd(bean: CoffeeBeanItem): Record<string, unknown>[] {
  const path = getBeanPath(bean);
  const fullUrl = `${SITE_URL}${path}`;

  return [
    buildBreadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'موسوعة حبوب البن', path: '/coffee-beans' },
      { name: bean.name_ar || bean.name_en || '', path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${bean.name_ar} (${bean.name_en}) - موسوعة حبوب البن`,
      description: bean.Recommended_uses_ar || bean.Flavor_notes_ar || `${bean.name_ar} - ${bean.Origin_ar}`,
      mainEntityOfPage: fullUrl,
      author: {
        '@type': 'Organization',
        name: 'Egyptian Coffee Trade - تجارة البن في مصر',
      },
    },
  ];
}

export function buildBlendJsonLd(blend: CoffeeBlendItem): Record<string, unknown>[] {
  const path = getBlendPath(blend);
  const fullUrl = `${SITE_URL}${path}`;

  return [
    buildBreadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'توليفات القهوة', path: '/coffee-blends' },
      { name: blend.name_ar || blend.name_en || '', path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${blend.name_ar} (${blend.name_en}) - توليفات القهوة`,
      description: blend.Usage_ar || blend.Resulting_flavor_ar || blend.name_ar,
      mainEntityOfPage: fullUrl,
      author: {
        '@type': 'Organization',
        name: 'Egyptian Coffee Trade - تجارة البن في مصر',
      },
    },
  ];
}
