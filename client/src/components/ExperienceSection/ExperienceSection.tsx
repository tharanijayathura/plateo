'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './ExperienceSection.module.css';

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    const startPlayback = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
      } catch {
        // Fallback for strict browser autoplay policies
      }
    };

    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener('loadeddata', startPlayback);
      return () => video.removeEventListener('loadeddata', startPlayback);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className={styles.experienceSection} id="experience" aria-label="The Plateo Experience">
      {/* Background Clear Looping Interior Video */}
      <div className={styles.videoWrapper}>
        {isVisible && (
          <video
            ref={videoRef}
            className={styles.bgVideo}
            src="/images/interior%20design1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
        {/* Soft edge gradients for seamless page transition */}
        <div className={styles.topVignette} />
        <div className={styles.bottomVignette} />
        <div className={styles.softAmbientTint} />
      </div>

      {/* Floating Glassmorphic Editorial Showcase */}
      <div className={styles.contentContainer}>
        <div className={styles.experienceCard}>
          {/* Pillar Logo */}
          <div className={styles.logoBadge}>
            <PlateoLogo size={32} showFlankingLines={true} />
          </div>

          {/* Sub-label */}
          <p className={styles.categoryLabel}>THE EXPERIENCE</p>

          {/* Headline */}
          <h2 className={styles.sectionTitle}>
            WHERE GOOD EVENINGS <br />
            <span className={styles.titleGold}>BEGIN.</span>
          </h2>

          {/* Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Main Narrative */}
          <p className={styles.narrative}>
            A thoughtfully designed space, exceptional cuisine, and moments worth sharing.
          </p>

          {/* Ambient Tags */}
          <div className={styles.ambientPills}>
            <span className={styles.ambientPill}>Warm Ambient Glow</span>
            <span className={styles.pillDot}>&bull;</span>
            <span className={styles.ambientPill}>Acoustic Soundscape</span>
            <span className={styles.pillDot}>&bull;</span>
            <span className={styles.ambientPill}>Artisanal Hospitality</span>
          </div>

          {/* Call to Action Button */}
          <div className={styles.actionWrapper}>
            <Link href="/reservations" className={styles.reserveBtn}>
              <span>RESERVE A TABLE</span>
              <span className={styles.arrowIcon}>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
