import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className={styles.item} aria-current={isLast ? 'page' : undefined}>
              {!isLast && item.url ? (
                <>
                  <Link href={item.url} className={styles.link}>
                    {item.name}
                  </Link>
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className={styles.current}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
