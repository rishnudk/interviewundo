import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interviewundo.com';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/problems/', '/login', '/register'],
      disallow: ['/admin/', '/dashboard/', '/profile/', '/submissions/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
