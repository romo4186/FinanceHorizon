'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import styles from './NewsletterSignup.module.css';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    
    // Simulate API call to email provider
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setStatus('success');
    setEmail('');
  };

  return (
    <div className={styles.card}>
      {status === 'success' ? (
        <div className={styles.successMessage}>
          <div className={styles.successTitle}>
            <CheckCircle size={24} />
            You're In!
          </div>
          <p className={styles.successText}>
            Thank you for subscribing. We will send you our latest financial insights and reviews direct to your inbox every Thursday.
          </p>
        </div>
      ) : (
        <>
          <h3 className={styles.title}>Get Weekly Financial Insights</h3>
          <p className={styles.description}>
            Join 50,000+ Americans who receive our expert guides on credit cards, banking, and investing. Zero spam, unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <label htmlFor="newsletter-email" className="visually-hidden">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !email.includes('@')}
              className={styles.button}
            >
              {status === 'loading' ? (
                'Joining...'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Subscribe <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
