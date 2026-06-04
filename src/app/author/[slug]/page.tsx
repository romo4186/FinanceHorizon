import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { TwitterIcon as Twitter, LinkedinIcon as Linkedin } from '@/components/BrandIcons';
import { getAuthorBySlug, getArticlesByAuthor } from '@/lib/content';
import { authors } from '@/data/authors';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaData from '@/components/SchemaData';
import styles from './page.module.css';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes for all author profiles
export async function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({
    slug: slug
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Author Not Found'
    };
  }

  return {
    title: `${author.name} | Financial Expert Profile`,
    description: `${author.name} is a key contributor to Finance Horizon. Read their professional bio, credentials, and financial advice articles.`,
    alternates: {
      canonical: `/author/${author.slug}`
    },
    openGraph: {
      title: `${author.name} | Financial Expert Profile | Finance Horizon`,
      description: author.bio,
      url: `https://www.financehorizon.com/author/${author.slug}`
    }
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authorArticles = getArticlesByAuthor(slug);

  // Breadcrumbs path
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Authors', url: '#' },
    { name: author.name }
  ];

  return (
    <>
      {/* Breadcrumbs Structured Schema */}
      <SchemaData
        type="breadcrumbs"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Authors', item: '#' },
          { name: author.name, item: `/author/${author.slug}` }
        ]}
      />

      <section className={styles.layout}>
        <div className="container">
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Large Author Profile Header Card */}
          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                priority
                sizes="120px"
                className={styles.avatar}
              />
            </div>
            
            <div className={styles.profileContent}>
              <div className={styles.role}>{author.role}</div>
              <h1 className={styles.name}>{author.name}</h1>
              {author.credentials && <p className={styles.credentials}>{author.credentials}</p>}
              <p className={styles.bio}>{author.bio}</p>
              
              <div className={styles.socials}>
                {author.socials?.twitter && (
                  <a
                    href={author.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={`${author.name}'s Twitter`}
                  >
                    <Twitter size={18} /> @{author.slug}
                  </a>
                )}
                {author.socials?.linkedin && (
                  <a
                    href={author.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={`${author.name}'s LinkedIn`}
                  >
                    <Linkedin size={18} /> Connect on LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* List of articles written by author */}
          <div>
            <h2 className={styles.sectionTitle}>Guides Written by {author.name.split(',')[0]}</h2>
            {authorArticles.length === 0 ? (
              <p className="text-muted">No guides published yet by this author.</p>
            ) : (
              <div className={styles.articlesGrid}>
                {authorArticles.map((article) => (
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
                        <Link
                          href={`/${article.category}/${article.slug}`}
                          className={styles.articleTitleLink}
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <p className={styles.excerpt}>{article.metaDescription}</p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto', paddingTop: '0.75rem' }}>
                        Published: {article.publishDate}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
