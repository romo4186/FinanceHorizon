import { MetadataRoute } from 'next';
import { getAllArticles, getCategories } from '@/lib/content';
import { authors } from '@/data/authors';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.financehorizon.com';
  const currentDate = new Date().toISOString();

  // 1. Homepage
  const homepageEntry = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  };

  // 2. Static Pages
  const staticPages = ['about', 'contact', 'privacy', 'disclaimer', 'terms', 'editorial-policy', 'search'];
  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // 3. Category Pages
  const categoryEntries = getCategories().map((cat) => ({
    url: `${baseUrl}/${cat}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 4. Article Pages
  const articlesList = await getAllArticles();
  const articleEntries = articlesList.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.slug}`,
    lastModified: new Date(article.publishDate).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 5. Author Pages
  const authorEntries = Object.keys(authors).map((authorSlug) => ({
    url: `${baseUrl}/author/${authorSlug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    homepageEntry,
    ...staticEntries,
    ...categoryEntries,
    ...articleEntries,
    ...authorEntries,
  ];
}
