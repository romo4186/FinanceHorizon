import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Wallet, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import { getAllArticles, getArticleBySlug } from '@/lib/content';
import NewsletterSignup from '@/components/NewsletterSignup';
import styles from './page.module.css';

export default async function Home() {
  const allArticles = await getAllArticles();
  const latestArticles = allArticles.slice(0, 6);
  
  // Hand-picked evergreen content for Editor's Picks
  const editorsPickSlugs = [
    'how-to-improve-credit-score',
    'best-high-yield-savings-accounts',
    'roth-ira-vs-traditional-ira'
  ];
  
  const editorsPicksResults = await Promise.all(
    editorsPickSlugs.map(slug => getArticleBySlug(slug))
  );
  const editorsPicks = editorsPicksResults.filter((article): article is typeof article & {} => !!article);

  const categories = [
    {
      name: 'Credit Cards',
      slug: 'credit-cards',
      icon: <CreditCard size={28} />,
      iconClass: styles.iconCC,
      description: 'Find the best travel and cash back cards, optimize rewards, and build a stellar credit score.'
    },
    {
      name: 'Banking',
      slug: 'banking',
      icon: <Wallet size={28} />,
      iconClass: styles.iconBank,
      description: 'Maximize your savings with high yield accounts, compare checking accounts, and claim bonuses.'
    },
    {
      name: 'Investing',
      slug: 'investing',
      icon: <TrendingUp size={28} />,
      iconClass: styles.iconInvest,
      description: 'Learn stock market basics, retirement planning (Roth IRAs), and select low-cost index ETFs.'
    },
    {
      name: 'Insurance',
      slug: 'insurance',
      icon: <Shield size={28} />,
      iconClass: styles.iconInsur,
      description: 'Compare auto, home, life, and health insurance to secure the best coverage for the lowest premium.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>Make Smarter Financial Decisions</h1>
          <p className={styles.heroSubtitle}>
            Navigate your financial future with expert guides, comparisons, and reviews on credit cards, banking, investing, and insurance.
          </p>
          <div>
            <a href="#categories" className="btn btn-primary btn-accent">
              Start Learning
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Explore Financial Categories</h2>
          <p className={styles.sectionSubtitle}>
            Select a topic to find expert-reviewed guides and tools customized for your personal finance goals.
          </p>
          
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link href={`/${cat.slug}`} key={cat.slug} className={styles.categoryCard}>
                <div className={`${styles.categoryIconWrapper} ${cat.iconClass}`}>
                  {cat.icon}
                </div>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.description}</p>
                <span className={styles.categoryLink}>
                  View Guides <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Picks Section */}
      <section className={`${styles.section} ${styles.editorsPicks}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Editor's Picks</h2>
          <p className={styles.sectionSubtitle}>
            Our absolute best, evergreen guides to setting up a healthy financial foundation.
          </p>

          <div className={styles.articlesGrid}>
            {editorsPicks.map((article) => (
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
                    <span className={styles.categoryBadge}>
                      {article.category.replace('-', ' ')}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className={styles.articleTitle}>
                    <Link href={`/${article.category}/${article.slug}`} className={styles.articleTitleLink}>
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
      </section>

      {/* Latest Articles Section */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest Financial Guides</h2>
          <p className={styles.sectionSubtitle}>
            Stay up to date with our newly published articles and updated reviews.
          </p>

          <div className={styles.articlesGrid}>
            {latestArticles.map((article) => (
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
                    <span className={styles.categoryBadge}>
                      {article.category.replace('-', ' ')}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className={styles.articleTitle}>
                    <Link href={`/${article.category}/${article.slug}`} className={styles.articleTitleLink}>
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
      </section>

      {/* Newsletter Block */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem 0' }}>
        <div className="container">
          <NewsletterSignup />
        </div>
      </section>
    </>
  );
}
