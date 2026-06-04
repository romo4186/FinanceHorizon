import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'Editorial Policy | Finance Horizon',
  description: 'Read the Editorial Policy of Finance Horizon. Learn about our fact-checking procedures, correction policies, and our commitment to financial E-E-A-T.',
  alternates: {
    canonical: '/editorial-policy'
  }
};

export default function EditorialPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Editorial Policy' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>Editorial Policy</h1>
          <p className={styles.subtitle}>
            Empowering readers with accurate, unbiased, and expert-reviewed financial content.
          </p>

          <div className={styles.content}>
            <p>
              At Finance Horizon, our primary mission is to help you navigate your financial future with confidence. To do this, we must maintain your trust by publishing content that is accurate, clear, and objective. 
            </p>
            <p>
              This Editorial Policy outlines our standards for writing, fact-checking, and updating the financial information on our website.
            </p>

            <h2>1. Expert Authorship & Review</h2>
            <p>
              We do not publish articles written by generalist writers without financial credentials. Every guide, product review, and calculation on Finance Horizon is written or reviewed by a qualified personal finance professional. Our team includes:
            </p>
            <ul>
              <li>Certified Financial Planners (CFP®)</li>
              <li>Chartered Financial Analysts (CFA)</li>
              <li>Chartered Financial Consultants (ChFC®)</li>
              <li>Chartered Property Casualty Underwriters (CPCU®)</li>
            </ul>
            <p>
              This ensures that our advice and explanations align with professional financial standards and industry best practices.
            </p>

            <h2>2. Fact-Checking & Accuracy</h2>
            <p>
              Before any article is published, it undergoes a rigorous editing and fact-checking process. Our editors verify all:
            </p>
            <ul>
              <li>Annual Percentage Yields (APYs) and interest rate quotes.</li>
              <li>Credit card sign-up bonuses, spending thresholds, and fee schedules.</li>
              <li>Insurance discount structures and coverage exclusions.</li>
              <li>Federal tax brackets, retirement limits, and FDIC guidelines.</li>
            </ul>
            <p>
              We source our data directly from official corporate pages, federal bureaus (such as the Federal Reserve, IRS, and FDIC), and verified rate aggregators.
            </p>

            <h2>3. Correction & Updates Policy</h2>
            <p>
              The financial landscape changes rapidly. To prevent outdated information from misleading our readers, we review our key guides (such as high-yield savings accounts lists and credit card comparisons) on a monthly basis.
            </p>
            <p>
              If a reader or editor spots an error in any of our articles, we investigate immediately. If a correction is warranted, we update the article and note the correction at the bottom of the page when appropriate. We encourage readers to submit correction requests to editor@financehorizon.com.
            </p>

            <h2>4. Editorial Independence</h2>
            <p>
              Finance Horizon is funded through advertising (Google AdSense) and affiliate compensation. However, our editorial decisions are completely separated from our business partnerships. 
            </p>
            <p>
              Our writing team does not have access to affiliate revenue statistics, and our product evaluations are based strictly on consumer value. If a credit card has a high interest rate or unfavorable terms, our writers will explicitly state that, regardless of our partnership status with the issuer.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
