import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'About Us | Finance Horizon',
  description: 'Learn about Finance Horizon\'s mission, our financial credentials, editorial guidelines, and expert writing team.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'About Us' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>About Finance Horizon</h1>
          <p className={styles.subtitle}>
            Empowering Americans to navigate their financial future with confidence.
          </p>

          <div className={styles.content}>
            <p>
              Welcome to <strong>Finance Horizon</strong>. Established in 2026, we are an independent financial publishing platform dedicated to providing clear, actionable, and expert-reviewed financial insights for residents across the United States.
            </p>
            <p>
              Our goal is simple: to demystify complex personal finance topics—ranging from picking the right credit card to choosing a health insurance deductible or setting up a Roth IRA—so that you can make smarter decisions with your money.
            </p>

            <h2>Our Editorial Philosophy</h2>
            <p>
              We believe that financial information must be trustworthy, transparent, and accurate. That's why we maintain strict editorial independence. 
            </p>
            <ul>
              <li><strong>Expert Writing Team:</strong> All our articles are researched and written by certified professionals, including Certified Financial Planners (CFP®), Chartered Financial Analysts (CFA), and risk strategy analysts.</li>
              <li><strong>Evidence-Based Reporting:</strong> We back up all reviews with comparison data, real interest rates, and official federal regulations (like the FDIC and NCUA limits).</li>
              <li><strong>No Pay-to-Play:</strong> Our reviews are never influenced by affiliate partnerships. While we do receive compensation from credit card issuers or banks when you click their links, our editorial ratings remain 100% objective.</li>
            </ul>

            <h2>Meet Our Expert Contributors</h2>
            <p>
              Our team consists of specialists who write about what they know best:
            </p>
            <ul>
              <li><strong>Sarah Jenkins, CFP®:</strong> Senior Credit Card Analyst specializing in consumer interest rates, credit score modeling, and rewards arbitrage.</li>
              <li><strong>David Vance, CFA:</strong> Investing & Retirement Editor specializing in index fund strategies, stock market basics, and tax-deferred accounts.</li>
              <li><strong>Amanda Ross, ChFC®:</strong> Banking & Cash Management Editor tracking high-yield savings interest shifts and bank sign-up promotions.</li>
              <li><strong>Marcus Thorne, CPCU®:</strong> Insurance Analyst comparing premium costs and explaining policy coverages for families.</li>
            </ul>

            <h2>Contact Information</h2>
            <p>
              Have questions, feedback, or editorial corrections? We'd love to hear from you. Visit our <a href="/contact">Contact Page</a> to get in touch with our editorial desk in Boston, MA.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
