import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service | Finance Horizon',
  description: 'Read the Terms of Service for Finance Horizon. Learn about the terms and conditions governing your use of our financial website.',
  alternates: {
    canonical: '/terms'
  }
};

export default function TermsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Terms of Service' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>
            Last updated: June 4, 2026
          </p>

          <div className={styles.content}>
            <p>
              Welcome to <strong>Finance Horizon</strong>. These Terms of Service govern your use of our website located at www.financehorizon.com and any services, content, or materials made available through this site.
            </p>
            <p>
              By accessing or using our website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>

            <h2>Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, Finance Horizon and/or its licensors own the intellectual property rights for all material on this website, including all written articles, comparison charts, logos, design components, and custom code. All intellectual property rights are reserved.
            </p>
            <p>
              You may access this content for your personal, non-commercial use only, subject to restrictions set in these terms:
            </p>
            <ul>
              <li>You must not copy, republish, or duplicate articles, guides, or data tables from Finance Horizon onto other websites without explicit written consent.</li>
              <li>You must not sell, rent, or sub-license material from Finance Horizon.</li>
              <li>You must not reproduce, duplicate, or copy material from Finance Horizon for commercial purposes.</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>
              You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of Finance Horizon. You must not use our website in any way which is unlawful, illegal, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
            </p>

            <h2>User Content</h2>
            <p>
              In these terms, "your user content" means material (including, without limitation, text, comments, and messages) that you submit to our website, for whatever purpose. You grant to Finance Horizon a non-exclusive, irrevocable, royalty-free license to use, reproduce, adapt, publish, and translate your user content in any existing or future media.
            </p>
            <p>
              Your user content must not be illegal, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action against you or Finance Horizon. We reserve the right to edit or remove any material submitted to our website.
            </p>

            <h2>No Warranties</h2>
            <p>
              This website is provided "as is" without any representations or warranties, express or implied. Finance Horizon makes no representations or warranties in relation to this website or the information and materials provided on this website. We do not warrant that the website will be constantly available, or that the information on this website is complete, true, accurate, or non-misleading.
            </p>

            <h2>Breaches of These Terms</h2>
            <p>
              Without prejudice to Finance Horizon's other rights under these terms, if you breach these terms in any way, we may take such action as we deem appropriate to deal with the breach, including suspending your access to the website, blocking your IP address, or pursuing legal action.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
