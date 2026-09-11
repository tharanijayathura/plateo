'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import SmokeBackground from '@/components/SmokeBackground/SmokeBackground';
import InteractivePlateShowcase from '@/components/InteractivePlateShowcase/InteractivePlateShowcase';
import CuratedMenuSection from '@/components/CuratedMenuSection/CuratedMenuSection';
import PhilosophySection from '@/components/PhilosophySection/PhilosophySection';
import CulinaryMastersSection from '@/components/CulinaryMastersSection/CulinaryMastersSection';
import ExperienceSection from '@/components/ExperienceSection/ExperienceSection';
import TableAwaitsSection from '@/components/TableAwaitsSection/TableAwaitsSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      {/* Section 1: Hero Landing with Ambient Atmosphere */}
      <section className={styles.heroSection}>
        {/* Optimized Hero Background Image */}
        <Image
          src="/images/platoe%20home%20bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroBgImage}
          quality={80}
        />

        {/* Butter-Smooth Seamless Looping Ambient Smoke Layer */}
        <SmokeBackground playbackRate={0.7} opacity={0.6} />

        {/* Ambient Vignette Overlay */}
        <div className={styles.vignetteOverlay} />

        {/* Main Centered Content */}
        <div className={styles.heroContent}>
          {/* Classical Greek Pillar P Monogram with flanking lines */}
          <div className={styles.logoContainer}>
            <PlateoLogo size={38} showFlankingLines={true} />
          </div>

          {/* Grand Brand Name Title */}
          <h1 className={styles.brandTitle}>
            PLATEO
          </h1>

          {/* Refined Luxury Subtitle / Tagline */}
          <p className={styles.tagline}>
            ELEVATED DINING &nbsp;&bull;&nbsp; TIMELESS EXPERIENCE
          </p>

          {/* Delicate Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Minimal Clean Action Buttons */}
          <div className={styles.actionGroup}>
            <Link href="/menu" className={styles.btnSecondary}>
              Explore Menu
            </Link>
            <Link href="/reservations" className={styles.btnPrimary}>
              Reserve a Table
            </Link>
          </div>
        </div>

        {/* Bottom Minimal Ambience Note */}
        <div className={styles.bottomAmbience}>
          <span>SAVOR &nbsp;&bull;&nbsp; INDULGE &nbsp;&bull;&nbsp; REMEMBER</span>
        </div>
      </section>

      {/* Section 2: Pinned Interactive Culinary Showcase (Video -> Slides Right -> Dish Pops on Right) */}
      <section className={styles.showcaseSection}>
        <InteractivePlateShowcase />
      </section>

      {/* Section 3: Curated Luxury Menu Showcase with Category Filters */}
      <CuratedMenuSection />

      {/* Section 4: The Plateo Brand Philosophy & Culinary Story */}
      <PhilosophySection />

      {/* Section 5: The Culinary Masters Behind The Food */}
      <CulinaryMastersSection />

      {/* Section 6: The Atmosphere & Interior Experience */}
      <ExperienceSection />

      {/* Section 7: Simple Luxury Editorial Reservation Callout */}
      <TableAwaitsSection />
    </div>
  );
}

