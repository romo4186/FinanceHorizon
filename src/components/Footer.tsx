import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { TwitterIcon as Twitter, FacebookIcon as Facebook, LinkedinIcon as Linkedin } from './BrandIcons';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Logo & Blurb */}
          <div className={styles.brandColumn}>
            <div className={styles.logo}>
              <Compass className={styles.logoIcon} size={24} />
              <span>
                Finance<span className={styles.logoAccent}>Horizon</span>
              </span>
            </div>
            <p className={styles.tagline}>
              Navigate your financial future. Finance Horizon provides professional, expert-reviewed guides, comparison tables, and calculations to help you make smarter financial decisions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className={styles.columnTitle}>Categories</h4>
            <ul className={styles.list}>
              <li>
                <Link href="/credit-cards" className={styles.link}>
                  Credit Cards
                </Link>
              </li>
              <li>
                <Link href="/banking" className={styles.link}>
                  Banking
                </Link>
              </li>
              <li>
                <Link href="/investing" className={styles.link}>
                  Investing
                </Link>
              </li>
              <li>
                <Link href="/insurance" className={styles.link}>
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial */}
          <div>
            <h4 className={styles.columnTitle}>Compliance</h4>
            <ul className={styles.list}>
              <li>
                <Link href="/about" className={styles.link}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.link}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className={styles.link}>
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className={styles.link}>
                  General Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.link}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Blurb */}
          <div>
            <h4 className={styles.columnTitle}>Finance Horizon Insights</h4>
            <p className={styles.newsletterText}>
              Subscribe to our editorial feed for weekly breakdowns of credit score shifts, banking yield spikes, and ETF strategies.
            </p>
            <div className={styles.socials}>
              <a
                href="https://twitter.com/financehorizon"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Follow on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com/financehorizon"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Follow on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://linkedin.com/company/financehorizon"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Follow on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Financial Disclaimer Block */}
        <div className={styles.disclaimerBox}>
          <div className={styles.disclaimerTitle}>General Disclaimer</div>
          <p>
            Disclaimer: The content on Finance Horizon is provided for educational and informational purposes only. It does not constitute professional investment, tax, legal, or financial advice. We recommend consulting with a certified financial planner or qualified specialist before making any major financial decisions. Finance Horizon may receive compensation from partner affiliate links; however, this compensation does not impact our editorial ratings or independent evaluations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            © {currentYear} Finance Horizon. All rights reserved. Navigate Your Financial Future™.
          </div>
          <div>
            U.S. Market Edition. All rates and fees are subject to change.
          </div>
        </div>
      </div>
    </footer>
  );
}
