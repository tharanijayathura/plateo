'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import PlateoLogo from '@/components/PlateoLogo/PlateoLogo';
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
    category: 'TWILIGHT & SUNSET (05:30 PM – 06:30 PM)',
    slots: [
      { time: '05:30 PM', status: 'Available' },
      { time: '06:00 PM', status: 'Available' },
      { time: '06:30 PM', status: 'Prime Time' },
    ],
  },
  {
    category: 'PRIME DINNER SERVICE (07:00 PM – 10:00 PM)',
    slots: [
      { time: '07:00 PM', status: 'Prime Time' },
      { time: '07:30 PM', status: 'Filling Fast' },
      { time: '08:00 PM', status: 'Prime Time' },
      { time: '08:30 PM', status: 'Available' },
      { time: '09:00 PM', status: 'Available' },
      { time: '09:30 PM', status: 'Available' },
    ],
  },
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Dairy-Free',
  'Halal',
  'No Pork',
];

const OCCASIONS = [
  'Casual Evening',
  'Romantic Date',
  'Birthday Celebration',
  'Anniversary',
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

  const formId = useId();

  // Quick date helper presets
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

  // Validation functions per step
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

  // ============================================================
  // handleSubmit — NOW CONNECTS TO THE REAL BACKEND!
  // ============================================================
  // BEFORE: setTimeout() generated a random fake code and went nowhere
  // AFTER:  fetch() sends data to Express server → saved to PostgreSQL
  //
  // The flow:
  //   1. Validate form fields (still on frontend for instant feedback)
  //   2. Send POST request to http://localhost:5000/api/reservations
  //   3. Server validates again, saves to database, generates unique code
  //   4. Response comes back with real booking code
  //   5. Show confirmation ticket with REAL data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // This is the KEY moment — sending data to the backend!
      // fetch() makes an HTTP POST request to our Express server
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',                                    // POST = "I want to CREATE something"
        headers: { 'Content-Type': 'application/json' },   // Tell server we're sending JSON
        body: JSON.stringify({                             // Convert JS object to JSON string
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
        }),
      });

      // Parse the JSON response from the server
      const data = await response.json();

      if (!response.ok || !data.success) {
        // Server rejected the data (validation failed, etc.)
        alert(data.message || 'Booking failed. Please try again.');
        return;
      }

      // SUCCESS! The reservation is now saved in the database!
      // data.bookingCode is a REAL unique code from PostgreSQL, not a random number
      setBookingCode(data.bookingCode);
      setStep(4);
    } catch {
      // Network error — server might not be running
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
    setErrors({});
  };

  const selectedSeatingObj =
    SEATING_OPTIONS.find((s) => s.id === seatingArea) || SEATING_OPTIONS[0];

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

      {/* STEP 1: SEATING ZONE & GUESTS */}
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
          <div className={styles.partySizeBox}>
            <label className={styles.fieldLabel}>NUMBER OF GUESTS</label>
            <div className={styles.guestCounterRow}>
              <button
                type="button"
                className={styles.counterBtn}
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                aria-label="Decrease guest count"
              >
                &minus;
              </button>

              <div className={styles.guestDisplay}>
                <span className={styles.guestNumber}>{guests}</span>
                <span className={styles.guestText}>
                  {guests === 1 ? 'GUEST' : 'GUESTS'}
                </span>
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

            {/* Quick Guest Pills */}
            <div className={styles.guestPillRow}>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`${styles.guestPill} ${guests === num ? styles.activePill : ''}`}
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

      {/* STEP 2: DATE & TIME */}
      {step === 2 && (
        <div className={styles.stepSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPill}>STEP 02 OF 03</span>
            <h3 className={styles.stepHeading}>SELECT DATE &amp; SERVICE TIME</h3>
            <p className={styles.stepDescription}>
              Reservations open 30 days in advance. Select your date and dining period.
            </p>
          </div>

          {/* Date Selection Box */}
          <div className={styles.datePickerBox}>
            <label className={styles.fieldLabel} htmlFor={`${formId}-date`}>
              RESERVATION DATE
            </label>

            {/* Quick Date Presets */}
            <div className={styles.quickDateRow}>
              <button
                type="button"
                className={styles.quickDateBtn}
                onClick={() => setQuickDate(0)}
              >
                Today
              </button>
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

            <input
              type="date"
              id={`${formId}-date`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
          </div>

          {/* Time Slots Categorized */}
          <div className={styles.timeSlotsWrapper}>
            <label className={styles.fieldLabel}>AVAILABLE SERVICE TIME SLOTS</label>

            {SERVICE_SLOTS.map((period) => (
              <div key={period.category} className={styles.serviceCategoryBlock}>
                <h5 className={styles.categoryTitle}>{period.category}</h5>
                <div className={styles.timePillsGrid}>
                  {period.slots.map((slot) => {
                    const isSelected = time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        className={`${styles.timePill} ${isSelected ? styles.activeTimePill : ''}`}
                        onClick={() => setTime(slot.time)}
                      >
                        <span className={styles.slotTime}>{slot.time}</span>
                        <span
                          className={`${styles.slotStatus} ${
                            slot.status === 'Prime Time'
                              ? styles.statusPrime
                              : slot.status === 'Filling Fast'
                              ? styles.statusFast
                              : ''
                          }`}
                        >
                          {slot.status}
                        </span>
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

      {/* STEP 3: GUEST INFORMATION & PREFERENCES */}
      {step === 3 && (
        <form className={styles.stepSection} onSubmit={handleSubmit}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPill}>STEP 03 OF 03</span>
            <h3 className={styles.stepHeading}>GUEST DETAILS &amp; TASTING PREFERENCES</h3>
            <p className={styles.stepDescription}>
              Please provide your contact information and any dietary notes so we can personalize your evening.
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

