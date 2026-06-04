import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.financehorizon.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/', // Next.js build assets directory
        '/static/', // Static asset references
        '/api/', // Back-end API services
        '/eb-clinical-portal/', // Administrative portal
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
