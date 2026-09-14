'use client';

import React, { useState } from 'react';
import styles from './ManageReservation.module.css';

interface Reservation {
  id: string;
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  occasion: string;
  dietary: string[];
  specialRequests: string;
  status: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ManageReservation() {
  // State
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    seatingArea: 'main',
    occasion: '',
    specialRequests: '',
  });

  // Cancel confirmation state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // 1. LOOKUP RESERVATION
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!bookingCodeInput.trim() || !emailInput.trim()) {
      setError('Please enter both your Booking Code and Email Address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reservations/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingCode: bookingCodeInput.trim(),
          email: emailInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'No reservation found matching these details.');
        setReservation(null);
        return;
      }

      setReservation(data.data);
    } catch {
      setError('Unable to connect to the reservation service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. OPEN EDIT FORM
  const handleStartEdit = () => {
    if (!reservation) return;
    setEditForm({
      fullName: reservation.fullName,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      seatingArea: reservation.seatingArea,
      occasion: reservation.occasion,
      specialRequests: reservation.specialRequests,
    });
    setIsEditing(true);
    setError('');
    setSuccessMsg('');
  };

  // 3. SUBMIT EDIT
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(
        `${API_URL}/api/reservations/${reservation.bookingCode}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: reservation.email,
            ...editForm,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to update reservation.');
        return;
      }

      setReservation(data.data);
      setIsEditing(false);
      setSuccessMsg('Your reservation has been updated successfully.');
    } catch {
      setError('Unable to save changes. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. CANCEL / REMOVE RESERVATION
  const handleConfirmCancel = async () => {
    if (!reservation) return;

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(
        `${API_URL}/api/reservations/${reservation.bookingCode}?email=${encodeURIComponent(
          reservation.email
        )}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to cancel reservation.');
        return;
      }

      setReservation(null);
      setShowCancelConfirm(false);
      setBookingCodeInput('');
      setEmailInput('');
      setSuccessMsg(`Reservation ${data.message || 'has been successfully cancelled'}`);
    } catch {
      setError('Unable to process cancellation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.manageContainer}>
      <header className={styles.headerSection}>
        <p className={styles.headerTag}>GUEST SELF-SERVICE</p>
        <h2 className={styles.headerTitle}>
          MANAGE YOUR <span className={styles.goldText}>RESERVATION</span>
        </h2>
        <p className={styles.headerSub}>
          Look up, modify, or cancel your table reservation using your Booking Code and Email Address.
        </p>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}
      {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

      {/* VIEW 1: LOOKUP FORM */}
      {!reservation && (
        <form onSubmit={handleLookup} className={styles.lookupForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>BOOKING CODE</label>
            <input
              className={styles.inputField}
              type="text"
              placeholder="e.g. PLT-8492"
              value={bookingCodeInput}
              onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>GUEST EMAIL ADDRESS</label>
            <input
              className={styles.inputField}
              type="email"
              placeholder="The email used for booking"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'SEARCHING RESERVATIONS...' : 'FIND MY RESERVATION'}
          </button>
        </form>
      )}

      {/* VIEW 2: RESERVATION DETAILS & ACTIONS */}
      {reservation && (
        <div>
          <button
            className={styles.backBtn}
            onClick={() => {
              setReservation(null);
              setIsEditing(false);
              setShowCancelConfirm(false);
            }}
          >
            &larr; SEARCH ANOTHER BOOKING
          </button>

          <div className={styles.detailsCard}>
            <div className={styles.detailsHeader}>
              <span className={styles.bookingCodeBadge}>
                {reservation.bookingCode}
              </span>
              <span
                className={styles.statusPill}
                style={{
                  background:
                    reservation.status === 'confirmed'
                      ? 'rgba(46, 204, 113, 0.15)'
                      : reservation.status === 'cancelled'
                      ? 'rgba(231, 76, 60, 0.15)'
                      : 'rgba(232, 196, 122, 0.15)',
                  color:
                    reservation.status === 'confirmed'
                      ? '#2ecc71'
                      : reservation.status === 'cancelled'
                      ? '#e74c3c'
                      : '#E8C47A',
                }}
              >
                {reservation.status}
              </span>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>PRIMARY GUEST</span>
                <span className={styles.detailValue}>{reservation.fullName}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>PARTY SIZE</span>
                <span className={styles.detailValue}>{reservation.guests} Guest(s)</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>DATE &amp; TIME</span>
                <span className={styles.detailValue}>
                  {reservation.date} &bull; {reservation.time}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>SEATING ZONE</span>
                <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                  {reservation.seatingArea}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>OCCASION</span>
                <span className={styles.detailValue}>{reservation.occasion}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>PHONE</span>
                <span className={styles.detailValue}>{reservation.phone}</span>
              </div>

              {reservation.specialRequests && (
                <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                  <span className={styles.detailLabel}>SPECIAL REQUESTS</span>
                  <span className={styles.detailValue}>{reservation.specialRequests}</span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            {!isEditing && !showCancelConfirm && (
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={handleStartEdit}
                >
                  ✎ EDIT RESERVATION
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowCancelConfirm(true)}
                >
                  🗑 CANCEL RESERVATION
                </button>
              </div>
            )}
          </div>

          {/* EDIT FORM INLINE */}
          {isEditing && (
            <div className={styles.editSection}>
              <h3 className={styles.editSectionTitle}>MODIFICATION DETAILS</h3>
              <form onSubmit={handleSaveEdit} className={styles.lookupForm}>
                <div className={styles.grid2Col}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>FULL NAME</label>
                    <input
                      className={styles.inputField}
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>PHONE NUMBER</label>
                    <input
                      className={styles.inputField}
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>RESERVATION DATE</label>
                    <input
                      className={styles.inputField}
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>TIME SLOT</label>
                    <input
                      className={styles.inputField}
                      type="text"
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>GUESTS</label>
                    <input
                      className={styles.inputField}
                      type="number"
                      min={1}
                      max={12}
                      value={editForm.guests}
                      onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>SEATING ZONE</label>
                    <select
                      className={styles.inputField}
                      value={editForm.seatingArea}
                      onChange={(e) => setEditForm({ ...editForm, seatingArea: e.target.value })}
                    >
                      <option value="main">Main Dining Room</option>
                      <option value="counter">Chef&apos;s Counter</option>
                      <option value="verandah">Garden Verandah</option>
                      <option value="private">Private Folio</option>
                    </select>
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.inputLabel}>OCCASION</label>
                    <input
                      className={styles.inputField}
                      value={editForm.occasion}
                      onChange={(e) => setEditForm({ ...editForm, occasion: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.inputLabel}>SPECIAL REQUESTS</label>
                    <textarea
                      className={styles.inputField}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      value={editForm.specialRequests}
                      onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    DISCARD
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    style={{ flex: 1, marginTop: 0 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'SAVING...' : 'SAVE MODIFICATIONS'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CANCEL CONFIRMATION INLINE */}
          {showCancelConfirm && (
            <div className={styles.editSection} style={{ borderColor: 'rgba(231, 76, 60, 0.4)' }}>
              <h3 className={styles.editSectionTitle} style={{ color: '#e74c3c' }}>
                CONFIRM CANCELLATION
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(247, 243, 233, 0.7)', margin: '0 0 1.25rem 0' }}>
                Are you sure you want to cancel reservation <strong>{reservation.bookingCode}</strong>? This will release your table and remove the reservation.
              </p>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => setShowCancelConfirm(false)}
                >
                  KEEP RESERVATION
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleConfirmCancel}
                  disabled={isLoading}
                >
                  {isLoading ? 'CANCELLING...' : 'YES, CANCEL TABLE'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
