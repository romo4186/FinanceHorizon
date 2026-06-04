import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Finance Horizon',
  description: 'Read the Privacy Policy of Finance Horizon. Learn how we handle your personal data, browser cookies, and Google AdSense advertisement data tracking.',
  alternates: {
    canonical: '/privacy'
  }
};

export default function PrivacyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Last updated: June 4, 2026
          </p>

          <div className={styles.content}>
            <p>
              At Finance Horizon, accessible from www.financehorizon.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Finance Horizon and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at compliance@financehorizon.com.
            </p>

            <h2>Log Files</h2>
            <p>
              Finance Horizon follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and are a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>

            <h2>Cookies and Web Beacons</h2>
            <p>
              Like any other website, Finance Horizon uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h2>Google DoubleClick DART Cookie</h2>
            <p>
              Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.financehorizon.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.
            </p>

            <h2>Our Advertising Partners</h2>
            <p>
              Some of the advertisers on our site may use cookies and web beacons. Our advertising partners include:
            </p>
            <ul>
              <li><strong>Google AdSense:</strong> Privacy policies regarding Google can be checked directly at Google's Privacy & Terms site. Google uses technology to serve advertisements and links that appear on Finance Horizon directly to users' browsers.</li>
            </ul>

            <h2>Newsletter Subscriptions</h2>
            <p>
              If you subscribe to our weekly newsletter, we collect your email address. This information is stored securely with our third-party email service provider and is used exclusively to send you financial newsletters. We will never sell, trade, or rent your email address to outside organizations. You can unsubscribe at any time by clicking the "Unsubscribe" link at the bottom of any email.
            </p>

            <h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p>
              Under the CCPA, among other rights, California consumers have the right to:
            </p>
            <ul>
              <li>Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
              <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
            </ul>
            <p>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </p>

            <h2>GDPR Data Protection Rights</h2>
            <p>
              We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>
            <ul>
              <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
