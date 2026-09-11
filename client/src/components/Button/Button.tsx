'use client'; // Required since we might handle user interactions (onClick)

/**
 * Button Component
 * 
 * A highly reusable UI component that acts either as a regular button or a navigation link.
 * 
 * Concepts used:
 * - Props: Custom parameters passed to the component to change its behavior and appearance.
 * - TypeScript Interfaces: Defines the expected shape and types of the props.
 * - Conditional Rendering: We render either a Next.js <Link> or an HTML <button> based on whether an 'href' prop is provided.
 */

import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

// Interface defining what props this component accepts
interface ButtonProps {
  children: React.ReactNode; // The content inside the button (usually text)
  variant?: 'primary' | 'secondary' | 'text'; // Optional variant to change style (default is primary)
  href?: string; // Optional URL if this button should act as a link
  onClick?: () => void; // Optional click handler
  type?: 'button' | 'submit'; // Optional button type for forms (default is button)
  className?: string; // Optional extra CSS classes
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  // Construct the CSS class string based on the variant prop
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  // If href is provided, render a Link component
  if (href) {
    return (
      <Link href={href} className={buttonClass} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // Otherwise, render a standard button
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}
