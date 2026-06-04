'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Compass, Calendar, BookOpen } from 'lucide-react';
import { querySearch } from '@/app/actions/articles';
import { Article } from '@/types';
import styles from './search.module.css';

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get initial query from URL search param
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);

  // Update query state if URL search param changes (e.g., browser back button)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Execute search when query changes
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      let active = true;
      querySearch(trimmedQuery).then((matches) => {
        if (active) {
          setResults(matches);
        }
      });
      return () => {
        active = false;
      };
    } else {
      setResults([]);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce/Transition URL parameter update
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.replace(`/search?${params.toString()}`);
    });
  };

  return (
    <div>
      {/* Search Input Bar */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search for articles, cards, banking bonuses, etc..."
          value={query}
          onChange={handleInputChange}
          className={styles.searchInput}
          autoFocus
        />
        <Search className={styles.searchIcon} size={22} />
      </div>

      {/* Results Header */}
      {query.trim().length >= 2 && (
        <div className={styles.resultsMeta}>
          {results.length} {results.length === 1 ? 'result' : 'results'} found for "{query}"
        </div>
      )}

      {/* Results Listing */}
      {results.length > 0 ? (
        <div className={styles.resultsGrid}>
          {results.map((article) => (
            <div key={article.slug} className={styles.resultCard}>
              <div className={styles.resultCategory}>
                {article.category.replace('-', ' ')}
              </div>
              <h3 className={styles.resultTitle}>
                <Link
                  href={`/${article.category}/${article.slug}`}
                  className={styles.resultTitleLink}
                >
                  {article.title}
                </Link>
              </h3>
              <p className={styles.resultExcerpt}>{article.metaDescription}</p>
              
              <div className={styles.resultFooter}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {article.publishDate}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BookOpen size={12} /> {article.readTime}
                </span>
                <span>•</span>
                <span>By {article.author.name}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        query.trim().length >= 2 && (
          <div className={styles.emptyState}>
            <Compass size={48} className="text-muted" style={{ strokeWidth: 1.5 }} />
            <div className={styles.emptyTitle}>No matches found</div>
            <p className={styles.emptyText}>
              We couldn't find any guides matching your query. Try searching for common financial terms like "credit score", "savings", "ETF", or "auto insurance".
            </p>
          </div>
        )
      )}

      {query.trim().length < 2 && (
        <div className={styles.emptyState}>
          <Search size={48} className="text-muted" style={{ strokeWidth: 1.5 }} />
          <div className={styles.emptyTitle}>Type to start searching</div>
          <p className={styles.emptyText}>
            Enter at least two letters to query our expert reviews database.
          </p>
        </div>
      )}
    </div>
  );
}
