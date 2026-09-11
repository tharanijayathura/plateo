'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TableAwaitsSection.module.css';

export default function TableAwaitsSection() {
  return (
    <section className={styles.tableAwaitsSection} id="reservation-callout" aria-label="Your Table Awaits">
      {/* Soft Ambient Background Lighting */}
      <div className={styles.ambientGlow} />

      {/* Expanded Low-Height Editorial Container */}
      <div className={styles.contentContainer}>
        {/* Category Tag */}
        <p className={styles.categoryLabel}>YOUR TABLE AWAITS</p>

        {/* Section Headline */}
        <h2 className={styles.sectionTitle}>
          AN EVENING WORTH <span className={styles.titleGold}>REMEMBERING.</span>
        </h2>

        {/* Narrative Copy */}
        <div className={styles.narrativeBlock}>
          <p>
            At Plateo, every detail is considered — from the first pour to the final plate.&nbsp;
            <Link href="/reservations" className={styles.subNarrativeLink}>
              Reserve your table and make the evening yours &rarr;
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
