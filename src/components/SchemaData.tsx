import React from 'react';
import { Article, FAQItem } from '../types';

interface SchemaDataProps {
  type: 'organization' | 'breadcrumbs' | 'article' | 'faq';
  article?: Article;
  breadcrumbs?: Array<{ name: string; item: string }>;
  faqs?: FAQItem[];
}

export default function SchemaData({ type, article, breadcrumbs, faqs }: SchemaDataProps) {
  let schemaData: object | null = null;
  const siteUrl = 'https://www.financehorizon.com'; // In production, this can come from environment variables

  if (type === 'organization') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Finance Horizon',
      'alternateName': 'FinanceHorizon',
      'url': siteUrl,
      'logo': `${siteUrl}/images/logo.png`,
      'sameAs': [
        'https://www.facebook.com/financehorizon',
        'https://twitter.com/financehorizon',
        'https://www.linkedin.com/company/financehorizon'
      ],
      'description': 'Navigate your financial future with expert-reviewed guides on credit cards, banking, investing, and insurance.'
    };
  } else if (type === 'breadcrumbs' && breadcrumbs) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.item.startsWith('http') ? crumb.item : `${siteUrl}${crumb.item}`
      }))
    };
  } else if (type === 'article' && article) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${siteUrl}/${article.category}/${article.slug}`
      },
      'headline': article.title,
      'description': article.metaDescription,
      'image': article.featuredImage,
      'datePublished': new Date(article.publishDate).toISOString(),
      'dateModified': new Date(article.publishDate).toISOString(),
      'author': {
        '@type': 'Person',
        'name': article.author.name,
        'jobTitle': article.author.role,
        'description': article.author.bio,
        'url': `${siteUrl}/author/${article.author.slug}`
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Finance Horizon',
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/images/logo.png`
        }
      }
    };
  } else if (type === 'faq' && faqs && faqs.length > 0) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
