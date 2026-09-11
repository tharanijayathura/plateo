'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './PlateRotationBackground.module.css';

interface PlateRotationBackgroundProps {
  playbackRate?: number;
  className?: string;
}

export default function PlateRotationBackground({
  playbackRate = 1.0,
  className = '',
}: PlateRotationBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only load video when section is in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    video.playbackRate = playbackRate;
    video.play().catch(() => {});

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        video.playbackRate = playbackRate;
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [playbackRate, isVisible]);

  return (
    <div ref={containerRef} className={`${styles.videoContainer} ${className}`} aria-hidden="true">
      {isVisible && (
        <video
          ref={videoRef}
          className={styles.videoPlayer}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          controls={false}
        >
          <source src="/images/plate%20rotation.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
