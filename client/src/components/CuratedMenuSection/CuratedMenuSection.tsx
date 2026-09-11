'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TOP_RATED_ITEMS } from '@/data/menuData';
import styles from './CuratedMenuSection.module.css';

export default function CuratedMenuSection() {
  return (
    <section className={styles.menuSection} id="curated-menu" aria-label="Best Rated Culinary Creations">
      {/* Background Ambient Noir Glows */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <div className={styles.sectionHeader}>
        <div className={styles.collectionBadge}>
          <span className={styles.badgeDiamond}>&#9671;</span>
          <span>HIGHEST RATED BY PATRONS</span>
          <span className={styles.badgeDiamond}>&#9671;</span>
        </div>
        <h2 className={styles.sectionTitle}>
          CROWD FAVORITES &amp; <br />
          <span>SIGNATURE CREATIONS</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Celebrated by our most discerning guests. Handcrafted using ancestral fire techniques,
          flown-in rare harvests, and visionary culinary craftsmanship.
        </p>
      </div>

      {/* Top 3 Rated Dishes Grid */}
      <div className={styles.featuredGridContainer}>
        {TOP_RATED_ITEMS.map((item, index) => (
          <article
            key={item.id}
            className={styles.menuCard}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image Container with Aspect Ratio */}
            <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.cardImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay} />

              {/* Rating & Badge */}
              <div className={styles.itemBadge}>
                <span>{item.badge}</span>
              </div>
            </div>

            {/* Content Details Below Image */}
            <div className={styles.cardBody}>
              <div className={styles.titlePriceRow}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <span className={styles.itemPrice}>{item.price}</span>
              </div>

              <p className={styles.itemDescription}>{item.description}</p>

              {item.tastingNote && (
                <div className={styles.tastingNoteBox}>
                  <span className={styles.noteDiamond}>&#9670;</span>
                  <span className={styles.noteText}>{item.tastingNote}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Button to Navigate to the Full Menu Page */}
      <div className={styles.bottomCtaBanner}>
        <p className={styles.ctaPrompt}>
          Discover all 20 artisanal creations across breakfast, lunch, dinner, desserts, and craft cocktails.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/menu" className={styles.ctaBtnPrimary}>
            EXPLORE OUR FULL MENU &rarr;
          </Link>
          <Link href="/reservations" className={styles.ctaBtnSecondary}>
            RESERVE A TABLE
          </Link>
        </div>
      </div>
      <div className={styles.bottomFadeOverlay} />
    </section>
  );
}
