'use client';

import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import SmokeBackground from '@/components/SmokeBackground/SmokeBackground';
import ManageReservation from '@/components/ManageReservation/ManageReservation';
import styles from '../reservations.module.css';

export default function CustomerManageReservationPage() {
  return (
    <main className={styles.reservationsPage}>
      {/* Background Ambient Smoke and Cinematic Lighting Layers */}
      <SmokeBackground playbackRate={0.65} opacity={0.45} />
      <div className={styles.topNoirGradient} />
      <div className={styles.bottomNoirGradient} />
      <div className={styles.ambientRadialGlow} />

      <div className={styles.pageContainer}>
        {/* Editorial Hero Header */}
        <header className={styles.heroHeader}>
          <div className={styles.logoContainer}>
            <PlateoLogo size={32} showFlankingLines={true} />
          </div>

          <p className={styles.tagline}>RESERVATIONS &bull; COLOMBO</p>

          <h1 className={styles.pageTitle}>
            MANAGE YOUR <span className={styles.goldText}>RESERVATION</span>
          </h1>

          {/* Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link
              href="/reservations"
              style={{
                color: 'rgba(232, 196, 122, 0.8)',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(232, 196, 122, 0.4)',
                paddingBottom: '2px',
              }}
            >
              &larr; Need to book a new table? Click here
            </Link>
          </div>
        </header>

        {/* Two-Column Grid */}
        <div className={styles.contentGrid}>
          <div className={styles.wizardColumn}>
            <ManageReservation />
          </div>

          <aside className={styles.conciergeColumn}>
            <div className={styles.conciergeCardHighlight}>
              <div className={styles.highlightHeader}>
                <span className={styles.pulseDot} />
                <span className={styles.highlightPill}>CONCIERGE DESK</span>
              </div>
              <h3 className={styles.highlightTitle}>NEED IMMEDIATE ASSISTANCE?</h3>
              <p className={styles.highlightText}>
                If you are modifying a reservation within 2 hours of your dining time, please reach out directly to our concierge team.
              </p>

              <div className={styles.contactActions}>
                <a href="tel:+94712599785" className={styles.phoneActionBtn}>
                  <span>CALL +94 712599785</span>
                </a>
                <a
                  href="https://wa.me/94712599785?text=Hello%20Plateo%20Concierge,%20I%20need%20to%20modify%20my%20reservation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappActionBtn}
                >
                  <span>WHATSAPP CONCIERGE</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
