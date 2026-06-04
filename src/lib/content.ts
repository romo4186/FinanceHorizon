import { prisma } from './prisma';
import { authors } from '../data/authors';
import { Article, Author } from '../types';

// Map database article to Article type
export function mapDbArticle(dbArt: any): Article {
  const author = authors[dbArt.authorSlug || 'sarah-jenkins'] || authors['sarah-jenkins'];
  
  // Calculate read time
  const strippedText = dbArt.content.replace(/<[^>]*>/g, ' ');
  const wordCount = strippedText.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Extract FAQs for SchemaData
  const faqItemRegex = /<h3 class="faq-question">(.*?)<\/h3>\s*<p class="faq-answer">(.*?)<\/p>/g;
  const faqMatches = [...dbArt.content.matchAll(faqItemRegex)];
  const faqs = faqMatches.map(m => ({
    question: m[1],
    answer: m[2]
  }));

  // Reconstruct sections to help dynamic rendering or page layout if needed,
  // but page.tsx can render raw HTML directly or map them.
  return {
    slug: dbArt.slug,
    title: dbArt.title,
    seoTitle: dbArt.metaTitle || dbArt.title,
    metaDescription: dbArt.metaDescription || dbArt.excerpt || '',
    category: (dbArt.category || 'credit-cards') as any,
    subtopics: dbArt.category ? [dbArt.category.replace('-', ' ')] : [],
    publishDate: new Date(dbArt.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime,
    author,
    featuredImage: dbArt.imageUrl || '',
    introduction: dbArt.excerpt || '',
    sections: [], // served as HTML
    faqs,
    relatedSlugs: [],
    content: dbArt.content
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const dbArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return dbArticles.map(mapDbArticle);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const dbArticles = await prisma.article.findMany({
    where: {
      published: true,
      category: { equals: category, mode: 'insensitive' }
    },
    orderBy: { createdAt: 'desc' }
  });
  return dbArticles.map(mapDbArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const dbArt = await prisma.article.findUnique({
    where: { slug }
  });
  if (!dbArt) return undefined;
  return mapDbArticle(dbArt);
}

export async function getArticlesByAuthor(authorSlug: string): Promise<Article[]> {
  const dbArticles = await prisma.article.findMany({
    where: {
      published: true,
      authorSlug
    },
    orderBy: { createdAt: 'desc' }
  });
  return dbArticles.map(mapDbArticle);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors[slug];
}

export function getCategories(): string[] {
  return ['credit-cards', 'banking', 'investing', 'insurance'];
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase().trim();

  const dbArticles = await prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: normalizedQuery, mode: 'insensitive' } },
        { metaDescription: { contains: normalizedQuery, mode: 'insensitive' } },
        { content: { contains: normalizedQuery, mode: 'insensitive' } },
        { category: { contains: normalizedQuery, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return dbArticles.map(mapDbArticle);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const dbArticles = await prisma.article.findMany({
    where: {
      published: true,
      category: article.category,
      slug: { not: article.slug }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return dbArticles.map(mapDbArticle);
}
