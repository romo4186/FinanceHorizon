import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/lib/content';
import Breadcrumbs from '@/components/Breadcrumbs';
import TableOfContents from '@/components/TableOfContents';
import FAQSection from '@/components/FAQSection';
import AuthorBox from '@/components/AuthorBox';
import ShareButtons from '@/components/ShareButtons';
import SchemaData from '@/components/SchemaData';
import styles from './page.module.css';

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Generate static params for build pre-rendering
export async function generateStaticParams() {
  const articlesList = await getAllArticles();
  return articlesList.map((article) => ({
    category: article.category,
    slug: article.slug
  }));
}

// Generate metadata for SEO dynamically
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found'
    };
  }

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/${article.category}/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://www.financehorizon.com/${article.category}/${article.slug}`,
      type: 'article',
      publishedTime: new Date(article.publishDate).toISOString(),
      authors: [`https://www.financehorizon.com/author/${article.author.slug}`],
      images: [
        {
          url: article.featuredImage,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.featuredImage]
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);

  // Validate article existence and matching category slug
  if (!article || article.category !== category) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article, 3);
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: article.category.replace('-', ' '), url: `/${article.category}` },
    { name: article.title }
  ];

  // Extract headings for Table of Contents from HTML
  const h2Regex = /<section id="([^"]+)">\s*<h2>(.*?)<\/h2>/gi;
  const matches = [...(article.content || '').matchAll(h2Regex)];
  const tocSections = matches.map((match) => ({
    id: match[1],
    title: match[2].replace(/<[^>]*>/g, '') // Strip nested tags
  }));

  return (
    <>
      {/* Dynamic SEO JSON-LD Schemas */}
      <SchemaData
        type="breadcrumbs"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: article.category.replace('-', ' '), item: `/${article.category}` },
          { name: article.title, item: `/${article.category}/${article.slug}` }
        ]}
      />
      <SchemaData type="article" article={article} />
      {article.faqs.length > 0 && <SchemaData type="faq" faqs={article.faqs} />}

      <article className={styles.layout}>
        <div className="container">
          
          <div className={styles.articleContentWrapper}>
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Article Header */}
            <header className={styles.header}>
              <Link href={`/${article.category}`} className={styles.categoryLink}>
                {article.category.replace('-', ' ')}
              </Link>
              <h1 className={styles.title}>{article.title}</h1>
              
              <div className={styles.metaRow}>
                <span>
                  By{' '}
                  <Link href={`/author/${article.author.slug}`} className={styles.authorLink}>
                    {article.author.name}
                  </Link>
                </span>
                <span>•</span>
                <time dateTime={article.publishDate}>
                  Published: {new Date(article.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </header>

            {/* Main Single Column Layout */}
            <div className={styles.mainGrid}>
              
              {/* Left Content Column */}
              <div className={styles.articleBody}>
                {/* Featured Image */}
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    width={800}
                    height={450}
                    priority
                    className={styles.featuredImage}
                  />
                </div>

                {/* Table of Contents */}
                <TableOfContents sections={tocSections} />

                {/* Main HTML content body from DB */}
                <div 
                  className={styles.articleHtmlContent}
                  dangerouslySetInnerHTML={{ 
                    __html: (article.content || '').includes('<section id="faq"') 
                      ? (article.content || '').split('<section id="faq"')[0] 
                      : (article.content || '') 
                  }} 
                />

                {/* FAQs Accordion */}
                {article.faqs.length > 0 && <FAQSection faqs={article.faqs} />}

                {/* Share buttons */}
                <ShareButtons title={article.title} />

                {/* Author Bio Box */}
                <AuthorBox author={article.author} />

              </div>
            </div>
          </div>

          {/* Related Articles Bottom Section */}
          {relatedArticles.length > 0 && (
            <section className={styles.bottomSection}>
              <h2 className={styles.sectionTitle} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Related Guides</h2>
              <div className={styles.bottomGrid}>
                {relatedArticles.map((rel) => (
                  <article key={rel.slug} className={styles.bottomCard}>
                    <Link href={`/${rel.category}/${rel.slug}`}>
                      <div className={styles.bottomImageWrapper}>
                        <Image
                          src={rel.featuredImage}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.bottomCardImage}
                        />
                      </div>
                    </Link>
                    <div className={styles.bottomCardMeta}>
                      <span className={styles.bottomCardCategory}>{rel.category.replace('-', ' ')}</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h3 style={{ margin: '0.5rem 0 0 0', lineHeight: 1.3 }}>
                      <Link href={`/${rel.category}/${rel.slug}`} className={styles.bottomCardLink}>
                        {rel.title}
                      </Link>
                    </h3>
                  </article>
                ))}
              </div>
            </section>
          )}

        </div>
      </article>
    </>
  );
}
