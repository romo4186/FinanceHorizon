import React from 'react';
import { Metadata } from 'next';
import { Mail, MapPin, ShieldAlert, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../static.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | Finance Horizon',
  description: 'Get in touch with the Finance Horizon team. Contact our editorial desk, advertising department, or submit correction requests.',
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Contact' }
  ];

  return (
    <section className={styles.layout}>
      <div className="container">
        
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.document}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Reach out to our editorial desks, support team, or partnership managers.
          </p>

          <div className={styles.content}>
            <p>
              We value comments, questions, suggestions, and corrections from our readers. Please review the contact options below to ensure your message reaches the appropriate desk.
            </p>

            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} className="text-primary-color" />
                  Editorial Desk
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Contact our editors regarding corrections, articles, or pitches.
                </p>
                <a href="mailto:editor@financehorizon.com" className="text-primary-color" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  editor@financehorizon.com
                </a>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={18} className="text-secondary-color" />
                  Compliance & Legal
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Submit licensing inquiries or privacy policy claims.
                </p>
                <a href="mailto:compliance@financehorizon.com" className="text-secondary-color" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  compliance@financehorizon.com
                </a>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} className="text-primary-color" />
                  Office Address
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Finance Horizon Publishing LLC<br />
                  100 Federal Street, Suite 1900<br />
                  Boston, MA 02110
                </p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={18} className="text-secondary-color" />
                  Phone Line
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Open Monday-Friday, 9:00 AM - 5:00 PM EST.
                </p>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  +1 (617) 555-0145
                </span>
              </div>
            </div>

            <h2 style={{ marginTop: '2.5rem' }}>Submission Guidelines</h2>
            <p>
              Before sending an email, please review our <a href="/editorial-policy">Editorial Policy</a>. We do not accept sponsored posts or paid links written by guest authors that do not meet our quality guidelines. All written suggestions are reviewed by our editors within 3 business days.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
