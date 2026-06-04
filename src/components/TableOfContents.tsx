import React from 'react';
import { AlignLeft } from 'lucide-react';
import styles from './TableOfContents.module.css';

interface TOCSection {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: TOCSection[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  if (sections.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <AlignLeft size={18} />
        Table of Contents
      </h3>
      <ol className={styles.list}>
        {sections.map((section) => (
          <li key={section.id} className={styles.item}>
            <a href={`#${section.id}`} className={styles.link}>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
