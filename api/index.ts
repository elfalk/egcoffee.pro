const SITE_URL = 'https://www.egcoffee.pro';

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
  'المصرية': 'egyptian',
  'مصرية': 'egyptian',
  'حاسبة': 'calculator',
  'الحاسبة': 'calculator',
  'سلالات': 'origins',
  'السلالات': 'origins',
  'سلالة': 'origin',
  'السلالة': 'origin',
  'إسبريسو': 'espresso',
  'اسبريسو': 'espresso',
  'تركي': 'turkish',
  'التركي': 'turkish',
  'أرابيكا': 'arabica',
  'ارابيكا': 'arabica',
  'روبوستا': 'robusta',
  'كولومبي': 'colombian',
  'كولومبيا': 'colombia',
  'برازيلي': 'brazilian',
  'البرازيل': 'brazil',
  'إثيوبي': 'ethiopian',
  'اثيوبي': 'ethiopian',
  'إثيوبيا': 'ethiopia',
  'اثيوبيا': 'ethiopia',
  'فيتنامي': 'vietnamese',
  'فيتنام': 'vietnam',
  'يمني': 'yemeni',
  'اليمن': 'yemen',
  'هندي': 'indian',
  'الهند': 'india',
  'إندونيسي': 'indonesian',
  'اندونيسي': 'indonesian',
  'أوغندي': 'ugandan',
  'اوغندي': 'ugandan',
  'كيني': 'kenyan',
  'كينيا': 'kenya',
};

const ARABIC_CHAR_MAP: Record<string, string> = {
  'ا': 'a',
  'أ': 'a',
  'إ': 'e',
  'آ': 'a',
  'ء': '',
  'ؤ': 'o',
  'ئ': 'e',
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
  'ي': 'y',
  'ى': 'a',
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

function slugifyText(input?: string | null): string {
  if (!input) return '';
  const cleaned = String(input)
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  if (!cleaned) return '';

  const words = cleaned
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const translatedWords = words.map((word) => {
    if (ARABIC_WORD_MAP[word]) return ARABIC_WORD_MAP[word];
    if (/^[a-z0-9-]+$/.test(word)) return word;
    let out = '';
    for (const ch of word) {
      if (/[a-z0-9-]/.test(ch)) out += ch;
      else if (ARABIC_CHAR_MAP[ch] !== undefined) out += ARABIC_CHAR_MAP[ch];
    }
    return out;
  });

  return translatedWords
    .join('-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getNormalizedBase44ApiUrl(): string {
  const raw = (
    process.env.VITE_BASE44_API_URL || 'https://egcoffee.base44.app/api'
  )
    .trim()
    .replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

function getBase44AppId(): string {
  return (
    process.env.VITE_BASE44_APP_ID ||
    process.env.BASE44_APP_ID ||
    '6ae1356b20aa9cddb1240b85'
  ).trim();
}

function getBase44AuthHeaders(): Record<string, string> {
  const rawToken = (
    process.env.BASE44_API_TOKEN ||
    process.env.BASE44_API_KEY ||
    process.env.VITE_BASE44_API_TOKEN ||
    process.env.VITE_BASE44_API_KEY ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '');
  const cleanKey = rawToken.replace(/^Bearer\s+/i, '').trim();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const isValidAsciiToken =
    cleanKey.length >= 10 &&
    !cleanKey.includes('حط_التوكن') &&
    !cleanKey.includes('ضع_هنا') &&
    !cleanKey.includes('YOUR_') &&
    /^[\x20-\x7E]+$/.test(cleanKey);
  if (isValidAsciiToken) {
    headers['Authorization'] = `Bearer ${cleanKey}`;
  }
  return headers;
}

function getTelegramBotToken(): string {
  const token = (
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '');
  if (!token || token.includes('YOUR_') || token.includes('ضع_هنا')) return '';
  return token;
}

function getTelegramChatIds(): string[] {
  const raw = (
    process.env.TELEGRAM_CHAT_ID ||
    process.env.VITE_TELEGRAM_CHAT_ID ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '');
  if (!raw || raw.includes('YOUR_') || raw.includes('ضع_هنا')) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function signBase44PrivateUri(rawUri: string): Promise<string> {
  const trimmed = String(rawUri || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }
  try {
    const baseUrl = getNormalizedBase44ApiUrl().replace(/\/api$/, '');
    const appId = getBase44AppId();
    const signRes = await fetch(
      `${baseUrl}/api/apps/${appId}/integration-endpoints/Core/CreateFileSignedUrl`,
      {
        method: 'POST',
        headers: getBase44AuthHeaders(),
        body: JSON.stringify({ file_uri: trimmed }),
      }
    );
    if (signRes.ok) {
      const signJson = await signRes.json();
      if (signJson?.signed_url) {
        return String(signJson.signed_url);
      }
    }
  } catch {
    // Ignore signing error
  }
  return '';
}

async function fetchBase44EntityServer(
  entityPath: string,
  queryString = '',
  options?: RequestInit
): Promise<{ status: number; ok: boolean; data: any }> {
  const baseUrl = getNormalizedBase44ApiUrl();
  const appId = getBase44AppId();
  const cleanEntityPath = entityPath.replace(/^\/+/, '');
  const qs = queryString
    ? queryString.startsWith('?')
      ? queryString
      : `?${queryString}`
    : '';

  const primaryUrl = `${baseUrl}/entities/${cleanEntityPath}${qs}`;
  const appScopedUrl = `${baseUrl}/apps/${appId}/entities/${cleanEntityPath}${qs}`;

  const fetchOpts: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      ...getBase44AuthHeaders(),
      ...(options?.headers || {}),
    },
    ...(options?.body ? { body: options.body } : {}),
  };

  let response = await fetch(primaryUrl, fetchOpts);
  if (
    !response.ok &&
    (response.status === 401 ||
      response.status === 403 ||
      response.status === 404)
  ) {
    const retryRes = await fetch(appScopedUrl, fetchOpts);
    if (retryRes.ok) {
      response = retryRes;
    }
  }

  const text = await response.text();
  let data: any = [];
  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    data = { error: text || 'Invalid JSON response from Base44' };
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

function extractDeliveryUrl(raw: any): string {
  if (!raw || typeof raw !== 'object') return '';
  return String(
    raw.delivery_file_or_url ||
      raw.download_url ||
      raw.file_url ||
      raw.pdf_url ||
      raw.book_url ||
      raw.course_url ||
      raw.url ||
      raw.link ||
      ''
  ).trim();
}

async function syncTelegramDecisionsAndApplyToBase44(): Promise<
  Record<string, 'approve' | 'reject'>
> {
  const botToken = getTelegramBotToken();
  const decisions: Record<string, 'approve' | 'reject'> = {};
  if (!botToken) return decisions;

  try {
    const updRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates?timeout=0`
    );
    if (!updRes.ok) return decisions;
    const data = await updRes.json();
    if (!data?.ok || !Array.isArray(data.result)) return decisions;

    for (const update of data.result) {
      const cb = update.callback_query;
      if (cb?.data) {
        const cbData = String(cb.data);
        if (cbData.startsWith('approve:') || cbData.startsWith('reject:')) {
          const isApprove = cbData.startsWith('approve:');
          const orderNum = (cbData.split(':')[1] || '').trim().toUpperCase();
          if (orderNum) {
            decisions[orderNum] = isApprove ? 'approve' : 'reject';
          }
          if (cb.id) {
            fetch(
              `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  callback_query_id: cb.id,
                  text: isApprove
                    ? `تمت الموافقة وتفعيل التحميل للطلب ${orderNum}`
                    : `تم رفض الطلب ${orderNum}`,
                }),
              }
            ).catch(() => {});
          }
        }
      }
    }

    const decisionEntries = Object.entries(decisions);
    if (decisionEntries.length > 0) {
      const { ok, data: ordersRaw } = await fetchBase44EntityServer(
        'Order',
        'limit=100&sort_by=-created_date'
      );
      const ordersList: any[] =
        ok && Array.isArray(ordersRaw)
          ? ordersRaw
          : Array.isArray(ordersRaw?.data)
          ? ordersRaw.data
          : [];

      for (const [orderNum, decision] of decisionEntries) {
        const matched = ordersList.find(
          (o) =>
            String(o.order_number || '').trim().toUpperCase() === orderNum
        );
        if (!matched?.id) continue;

        const targetPay = decision === 'approve' ? 'paid' : 'unpaid';
        const targetOrd = decision === 'approve' ? 'completed' : 'cancelled';
        if (
          matched.payment_status === targetPay &&
          matched.order_status === targetOrd
        ) {
          continue;
        }

        const updatePayload =
          decision === 'approve'
            ? {
                payment_status: 'paid',
                order_status: 'completed',
                approved_by: 'Telegram Admin (@wepegcoffeebot)',
              }
            : {
                payment_status: 'unpaid',
                order_status: 'cancelled',
                admin_notes: 'لم تتم معالجة طلبك',
              };

        await fetchBase44EntityServer(`Order/${matched.id}`, '', {
          method: 'PUT',
          body: JSON.stringify(updatePayload),
        }).catch(() => {});
      }
    }
  } catch {
    // Ignore sync errors
  }

  return decisions;
}

async function sendTelegramOrderNotificationServer(
  params: Record<string, any>
): Promise<{ sent: boolean; deliveredToCount: number }> {
  const botToken = getTelegramBotToken();
  if (!botToken) {
    return { sent: false, deliveredToCount: 0 };
  }

  const chatSet = new Set<string>(getTelegramChatIds());

  // Also discover any admin chat IDs that interacted with the bot recently
  try {
    const updRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates?timeout=0`
    );
    if (updRes.ok) {
      const updData = await updRes.json();
      if (updData?.ok && Array.isArray(updData.result)) {
        for (const u of updData.result) {
          const cid =
            u?.message?.chat?.id ??
            u?.callback_query?.message?.chat?.id ??
            u?.my_chat_member?.chat?.id;
          if (cid !== undefined && cid !== null) {
            chatSet.add(String(cid));
          }
        }
      }
    }
  } catch {
    // Ignore
  }

  const chatIds = Array.from(chatSet);
  if (chatIds.length === 0) {
    return { sent: false, deliveredToCount: 0 };
  }

  const orderNum = params.order_number || `EGC-${Date.now()}`;
  const messageText = [
    '☕ *طلب شراء جديد — منصة تجارة القهوة المصرية*',
    `• *رقم الطلب:* \`${orderNum}\``,
    `• *العميل:* ${params.customer_name || '-'}`,
    `• *التواصل:* \`${params.customer_contact || '-'}\``,
    `• *المنتج:* ${params.item_title || '-'} (الكمية: ${params.quantity || 1})`,
    `• *الإجمالي:* ${params.total_price || 0} ${params.currency || 'EGP'}`,
    `• *طريقة الدفع:* ${params.payment_method_label || params.payment_method || '-'}`,
    params.admin_notes ? `• *ملاحظات:* ${params.admin_notes}` : '',
    `• *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}`,
    '',
    '👇 *اضغط على (موافق) لتفعيل رابط تحميل الكتاب فوراً للعميل أو (رفض) لإلغاء الطلب:*',
  ]
    .filter(Boolean)
    .join('\n');

  const plainCaption = messageText.replace(/[*`]/g, '');
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ موافق (تفعيل رابط التحميل)',
          callback_data: `approve:${orderNum}`,
        },
        {
          text: '❌ رفض الطلب',
          callback_data: `reject:${orderNum}`,
        },
      ],
    ],
  };

  const receiptImg = String(params.receipt_image_url || '').trim();
  let deliveredCount = 0;

  for (const chatId of chatIds) {
    let sentPhoto = false;
    if (receiptImg.startsWith('data:image/')) {
      try {
        const match = receiptImg.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          const binaryBuffer = Buffer.from(base64Data, 'base64');
          const form = new FormData();
          form.append('chat_id', String(chatId));
          form.append('caption', plainCaption.slice(0, 1000));
          form.append('reply_markup', JSON.stringify(inlineKeyboard));
          const ext = mimeType.split('/')[1] || 'jpg';
          form.append(
            'photo',
            new Blob([binaryBuffer], { type: mimeType }),
            `receipt-${orderNum}.${ext}`
          );
          const photoRes = await fetch(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            {
              method: 'POST',
              body: form,
            }
          );
          if (photoRes.ok) {
            sentPhoto = true;
            deliveredCount++;
          }
        }
      } catch {
        // Fallback to text message
      }
    } else if (/^https?:\/\//i.test(receiptImg)) {
      try {
        const photoRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendPhoto`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              photo: receiptImg,
              caption: plainCaption.slice(0, 1000),
              reply_markup: inlineKeyboard,
            }),
          }
        );
        if (photoRes.ok) {
          sentPhoto = true;
          deliveredCount++;
        }
      } catch {
        // Fallback to text message
      }
    }

    if (!sentPhoto) {
      try {
        let tgRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: messageText,
              parse_mode: 'Markdown',
              reply_markup: inlineKeyboard,
            }),
          }
        );
        if (!tgRes.ok) {
          tgRes = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: plainCaption,
                reply_markup: inlineKeyboard,
              }),
            }
          );
        }
        if (tgRes.ok) {
          deliveredCount++;
        }
      } catch {
        // Ignore single chat failure
      }
    }
  }

  return {
    sent: deliveredCount > 0,
    deliveredToCount: deliveredCount,
  };
}

export default async function handler(req: any, res: any) {
  const urlObj = new URL(req.url || '/api', SITE_URL);
  const rewrittenSubpath =
    urlObj.searchParams.get('__path') ||
    (typeof req.query?.__path === 'string' ? req.query.__path : null);

  let pathname = urlObj.pathname;
  if (
    rewrittenSubpath &&
    (pathname === '/api/index' ||
      pathname === '/api/index.ts' ||
      pathname === '/api' ||
      pathname === '/api/')
  ) {
    pathname = `/api/${rewrittenSubpath.replace(/^\/+/, '')}`;
  }
  if (rewrittenSubpath !== null) {
    urlObj.searchParams.delete('__path');
  }

  // 1. Dynamic Sitemap (/api/sitemap or /sitemap.xml)
  if (
    pathname === '/api/sitemap' ||
    pathname === '/sitemap.xml' ||
    urlObj.searchParams.get('sitemap') === '1'
  ) {
    try {
      const fetchList = async (name: string) => {
        try {
          const { ok, data } = await fetchBase44EntityServer(name, 'limit=100');
          if (!ok) return [];
          return Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.items)
            ? data.items
            : [];
        } catch {
          return [];
        }
      };

      const [catalogRaw, articlesRaw, categoriesRaw, beansRaw, blendsRaw] =
        await Promise.all([
          fetchList('CatalogItem'),
          fetchList('Article'),
          fetchList('ArticleCategory'),
          fetchList('CoffeeBean'),
          fetchList('CoffeeBlend'),
        ]);

      const today = new Date().toISOString().slice(0, 10);
      const urls: {
        loc: string;
        lastmod: string;
        changefreq: string;
        priority: string;
      }[] = [
        { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
        { loc: `${SITE_URL}/marckt`, lastmod: today, changefreq: 'daily', priority: '0.9' },
        { loc: `${SITE_URL}/store`, lastmod: today, changefreq: 'daily', priority: '0.9' },
        { loc: `${SITE_URL}/books`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/courses`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/articles`, lastmod: today, changefreq: 'daily', priority: '0.9' },
        { loc: `${SITE_URL}/coffee-beans`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/coffee-blends`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/calculators`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/calculators/blend-calculator`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/calculators/roasting-loss`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/calculators/roasted-coffee-cost`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${SITE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
        { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
        { loc: `${SITE_URL}/privacy`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
      ];

      const seen = new Set<string>(urls.map((u) => u.loc));
      const addUrl = (
        pathStr: string,
        lastmodDate?: string,
        changefreq = 'weekly',
        priority = '0.8'
      ) => {
        const full = `${SITE_URL}${
          pathStr.startsWith('/') ? pathStr : `/${pathStr}`
        }`;
        if (seen.has(full)) return;
        seen.add(full);
        urls.push({
          loc: full,
          lastmod: lastmodDate ? String(lastmodDate).slice(0, 10) : today,
          changefreq,
          priority,
        });
      };

      for (const item of catalogRaw) {
        if (item.is_available === false || item.is_active === false || item.status === 'draft') continue;
        const slug =
          slugifyText(item.slug) ||
          slugifyText(item.title_en) ||
          slugifyText(item.title_ar) ||
          slugifyText(item.id);
        if (!slug) continue;
        const mod = item.updated_date || item.created_date || today;
        addUrl(`/marckt/${slug}`, mod, 'weekly', '0.85');
        const itemType = String(item.item_type || item.type || 'book').toLowerCase();
        if (itemType === 'book' || itemType === 'bundle') {
          addUrl(`/books/${slug}`, mod, 'weekly', '0.85');
        } else if (itemType === 'course') {
          addUrl(`/courses/${slug}`, mod, 'weekly', '0.85');
        }
      }

      for (const cat of categoriesRaw) {
        const slug =
          slugifyText(cat.slug) ||
          slugifyText(cat.name_en) ||
          slugifyText(cat.name_ar) ||
          slugifyText(cat.id);
        if (!slug) continue;
        addUrl(`/articles/category/${slug}`, cat.updated_date || today, 'weekly', '0.75');
      }

      for (const art of articlesRaw) {
        if (art.status === 'draft' || art.is_published === false) continue;
        const slug =
          slugifyText(art.slug) ||
          slugifyText(art.title_en) ||
          slugifyText(art.title_ar) ||
          slugifyText(art.id);
        if (!slug) continue;
        addUrl(`/articles/${slug}`, art.updated_date || art.publish_date || today, 'weekly', '0.85');
      }

      for (const bean of beansRaw) {
        const slug =
          slugifyText(bean.slug) ||
          slugifyText(bean.name_en) ||
          slugifyText(bean.name_ar) ||
          slugifyText(bean.id);
        if (!slug) continue;
        addUrl(`/coffee-beans/${slug}`, bean.updated_date || today, 'monthly', '0.75');
      }

      for (const blend of blendsRaw) {
        const slug =
          slugifyText(blend.slug) ||
          slugifyText(blend.name_en) ||
          slugifyText(blend.name_ar) ||
          slugifyText(blend.id);
        if (!slug) continue;
        addUrl(`/coffee-blends/${slug}`, blend.updated_date || today, 'monthly', '0.75');
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(
          (u) =>
            `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
        ),
        '</urlset>',
      ].join('\n');

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      return res.status(200).send(xml);
    } catch {
      return res
        .status(500)
        .send(
          '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
        );
    }
  }

  // 2. Analyze Blend endpoint (/api/analyze-blend)
  if (pathname === '/api/analyze-blend' && req.method === 'POST') {
    try {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const {
        beanState,
        roastLossPercent,
        targetUse,
        components,
        financials,
        lang = 'ar',
      } = body;

      if (!components || !Array.isArray(components) || components.length === 0) {
        return res.status(400).json({ error: 'Blend components are required.' });
      }

      const componentsText = components
        .map(
          (c: { name: string; percentage: number; pricePerKg: number }) =>
            `- ${c.name}: ${c.percentage}% (${c.pricePerKg} EGP/kg)`
        )
        .join('\n');

      const targetLabel =
        targetUse === 'turkish'
          ? 'Turkish Coffee (قهوة تركي)'
          : targetUse === 'espresso'
          ? 'Espresso (إسبريسو)'
          : 'Both Turkish Coffee & Espresso (قهوة تركي وإسبريسو معاً)';

      const beanStateLabel =
        beanState === 'green'
          ? `Green Coffee Beans with ${roastLossPercent}% expected roast weight loss`
          : 'Ready Roasted Coffee Beans (0% additional roast loss)';

      const prompt = `You are the Chief Coffee Master Roaster and Commercial Coffee Economist in Egypt ("تجارة القهوة المصرية - Egyptian Coffee Trade").
Analyze the following coffee blend designed for the Egyptian market:

Bean Type: ${beanStateLabel}
Target Extraction: ${targetLabel}
Blend Components:
${componentsText}

Financial Metrics Calculated:
- Raw Input Cost per Kg: ${financials?.rawCostPerKg?.toFixed(2) || 0} EGP
- Net Roasted Cost per Kg (Before Operating Expenses): ${financials?.netRoastedCostPerKg?.toFixed(2) || 0} EGP
- Green Weight Required for 1 Kg Net Roasted: ${financials?.greenNeededForOneKgRoasted?.toFixed(3) || 1} Kg

Respond strictly in JSON matching the schema in ${
        lang === 'ar'
          ? 'professional Egyptian/Standard Arabic for coffee traders and roasters'
          : 'professional English for coffee traders and roasters'
      }.`;

      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || '',
      });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryVerdict: { type: Type.STRING },
              sensoryProfile: {
                type: Type.OBJECT,
                properties: {
                  bodyScore: { type: Type.NUMBER },
                  cremaOrWeshScore: { type: Type.NUMBER },
                  acidityScore: { type: Type.NUMBER },
                  bitternessScore: { type: Type.NUMBER },
                  aromaNotes: { type: Type.STRING },
                },
                required: [
                  'bodyScore',
                  'cremaOrWeshScore',
                  'acidityScore',
                  'bitternessScore',
                  'aromaNotes',
                ],
              },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              suitabilityAnalysis: {
                type: Type.OBJECT,
                properties: {
                  turkishSuitability: { type: Type.STRING },
                  espressoSuitability: { type: Type.STRING },
                  recommendedRoastLevel: { type: Type.STRING },
                },
                required: [
                  'turkishSuitability',
                  'espressoSuitability',
                  'recommendedRoastLevel',
                ],
              },
              flavorOptimizationTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              costOptimizationTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'summaryVerdict',
              'sensoryProfile',
              'pros',
              'cons',
              'suitabilityAnalysis',
              'flavorOptimizationTips',
              'costOptimizationTips',
            ],
          },
        },
      });

      const rawText = response.text || '{}';
      return res.status(200).json(JSON.parse(rawText));
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err?.message || 'Failed to analyze blend' });
    }
  }

  // 3. Notify Telegram (/api/notify-telegram)
  if (pathname === '/api/notify-telegram' && req.method === 'POST') {
    try {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const result = await sendTelegramOrderNotificationServer(body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(200).json({ sent: false, error: err?.message });
    }
  }

  // 4. Telegram Sync (/api/telegram-sync)
  if (pathname === '/api/telegram-sync') {
    const decisions = await syncTelegramDecisionsAndApplyToBase44();
    return res.status(200).json({ decisions });
  }

  // 5. Local Orders endpoint (/api/local-orders) — Bridges orders directly with Base44 & Telegram on Vercel
  if (pathname === '/api/local-orders') {
    if (req.method === 'GET') {
      await syncTelegramDecisionsAndApplyToBase44();
      const { ok, data } = await fetchBase44EntityServer(
        'Order',
        'limit=100&sort_by=-created_date'
      );
      const list =
        ok && Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const qty = Number(body.quantity) || 1;
      const price = Number(body.total_price ?? body.amount_egp) || 0;
      const contact = body.customer_contact || body.customer_phone || '';
      const orderNum =
        body.order_number ||
        `EGC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      let deliveryUrl = String(body.delivery_file_or_url || '').trim();
      if (!deliveryUrl) {
        try {
          const { ok, data: catData } = await fetchBase44EntityServer(
            'CatalogItem',
            'limit=100'
          );
          const items: any[] =
            ok && Array.isArray(catData)
              ? catData
              : Array.isArray(catData?.data)
              ? catData.data
              : [];
          const catalogItemId = body.catalog_item_id || body.item_id;
          const itemTitle = body.item_title || body.item_title_ar;
          const matched = items.find(
            (it) =>
              (catalogItemId && String(it.id) === String(catalogItemId)) ||
              (itemTitle &&
                (String(it.title_ar || '').trim() === String(itemTitle).trim() ||
                  String(it.title_en || '').trim() === String(itemTitle).trim()))
          );
          deliveryUrl = extractDeliveryUrl(matched);
        } catch {
          // Ignore
        }
      }

      const b44Payload = {
        order_number: orderNum,
        customer_name: body.customer_name || 'عميل المنصة',
        customer_contact: contact,
        catalog_item_id: body.catalog_item_id || body.item_id || '',
        item_title: body.item_title || body.item_title_ar || 'إصدار رقمي',
        quantity: qty,
        total_price: price,
        currency: body.currency || 'EGP',
        payment_method: body.payment_method || 'instapay',
        receipt_image_url:
          body.receipt_image_url &&
          !String(body.receipt_image_url).startsWith('data:')
            ? body.receipt_image_url
            : `RECEIPT-${orderNum}`,
        payment_status: 'under_review',
        order_status: 'new',
        admin_notes: body.admin_notes || '',
        delivery_file_or_url: deliveryUrl,
      };

      let base44Id = '';
      try {
        const { ok, data: created } = await fetchBase44EntityServer(
          'Order',
          '',
          {
            method: 'POST',
            body: JSON.stringify(b44Payload),
          }
        );
        if (ok && created?.id) {
          base44Id = String(created.id);
          if (!deliveryUrl) {
            deliveryUrl = extractDeliveryUrl(created);
          }
        }
      } catch {
        // Ignore
      }

      return res.status(200).json({
        id: base44Id || body.id || `ord-eg-${Date.now()}`,
        base44_id: base44Id || undefined,
        ...b44Payload,
        delivery_file_or_url: deliveryUrl,
        client_id: body.client_id,
        customer_id: body.customer_id,
        created_date: new Date().toISOString(),
      });
    }
  }

  // 6. Customer Auth Endpoints (/api/customers/register & /api/customers/login)
  if (
    (pathname === '/api/customers/register' ||
      pathname === '/api/customers/login') &&
    req.method === 'POST'
  ) {
    // Return 200 with clientFallback flag so client-side Base44 order sync handles auth cleanly without 404 console errors
    return res.status(200).json({ clientFallback: true });
  }

  // 7. Base44 Signed URL (/api/base44/signed-url)
  if (pathname === '/api/base44/signed-url' && req.method === 'POST') {
    try {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const rawUri = String(body.file_uri || '').trim();
      if (!rawUri) return res.status(400).json({ error: 'file_uri required' });
      const signedUrl = await signBase44PrivateUri(rawUri);
      return res.status(200).json({ signed_url: signedUrl });
    } catch {
      return res.status(200).json({ signed_url: '' });
    }
  }

  // 8. Base44 Entity Proxy (/api/base44/entities/:entity[/...])
  if (pathname.startsWith('/api/base44/entities/')) {
    const entityPath = pathname
      .replace('/api/base44/entities/', '')
      .replace(/^\/+/, '');
    const entity = entityPath.split('/')[0];
    const qs = urlObj.search ? urlObj.search : '';

    try {
      const { status, ok, data } = await fetchBase44EntityServer(
        entityPath,
        qs,
        {
          method: req.method || 'GET',
          ...(req.method === 'POST' ||
          req.method === 'PUT' ||
          req.method === 'PATCH'
            ? {
                body:
                  typeof req.body === 'string'
                    ? req.body
                    : JSON.stringify(req.body || {}),
              }
            : {}),
        }
      );

      if (
        (entity === 'AudioClip' ||
          entity === 'Ad' ||
          entity === 'CatalogItem' ||
          entity === 'Order') &&
        ok &&
        req.method === 'GET'
      ) {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        await Promise.all(
          list.map(async (item: any) => {
            if (!item || typeof item !== 'object') return;
            if (entity === 'AudioClip') {
              const rawUri = String(
                item.file_uri ||
                  item.audio_url ||
                  item.file_url ||
                  item.audio_file ||
                  item.url ||
                  ''
              ).trim();
              if (!rawUri) return;
              if (/^https?:\/\//i.test(rawUri) || rawUri.startsWith('/')) {
                item.audio_url = rawUri;
                return;
              }
              const signed = await signBase44PrivateUri(rawUri);
              if (signed) item.audio_url = signed;
            } else if (entity === 'Ad') {
              const rawUri = String(item.image_url || '').trim();
              if (!rawUri || /^https?:\/\//i.test(rawUri) || rawUri.startsWith('/'))
                return;
              const signed = await signBase44PrivateUri(rawUri);
              if (signed) item.image_url = signed;
            } else if (entity === 'CatalogItem' || entity === 'Order') {
              const rawDelivery = String(item.delivery_file_or_url || '').trim();
              if (
                rawDelivery &&
                !/^https?:\/\//i.test(rawDelivery) &&
                !rawDelivery.startsWith('/')
              ) {
                const signed = await signBase44PrivateUri(rawDelivery);
                if (signed) item.delivery_file_or_url = signed;
              }
            }
          })
        );
      }

      return res.status(status).json(data);
    } catch (err: any) {
      return res
        .status(502)
        .json({ error: err?.message || 'Base44 proxy error' });
    }
  }

  return res.status(404).json({ error: 'API endpoint not found', path: pathname });
}
