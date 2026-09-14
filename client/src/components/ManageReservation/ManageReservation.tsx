'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    seatingArea: 'main',
    occasion: '',
    specialRequests: '',
  });

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all reservations
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reservations`);
      const data = await response.json();
      if (response.ok && data.success) {
        setReservations(data.data);
      } else {
        setError('Unable to load reservations.');
      }
    } catch {
      setError('Unable to connect to the reservation service. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Open Edit Mode for a specific card
  const handleStartEdit = (r: Reservation) => {
    setEditingId(r.id);
    setEditForm({
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      seatingArea: r.seatingArea,
      occasion: r.occasion,
      specialRequests: r.specialRequests,
    });
    setError('');
    setSuccessMsg('');
  };

  // Submit Edit
  const handleSaveEdit = async (id: string) => {
    setIsSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data.data } : r))
        );
        setEditingId(null);
        setSuccessMsg(`Reservation updated successfully.`);
      } else {
        setError(data.message || 'Failed to update reservation.');
      }
    } catch {
      setError('Unable to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Delete / Cancel
  const handleConfirmDelete = async (id: string, code: string) => {
    setIsSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        setDeletingId(null);
        setSuccessMsg(`Reservation ${code} has been successfully cancelled and removed.`);
      } else {
        setError(data.message || 'Failed to cancel reservation.');
      }
    } catch {
      setError('Unable to process cancellation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter reservations by search query
  const filteredReservations = reservations.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.bookingCode.toLowerCase().includes(q) ||
      r.date.includes(q) ||
      r.seatingArea.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.manageContainer}>
      <header className={styles.headerSection}>
        <p className={styles.headerTag}>GUEST SELF-SERVICE</p>
        <h2 className={styles.headerTitle}>
          EDIT OR CANCEL <span className={styles.goldText}>RESERVATIONS</span>
        </h2>
        <p className={styles.headerSub}>
          All current table bookings are listed below. Click <strong>Edit</strong> or <strong>Cancel</strong> on any reservation card to update your dining arrangements.
        </p>
      </header>

      {/* Messages */}
      {error && <div className={styles.errorBanner}>{error}</div>}
      {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

      {/* Search & Refresh Filter Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="🔍 Filter by name, email, booking code, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={fetchReservations}
          className={styles.editBtn}
          style={{ width: 'auto', padding: '0.85rem 1.25rem' }}
        >
          ↻ REFRESH
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(232, 196, 122, 0.7)' }}>
          Loading active reservations...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredReservations.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(232, 196, 122, 0.2)',
            borderRadius: '10px',
            color: 'rgba(247, 243, 233, 0.5)',
          }}
        >
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No reservations found.</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(247, 243, 233, 0.35)' }}>
            {searchQuery ? 'Try clearing your search query.' : 'There are currently no table bookings in the system.'}
          </p>
        </div>
      )}

      {/* RESERVATIONS LIST CARDS */}
      {!isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredReservations.map((r) => {
            const isCardEditing = editingId === r.id;
            const isCardDeleting = deletingId === r.id;

            return (
              <div key={r.id} className={styles.detailsCard}>
                {/* Header Row */}
                <div className={styles.detailsHeader}>
                  <div>
                    <span className={styles.bookingCodeBadge}>{r.bookingCode}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(247,243,233,0.4)', marginLeft: '0.75rem' }}>
                      {r.fullName} ({r.email})
                    </span>
                  </div>
                  <span
                    className={styles.statusPill}
                    style={{
                      background:
                        r.status === 'confirmed'
                          ? 'rgba(46, 204, 113, 0.15)'
                          : r.status === 'cancelled'
                          ? 'rgba(231, 76, 60, 0.15)'
                          : 'rgba(232, 196, 122, 0.15)',
                      color:
                        r.status === 'confirmed'
                          ? '#2ecc71'
                          : r.status === 'cancelled'
                          ? '#e74c3c'
                          : '#E8C47A',
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Normal Details View */}
                {!isCardEditing && !isCardDeleting && (
                  <>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>PRIMARY GUEST</span>
                        <span className={styles.detailValue}>{r.fullName}</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>PARTY SIZE</span>
                        <span className={styles.detailValue}>{r.guests} Guest(s)</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>DATE &amp; TIME</span>
                        <span className={styles.detailValue}>
                          {r.date} &bull; {r.time}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>SEATING ZONE</span>
                        <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                          {r.seatingArea}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>OCCASION</span>
                        <span className={styles.detailValue}>{r.occasion}</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>PHONE</span>
                        <span className={styles.detailValue}>{r.phone}</span>
                      </div>

                      {r.specialRequests && (
                        <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                          <span className={styles.detailLabel}>SPECIAL REQUESTS</span>
                          <span className={styles.detailValue}>{r.specialRequests}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.actionRow}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => handleStartEdit(r)}
                      >
                        ✎ EDIT RESERVATION
                      </button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => setDeletingId(r.id)}
                      >
                        🗑 CANCEL / REMOVE
                      </button>
                    </div>
                  </>
                )}

                {/* Inline Edit Form */}
                {isCardEditing && (
                  <div className={styles.editSection}>
                    <h3 className={styles.editSectionTitle}>EDIT RESERVATION DETAILS</h3>
                    <div className={styles.lookupForm}>
                      <div className={styles.grid2Col}>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>FULL NAME</label>
                          <input
                            className={styles.inputField}
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>EMAIL ADDRESS</label>
                          <input
                            className={styles.inputField}
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>PHONE NUMBER</label>
                          <input
                            className={styles.inputField}
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>RESERVATION DATE</label>
                          <input
                            className={styles.inputField}
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>TIME SLOT</label>
                          <input
                            className={styles.inputField}
                            type="text"
                            value={editForm.time}
                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
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

                        <div className={styles.inputGroup}>
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
                            style={{ minHeight: '70px', resize: 'vertical' }}
                            value={editForm.specialRequests}
                            onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className={styles.actionRow}>
                        <button
                          type="button"
                          className={styles.cancelBtn}
                          onClick={() => setEditingId(null)}
                        >
                          DISCARD
                        </button>
                        <button
                          type="button"
                          className={styles.submitBtn}
                          style={{ flex: 1, marginTop: 0 }}
                          disabled={isSaving}
                          onClick={() => handleSaveEdit(r.id)}
                        >
                          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Delete Confirmation */}
                {isCardDeleting && (
                  <div className={styles.editSection} style={{ borderColor: 'rgba(231, 76, 60, 0.4)' }}>
                    <h3 className={styles.editSectionTitle} style={{ color: '#e74c3c' }}>
                      CONFIRM CANCELLATION
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(247, 243, 233, 0.7)', margin: '0 0 1.25rem 0' }}>
                      Are you sure you want to cancel reservation <strong>{r.bookingCode}</strong> for{' '}
                      <strong>{r.fullName}</strong>? This table will be released and permanently removed.
                    </p>
                    <div className={styles.actionRow}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setDeletingId(null)}
                      >
                        KEEP RESERVATION
                      </button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        disabled={isSaving}
                        onClick={() => handleConfirmDelete(r.id, r.bookingCode)}
                      >
                        {isSaving ? 'REMOVING...' : 'YES, CANCEL & REMOVE TABLE'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
