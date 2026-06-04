import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { TwitterIcon as Twitter, LinkedinIcon as Linkedin } from './BrandIcons';
import { Author } from '../types';
import styles from './AuthorBox.module.css';

interface AuthorBoxProps {
  author: Author;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <Image
          src={author.avatar}
          alt={author.name}
          width={100}
          height={100}
          className={styles.avatar}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.role}>{author.role}</div>
        <h3 className={styles.name}>
          <Link href={`/author/${author.slug}`}>{author.name}</Link>
        </h3>
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
              <Twitter size={18} />
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
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
