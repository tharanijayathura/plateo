'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './PhilosophySection.module.css';

export default function PhilosophySection() {
  return (
    <section className={styles.philosophySection} id="philosophy" aria-label="The Plateo Philosophy">
      {/* Full-Bleed Background Image (Chef on Left, Deep Black on Right) */}
      <div className={styles.bgImageWrapper}>
        <Image
          src="/images/philosophy.webp"
          alt="Executive Chef garnishing signature plate at Plateo"
          fill
          priority={false}
          sizes="100vw"
          className={styles.bgImage}
        />
        {/* Cinematic atmospheric overlays to blend top/bottom and enhance right side legibility */}
        <div className={styles.topNoirGradient} />
        <div className={styles.bottomNoirGradient} />
        <div className={styles.rightBlackFade} />
      </div>

      {/* Content Placed Directly on the Black Right Side */}
      <div className={styles.contentContainer}>
        <div className={styles.textBlock}>
          {/* Top Classical Pillar Monogram */}
          <div className={styles.logoBadge}>
            <PlateoLogo size={32} showFlankingLines={true} />
          </div>

          {/* Section Heading */}
          <h2 className={styles.sectionTitle}>
            THE PLATEO <br />
            <span className={styles.titleGold}>PHILOSOPHY</span>
          </h2>

          {/* Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Highlight Lead Quote */}
          <div className={styles.leadQuote}>
            <p className={styles.leadLine}>More than a meal.</p>
            <p className={styles.leadLine}>A moment worth remembering.</p>
          </div>

          {/* Narrative Paragraphs */}
          <div className={styles.narrative}>
            <p>
              At Plateo, every dish is created with care, balance and imagination.
            </p>
            <p>
              From carefully selected ingredients to the final touch on the plate,
              every detail has a purpose.
            </p>
          </div>

          {/* CTA Action Button */}
          <div className={styles.actionWrapper}>
            <Link href="/about" className={styles.storyBtn}>
              <span>DISCOVER OUR STORY</span>
              <span className={styles.arrowIcon}>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
