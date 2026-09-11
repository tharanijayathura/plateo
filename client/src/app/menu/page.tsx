'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import { ALL_MENU_ITEMS, CATEGORIES_CONFIG, MenuCategory } from '@/data/menuData';
import styles from './menu.module.css';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tastingNote && item.tastingNote.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className={styles.menuPage}>
      {/* Ambient Noir Glows */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      {/* Hero Header */}
      <header className={styles.headerSection}>
        <div className={styles.navBreadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            &larr; BACK TO HOME
          </Link>
        </div>

        <div className={styles.logoWrapper}>
          <PlateoLogo size={36} showFlankingLines={true} />
        </div>

        <div className={styles.collectionBadge}>
          <span className={styles.badgeDiamond}>&#9671;</span>
          <span>THE COMPLETE EPICUREAN COLLECTION</span>
          <span className={styles.badgeDiamond}>&#9671;</span>
        </div>

        <h1 className={styles.pageTitle}>
          OUR COMPLETE <br />
          <span>A LA CARTE MENU</span>
        </h1>

        <p className={styles.pageSubtitle}>
          From morning brioche and cloud pancakes to hearth-seared wagyu, Atlantic lobster, and
          small-batch craft libations—explore our entire culinary spectrum.
        </p>

        {/* Search Bar & Category Filters */}
        <div className={styles.controlsContainer}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>&#9906;</span>
            <input
              type="text"
              placeholder="Search by ingredient, dish, or tasting note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search dishes"
            />
            {searchQuery && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className={styles.filterScrollTrack} role="tablist" aria-label="Filter dishes by category">
            {CATEGORIES_CONFIG.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span className={styles.filterLabel}>{cat.label}</span>
                  <span className={styles.filterCount}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Menu Cards Grid */}
      <section className={styles.gridSection} aria-label="Menu Items">
        {filteredItems.length > 0 ? (
          <div className={styles.menuGrid}>
            {filteredItems.map((item, index) => (
              <article
                key={item.id}
                className={styles.menuCard}
                style={{ animationDelay: `${Math.min(index * 0.04, 0.3)}s` }}
              >
                {/* Image Container */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.imageOverlay} />

                  {/* Badge */}
                  {item.badge && (
                    <div className={styles.itemBadge}>
                      <span>{item.badge}</span>
                    </div>
                  )}
                </div>

                {/* Body details */}
                <div className={styles.cardBody}>
                  <div className={styles.titlePriceRow}>
                    <h2 className={styles.itemName}>{item.name}</h2>
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
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No culinary creations match your search.</p>
            <button
              className={styles.resetFiltersBtn}
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </section>

      {/* Reservation CTA Footer Banner */}
      <footer className={styles.reservationBanner}>
        <h2 className={styles.reservationTitle}>EXPERIENCE IT IN PERSON</h2>
        <p className={styles.reservationSubtitle}>
          Reserve your table for lunch, dinner, or our weekend tasting experience.
        </p>
        <div className={styles.bannerActions}>
          <Link href="/reservations" className={styles.btnPrimary}>
            RESERVE A TABLE
          </Link>
          <Link href="/contact" className={styles.btnSecondary}>
            PRIVATE BANQUET INQUIRIES
          </Link>
        </div>
      </footer>
    </main>
  );
}
