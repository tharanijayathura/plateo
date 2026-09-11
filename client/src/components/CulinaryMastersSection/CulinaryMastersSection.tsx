'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './CulinaryMastersSection.module.css';

interface MasterChef {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  heritage: string;
  imageSrc: string;
  philosophy: string;
  accolades: string[];
  signatureDishes: string[];
  specialties: {
    label: string;
    icon: string;
  }[];
}

const CHEFS: MasterChef[] = [
  {
    id: 'kaelen',
    name: 'Chef Kaelen Senanayake',
    role: 'EXECUTIVE CULINARY DIRECTOR & FIRE ATELIER MASTER',
    subtitle: 'The Alchemist of Flame & Heritage Smoke',
    heritage: 'Galle & Colombo Heritage • 18 Years Contemporary Gastronomy',
    imageSrc: '/images/chef-1-nobg.webp',
    philosophy:
      'True culinary artistry is not in masking raw nature, but in subjecting indigenous Ceylon spices to the untamed thermal alchemy of open wood embers.',
    accolades: [
      '3-Star Michelin Veteran Alumnus',
      "Bocuse d'Or Asia Finalist",
      'Asia 50 Best Discovery Chef 2024',
    ],
    signatureDishes: [
      'Smoked Ceylon Cinnamon Wagyu (Mb9+)',
      'Fire-Roasted Lagoon Mud Crab in Coastal Fennel Foam',
      'Wild Jakfruit Emulsion & Aged Miris Oil',
    ],
    specialties: [
      { label: 'Thermal Flame & Woodfire', icon: '🔥' },
      { label: 'Ancient Spice Extraction', icon: '🌿' },
      { label: 'Zero-Waste Degustation', icon: '◈' },
    ],
  },
  {
    id: 'marcus',
    name: 'Chef Marcus De Silva',
    role: 'HEAD OF BOTANICAL GASTRONOMY & PASTRY ATELIER',
    subtitle: 'The Sculptor of Terroir & High-Country Botanicals',
    heritage: 'Nuwara Eliya High-Country Botanical Forager • Master Pâtissier',
    imageSrc: '/images/chef-2-nobg.webp',
    philosophy:
      'Every morning dewdrop on our Nuwara Eliya tea shrubs and every crystal in wild Kithul treacle holds a geographic heartbeat. Our pastry atelier translates island flora into sensory poetry.',
    accolades: [
      'Relais & Châteaux Master Artisan',
      'World Pastry Cup Gold Honoree',
      'Global Botanical Pastry Innovator',
    ],
    signatureDishes: [
      'Single-Estate Silver Needle Tea Sphere',
      'Caramelized Kithul Treacle Glass Dome',
      'Wild Passionfruit & Buffalo Curd Caviar',
    ],
    specialties: [
      { label: 'High-Altitude Botanicals', icon: '🌱' },
      { label: 'Sugar & Treacle Sculpting', icon: '🍯' },
      { label: 'Aromatic Molecular Craft', icon: '✨' },
    ],
  },
];

export default function CulinaryMastersSection() {
  const [activeChefId, setActiveChefId] = useState<string>('kaelen');

  return (
    <section className={styles.mastersSection} aria-label="Our Culinary Masters">
      {/* Background Ambient Glow Layers */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <div className={styles.logoBadge}>
            <PlateoLogo size={28} showFlankingLines={true} />
          </div>

          <p className={styles.tagline}>THE VISIONARIES BEHIND THE FLAME</p>

          <h2 className={styles.sectionTitle}>
            OUR CULINARY <span className={styles.goldText}>MASTERS</span>
          </h2>

          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.headerSub}>
            MEET THE MINDS TRANSLATING SRI LANKAN ROOTS INTO AVANT-GARDE GASTRONOMY
          </p>
        </header>

        {/* Mobile/Tablet Chef Selector Toggle */}
        <div className={styles.mobileTabSelector}>
          {CHEFS.map((chef) => (
            <button
              key={chef.id}
              type="button"
              className={`${styles.tabBtn} ${activeChefId === chef.id ? styles.activeTabBtn : ''}`}
              onClick={() => setActiveChefId(chef.id)}
            >
              <span className={styles.tabName}>{chef.name.split(' ')[1]}</span>
              <span className={styles.tabRoleShort}>
                {chef.id === 'kaelen' ? 'Culinary Director' : 'Pastry Master'}
              </span>
            </button>
          ))}
        </div>

        {/* Chef Cards Grid */}
        <div className={styles.chefsGrid}>
          {CHEFS.map((chef) => {
            const isTabActive = activeChefId === chef.id;
            return (
              <article
                key={chef.id}
                className={`${styles.chefCard} ${isTabActive ? styles.chefCardActiveMobile : ''}`}
              >
                {/* Visual Portrait Pedestal */}
                <div className={styles.portraitWrapper}>
                  {/* Decorative Frame Elements */}
                  <div className={styles.frameCornerTL} />
                  <div className={styles.frameCornerTR} />
                  <div className={styles.frameCornerBL} />
                  <div className={styles.frameCornerBR} />

                  {/* Golden Aura Radial Light */}
                  <div className={styles.pedestalAura} />
                  <div className={styles.ringArch} />

                  {/* Master Cutout Image */}
                  <div className={styles.imageContainer}>
                    <Image
                      src={chef.imageSrc}
                      alt={`${chef.name} - ${chef.role}`}
                      width={520}
                      height={680}
                      className={styles.chefImage}
                      loading="lazy"
                      sizes="(max-width: 768px) 90vw, 520px"
                    />
                  </div>

                  {/* Floating Title Plaque */}
                  <div className={styles.portraitBadge}>
                    <span className={styles.badgeLabel}>PLATEO ATELIER</span>
                    <span className={styles.badgeChefName}>{chef.name}</span>
                  </div>
                </div>

                {/* Chef Editorial Narrative & Credentials */}
                <div className={styles.detailsContent}>
                  {/* Role Header */}
                  <div className={styles.roleHeader}>
                    <span className={styles.rolePill}>{chef.role}</span>
                    <h3 className={styles.chefTitle}>{chef.name}</h3>
                    <p className={styles.chefSubtitle}>{chef.subtitle}</p>
                    <p className={styles.chefHeritage}>{chef.heritage}</p>
                  </div>

                  {/* Philosophy Quote */}
                  <blockquote className={styles.philosophyQuote}>
                    <span className={styles.quoteMark}>&ldquo;</span>
                    <p className={styles.quoteText}>{chef.philosophy}</p>
                    <span className={styles.quoteMarkClose}>&rdquo;</span>
                  </blockquote>

                  {/* Accolades List */}
                  <div className={styles.accoladesBlock}>
                    <h4 className={styles.blockHeading}>HONORS &amp; DISTINCTIONS</h4>
                    <ul className={styles.accoladesList}>
                      {chef.accolades.map((acc, i) => (
                        <li key={i} className={styles.accoladeItem}>
                          <span className={styles.goldBullet}>◈</span>
                          <span>{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Signature Degustations */}
                  <div className={styles.signatureBlock}>
                    <h4 className={styles.blockHeading}>SIGNATURE DEGUSTATIONS</h4>
                    <div className={styles.dishPills}>
                      {chef.signatureDishes.map((dish, i) => (
                        <div key={i} className={styles.dishPill}>
                          <span className={styles.dishIcon}>✦</span>
                          <span>{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Craft Pillars */}
                  <div className={styles.specialtiesRow}>
                    {chef.specialties.map((spec, i) => (
                      <div key={i} className={styles.specialtyBadge}>
                        <span className={styles.specIcon}>{spec.icon}</span>
                        <span className={styles.specLabel}>{spec.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Hallmark Atelier Stats Grid */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Native Island Foraging</span>
            <span className={styles.statSub}>Sustainable micro-farms &amp; deep-forest spices</span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <span className={styles.statNumber}>48 HR</span>
            <span className={styles.statLabel}>Heritage Spice Infusion</span>
            <span className={styles.statSub}>Slow cold-press &amp; woodfire reduction</span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <span className={styles.statNumber}>24 SEAT</span>
            <span className={styles.statLabel}>Intimate Chef&apos;s Table</span>
            <span className={styles.statSub}>Front-row view to the open woodfire hearth</span>
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className={styles.ctaWrapper}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaTextGroup}>
              <h4 className={styles.ctaTitle}>EXPERIENCE THE ATELIER FIRSTHAND</h4>
              <p className={styles.ctaDesc}>
                Reserve your seat at our Chef&apos;s Counter or Private Folio Salon to witness our masters in motion.
              </p>
            </div>
            <div className={styles.ctaButtonGroup}>
              <Link href="/menu" className={styles.ctaSecondaryBtn}>
                <span>EXPLORE TASTING MENU</span>
              </Link>
              <Link href="/reservations" className={styles.ctaPrimaryBtn}>
                <span>RESERVE CHEF&apos;S TABLE</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
