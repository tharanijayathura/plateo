/**
 * SectionHeading Component
 * 
 * A simple, reusable server component for introducing page sections.
 * Server components don't require 'use client' and are faster to load
 * because they don't send JavaScript to the browser.
 * 
 * Concepts used:
 * - Server Component: Default component type in Next.js App Router.
 * - Props: Title, optional subtitle, and alignment configuration.
 */

import React from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: string;
  subtitle?: string; // The '?' means this prop is optional
  alignment?: 'left' | 'center';
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  alignment = 'center' 
}: SectionHeadingProps) {
  // We use the alignment prop to conditionally apply a CSS class
  const alignmentClass = alignment === 'center' ? styles.center : styles.left;

  return (
    <div className={`${styles.headingContainer} ${alignmentClass}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.decorativeLine}></div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
