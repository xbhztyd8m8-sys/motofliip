const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://motofliip.vercel.app';

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE}/`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/signup`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/login`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/faq`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/terms`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
