'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import PlateRotationBackground from '@/components/PlateRotationBackground/PlateRotationBackground';
import styles from './InteractivePlateShowcase.module.css';

interface Hotspot {
  id: string;
  name: string;
  top: string;
  left: string;
  width?: string;
  height?: string;
}

const INGREDIENT_HOTSPOTS: Hotspot[] = [
  {
    id: 'steak',
    name: 'Prime Seared Fillet with Smoked Herb Crust',
    top: '56%',
    left: '50%',
    width: '28%',
    height: '28%',
  },
  {
    id: 'rosemary',
    name: 'Fresh Aromatic Rosemary Sprig',
    top: '38%',
    left: '49%',
    width: '16%',
    height: '20%',
  },
  {
    id: 'tomatoes',
    name: 'Fire-Roasted Vine Cherry Tomatoes',
    top: '70%',
    left: '45%',
    width: '15%',
    height: '15%',
  },
  {
    id: 'potatoes-left',
    name: 'Crispy Herb-Roasted Golden Potato Wedges',
    top: '64%',
    left: '30%',
    width: '18%',
    height: '18%',
  },
  {
    id: 'potatoes-right',
    name: 'Caramelized Roasted Potatoes & Sweet Shallots',
    top: '66%',
    left: '68%',
    width: '18%',
    height: '18%',
  },
  {
    id: 'asparagus-front',
    name: 'Charred Tender Garden Asparagus Spears',
    top: '74%',
    left: '55%',
    width: '22%',
    height: '16%',
  },
  {
    id: 'asparagus-side',
    name: 'Sautéed Wild Asparagus & Roast Garlic',
    top: '52%',
    left: '35%',
    width: '18%',
    height: '18%',
  },
];

interface SparkData {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
}

interface RiserData {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
}

function createDeterministicSparks(): SparkData[] {
  let s = 42;
  const pseudoRandom = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.round((pseudoRandom() * 92 + 4) * 100) / 100,
    top: Math.round((pseudoRandom() * 84 + 8) * 100) / 100,
    size: Math.round((pseudoRandom() * 3 + 1.5) * 10) / 10,
    delay: Math.round(pseudoRandom() * 6 * 100) / 100,
    duration: Math.round((pseudoRandom() * 4 + 3) * 100) / 100,
    dx: Math.round((pseudoRandom() - 0.5) * 35 * 10) / 10,
    dy: Math.round((pseudoRandom() - 0.5) * 45 * 10) / 10,
  }));
}

function createDeterministicRisers(): RiserData[] {
  let s = 108;
  const pseudoRandom = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.round((pseudoRandom() * 60 + 20) * 100) / 100,
    size: Math.round((pseudoRandom() * 3.5 + 2) * 10) / 10,
    delay: Math.round(pseudoRandom() * 5 * 100) / 100,
    duration: Math.round((pseudoRandom() * 3.5 + 2.5) * 100) / 100,
    dx: Math.round((pseudoRandom() - 0.5) * 50 * 10) / 10,
    dy: Math.round(-(pseudoRandom() * 110 + 60) * 10) / 10,
  }));
}

const STATIC_SPARKS: SparkData[] = createDeterministicSparks();
const STATIC_RISERS: RiserData[] = createDeterministicRisers();

export default function InteractivePlateShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sparkleLayerRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);

  // Active showcase phase: 'video' = rotating video full screen, 'dish' = interactive dish with description
  const [phase, setPhase] = useState<'video' | 'dish'>('video');

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: string; left: string }>({ top: '0%', left: '0%' });

  // Spawn sparkle burst helper
  const triggerBurstAt = useCallback((x: number, y: number) => {
    if (!sparkleLayerRef.current) return;
    const burstCount = 22;

    for (let i = 0; i < burstCount; i++) {
      const burstParticle = document.createElement('div');
      burstParticle.className = styles.sparkle;
      const size = Math.random() * 6 + 3;
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 85 + 30;
      const bx = Math.cos(angle) * distance;
      const by = Math.sin(angle) * distance;

      burstParticle.style.width = `${size}px`;
      burstParticle.style.height = `${size}px`;
      burstParticle.style.left = `${x}px`;
      burstParticle.style.top = `${y}px`;
      burstParticle.style.setProperty('--bx', `${bx}px`);
      burstParticle.style.setProperty('--by', `${by}px`);
      burstParticle.style.animation = `${styles.sparkleBurst} ${Math.random() * 0.4 + 0.6}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

      sparkleLayerRef.current.appendChild(burstParticle);
      setTimeout(() => {
        burstParticle.remove();
      }, 1000);
    }
  }, []);

  // Cursor sparkle trail spawn
  const lastTrailTime = useRef(0);
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTrailTime.current < 45) return;
    lastTrailTime.current = now;

    if (!sparkleLayerRef.current) return;

    const sparkle = document.createElement('div');
    sparkle.className = styles.sparkle;
    const size = Math.random() * 5 + 3;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    sparkle.style.animation = `${styles.sparkleTrail} ${Math.random() * 0.4 + 0.6}s ease-out forwards`;

    sparkleLayerRef.current.appendChild(sparkle);
    setTimeout(() => {
      sparkle.remove();
    }, 1000);

    // Subtle 3D tilt on rig when dish is active on desktop
    if (rigRef.current && stageRef.current && phase === 'dish' && window.innerWidth > 768) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rigRef.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    }
  }, [phase]);

  const handlePointerLeave = useCallback(() => {
    if (rigRef.current) {
      rigRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    }
    setActivePopup(null);
  }, []);

  // Click / Tap burst interaction on the plate
  const handlePlateClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    triggerBurstAt(e.clientX, e.clientY);
  }, [triggerBurstAt]);

  const handlePlateTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      triggerBurstAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [triggerBurstAt]);

  const handleHotspotEnter = (hotspot: Hotspot) => {
    setActivePopup(hotspot.name);
    setPopupPos({ top: hotspot.top, left: hotspot.left });
  };

  const handleHotspotLeave = () => {
    // Only dismiss on desktop mouse leave
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setActivePopup(null);
    }
  };

  const handleHotspotSelect = (hotspot: Hotspot, e: React.SyntheticEvent) => {
    e.stopPropagation();
    setActivePopup((prev) => (prev === hotspot.name ? null : hotspot.name));
    setPopupPos({ top: hotspot.top, left: hotspot.left });
  };

  return (
    <div
      ref={stageRef}
      className={styles.showcaseContainer}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Top & Bottom Ambient Noir Seam Gradients */}
      <div className={styles.topNoirSeam} />
      <div className={styles.bottomNoirSeam} />

      {/* ====================================================================
          LAYER 1: Rotating Plate Video Layer (Slides to the Right when Phase Changes)
          ==================================================================== */}
      <div
        className={`${styles.videoLayer} ${phase === 'video' ? styles.videoActive : styles.videoExit}`}
      >
        <PlateRotationBackground playbackRate={1.0} />
        {/* Atmospheric Radial Vignette Overlay */}
        <div className={styles.videoVignette} />
      </div>

      {/* ====================================================================
          LAYER 2: 3rd Screen Interactive Dish Feature (Pops in on Right Side of Screen)
          ==================================================================== */}
      <div
        className={`${styles.interactiveDishLayer} ${phase === 'dish' ? styles.dishActive : styles.dishHidden}`}
        onClick={() => setActivePopup(null)}
      >
        {/* Ambient Particles in Dish Showcase */}
        <div className={styles.particles}>
          {STATIC_SPARKS.map((spark) => (
            <div
              key={`spark-${spark.id}`}
              className={styles.sparkWrap}
              style={
                {
                  left: `${spark.left}%`,
                  top: `${spark.top}%`,
                  animationDuration: `${spark.duration * 1.5}s`,
                  animationDelay: `${spark.delay}s`,
                  '--dx': `${spark.dx}px`,
                  '--dy': `${spark.dy}px`,
                } as React.CSSProperties
              }
            >
              <div
                className={styles.spark}
                style={{
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  animationDuration: `${spark.duration}s`,
                  animationDelay: `${spark.delay}s`,
                }}
              />
            </div>
          ))}

          {STATIC_RISERS.map((riser) => (
            <div
              key={`riser-${riser.id}`}
              className={styles.riser}
              style={
                {
                  left: `${riser.left}%`,
                  width: `${riser.size}px`,
                  height: `${riser.size}px`,
                  animationDuration: `${riser.duration}s`,
                  animationDelay: `${riser.delay}s`,
                  '--dx': `${riser.dx}px`,
                  '--dy': `${riser.dy}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className={styles.showcaseGrid}>
          {/* Left Side: Editorial Story & Culinary Description */}
          <div className={styles.storyContent}>
            <div className={styles.collectionBadge}>
              <span>SIGNATURE CREATION &bull; COLLECTION I</span>
            </div>
            <h2 className={styles.storyTitle}>
              THE ART OF <br />
              <span>FLAVOR HARMONY</span>
            </h2>
            <p className={styles.storyText}>
              Every ingredient is hand-selected and fire-roasted to perfection.
              Hover or tap across the dish to explore our culinary craft and distinct flavor notes.
            </p>
            <div className={styles.interactiveHint}>
              <span className={styles.hintDiamond}>&#9671;</span>
              <span>HOVER ELEMENTS TO INSPECT &bull; TAP TO INTERACT</span>
            </div>
          </div>

          {/* Right Side: Interactive Plate Rig (Pops In from Right) */}
          <div className={styles.dishRightContainer}>
            <div
              ref={rigRef}
              className={styles.rig}
              onClick={handlePlateClick}
              onTouchStart={handlePlateTouch}
            >
              {/* Pulsing Warm Ember Glow Beneath Dish */}
              <div className={styles.glow} />

              {/* High-Resolution Dish Presentation Image */}
              <Image
                src="/images/plate.webp"
                alt="Plateo Signature Seared Fillet & Garden Vegetables"
                width={1200}
                height={800}
                className={styles.plateImg}
                sizes="(max-width: 900px) 90vw, 50vw"
              />

              {/* Interactive Ingredient Hotspot Targets */}
              <div className={styles.hotspotLayer}>
                {INGREDIENT_HOTSPOTS.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    className={styles.hotspot}
                    style={{
                      top: hotspot.top,
                      left: hotspot.left,
                      width: hotspot.width || '18%',
                      height: hotspot.height || '18%',
                    }}
                    aria-label={hotspot.name}
                    onMouseEnter={() => handleHotspotEnter(hotspot)}
                    onMouseLeave={handleHotspotLeave}
                    onFocus={() => handleHotspotEnter(hotspot)}
                    onBlur={handleHotspotLeave}
                    onClick={(e) => handleHotspotSelect(hotspot, e)}
                  />
                ))}

                {/* Elegant Ingredient Popup Tooltip */}
                <div
                  className={`${styles.ingredientPopup} ${activePopup ? styles.show : ''}`}
                  style={{ top: popupPos.top, left: popupPos.left }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {activePopup}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PHASE CONTROLS (Pills at Bottom Center to Switch Bidirectionally)
          ==================================================================== */}
      <div className={styles.phaseControls}>
        <button
          className={`${styles.phaseBtn} ${phase === 'video' ? styles.activePhaseBtn : ''}`}
          onClick={() => setPhase('video')}
          aria-label="View Signature Plating Video"
        >
          <span className={styles.phaseNum}>01</span> SIGNATURE PLATING
        </button>
        <div className={styles.phaseDivider}>&#9671;</div>
        <button
          className={`${styles.phaseBtn} ${phase === 'dish' ? styles.activePhaseBtn : ''}`}
          onClick={() => setPhase('dish')}
          aria-label="View Tasting Notes & Ingredients"
        >
          <span className={styles.phaseNum}>02</span> TASTING NOTES
        </button>
      </div>

      {/* Overlay Sparkle Particles (Cursor Trail & Click Bursts) */}
      <div ref={sparkleLayerRef} className={styles.sparkleLayer} />
    </div>
  );
}
