'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './Footer.module.css';

const NewsletterSignup = dynamic(() => Promise.resolve(NewsletterSignupContent), {
  ssr: false,
  loading: () => <NewsletterPlaceholder />,
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Plateo Footer" suppressHydrationWarning>
      {/* Top Ambient Gold Glow */}
      <div className={styles.topAmbientGlow} />

      {/* Main Wide Container (1360px - wider than upper section) */}
      <div className={styles.wideContainer}>
        {/* 4 Gradient Columns Grid */}
        <div className={styles.columnsGrid}>
          
          {/* Column 1: Brand & Identity */}
          <div className={`${styles.gradientCard} ${styles.brandCard}`}>
            <div className={styles.cardGlowBorder} />
            <div className={styles.brandHeader}>
              <div className={styles.logoWrapper}>
                <PlateoLogo size={36} showFlankingLines={true} />
              </div>
              <h2 className={styles.brandTitle}>PLATEO</h2>
              <p className={styles.brandSub}>COLOMBO &bull; ELEGANCE &bull; FINE DINING</p>
            </div>
            
            <p className={styles.brandTagline}>
              An elevated sanctuary of epicurean taste, precision plating, and timeless Sri Lankan hospitality.
            </p>

            <div className={styles.openBadge}>
              <span className={styles.pulseDot} />
              <span>OPEN DAILY &bull; 8:00 AM – 12:00 AM</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className={`${styles.gradientCard} ${styles.navCard}`}>
            <div className={styles.cardGlowBorder} />
            <h3 className={styles.cardHeading}>
              <span>NAVIGATE</span>
              <span className={styles.headingUnderline} />
            </h3>
            
            <ul className={styles.navList}>
              <li>
                <Link href="/" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>Home Landing</span>
                </Link>
              </li>
              <li>
                <Link href="/menu" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>A La Carte Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>Signature Plating</span>
                </Link>
              </li>
              <li>
                <Link href="/#philosophy" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>Brand Philosophy</span>
                </Link>
              </li>
              <li>
                <Link href="/#experience" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>The Atmosphere</span>
                </Link>
              </li>
              <li>
                <Link href="/reservations" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>Table Reservations</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.navLink}>
                  <span className={styles.linkArrow}>&rarr;</span>
                  <span>Our Culinary Story</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sri Lankan Address & Contact */}
          <div className={`${styles.gradientCard} ${styles.contactCard}`}>
            <div className={styles.cardGlowBorder} />
            <h3 className={styles.cardHeading}>
              <span>LOCATION &amp; CONTACT</span>
              <span className={styles.headingUnderline} />
            </h3>

            <div className={styles.contactDetails}>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>&#128205;</span>
                <div className={styles.infoText}>
                  <strong>No. 48, Lotus Promenade</strong>
                  <span>Galle Face District, Colombo 03</span>
                  <span>Sri Lanka</span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>&#128222;</span>
                <div className={styles.infoText}>
                  <span className={styles.label}>Direct Reservations</span>
                  <a href="tel:+94712599785" className={styles.phoneLink}>
                    +94 712599785
                  </a>
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>&#9993;</span>
                <div className={styles.infoText}>
                  <span className={styles.label}>Concierge &amp; Events</span>
                  <a href="mailto:reservations@plateo.lk" className={styles.emailLink}>
                    reservations@plateo.lk
                  </a>
                </div>
              </div>

              <div className={styles.valetNote}>
                <span>&bull; Smart Elegant Attire</span>
                <span>&bull; Private Valet Parking Available</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Private Tastings */}
          <div className={`${styles.gradientCard} ${styles.newsletterCard}`}>
            <div className={styles.cardGlowBorder} />
            <h3 className={styles.cardHeading}>
              <span>PRIVATE INQUIRIES</span>
              <span className={styles.headingUnderline} />
            </h3>

            <p className={styles.newsletterText}>
              Subscribe for private invitations to seasonal chef tasting menus, sommelier pairings, and exclusive dining events.
            </p>

            <NewsletterSignup />

            <div className={styles.socialHandles}>
              <span className={styles.socialLabel}>FOLLOW US</span>
              <div className={styles.socialLinks}>
                <a href="#instagram" aria-label="Instagram">Instagram</a>
                <span className={styles.socialDot}>&bull;</span>
                <a href="#facebook" aria-label="Facebook">Facebook</a>
                <span className={styles.socialDot}>&bull;</span>
                <a href="#michelin" aria-label="Michelin Guide">Michelin Guide</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Bar */}
        <div className={styles.bottomSubBar}>
          <p className={styles.copyrightText}>
            &copy; {currentYear} PLATEO Luxury Dining. All Rights Reserved. Crafted for elevated gastronomy in Colombo.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/ethics">Culinary Ethics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterPlaceholder() {
  return (
    <div className={styles.subscribeForm} aria-hidden="true">
      <div className={`${styles.inputWrapper} ${styles.inputSkeleton}`} />
    </div>
  );
}

function NewsletterSignupContent() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  if (subscribed) {
    return (
      <div className={styles.subscribedBox}>
        <span className={styles.checkIcon}>&#10003;</span>
        <p>Thank you for subscribing. Our concierge will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
      <div className={styles.inputWrapper}>
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.emailInput}
        />
        <button type="submit" className={styles.submitBtn}>
          <span>JOIN</span>
          <span>&rarr;</span>
        </button>
      </div>
    </form>
  );
}
