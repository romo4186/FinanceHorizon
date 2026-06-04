'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';
import styles from './FAQSection.module.css';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Frequently Asked Questions (FAQ)</h2>
      <div className={styles.list}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
              <button
                type="button"
                className={styles.questionButton}
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`}
                  size={20}
                />
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`${styles.answerPanel} ${isOpen ? styles.answerPanelOpen : ''}`}
                aria-hidden={!isOpen}
              >
                {isOpen && (
                  <div className={styles.answerContent}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
