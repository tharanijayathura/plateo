'use client';

import { useState } from 'react';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import SmokeBackground from '@/components/SmokeBackground/SmokeBackground';
import ReservationForm from '@/components/ReservationForm/ReservationForm';
import ManageReservation from '@/components/ManageReservation/ManageReservation';
import styles from './reservations.module.css';

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'manage'>('book');

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
            {activeTab === 'book' ? (
              <>SECURE YOUR <span className={styles.goldText}>TABLE</span></>
            ) : (
              <>MANAGE YOUR <span className={styles.goldText}>BOOKING</span></>
            )}
          </h1>

          {/* Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          {/* Mode Switcher Tabs */}
          <div className={styles.tabSwitcher}>
            <button
              onClick={() => setActiveTab('book')}
              className={`${styles.tabBtn} ${activeTab === 'book' ? styles.activeTabBtn : ''}`}
            >
              ✦ BOOK A TABLE
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`${styles.tabBtn} ${activeTab === 'manage' ? styles.activeTabBtn : ''}`}
            >
              ✎ EDIT / CANCEL BOOKING
            </button>
          </div>
        </header>

        {/* Two-Column Booking & Concierge Grid */}
        <div className={styles.contentGrid}>
          {/* Main Column */}
          <div className={styles.wizardColumn}>
            {activeTab === 'book' ? <ReservationForm /> : <ManageReservation />}
          </div>

          {/* Concierge & Information Sidebar Column */}
          <aside className={styles.conciergeColumn}>
            {/* Card 1: Dining Guidelines & Dress Code */}
            <div className={styles.conciergeCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                </span>
                <span className={styles.cardCategory}>GUIDELINES</span>
              </div>
              <h3 className={styles.cardTitle}>DRESS CODE &amp; COURTESY</h3>
              <p className={styles.cardText}>
                We encourage <strong>Elegant Smart Casual</strong> attire. To maintain an elevated ambiance, athletic wear, beachwear, and sportswear are not permitted.
              </p>
              <div className={styles.cardFooterNote}>
                <span>Grace holding window: 15 minutes</span>
              </div>
            </div>

            {/* Card 2: 7-Course Tasting & Sommelier */}
            <div className={styles.conciergeCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 22h8" />
                    <path d="M12 15v7" />
                    <path d="M6 3h12v5a6 6 0 0 1-12 0V3z" />
                  </svg>
                </span>
                <span className={styles.cardCategory}>EXPERIENCE</span>
              </div>
              <h3 className={styles.cardTitle}>TASTING MENU &amp; SOMMELIER</h3>
              <p className={styles.cardText}>
                Our executive sommelier curates bespoke Old World &amp; biodynamic wine pairings alongside our signature 7-course seasonal tasting menu.
              </p>
              <Link href="/menu" className={styles.cardLink}>
                <span>EXPLORE TASTING MENU</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Card 3: Valet & Arrival */}
            <div className={styles.conciergeCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </span>
                <span className={styles.cardCategory}>ARRIVAL</span>
              </div>
              <h3 className={styles.cardTitle}>COMPLIMENTARY VALET</h3>
              <p className={styles.cardText}>
                Private valet parking is available at our Lotus Promenade entrance. Chauffeur lounge and EV charging are available on request.
              </p>
              <div className={styles.cardFooterNote}>
                <span>No. 48, Lotus Promenade, Colombo 03</span>
              </div>
            </div>

            {/* Card 4: Direct Concierge Line */}
            <div className={styles.conciergeCardHighlight}>
              <div className={styles.highlightHeader}>
                <span className={styles.pulseDot} />
                <span className={styles.highlightPill}>CONCIERGE DESK</span>
              </div>
              <h3 className={styles.highlightTitle}>LARGE PARTIES &amp; PRIVATE EVENTS</h3>
              <p className={styles.highlightText}>
                For exclusive buyouts or parties of 8+, our private event curator is at your immediate service.
              </p>

              <div className={styles.contactActions}>
                <a href="tel:+94712599785" className={styles.phoneActionBtn}>
                  <span>CALL +94 712599785</span>
                </a>
                <a
                  href="https://wa.me/94712599785?text=Hello%20Plateo%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20private%20reservation"
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

