import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shoppa.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/profile', '/fund-wallet', '/cart', '/checkout'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
