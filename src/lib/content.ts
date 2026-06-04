import { Article, Author } from '../types';
import { articles } from '../data/articles';
import { authors } from '../data/authors';

// Get all articles sorted by publish date (newest first)
export function getAllArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Get articles filtered by category, sorted by date
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
}

// Get an article by its slug
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

// Get all articles written by a specific author
export function getArticlesByAuthor(authorSlug: string): Article[] {
  return getAllArticles().filter((article) => article.author.slug === authorSlug);
}

// Get an author profile by their slug
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors[slug];
}

// Get all unique categories
export function getCategories(): string[] {
  return ['credit-cards', 'banking', 'investing', 'insurance'];
}

// Find articles matching a query (title, description, subtopics, content check)
export function searchArticles(query: string): Article[] {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase().trim();

  return getAllArticles().filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(normalizedQuery);
    const descMatch = article.metaDescription.toLowerCase().includes(normalizedQuery);
    const subtopicMatch = article.subtopics.some((topic) =>
      topic.toLowerCase().includes(normalizedQuery)
    );
    const categoryMatch = article.category.toLowerCase().replace('-', ' ').includes(normalizedQuery);

    return titleMatch || descMatch || subtopicMatch || categoryMatch;
  });
}

// Get related articles based on pre-defined relatedSlugs or fallback to same category
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  // Try to load pre-selected related articles first
  const related = article.relatedSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => !!a);

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  // Fallback to other articles from the same category
  const sameCategory = getArticlesByCategory(article.category).filter(
    (a) => a.slug !== article.slug && !article.relatedSlugs.includes(a.slug)
  );

  return [...related, ...sameCategory].slice(0, limit);
}
