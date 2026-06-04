import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticlesByCategory, getCategories } from '@/lib/content';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaData from '@/components/SchemaData';
import styles from './page.module.css';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Maps path slugs to human-readable details
const categoryDetails: Record<
  string,
  { name: string; tagline: string; subtopics: string[] }
> = {
  'credit-cards': {
    name: 'Credit Cards',
    tagline: 'Help users find the best credit cards, improve credit scores, and maximize rewards.',
    subtopics: [
      'Best Credit Cards',
      'Cash Back Cards',
      'Travel Cards',
      'Credit Building',
      'Credit Score Improvement',
      'Credit Utilization',
      'Rewards Programs'
    ]
  },
  'banking': {
    name: 'Banking',
    tagline: 'Everything about checking accounts, savings accounts, online banks, and banking bonuses.',
    subtopics: [
      'High Yield Savings Accounts',
      'Online Banks',
      'Checking Accounts',
      'Bank Bonuses',
      'CDs',
      'Money Market Accounts'
    ]
  },
  'investing': {
    name: 'Investing',
    tagline: 'Long-term investing, retirement planning, ETFs, index funds, and beginner investing.',
    subtopics: [
      'ETFs',
      'Index Funds',
      'Retirement',
      'Roth IRA',
      'Traditional IRA',
      'Dividend Investing',
      'Stock Market Basics'
    ]
  },
  'insurance': {
    name: 'Insurance',
    tagline: 'Help users understand and compare auto, home, life, health, and renters insurance options.',
    subtopics: [
      'Auto Insurance',
      'Home Insurance',
      'Life Insurance',
      'Health Insurance',
      'Renters Insurance'
    ]
  }
};

// Generate static routes at build time
export async function generateStaticParams() {
  return getCategories().map((category) => ({
    category: category
  }));
}

// Generate metadata for the category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const details = categoryDetails[category.toLowerCase()];

  if (!details) {
    return {
      title: 'Category Not Found'
    };
  }

  return {
    title: `${details.name} Guides & Reviews`,
    description: details.tagline,
    alternates: {
      canonical: `/${category}`
    },
    openGraph: {
      title: `${details.name} Guides & Reviews | Finance Horizon`,
      description: details.tagline,
      url: `https://www.financehorizon.com/${category}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryKey = category.toLowerCase();
  const details = categoryDetails[categoryKey];

  if (!details) {
    notFound();
  }

  const categoryArticles = await getArticlesByCategory(categoryKey);
  
  // Split articles into featured (newest) and remaining
  const featuredArticle = categoryArticles[0];
  const gridArticles = categoryArticles.slice(1);

  // Breadcrumbs path
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: details.name }
  ];

  return (
    <>
      {/* Category Banner */}
      <section className={styles.banner}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className={styles.title}>{details.name}</h1>
          <p className={styles.tagline}>{details.tagline}</p>
        </div>
      </section>

      {/* Subtopics Bar */}
      <section className={styles.subtopicsContainer}>
        <div className="container">
          <div className={styles.subtopicsTitle}>Subtopics in this category:</div>
          <div className={styles.subtopicsList}>
            {details.subtopics.map((topic) => (
              <span key={topic} className={styles.subtopicBadge}>
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <SchemaData
        type="breadcrumbs"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: details.name, item: `/${categoryKey}` }
        ]}
      />

      {/* Main Content Area */}
      <section className={styles.contentArea}>
        <div className="container">
          
          {/* Featured Card (Top Article) */}
          {featuredArticle && (
            <div className={styles.featuredBox}>
              <h2 className={styles.gridTitle}>Featured Guide</h2>
              <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src={featuredArticle.featuredImage}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 968px) 100vw, 50vw"
                    className={styles.featuredImage}
                  />
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span>{featuredArticle.readTime}</span>
                    <span> • </span>
                    <span>{featuredArticle.publishDate}</span>
                  </div>
                  <h3 className={styles.featuredTitle}>
                    <Link
                      href={`/${categoryKey}/${featuredArticle.slug}`}
                      className={styles.featuredTitleLink}
                    >
                      {featuredArticle.title}
                    </Link>
                  </h3>
                  <p className={styles.featuredExcerpt}>
                    {featuredArticle.metaDescription}
                  </p>
                  
                  <div className={styles.authorRow}>
                    <div>
                      <div className={styles.authorName}>{featuredArticle.author.name}</div>
                      <div className={styles.authorRole}>{featuredArticle.author.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Remaining Articles List Grid */}
          {gridArticles.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h2 className={styles.gridTitle}>More {details.name} Articles</h2>
              <div className={styles.articlesGrid}>
                {gridArticles.map((article) => (
                  <article key={article.slug} className={styles.articleCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.articleImage}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.metaRow}>
                        <span>{article.readTime}</span>
                        <span>{article.publishDate}</span>
                      </div>
                      <h3 className={styles.articleTitle}>
                        <Link
                          href={`/${categoryKey}/${article.slug}`}
                          className={styles.articleTitleLink}
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <p className={styles.articleExcerpt}>{article.metaDescription}</p>
                      
                      <div className={styles.authorRow}>
                        <div>
                          <div className={styles.authorName}>{article.author.name}</div>
                          <div className={styles.authorRole}>{article.author.role}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
