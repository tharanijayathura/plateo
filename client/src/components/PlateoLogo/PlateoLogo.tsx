import React from 'react';

interface PlateoLogoProps {
  size?: number;
  className?: string;
  showFlankingLines?: boolean;
}

export default function PlateoLogo({
  size = 36,
  className = '',
  showFlankingLines = true,
}: PlateoLogoProps) {
  const lineWidth = Math.round(size * 1.1);

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
      }}
    >
      {showFlankingLines && (
        <span
          style={{
            display: 'block',
            width: `${lineWidth}px`,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7))',
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
        aria-label="Plateo Pillar Monogram"
      >
        <defs>
          <linearGradient id="goldPlateoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9F1DC" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#E6C875" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Top Capital Platform */}
        <rect
          x="30"
          y="18"
          width="26"
          height="3"
          rx="1"
          fill="url(#goldPlateoGrad)"
          filter="url(#goldGlow)"
        />
        <rect
          x="33"
          y="22"
          width="20"
          height="2"
          rx="0.5"
          fill="url(#goldPlateoGrad)"
        />

        {/* Ionic Pillar Fluted Columns (Left stem of the P) */}
        <rect x="34" y="25" width="2.5" height="52" rx="0.5" fill="url(#goldPlateoGrad)" />
        <rect x="38" y="25" width="2.5" height="52" rx="0.5" fill="url(#goldPlateoGrad)" />
        <rect x="42" y="25" width="2.5" height="52" rx="0.5" fill="url(#goldPlateoGrad)" />
        <rect x="46" y="25" width="2.5" height="52" rx="0.5" fill="url(#goldPlateoGrad)" />

        {/* Base of the Pillar */}
        <rect
          x="32"
          y="77"
          width="22"
          height="2.5"
          rx="0.5"
          fill="url(#goldPlateoGrad)"
        />
        <rect
          x="29"
          y="80.5"
          width="28"
          height="3"
          rx="1"
          fill="url(#goldPlateoGrad)"
          filter="url(#goldGlow)"
        />

        {/* Curved Bowl of the P */}
        <path
          d="M 48 20 
             H 64 
             C 74 20 80 27 80 37 
             C 80 47 74 54 64 54 
             H 48"
          stroke="url(#goldPlateoGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#goldGlow)"
        />

        {/* Inner Serif Accent on P loop */}
        <path
          d="M 48 27
             H 62
             C 68 27 72 31 72 37
             C 72 43 68 47 62 47
             H 48"
          stroke="url(#goldPlateoGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
      </svg>

      {showFlankingLines && (
        <span
          style={{
            display: 'block',
            width: `${lineWidth}px`,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.7), transparent)',
          }}
        />
      )}
    </div>
  );
}
