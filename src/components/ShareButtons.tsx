'use client';

import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { TwitterIcon as Twitter, FacebookIcon as Facebook, LinkedinIcon as Linkedin } from './BrandIcons';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.href));
  }, []);

  const encodedTitle = encodeURIComponent(title);

  if (!shareUrl) {
    // Return empty placeholders with static sizes during SSR to avoid layout shift
    return (
      <div className={styles.container}>
        <span className={styles.label}>Share:</span>
        <div className={styles.buttons}>
          <div className={`${styles.btn} ${styles.email}`} style={{ opacity: 0.1 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Share this guide:</span>
      <div className={styles.buttons}>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.twitter}`}
          aria-label="Share on Twitter"
        >
          <Twitter size={18} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.facebook}`}
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.linkedin}`}
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a
          href={`mailto:?subject=${encodedTitle}&body=Check%20out%20this%20financial%20guide%3A%20${shareUrl}`}
          className={`${styles.btn} ${styles.email}`}
          aria-label="Share via Email"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  );
}
