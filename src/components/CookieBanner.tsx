'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('finance_horizon_cookie_consent');
    if (!consent) {
      // Small delay for better UX transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('finance_horizon_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('finance_horizon_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.bannerContainer} id="cookie-consent-banner">
      <div className={styles.bannerContent}>
        <div className={styles.textContainer}>
          <h4 className={styles.title}>Cookie Consent</h4>
          <p className={styles.description}>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our{' '}
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleDecline} className={styles.declineBtn} id="btn-cookie-decline">
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptBtn} id="btn-cookie-accept">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
