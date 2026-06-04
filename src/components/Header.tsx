'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Compass } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when page path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const categories = [
    { name: 'Credit Cards', href: '/credit-cards' },
    { name: 'Banking', href: '/banking' },
    { name: 'Investing', href: '/investing' },
    { name: 'Insurance', href: '/insurance' }
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href) ? styles.navLinkActive : '';
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink} aria-label="Finance Horizon Homepage">
          <Compass className={styles.logoIcon} size={28} />
          <span>
            Finance<span className={styles.logoAccent}>Horizon</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {categories.map((cat) => (
              <li key={cat.href} className={styles.navItem}>
                <Link
                  href={cat.href}
                  className={`${styles.navLink} ${isActive(cat.href)}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Elements */}
        <div className={styles.actions}>
          <Link href="/search" className={styles.searchBtn} aria-label="Open Search Page">
            <Search size={20} />
          </Link>
          
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayOpen : ''}`}>
        <nav aria-label="Mobile Navigation">
          <ul className={styles.mobileNavList}>
            <li>
              <Link href="/" className={styles.mobileNavLink}>
                Home
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.href}>
                <Link href={cat.href} className={styles.mobileNavLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search" className={styles.mobileNavLink}>
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
