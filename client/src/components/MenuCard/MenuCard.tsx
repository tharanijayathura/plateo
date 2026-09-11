/**
 * MenuCard Component
 * 
 * A server component that displays individual menu items.
 * It takes in properties (props) like the dish name, description, price, etc.
 * 
 * Concepts used:
 * - Server Components: Renders HTML on the server, resulting in great performance.
 * - Conditional Rendering: We render an image if 'imageUrl' exists, otherwise a placeholder.
 */

import React from 'react';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string; // Optional image URL
}

export default function MenuCard({ 
  name, 
  description, 
  price, 
  category, 
  imageUrl 
}: MenuCardProps) {
  return (
    <div className={styles.card}>
      {/* Conditionally render image or placeholder */}
      {imageUrl ? (
        <div 
          className={styles.imageArea}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className={styles.placeholderArea}>
          <span className={styles.categoryLabel}>{category}</span>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.price}>${price.toFixed(2)}</span>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
