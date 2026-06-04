import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'General Disclaimer | Finance Horizon',
  description: 'Read the editorial and financial disclaimer of Finance Horizon. Learn about our advertising disclosure and liability limits.',
  alternates: {
    canonical: '/disclaimer'
  }
};

export default function DisclaimerPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'General Disclaimer' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>General Disclaimer</h1>
          <p className={styles.subtitle}>
            Last updated: June 4, 2026
          </p>

          <div className={styles.content}>
            <p>
              By using the website <strong>Finance Horizon</strong> (www.financehorizon.com), you accept this disclaimer in full. If you disagree with any part of this disclaimer, you must not use our website.
            </p>

            <h2>No Professional Financial Advice</h2>
            <p>
              The content published on Finance Horizon is for educational, informational, and entertainment purposes only. Finance Horizon is not a registered investment advisor, broker-dealer, or fiduciary. No content on this site should be construed as professional investment, tax, legal, or financial advice.
            </p>
            <p>
              Although our authors are certified experts (such as CFPs and CFAs), the financial markets are dynamic and individual situations vary. We recommend that you consult with a certified financial planner, tax advisor, or legal professional before executing any financial products, credit cards, or investments.
            </p>

            <h2>Affiliate Compensation Disclosure</h2>
            <p>
              In compliance with the Federal Trade Commission (FTC) guidelines, please be aware that Finance Horizon receives compensation from various credit card issuers, banking institutions, and insurance providers featured on our website.
            </p>
            <p>
              This compensation may impact where and in what order products appear on our pages. It may also affect our comparison tables. However, this compensation does **not** dictate our editorial evaluations, review ratings, or independent research. We routinely review and recommend competitive products that do not compensate us to ensure our readers receive high-value financial recommendations.
            </p>

            <h2>Accuracy of Information</h2>
            <p>
              We make every effort to ensure that the information on this website—such as annual percentage yields (APYs), credit card sign-up bonuses, fee structures, and insurance discounts—is accurate and up to date at the time of publication. 
            </p>
            <p>
              However, financial institutions frequently adjust their rates, rewards, and terms. Finance Horizon does not guarantee the accuracy, timeliness, or completeness of the information on this website. All products are presented without warranty. Please verify rates, terms, and conditions directly with the financial institution before opening an account or signing up.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Under no circumstances will Finance Horizon, its owners, writers, or affiliates be held liable for any financial loss, damages, or legal actions resulting from the use of, or reliance upon, the information or links provided on this website. You agree that any financial products you register for are selected at your own discretion and risk.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
