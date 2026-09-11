'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './Header.module.css';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const navLinks = [
    { name: 'Home', href: '/', num: '01' },
    { name: 'Menu', href: '/menu', num: '02' },
    { name: 'Reservations', href: '/reservations', num: '03' },
    { name: 'About', href: '/about', num: '04' },
    { name: 'Contact', href: '/contact', num: '05' },
  ];

  return (
    <>
      {/* Sleek Floating Luxury Burger Menu Button */}
      <button
        className={styles.floatingMenuTrigger}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Navigation Menu"
        aria-expanded={isSidebarOpen}
      >
        <div className={styles.menuIconBars}>
          <span className={styles.iconBar} />
          <span className={styles.iconBar} />
        </div>
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`${styles.backdrop} ${isSidebarOpen ? styles.backdropActive : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Side Drawer Navigation */}
      <aside
        className={`${styles.sideDrawer} ${isSidebarOpen ? styles.sideDrawerOpen : ''}`}
        aria-label="Side Navigation"
      >
        {/* Subtle Ambient Golden Glows */}
        <div className={styles.drawerTopGlow} />
        <div className={styles.drawerBottomGlow} />

        <div className={styles.drawerInner}>
          {/* Drawer Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerBrand}>
              <div className={styles.brandTextGroup}>
                <span className={styles.drawerBrandTitle}>PLATEO</span>
                <span className={styles.drawerBrandSub}>COLOMBO</span>
              </div>
            </div>

            <button
              className={styles.closeBtn}
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close Navigation Menu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Clean Gold Hairline Divider */}
          <div className={styles.divider} />

          {/* Navigation Links */}
          <nav className={styles.drawerNav}>
            <p className={styles.navMenuLabel}>EXPLORE</p>
            <ul className={styles.drawerNavList}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className={styles.drawerNavItem}>
                    <Link
                      href={link.href}
                      className={`${styles.drawerNavLink} ${isActive ? styles.activeNavLink : ''}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className={styles.navNum}>{link.num}</span>
                      <span className={styles.navName}>{link.name}</span>
                      <span className={styles.navArrow}>&rarr;</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Action Reservation */}
          <div className={styles.drawerCta}>
            <Link
              href="/reservations"
              className={styles.reserveBtn}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>BOOK A TABLE</span>
              <span className={styles.ctaArrow}>&rarr;</span>
            </Link>
          </div>

          {/* Drawer Concierge / Footer Info Card */}
          <div className={styles.drawerFooter}>
            <div className={styles.footerHeader}>
              <span className={styles.conciergeLabel}>CONCIERGE &amp; LOCATION</span>
              <span className={styles.openPill}>
                <span className={styles.pulseDot} />
                <span>OPEN DAILY</span>
              </span>
            </div>

            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>LOCATION</p>
              <p className={styles.infoValue}>No. 48, Lotus Promenade, Colombo 03</p>
            </div>
            
            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>HOURS</p>
              <p className={styles.infoValue}>Mon–Sun: 8:00 AM – 12:00 AM (All Day)</p>
            </div>
            
            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>RESERVATIONS</p>
              <a href="tel:+94712599785" className={styles.infoLink}>
                +94 712599785
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
