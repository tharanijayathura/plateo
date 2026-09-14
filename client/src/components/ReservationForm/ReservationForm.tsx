'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
import { ALL_MENU_ITEMS, MenuItem } from '@/data/menuData';
import styles from './ReservationForm.module.css';

interface SeatingOption {
  id: string;
  name: string;
  badge: string;
  capacity: string;
  atmosphere: string;
  description: string;
}

const SEATING_OPTIONS: SeatingOption[] = [
  {
    id: 'main',
    name: 'Main Dining Hall',
    badge: 'Signature',
    capacity: '1 – 8 Guests',
    atmosphere: 'Warm hearth ambiance & acoustic serenity',
    description: 'Understated noir elegance beneath soft golden candlelight with centered hearth view.',
  },
  {
    id: 'counter',
    name: "Chef's Counter",
    badge: 'Immersive',
    capacity: '1 – 4 Guests',
    atmosphere: 'Front-row culinary craft & live woodfire',
    description: 'Direct interaction with our executive culinary team around the live open hearth.',
  },
  {
    id: 'verandah',
    name: 'The Glass Verandah',
    badge: 'Atmospheric',
    capacity: '2 – 6 Guests',
    atmosphere: 'Botanical garden views & starlight',
    description: 'Enclosed conservatory terrace surrounded by illuminated Ceylon tropical greenery.',
  },
  {
    id: 'private',
    name: 'Private Folio Salon',
    badge: 'Exclusive',
    capacity: '6 – 12 Guests',
    atmosphere: 'Bespoke tasting salon & sommelier',
    description: 'Secluded private suite with tailored 7-course pairing and personal sommelier host.',
  },
];

const SERVICE_SLOTS = [
  {
    category: 'LUNCH SERVICE (12:00 PM – 02:30 PM)',
    slots: [
      { time: '12:00 PM', status: 'Available' },
      { time: '12:30 PM', status: 'Available' },
      { time: '01:00 PM', status: 'Available' },
      { time: '01:30 PM', status: 'Filling Fast' },
      { time: '02:00 PM', status: 'Available' },
    ],
  },
  {
    category: 'DINNER SERVICE (06:30 PM – 10:30 PM)',
    slots: [
      { time: '06:30 PM', status: 'Available' },
      { time: '07:00 PM', status: 'Filling Fast' },
      { time: '07:30 PM', status: 'Most Popular' },
      { time: '08:00 PM', status: 'Available' },
      { time: '08:30 PM', status: 'Available' },
      { time: '09:00 PM', status: 'Available' },
    ],
  },
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Halal Certified',
  'No Seafood',
  'Kosher Style',
];

const OCCASIONS = [
  'Casual Evening',
  'Birthday Celebration',
  'Anniversary',
  'Romantic Date Night',
  'Business Gathering',
  'Culinary Tasting Journey',
];

export default function ReservationForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [seatingArea, setSeatingArea] = useState<string>('main');
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('07:30 PM');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('Casual Evening');
  const [dietary, setDietary] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('PLT-8492');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Optional Meal & Drink Selection State
  const [orderedItems, setOrderedItems] = useState<Record<string, number>>({});
  const [mealCategoryFilter, setMealCategoryFilter] = useState<'all' | 'dinner' | 'lunch' | 'breakfast' | 'desserts' | 'drinks'>('all');

  const formId = useId();

  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDate(d.toISOString().split('T')[0]);
  };

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  // Meal & Drink counter helpers
  const handleItemQuantityChange = (itemId: string, delta: number) => {
    setOrderedItems((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Convert orderedItems record into structured array for API
  const getStructuredOrderedItems = () => {
    return Object.entries(orderedItems).map(([id, quantity]) => {
      const item = ALL_MENU_ITEMS.find((m) => m.id === id);
      return {
        id,
        name: item?.name || id,
        category: item?.category || 'general',
        price: item?.price || '$0',
        quantity,
      };
    });
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'Please select a reservation date';
    if (!time) newErrors.time = 'Please select a preferred dining time slot';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!email.trim() || !email.includes('@'))
      newErrors.email = 'Please enter a valid email address';
    if (!phone.trim() || phone.length < 8)
      newErrors.phone = 'Please enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1 && step < 4) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const structuredItems = getStructuredOrderedItems();

      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          date,
          time,
          guests,
          seatingArea,
          occasion,
          dietary,
          specialRequests,
          orderedItems: structuredItems,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Booking failed. Please try again.');
        return;
      }

      setBookingCode(data.bookingCode);
      setStep(4);
    } catch {
      alert('Unable to connect to the booking server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    setDietary([]);
    setOrderedItems({});
    setErrors({});
  };

  const selectedSeatingObj =
    SEATING_OPTIONS.find((s) => s.id === seatingArea) || SEATING_OPTIONS[0];

  const filteredMenuItems = ALL_MENU_ITEMS.filter((item) =>
    mealCategoryFilter === 'all' ? true : item.category === mealCategoryFilter
  );

  const totalPreorderedCount = Object.values(orderedItems).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.wizardContainer}>
      {/* Banner to Edit or Remove Existing Reservation */}
      {step < 4 && (
        <div style={{
          background: 'rgba(232, 196, 122, 0.08)',
          border: '1px solid rgba(232, 196, 122, 0.25)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(247, 243, 233, 0.7)' }}>
            Already booked a table?
          </span>
          <Link
            href="/reservations/manage"
            style={{
              color: '#E8C47A',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textDecoration: 'none',
              background: 'rgba(232, 196, 122, 0.15)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(232, 196, 122, 0.4)',
            }}
          >
            ✎ EDIT OR REMOVE RESERVATION &rarr;
          </Link>
        </div>
      )}

      {/* Wizard Header Progress Bar (Steps 1 to 3) */}
      {step < 4 && (
        <div className={styles.progressHeader}>
          <div className={styles.stepTrack}>
            <div
              className={styles.stepFill}
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>

          <div className={styles.stepIndicators}>
            <div
              className={`${styles.stepNode} ${step >= 1 ? styles.stepActive : ''}`}
              onClick={() => setStep(1)}
            >
              <span className={styles.stepNum}>01</span>
              <span className={styles.stepTitle}>SEATING &amp; GUESTS</span>
            </div>

            <div
              className={`${styles.stepNode} ${step >= 2 ? styles.stepActive : ''}`}
              onClick={() => {
                setStep(2);
              }}
            >
              <span className={styles.stepNum}>02</span>
              <span className={styles.stepTitle}>DATE &amp; TIME</span>
            </div>

            <div
              className={`${styles.stepNode} ${step >= 3 ? styles.stepActive : ''}`}
              onClick={() => {
                if (validateStep2()) setStep(3);
              }}
            >
              <span className={styles.stepNum}>03</span>
              <span className={styles.stepTitle}>DETAILS &amp; TASTING</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: SEATING ZONE & PARTY SIZE */}
      {step === 1 && (
        <div className={styles.stepSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPill}>STEP 01 OF 03</span>
            <h3 className={styles.stepHeading}>SELECT SEATING &amp; PARTY SIZE</h3>
            <p className={styles.stepDescription}>
              Choose your preferred dining setting and number of guests for this evening.
            </p>
          </div>

          {/* Party Size Selector */}
          <div className={styles.guestSelectorBlock}>
            <label className={styles.fieldLabel}>NUMBER OF GUESTS</label>

            <div className={styles.guestCounterControl}>
              <button
                type="button"
                className={styles.counterBtn}
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                aria-label="Decrease guest count"
              >
                &minus;
              </button>

              <div className={styles.counterDisplay}>
                <span className={styles.counterNumber}>{guests}</span>
                <span className={styles.counterLabel}>GUESTS</span>
              </div>

              <button
                type="button"
                className={styles.counterBtn}
                onClick={() => setGuests((g) => Math.min(12, g + 1))}
                aria-label="Increase guest count"
              >
                &#43;
              </button>
            </div>

            <div className={styles.quickGuestsGrid}>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`${styles.quickGuestBtn} ${guests === num ? styles.quickGuestActive : ''}`}
                  onClick={() => setGuests(num)}
                >
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Cards Grid */}
          <div className={styles.seatingGrid}>
            {SEATING_OPTIONS.map((opt) => {
              const isSelected = seatingArea === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`${styles.seatingCard} ${isSelected ? styles.seatingCardActive : ''}`}
                  onClick={() => setSeatingArea(opt.id)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.cardZoneIcon}>
                        {opt.id === 'main' && (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M10 7v14M14 7v14" />
                          </svg>
                        )}
                        {opt.id === 'counter' && (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                          </svg>
                        )}
                        {opt.id === 'verandah' && (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 20A7 7 0 0 1 4 13C4 6 11 3 20 3c0 9-3 16-9 17Z" />
                            <path d="M4 13c7 0 12-4 16-10" />
                          </svg>
                        )}
                        {opt.id === 'private' && (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                          </svg>
                        )}
                      </span>
                      <span className={styles.cardBadge}>{opt.badge}</span>
                    </div>
                    <span className={styles.cardCapacity}>{opt.capacity}</span>
                  </div>

                  <h4 className={styles.cardTitle}>{opt.name}</h4>
                  <p className={styles.cardAtmosphere}>{opt.atmosphere}</p>
                  <p className={styles.cardDesc}>{opt.description}</p>

                  <div className={styles.radioIndicator}>
                    <span className={styles.radioDot} />
                    <span className={styles.radioText}>
                      {isSelected ? 'SELECTED' : 'SELECT AMBIANCE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Navigation */}
          <div className={styles.actionRow}>
            <div className={styles.actionLeftInfo}>
              <span>{guests} Guests</span> &bull; <span>{selectedSeatingObj.name}</span>
            </div>
            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNextStep}
            >
              <span>CONTINUE TO DATE &amp; TIME</span>
              <span className={styles.btnArrow}>&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SELECTION */}
      {step === 2 && (
        <div className={styles.stepSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPill}>STEP 02 OF 03</span>
            <h3 className={styles.stepHeading}>SELECT DATE &amp; DINING TIME</h3>
            <p className={styles.stepDescription}>
              Select your desired evening date and seating time slot.
            </p>
          </div>

          {/* Date Selector */}
          <div className={styles.dateSelectorBlock}>
            <label className={styles.fieldLabel} htmlFor={`${formId}-date`}>
              RESERVATION DATE
            </label>
            <div className={styles.dateInputRow}>
              <input
                type="date"
                id={`${formId}-date`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.dateInput}
              />
              <div className={styles.quickDatePills}>
                <button
                  type="button"
                  className={styles.quickDateBtn}
                  onClick={() => setQuickDate(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className={styles.quickDateBtn}
                  onClick={() => setQuickDate(2)}
                >
                  In 2 Days
                </button>
                <button
                  type="button"
                  className={styles.quickDateBtn}
                  onClick={() => setQuickDate(7)}
                >
                  Next Week
                </button>
              </div>
            </div>
            {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
          </div>

          {/* Time Slot Categories */}
          <div className={styles.timeSlotsBlock}>
            <label className={styles.fieldLabel}>PREFERRED SERVICE SLOT</label>
            {SERVICE_SLOTS.map((group) => (
              <div key={group.category} className={styles.slotGroup}>
                <span className={styles.slotGroupTitle}>{group.category}</span>
                <div className={styles.slotsGrid}>
                  {group.slots.map((slot) => {
                    const isSelected = time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        className={`${styles.slotBtn} ${isSelected ? styles.slotBtnActive : ''}`}
                        onClick={() => setTime(slot.time)}
                      >
                        <span className={styles.slotTime}>{slot.time}</span>
                        <span className={styles.slotStatus}>{slot.status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {errors.time && <p className={styles.fieldError}>{errors.time}</p>}
          </div>

          {/* Action Navigation */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.prevBtn}
              onClick={handlePrevStep}
            >
              &larr; BACK
            </button>

            <div className={styles.actionCenterInfo}>
              <span>{date}</span> &bull; <span>{time}</span>
            </div>

            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNextStep}
            >
              <span>CONTINUE TO DETAILS</span>
              <span className={styles.btnArrow}>&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GUEST DETAILS, TASTING & OPTIONAL MEALS/DRINKS */}
      {step === 3 && (
        <form className={styles.stepSection} onSubmit={handleSubmit}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPill}>STEP 03 OF 03</span>
            <h3 className={styles.stepHeading}>GUEST DETAILS &amp; TASTING PREFERENCES</h3>
            <p className={styles.stepDescription}>
              Provide contact info and optionally pre-select meals &amp; beverages for your table.
            </p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.fieldLabel} htmlFor={`${formId}-name`}>
                FULL NAME *
              </label>
              <input
                type="text"
                id={`${formId}-name`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lady Vivienne Sterling"
                className={`${styles.textInput} ${errors.fullName ? styles.inputError : ''}`}
              />
              {errors.fullName && (
                <span className={styles.fieldError}>{errors.fullName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.fieldLabel} htmlFor={`${formId}-email`}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                id={`${formId}-email`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. guest@plateo.lk"
                className={`${styles.textInput} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && (
                <span className={styles.fieldError}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.fieldLabel} htmlFor={`${formId}-phone`}>
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                id={`${formId}-phone`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className={`${styles.textInput} ${errors.phone ? styles.inputError : ''}`}
              />
              {errors.phone && (
                <span className={styles.fieldError}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.fieldLabel}>DINING OCCASION</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className={styles.selectInput}
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Restrictions Multi-Select */}
          <div className={styles.dietaryBlock}>
            <label className={styles.fieldLabel}>DIETARY PREFERENCES &amp; ALLERGIES</label>
            <p className={styles.fieldSub}>
              Our executive chef accommodates bespoke dietary requirements with 24h advance notice.
            </p>
            <div className={styles.dietaryPillsGrid}>
              {DIETARY_OPTIONS.map((item) => {
                const active = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.dietaryPill} ${active ? styles.activeDietary : ''}`}
                    onClick={() => toggleDietary(item)}
                  >
                    <span className={styles.dietCheck}>{active ? '✓' : '+'}</span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* OPTIONAL: PRE-SELECT MEALS & DRINKS                          */}
          {/* ============================================================ */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(232, 196, 122, 0.25)',
            borderRadius: '10px',
            padding: '1.25rem',
            margin: '1.5rem 0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label className={styles.fieldLabel} style={{ marginBottom: '2px' }}>
                  PRE-SELECT MEALS &amp; DRINKS (OPTIONAL)
                </label>
                <p className={styles.fieldSub} style={{ margin: 0 }}>
                  Pre-order dishes or drinks for your table, or skip to order in person.
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: totalPreorderedCount > 0 ? '#2ecc71' : '#E8C47A', fontWeight: 600 }}>
                {totalPreorderedCount === 0
                  ? '✦ Table Only (No Pre-order)'
                  : `✓ ${totalPreorderedCount} Item(s) Selected`}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['all', 'dinner', 'lunch', 'breakfast', 'desserts', 'drinks'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMealCategoryFilter(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    border: mealCategoryFilter === cat ? '1px solid #E8C47A' : '1px solid rgba(255,255,255,0.1)',
                    background: mealCategoryFilter === cat ? 'rgba(232, 196, 122, 0.15)' : 'transparent',
                    color: mealCategoryFilter === cat ? '#E8C47A' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Meal Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.75rem',
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {filteredMenuItems.map((menuItem) => {
                const qty = orderedItems[menuItem.id] || 0;
                return (
                  <div
                    key={menuItem.id}
                    style={{
                      background: qty > 0 ? 'rgba(232, 196, 122, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: qty > 0 ? '1px solid #E8C47A' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', color: '#F7F3E9', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {menuItem.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#E8C47A', fontWeight: 600 }}>
                        {menuItem.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {qty > 0 && (
                        <button
                          type="button"
                          onClick={() => handleItemQuantityChange(menuItem.id, -1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid rgba(231,76,60,0.4)',
                            background: 'rgba(231,76,60,0.15)',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                          }}
                        >
                          &minus;
                        </button>
                      )}
                      {qty > 0 && (
                        <span style={{ fontSize: '0.8rem', color: '#F7F3E9', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                          {qty}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleItemQuantityChange(menuItem.id, 1)}
                        style={{
                          padding: qty === 0 ? '0.3rem 0.6rem' : '0',
                          width: qty === 0 ? 'auto' : '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid rgba(232, 196, 122, 0.4)',
                          background: 'rgba(232, 196, 122, 0.15)',
                          color: '#E8C47A',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {qty === 0 ? '+ ADD' : '+'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Requests */}
          <div className={styles.formGroupFull}>
            <label className={styles.fieldLabel} htmlFor={`${formId}-requests`}>
              BESPOKE REQUESTS / WINE PAIRING NOTES
            </label>
            <textarea
              id={`${formId}-requests`}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              placeholder="e.g. Preferred vintage champagne on arrival, quiet corner table, anniversary surprise dessert inscription..."
              className={styles.textareaInput}
            />
          </div>

          {/* Action Row */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.prevBtn}
              onClick={handlePrevStep}
              disabled={isSubmitting}
            >
              &larr; BACK
            </button>

            <button
              type="submit"
              className={styles.confirmBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>CONFIRMING RESERVATION...</span>
              ) : (
                <>
                  <span>CONFIRM &amp; SECURE TABLE</span>
                  <span className={styles.btnArrow}>&rarr;</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: ANIMATED LUXURY CONFIRMATION PASS */}
      {step === 4 && (
        <div className={styles.confirmationWrapper}>
          <div className={styles.ticketCard}>
            {/* Ticket Top Banner */}
            <div className={styles.ticketHeader}>
              <div className={styles.ticketBrand}>
                <PlateoLogo size={28} showFlankingLines={true} />
                <span className={styles.brandTitleText}>PLATEO</span>
                <span className={styles.brandSubtitleText}>RESERVATION CONFIRMATION PASS</span>
              </div>
              <div className={styles.bookingRefBlock}>
                <span className={styles.bookingRefLabel}>REFERENCE CODE</span>
                <span className={styles.bookingRefCode}>{bookingCode}</span>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className={styles.ticketDivider}>
              <div className={styles.cutoutLeft} />
              <div className={styles.dashedLine} />
              <div className={styles.cutoutRight} />
            </div>

            {/* Ticket Main Details */}
            <div className={styles.ticketBody}>
              <div className={styles.ticketSuccessNotice}>
                <div className={styles.successIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 className={styles.confirmedTitle}>TABLE RESERVED FOR {fullName.toUpperCase()}</h4>
                  <p className={styles.confirmedSubtitle}>
                    A confirmation email &amp; SMS concierge invite has been dispatched to {email}.
                  </p>
                </div>
              </div>

              <div className={styles.ticketGrid}>
                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>DATE</span>
                  <span className={styles.itemValue}>{date}</span>
                </div>

                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>TIME</span>
                  <span className={styles.itemValue}>{time}</span>
                </div>

                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>PARTY SIZE</span>
                  <span className={styles.itemValue}>{guests} Guests</span>
                </div>

                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>SEATING AMBIANCE</span>
                  <span className={styles.itemValue}>{selectedSeatingObj.name}</span>
                </div>

                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>OCCASION</span>
                  <span className={styles.itemValue}>{occasion}</span>
                </div>

                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>DIETARY NOTES</span>
                  <span className={styles.itemValue}>
                    {dietary.length > 0 ? dietary.join(', ') : 'Standard Tasting'}
                  </span>
                </div>
              </div>

              {/* Pre-ordered items summary */}
              <div style={{
                background: 'rgba(232, 196, 122, 0.06)',
                border: '1px solid rgba(232, 196, 122, 0.2)',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                margin: '1rem 0',
              }}>
                <span className={styles.itemLabel} style={{ display: 'block', marginBottom: '0.3rem' }}>
                  PRE-ORDERED MEALS &amp; BEVERAGES
                </span>
                {totalPreorderedCount === 0 ? (
                  <span style={{ fontSize: '0.85rem', color: 'rgba(247,243,233,0.5)', fontStyle: 'italic' }}>
                    Table Reservation Only (Dishes &amp; drinks will be ordered at your table)
                  </span>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#F7F3E9', fontSize: '0.85rem' }}>
                    {getStructuredOrderedItems().map((item) => (
                      <li key={item.id}>
                        <strong>{item.quantity}x</strong> {item.name} ({item.price})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {specialRequests && (
                <div className={styles.ticketNotesBox}>
                  <span className={styles.itemLabel}>BESPOKE REQUEST</span>
                  <p className={styles.ticketNoteText}>{specialRequests}</p>
                </div>
              )}

              {/* Concierge Reminders */}
              <div className={styles.conciergeReminder}>
                <p>
                  <strong>Dress Code:</strong> Elegant Smart Casual &bull;{' '}
                  <strong>Valet:</strong> Complimentary Private Valet at Lotus Promenade &bull;{' '}
                  <strong>Grace Period:</strong> 15 minutes holding window
                </p>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className={styles.ticketFooter}>
              <button
                type="button"
                className={styles.calendarBtn}
                onClick={() => {
                  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `Dinner at Plateo - ${bookingCode}`
                  )}&dates=${date.replace(/-/g, '')}/${date.replace(
                    /-/g,
                    ''
                  )}&details=${encodeURIComponent(
                    `Reservation for ${guests} guests at Plateo (${selectedSeatingObj.name}). Reference: ${bookingCode}`
                  )}&location=${encodeURIComponent(
                    'No. 48, Lotus Promenade, Colombo 03'
                  )}`;
                  window.open(calendarUrl, '_blank');
                }}
              >
                <span>ADD TO GOOGLE CALENDAR</span>
              </button>

              <button
                type="button"
                className={styles.newBookingBtn}
                onClick={resetForm}
              >
                <span>BOOK ANOTHER TABLE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
