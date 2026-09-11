'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import styles from './StoryExperience.module.css';

interface StoryStep {
  id: string;
  stepNum: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  narrative: string;
  imageSrc: string;
  altText: string;
  isFinal?: boolean;
}

const STORY_STEPS: StoryStep[] = [
  {
    id: 'origin',
    stepNum: '00',
    tag: 'THE ORIGIN',
    titleLine1: 'BEFORE IT',
    titleLine2: 'BECOMES A DISH.',
    narrative: 'There is a journey behind every plate.',
    imageSrc: '/story/1.webp',
    altText: 'The origin of Plateo culinary philosophy',
  },
  {
    id: 'land',
    stepNum: '01',
    tag: '01 — THE LAND',
    titleLine1: 'IT BEGINS WHERE',
    titleLine2: 'NATURE DOES.',
    narrative: 'We search beyond the kitchen for ingredients with character, freshness and purpose.',
    imageSrc: '/story/2.webp',
    altText: 'Organic Sri Lankan nature and forest soil',
  },
  {
    id: 'harvest',
    stepNum: '02',
    tag: '02 — THE HARVEST',
    titleLine1: 'WE TAKE ONLY',
    titleLine2: 'WHAT WE NEED.',
    narrative: 'Seasonal ingredients, gathered at their peak.',
    imageSrc: '/story/3.webp',
    altText: 'Harvesting fresh organic ingredients',
  },
  {
    id: 'preparation',
    stepNum: '03',
    tag: '03 — THE PREPARATION',
    titleLine1: 'EVERY INGREDIENT',
    titleLine2: 'DESERVES ATTENTION.',
    narrative: 'Washed. Prepared. Refined. Every detail matters.',
    imageSrc: '/story/4.webp',
    altText: 'Meticulous preparation of fresh botanicals and produce',
  },
  {
    id: 'craft',
    stepNum: '04',
    tag: '04 — THE CRAFT',
    titleLine1: 'NATURE',
    titleLine2: 'MEETS FIRE.',
    narrative: 'Technique transforms what the earth provides.',
    imageSrc: '/story/5.webp',
    altText: 'Culinary craft and open hearth fire cooking',
  },
  {
    id: 'plate',
    stepNum: '05',
    tag: '05 — THE PLATE',
    titleLine1: 'FROM THE LAND,',
    titleLine2: 'TO THE PLATE.',
    narrative: 'Simple ingredients become something worth remembering.',
    imageSrc: '/story/6.webp',
    altText: 'Precision plating of the finished dish',
  },
  {
    id: 'table',
    stepNum: '06',
    tag: '06 — THE TABLE',
    titleLine1: 'THEN, IT BECOMES',
    titleLine2: 'YOUR MOMENT.',
    narrative: 'Because food is meant to be shared.',
    imageSrc: '/story/7.webp',
    altText: 'The dining table experience at Plateo',
    isFinal: true,
  },
];

export default function StoryExperience() {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [flipFromIndex, setFlipFromIndex] = useState(0);
  const [flipToIndex, setFlipToIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const bookStageRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);

  const goToStep = useCallback(
    (targetIndex: number) => {
      if (targetIndex === displayIndex || isFlipping) return;
      if (targetIndex < 0 || targetIndex >= STORY_STEPS.length) return;

      const dir = targetIndex > displayIndex ? 'next' : 'prev';
      setFlipFromIndex(displayIndex);
      setFlipToIndex(targetIndex);
      setFlipDirection(dir);
      setIsFlipping(true);

      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
      const duration = isMobile ? 180 : 600;

      setTimeout(() => {
        setDisplayIndex(targetIndex);
        setIsFlipping(false);
      }, duration);
    },
    [displayIndex, isFlipping]
  );

  const handleNext = useCallback(() => {
    if (displayIndex < STORY_STEPS.length - 1) {
      goToStep(displayIndex + 1);
    }
  }, [displayIndex, goToStep]);

  const handlePrev = useCallback(() => {
    if (displayIndex > 0) {
      goToStep(displayIndex - 1);
    }
  }, [displayIndex, goToStep]);

  // Lock Wheel scrolling to book page flipping on desktop/laptop
  useEffect(() => {
    const el = bookStageRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only lock wheel scrolling to turn pages on laptop/desktop screens
      if (typeof window !== 'undefined' && window.innerWidth <= 900) {
        return;
      }

      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      if (e.deltaY > 15) {
        lastScrollTime.current = now;
        handleNext();
      } else if (e.deltaY < -15) {
        lastScrollTime.current = now;
        handlePrev();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [handleNext, handlePrev]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentStep = STORY_STEPS[displayIndex];
  const fromStep = STORY_STEPS[flipFromIndex];
  const toStep = STORY_STEPS[flipToIndex];
  const activeStepNum = isFlipping ? flipToIndex : displayIndex;

  const baseLeftImage = isFlipping
    ? (flipDirection === 'next' ? fromStep.imageSrc : toStep.imageSrc)
    : currentStep.imageSrc;

  const baseRightStep = isFlipping ? toStep : currentStep;

  return (
    <div
      className={styles.storyWrapper}
      id="about"
    >
      {/* Background Image Layer with smooth parallax cross-fade */}
      <div className={styles.bgWrapper}>
        {STORY_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`${styles.bgItem} ${idx === activeStepNum ? styles.bgActive : ''}`}
          >
            <Image
              src={step.imageSrc}
              alt={step.altText}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={styles.bgImage}
            />
            <div className={styles.topNoirFade} />
            <div className={styles.bottomNoirFade} />
            <div className={styles.jungleVignette} />
          </div>
        ))}
      </div>

      {/* Main 3D Book Stage Container */}
      <div ref={bookStageRef} className={styles.bookStage}>
        {/* Book Header Title & Restart Story Action */}
        <div className={styles.bookTitleBadge}>
          <div className={styles.bookBadgeLeft}>
            <PlateoLogo size={24} showFlankingLines={true} />
            <span className={styles.bookHeaderTitle}>THE PLATEO CHRONICLES</span>
          </div>
          <button
            onClick={() => goToStep(0)}
            className={styles.resetBookBtn}
            disabled={activeStepNum === 0}
            title="Return to First Page (Folio 1)"
            aria-label="Return to First Page"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.resetIcon}
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span className={styles.resetText}>RESTART STORY</span>
          </button>
        </div>

        {/* Mobile Horizontal Step Bar (< 900px) */}
        <div className={styles.mobileProgressNav} aria-label="Story step navigation for mobile">
          <div className={styles.mobileStepTrack}>
            <div
              className={styles.mobileStepFill}
              style={{
                width: `${(activeStepNum / (STORY_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>
          <div className={styles.mobileStepNodes}>
            {STORY_STEPS.map((step, idx) => {
              const isActive = idx === activeStepNum;
              return (
                <button
                  key={step.id}
                  className={`${styles.mobileStepBtn} ${isActive ? styles.activeMobileStep : ''}`}
                  onClick={() => goToStep(idx)}
                  aria-label={`Jump to page ${step.stepNum}: ${step.tag}`}
                >
                  {step.stepNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Book Page Progress Indicator (Scoped strictly to Book Section) */}
        <nav className={styles.sideProgressNav} aria-label="Story book page navigation">
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                height: `${(activeStepNum / (STORY_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>
          <ul className={styles.stepNodes}>
            {STORY_STEPS.map((step, idx) => {
              const isActive = idx === activeStepNum;
              return (
                <li key={step.id}>
                  <button
                    className={`${styles.nodeBtn} ${isActive ? styles.activeNode : ''}`}
                    onClick={() => goToStep(idx)}
                    aria-label={`Jump to page ${step.stepNum}: ${step.tag}`}
                  >
                    <span className={styles.nodeDot} />
                    <span className={styles.nodeLabel}>{step.stepNum}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 3D Book Frame */}
        <div className={`${styles.bookContainer} ${isFlipping ? styles.bookFlipping : ''}`}>
          {/* Left Page (Image & Folio) */}
          <div className={styles.leftPage}>
            <div className={styles.pageInner}>
              <div className={styles.imageBox}>
                <Image
                  src={baseLeftImage}
                  alt={currentStep.altText}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.pageImage}
                  priority
                />
                <div className={styles.imageOverlay} />
                <span className={styles.watermarkNum}>{baseRightStep.stepNum}</span>
              </div>
              <div className={styles.leftPageFooter}>
                <span className={styles.pageFolio}>
                  FOLIO {activeStepNum + 1} OF {STORY_STEPS.length}
                </span>
                <span className={styles.chapterTag}>{baseRightStep.tag}</span>
              </div>
            </div>
            <div className={styles.leftSpineShadow} />
          </div>

          {/* Right Page (Narrative & Story Content) */}
          <div className={styles.rightPage}>
            <div className={styles.pageInner}>
              {/* Monogram */}
              <div className={styles.badgeWrapper}>
                <PlateoLogo size={28} showFlankingLines={true} />
              </div>

              {/* Step Tag */}
              <p className={styles.stepTag}>{baseRightStep.tag}</p>

              {/* Section Headline */}
              <h2 className={styles.sectionTitle}>
                {baseRightStep.titleLine1} <br />
                <span className={styles.goldText}>{baseRightStep.titleLine2}</span>
              </h2>

              {/* Diamond Divider */}
              <div className={styles.dividerBox}>
                <span className={styles.dividerLine} />
                <span className={styles.diamond}>&#9671;</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Narrative Text */}
              <p className={styles.narrativeText}>{baseRightStep.narrative}</p>

              {/* Step 0 Scroll Cue */}
              {activeStepNum === 0 && (
                <div className={styles.scrollCue} onClick={handleNext}>
                  <span className={styles.cueText}>SCROLL TO TURN PAGE</span>
                  <span className={styles.cueArrow}>&darr;</span>
                </div>
              )}

              {/* Navigation Controls */}
              <div className={styles.pageNavigationControls}>
                <button
                  className={styles.prevPageBtn}
                  onClick={handlePrev}
                  disabled={activeStepNum === 0}
                  aria-label="Previous Page"
                >
                  &larr; PREVIOUS
                </button>

                <div className={styles.pageCounterGroup}>
                  <span className={styles.pageCounter}>
                    {activeStepNum + 1} / {STORY_STEPS.length}
                  </span>
                  {activeStepNum > 0 && (
                    <button
                      className={styles.miniResetBtn}
                      onClick={() => goToStep(0)}
                      title="Return to First Page"
                      aria-label="Return to First Page"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                    </button>
                  )}
                </div>

                <button
                  className={styles.nextPageBtn}
                  onClick={handleNext}
                  disabled={activeStepNum === STORY_STEPS.length - 1}
                  aria-label="Next Page"
                >
                  NEXT PAGE &rarr;
                </button>
              </div>
            </div>

            <div className={styles.rightSpineShadow} />
          </div>

          {/* 3D Animated Flipping Leaf */}
          {isFlipping && (
            <div
              className={`${styles.turningLeaf} ${
                flipDirection === 'next' ? styles.flipNext : styles.flipPrev
              }`}
            >
              {flipDirection === 'next' ? (
                <>
                  {/* Turning Forward (Right to Left) */}
                  <div className={styles.leafFront}>
                    <div className={styles.pageInner}>
                      <div className={styles.badgeWrapper}>
                        <PlateoLogo size={28} showFlankingLines={true} />
                      </div>
                      <p className={styles.stepTag}>{fromStep.tag}</p>
                      <h2 className={styles.sectionTitle}>
                        {fromStep.titleLine1} <br />
                        <span className={styles.goldText}>{fromStep.titleLine2}</span>
                      </h2>
                      <div className={styles.dividerBox}>
                        <span className={styles.dividerLine} />
                        <span className={styles.diamond}>&#9671;</span>
                        <span className={styles.dividerLine} />
                      </div>
                      <p className={styles.narrativeText}>{fromStep.narrative}</p>
                    </div>
                    <div className={styles.leafShadowOverlay} />
                  </div>

                  <div className={styles.leafBack}>
                    <div className={styles.imageBox}>
                      <Image
                        src={toStep.imageSrc}
                        alt={toStep.altText}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className={styles.pageImage}
                      />
                      <div className={styles.imageOverlay} />
                      <span className={styles.watermarkNum}>{toStep.stepNum}</span>
                    </div>
                    <div className={styles.leafShadowOverlayBack} />
                  </div>
                </>
              ) : (
                <>
                  {/* Turning Backward (Left to Right) */}
                  <div className={styles.leafFrontLeft}>
                    <div className={styles.imageBox}>
                      <Image
                        src={fromStep.imageSrc}
                        alt={fromStep.altText}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className={styles.pageImage}
                      />
                      <div className={styles.imageOverlay} />
                      <span className={styles.watermarkNum}>{fromStep.stepNum}</span>
                    </div>
                    <div className={styles.leafShadowOverlay} />
                  </div>

                  <div className={styles.leafBackRight}>
                    <div className={styles.pageInner}>
                      <div className={styles.badgeWrapper}>
                        <PlateoLogo size={28} showFlankingLines={true} />
                      </div>
                      <p className={styles.stepTag}>{toStep.tag}</p>
                      <h2 className={styles.sectionTitle}>
                        {toStep.titleLine1} <br />
                        <span className={styles.goldText}>{toStep.titleLine2}</span>
                      </h2>
                      <div className={styles.dividerBox}>
                        <span className={styles.dividerLine} />
                        <span className={styles.diamond}>&#9671;</span>
                        <span className={styles.dividerLine} />
                      </div>
                      <p className={styles.narrativeText}>{toStep.narrative}</p>
                    </div>
                    <div className={styles.leafShadowOverlayBack} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Book Spine Center Line */}
          <div className={styles.bookCenterSpine} />
        </div>
      </div>

      {/* Standalone Separate Section below the 3D Book */}
      <section className={styles.finalReservationSection} aria-label="Book a Table at Plateo">
        <div className={styles.finalReservationContainer}>
          <div className={styles.finalLogoBadge}>
            <PlateoLogo size={32} showFlankingLines={true} />
          </div>

          <h3 className={styles.finalBrandTitle}>PLATEO</h3>
          <p className={styles.finalMotto}>
            FROM NATURE. THROUGH FIRE. TO YOU.
          </p>

          <div className={styles.dividerBox}>
            <span className={styles.dividerLine} />
            <span className={styles.diamond}>&#9671;</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.finalAwaits}>Your table awaits.</p>

          <div className={styles.finalActionWrapper}>
            <Link href="/reservations" className={styles.reserveBtn}>
              <span>RESERVE A TABLE</span>
              <span className={styles.arrowIcon}>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
