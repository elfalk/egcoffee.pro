import { OrderRecord } from '../types/coffee';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const GTM_CONTAINER_ID = 'GTM-T2KCKDLR';
const OPTIONAL_META_PIXEL_ID = ((import.meta.env.VITE_META_PIXEL_ID as string) || '').trim();

const PURCHASE_DEDUP_STORAGE_KEY = 'egc_tracked_paid_orders_v1';

let lastTrackedPagePath = '';
let isInitialPageLoad = true;
let metaPixelInitialized = false;

/**
 * Preserves the existing Google Tag Manager (GTM-T2KCKDLR) installation in index.html
 * and the Meta Pixel (1135528898886821) already managed inside GTM-T2KCKDLR.
 * Does not require VITE_GTM_ID or VITE_META_PIXEL_ID.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  // Meta Pixel is already loaded and managed via GTM-T2KCKDLR.
  // Only initialize a standalone fallback if an optional VITE_META_PIXEL_ID is explicitly provided
  // AND GTM has not initialized window.fbq.
  if (OPTIONAL_META_PIXEL_ID && !metaPixelInitialized && typeof window.fbq !== 'function') {
    metaPixelInitialized = true;
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    const fbqFn = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbqFn === 'function') {
      fbqFn('init', OPTIONAL_META_PIXEL_ID);
    }
  }
}

/**
 * Tracks a virtual SPA page view across Google Tag Manager and Meta Pixel.
 * Deduplicates consecutive identical path calls and avoids double-firing Meta Pixel PageView
 * on initial load (since GTM-T2KCKDLR already fires fbq('track', 'PageView') on initial load).
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const cleanPath = path || window.location.pathname;
  if (lastTrackedPagePath === cleanPath) return;
  lastTrackedPagePath = cleanPath;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: cleanPath,
    page_location: `https://www.egcoffee.pro${cleanPath}`,
    page_title: title || document.title,
  });

  if (isInitialPageLoad) {
    isInitialPageLoad = false;
    return;
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

export interface TrackContentPayload {
  id: string;
  name: string;
  category: 'book' | 'bundle' | 'course' | 'product' | 'article' | 'bean' | 'blend' | 'calculator';
  price?: number;
  currency?: string;
  slug?: string;
}

let lastViewedContentKey = '';

/**
 * Tracks ViewContent when a user views a specific book, course, product, article, bean, or blend.
 */
export function trackViewContent(item: TrackContentPayload): void {
  if (typeof window === 'undefined') return;
  const dedupKey = `${item.category}:${item.id || item.slug || item.name}`;
  if (lastViewedContentKey === dedupKey) return;
  lastViewedContentKey = dedupKey;

  const currency = item.currency || 'EGP';
  const value = typeof item.price === 'number' && !Number.isNaN(item.price) ? item.price : 0;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      currency,
      value,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: value,
        },
      ],
    },
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_ids: [item.id],
      content_name: item.name,
      content_category: item.category,
      content_type: 'product',
      value,
      currency,
    });
  }
}

/**
 * Tracks InitiateCheckout when a user opens the checkout modal to buy a book, bundle, course, or product.
 * NOTE: This does NOT fire Purchase.
 */
export function trackInitiateCheckout(item: {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  price: number;
  currency?: string;
}): void {
  if (typeof window === 'undefined') return;
  const currency = item.currency || 'EGP';
  const value = Number(item.price) || 0;
  const itemTitle = item.title || item.name || item.id;
  const itemCategory = item.type || item.category || 'product';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency,
      value,
      items: [
        {
          item_id: item.id,
          item_name: itemTitle,
          item_category: itemCategory,
          price: value,
          quantity: 1,
        },
      ],
    },
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: [item.id],
      content_name: itemTitle,
      content_category: itemCategory,
      content_type: 'product',
      value,
      currency,
      num_items: 1,
    });
  }
}

/**
 * Reads already-tracked paid order numbers from localStorage to prevent duplicate Purchase firing.
 */
function getTrackedOrderNumbers(): Set<string> {
  try {
    const raw = localStorage.getItem(PURCHASE_DEDUP_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function markOrderAsTracked(orderKey: string): void {
  try {
    const existing = getTrackedOrderNumbers();
    existing.add(orderKey);
    localStorage.setItem(PURCHASE_DEDUP_STORAGE_KEY, JSON.stringify(Array.from(existing).slice(-200)));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Tracks a confirmed Purchase ONLY when the order's payment_status is 'paid' or order_status is 'completed'.
 * Never fires for 'pending_review', 'unpaid', or 'cancelled' orders.
 * Deduplicated per order_number so refreshing the orders page never fires duplicate Purchase events.
 */
export function trackConfirmedPurchaseIfEligible(order: OrderRecord): boolean {
  if (typeof window === 'undefined' || !order) return false;

  const isConfirmedPaid =
    order.payment_status === 'paid' || order.order_status === 'completed';

  if (!isConfirmedPaid) {
    return false;
  }

  const orderKey = String(order.order_number || order.id || '').trim();
  if (!orderKey) return false;

  const trackedOrders = getTrackedOrderNumbers();
  if (trackedOrders.has(orderKey)) {
    return false;
  }

  markOrderAsTracked(orderKey);

  const currency = order.currency || 'EGP';
  const value = Number(order.total_price ?? order.amount_egp ?? order.price) || 0;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderKey,
      value,
      currency,
      items: [
        {
          item_id: order.item_id || orderKey,
          item_name: order.item_title,
          item_category: order.item_type || 'catalog',
          price: value,
          quantity: 1,
        },
      ],
    },
  });

  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'Purchase',
      {
        value,
        currency,
        content_ids: [order.item_id || orderKey],
        content_name: order.item_title,
        content_type: 'product',
        order_id: orderKey,
        num_items: 1,
      },
      { eventID: `purchase_${orderKey}` }
    );
  }

  return true;
}
