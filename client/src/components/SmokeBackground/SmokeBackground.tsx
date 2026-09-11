'use client';

import React, { useRef, useEffect } from 'react';
import styles from './SmokeBackground.module.css';

interface SmokeBackgroundProps {
  playbackRate?: number;
  opacity?: number;
}

export default function SmokeBackground({
  playbackRate = 0.65,
  opacity = 0.55,
}: SmokeBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    video.play().catch(() => {});
  }, [playbackRate]);

  return (
    <div className={styles.smokeContainer} style={{ opacity }} aria-hidden="true">
      <video
        ref={videoRef}
        className={`${styles.video} ${styles.visible}`}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/images/smoke.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
