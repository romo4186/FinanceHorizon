import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SearchClient from './SearchClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './search.module.css';

export const metadata: Metadata = {
  title: 'Search Financial Guides',
  description: 'Search our database of expert personal finance reviews, comparison guides, and strategies on Finance Horizon.',
  alternates: {
    canonical: '/search'
  }
};

export default function SearchPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Search' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Titles */}
        <h1 className={styles.title}>Search Guides & Reviews</h1>
        <p className={styles.subtitle}>
          Query our database of expert-written financial columns.
        </p>

        {/* Suspense Boundary wrapping Client Search Logic */}
        <Suspense fallback={<div className="text-center text-muted">Loading search client...</div>}>
          <SearchClient />
        </Suspense>

      </div>
    </section>
  );
}
