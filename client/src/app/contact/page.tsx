'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import SmokeBackground from '@/components/SmokeBackground/SmokeBackground';
import styles from './contact.module.css';

interface Department {
  id: string;
  name: string;
  specialist: string;
  turnaround: string;
  placeholder: string;
  icon: React.ReactNode;
}

const DEPARTMENTS: Department[] = [
  {
    id: 'dining',
    name: 'Private Dining & Buyouts',
    specialist: 'Event Director & Sommelier',
    turnaround: '< 2 Hours',
    placeholder:
      'Please share your intended date, expected guest count, and any bespoke requirements for our private salon or dining room buyout...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    ),
  },
  {
    id: 'culinary',
    name: "Chef's Table & Tastings",
    specialist: 'Executive Culinary Curator',
    turnaround: '< 4 Hours',
    placeholder:
      'Tell us about your multi-course degustation preferences, dietary milestones, or bespoke culinary requests...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
      </svg>
    ),
  },
  {
    id: 'press',
    name: 'Press & Media Relations',
    specialist: 'Communications & Brand Officer',
    turnaround: 'Within 24 Hours',
    placeholder:
      'Inquiries regarding editorial features, photography requests, culinary journalism, or brand collaborations...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    id: 'concierge',
    name: 'General Concierge & Guest Desk',
    specialist: 'Head of Guest Experience',
    turnaround: '< 1 Hour',
    placeholder:
      'How may our concierge assist you today? Inquire about reservations, directions, dress code, or general feedback...',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'Is private valet parking provided upon arrival?',
    a: 'Yes, complimentary private valet parking is available at our main Lotus Promenade portico entrance for all dining and salon guests throughout both lunch and dinner services.',
  },
  {
    q: 'What is the maximum capacity for private salon buyouts?',
    a: 'Our Private Folio Salon accommodates up to 12 seated guests for tailored tasting degustations. Full restaurant buyouts accommodate up to 60 seated guests with personalized culinary direction.',
  },
  {
    q: 'Can the culinary atelier accommodate severe allergies and vegan degustations?',
    a: 'With 24 hours advance notice, our executive culinary team crafts personalized 7-course tasting menus for vegetarian, vegan, gluten-free, halal, and allergy-sensitive guests.',
  },
  {
    q: 'What is Plateo’s corkage policy for rare vintages?',
    a: 'Guests may bring up to two 750ml bottles of special collector wines not represented on our current cellar folio. A corkage fee of $45 per bottle applies, including decanting and Riedel stemware service.',
  },
];

export default function ContactPage() {
  const [selectedDept, setSelectedDept] = useState<string>('dining');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [replyMethod, setReplyMethod] = useState<'email' | 'whatsapp' | 'call'>('whatsapp');
  const [message, setMessage] = useState<string>('');
  const [isStamping, setIsStamping] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [dispatchCode, setDispatchCode] = useState<string>('CORR-8924');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formId = useId();

  // Live Colombo Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setCurrentTime(timeStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeDeptObj =
    DEPARTMENTS.find((d) => d.id === selectedDept) || DEPARTMENTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!email.trim() || !email.includes('@'))
      newErrors.email = 'Please provide a valid email address';
    if (!message.trim() || message.length < 10)
      newErrors.message = 'Please provide correspondence details (min 10 chars)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsStamping(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Send contact message to the backend — saved to PostgreSQL!
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          department: selectedDept,
          replyMethod,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to send message.');
        setIsStamping(false);
        return;
      }

      // Use the REAL reference code from the database
      setDispatchCode(data.referenceCode);
      setIsStamping(false);
      setIsDispatched(true);
    } catch {
      alert('Unable to connect to server. Please try again.');
      setIsStamping(false);
    }
  };

  const handleReset = () => {
    setIsDispatched(false);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
  };

  return (
    <main className={styles.contactPage}>
      {/* Ambient Cinema Lighting & Smoke Background */}
      <SmokeBackground playbackRate={0.65} opacity={0.4} />
      <div className={styles.topNoirGradient} />
      <div className={styles.bottomNoirGradient} />
      <div className={styles.ambientGoldGlow} />

      <div className={styles.pageContainer}>
        {/* Editorial Header */}
        <header className={styles.heroHeader}>
          <div className={styles.logoContainer}>
            <PlateoLogo size={32} showFlankingLines={true} />
          </div>

          <p className={styles.tagline}>CONCIERGE &bull; CORRESPONDENCE</p>

          <h1 className={styles.pageTitle}>
            THE <span className={styles.goldText}>ATELIER</span> DESK
          </h1>

          {/* Diamond Divider */}
          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.heroSub}>
            DIRECT CORRESPONDENCE &bull; LOTUS PROMENADE &bull; COLOMBO
          </p>

          {/* Live Colombo Clock & Desk Status Bar */}
          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <span className={styles.clockIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span className={styles.statusLabel}>COLOMBO (GMT+5:30):</span>
              <span className={styles.statusTime}>{currentTime || '10:45:00 AM'}</span>
            </div>

            <div className={styles.statusDivider} />

            <div className={styles.statusItem}>
              <span className={styles.pulseDot} />
              <span className={styles.deskStatusText}>CONCIERGE ONLINE</span>
              <span className={styles.responseTimeBadge}>
                Avg Response: {activeDeptObj.turnaround}
              </span>
            </div>
          </div>
        </header>

        {/* Main Grid: Epistolary Form & Concierge Portals */}
        <div className={styles.contentGrid}>
          {/* LEFT: Wax-Sealed Epistolary Atelier Form */}
          <section className={styles.atelierSection}>
            {/* Department Channel Tabs */}
            <div className={styles.departmentTabs}>
              <span className={styles.deptHeaderLabel}>SELECT INQUIRY CHANNEL:</span>
              <div className={styles.deptPillsGrid}>
                {DEPARTMENTS.map((dept) => {
                  const isActive = selectedDept === dept.id;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      className={`${styles.deptPill} ${isActive ? styles.activeDeptPill : ''}`}
                      onClick={() => setSelectedDept(dept.id)}
                    >
                      <span className={styles.deptIcon}>{dept.icon}</span>
                      <span className={styles.deptName}>{dept.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Parchment Card */}
            <div className={styles.parchmentCard}>
              {/* Corner Brackets Decoration */}
              <div className={styles.bracketTL} />
              <div className={styles.bracketTR} />
              <div className={styles.bracketBL} />
              <div className={styles.bracketBR} />

              {!isDispatched ? (
                <form className={styles.epistolaryForm} onSubmit={handleSubmit}>
                  {/* Department Specialist Header */}
                  <div className={styles.specialistBanner}>
                    <div className={styles.specialistAvatar}>
                      <span className={styles.avatarIcon}>{activeDeptObj.icon}</span>
                    </div>
                    <div className={styles.specialistInfo}>
                      <span className={styles.assignedLabel}>DIRECT CHANNEL ASSIGNED</span>
                      <h4 className={styles.specialistName}>{activeDeptObj.name}</h4>
                      <p className={styles.specialistRole}>
                        Curated by: <strong>{activeDeptObj.specialist}</strong> &bull; Response within{' '}
                        {activeDeptObj.turnaround}
                      </p>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className={styles.formRow}>
                    <div className={styles.inputField}>
                      <label className={styles.floatingLabel} htmlFor={`${formId}-name`}>
                        YOUR NAME / TITLE *
                      </label>
                      <input
                        type="text"
                        id={`${formId}-name`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Lord Alistair Vance"
                        className={`${styles.atelierInput} ${errors.name ? styles.inputError : ''}`}
                      />
                      {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>

                    <div className={styles.inputField}>
                      <label className={styles.floatingLabel} htmlFor={`${formId}-email`}>
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        id={`${formId}-email`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alistair@vance-holdings.com"
                        className={`${styles.atelierInput} ${errors.email ? styles.inputError : ''}`}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputField}>
                      <label className={styles.floatingLabel} htmlFor={`${formId}-phone`}>
                        TELEPHONE (OPTIONAL)
                      </label>
                      <input
                        type="tel"
                        id={`${formId}-phone`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className={styles.atelierInput}
                      />
                    </div>

                    <div className={styles.inputField}>
                      <label className={styles.floatingLabel}>
                        PREFERRED CONCIERGE REPLY METHOD
                      </label>
                      <div className={styles.replyMethodGroup}>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${replyMethod === 'whatsapp' ? styles.activeMethod : ''}`}
                          onClick={() => setReplyMethod('whatsapp')}
                        >
                          <span className={styles.methodDot} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${replyMethod === 'email' ? styles.activeMethod : ''}`}
                          onClick={() => setReplyMethod('email')}
                        >
                          <span className={styles.methodDot} />
                          <span>Email</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${replyMethod === 'call' ? styles.activeMethod : ''}`}
                          onClick={() => setReplyMethod('call')}
                        >
                          <span className={styles.methodDot} />
                          <span>Phone Call</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className={styles.textareaField}>
                    <label className={styles.floatingLabel} htmlFor={`${formId}-msg`}>
                      YOUR CORRESPONDENCE *
                    </label>
                    <textarea
                      id={`${formId}-msg`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder={activeDeptObj.placeholder}
                      className={`${styles.atelierTextarea} ${errors.message ? styles.inputError : ''}`}
                    />
                    {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                  </div>

                  {/* Stamp & Dispatch Button */}
                  <div className={styles.submitRow}>
                    <div className={styles.securityNote}>
                      <span className={styles.lockIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <span>Private &amp; Confidential Epistolary Protocol</span>
                    </div>

                    <button
                      type="submit"
                      className={`${styles.dispatchBtn} ${isStamping ? styles.stampingActive : ''}`}
                      disabled={isStamping}
                    >
                      {isStamping ? (
                        <div className={styles.stampProgress}>
                          <span className={styles.waxSealIcon}>◈</span>
                          <span>AFFIXING GOLD WAX SEAL...</span>
                        </div>
                      ) : (
                        <>
                          <span>DISPATCH CORRESPONDENCE</span>
                          <span className={styles.sendIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* DISPATCHED WAX SEAL VOUCHER */
                <div className={styles.dispatchedVoucher}>
                  <div className={styles.waxSealStamp}>
                    <div className={styles.sealEmboss}>
                      <span className={styles.sealLogo}>P</span>
                      <span className={styles.sealRingText}>PLATEO &bull; DISPATCHED</span>
                    </div>
                  </div>

                  <h3 className={styles.dispatchedTitle}>CORRESPONDENCE SEALED &amp; DISPATCHED</h3>
                  <p className={styles.dispatchedSub}>
                    Your message has been assigned reference code{' '}
                    <strong className={styles.goldCode}>{dispatchCode}</strong> and routed to{' '}
                    <strong>{activeDeptObj.specialist}</strong>.
                  </p>

                  <div className={styles.voucherGrid}>
                    <div className={styles.voucherItem}>
                      <span className={styles.vLabel}>FROM</span>
                      <span className={styles.vValue}>{name}</span>
                    </div>
                    <div className={styles.voucherItem}>
                      <span className={styles.vLabel}>CHANNEL</span>
                      <span className={styles.vValue}>{activeDeptObj.name}</span>
                    </div>
                    <div className={styles.voucherItem}>
                      <span className={styles.vLabel}>PREFERRED REPLY</span>
                      <span className={styles.vValue}>{replyMethod.toUpperCase()}</span>
                    </div>
                    <div className={styles.voucherItem}>
                      <span className={styles.vLabel}>EXPECTED TURNAROUND</span>
                      <span className={styles.vValue}>{activeDeptObj.turnaround}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.newDispatchBtn}
                    onClick={handleReset}
                  >
                    <span>COMPOSE ANOTHER MESSAGE</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Curated Concierge Portals & Dark Radar Map */}
          <aside className={styles.portalsSection}>
            {/* Portal 1: Dark-Noir Radar Map Card */}
            <div className={styles.portalCard}>
              <div className={styles.portalHeader}>
                <span className={styles.portalIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span className={styles.portalCategory}>SANCTUARY &bull; LOCATION</span>
              </div>

              <h4 className={styles.portalTitle}>LOTUS PROMENADE, COLOMBO 03</h4>
              <p className={styles.portalText}>
                No. 48, Lotus Promenade, Marine Drive Precinct, Colombo 03, Sri Lanka.
              </p>

              {/* Animated Dark Radar Map Canvas Preview */}
              <div className={styles.radarMapBox}>
                <div className={styles.radarGridLines} />
                <div className={styles.radarSweep} />
                <div className={styles.radarBeacon}>
                  <div className={styles.beaconCore} />
                  <div className={styles.beaconWave1} />
                  <div className={styles.beaconWave2} />
                </div>
                <div className={styles.mapPinCard}>
                  <span className={styles.pinTitle}>PLATEO COLOMBO</span>
                  <span className={styles.pinSub}>Valet Portico Entrance</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Colombo+03+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                <span>OPEN IN GOOGLE MAPS</span>
                <span>&rarr;</span>
              </a>
            </div>

            {/* Portal 2: Direct Voice & WhatsApp Concierge */}
            <div className={styles.portalCardHighlight}>
              <div className={styles.portalHeader}>
                <span className={styles.livePulseDot} />
                <span className={styles.highlightPill}>DIRECT CONCIERGE DESK</span>
              </div>

              <h4 className={styles.highlightTitle}>IMMEDIATE VIP ASSISTANCE</h4>
              <p className={styles.highlightText}>
                For same-day dining availability, urgent dietary notifications, or chauffeur valet coordination.
              </p>

              <div className={styles.directActionsGrid}>
                <a href="tel:+94712599785" className={styles.callActionBtn}>
                  <span className={styles.btnIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <span>CALL +94 712599785</span>
                </a>

                <a
                  href="https://wa.me/94712599785?text=Hello%20Plateo%20Concierge,%20I%20am%20inquiring%20about%20a%20reservation%20or%20private%20dining"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappActionBtn}
                >
                  <span className={styles.btnIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </span>
                  <span>VIP WHATSAPP CONCIERGE</span>
                </a>
              </div>
            </div>

            {/* Portal 3: Operating Cadence */}
            <div className={styles.portalCard}>
              <div className={styles.portalHeader}>
                <span className={styles.portalIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <span className={styles.portalCategory}>HOURS &bull; CADENCE</span>
              </div>

              <h4 className={styles.portalTitle}>SALON &amp; DINING HOURS</h4>
              <div className={styles.cadenceGrid}>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceDays}>TUE &ndash; SUN (LUNCH)</span>
                  <span className={styles.cadenceHours}>12:00 PM &ndash; 02:30 PM</span>
                </div>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceDays}>TUE &ndash; SUN (DINNER)</span>
                  <span className={styles.cadenceHours}>06:30 PM &ndash; 11:30 PM</span>
                </div>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceDays}>MONDAYS</span>
                  <span className={styles.cadenceClosed}>Private Cellar &amp; Culinary R&amp;D (Closed)</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM: Expandable Luxury FAQ Accordion */}
        <section className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <span className={styles.sectionPill}>FREQUENTLY INQUIRED</span>
            <h3 className={styles.faqHeading}>ATELIER PROTOCOLS &amp; CONCIERGE FAQS</h3>
            <p className={styles.faqSub}>
              Essential guidance regarding dress code, private salon buyouts, and bespoke cellar accommodations.
            </p>
          </div>

          <div className={styles.accordionContainer}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}
                >
                  <button
                    type="button"
                    className={styles.accordionQuestion}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.qNum}>0{idx + 1}</span>
                    <span className={styles.qText}>{faq.q}</span>
                    <span className={styles.qChevron}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  <div className={styles.accordionAnswer}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

