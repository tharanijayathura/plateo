'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  orderedItems?: Array<{ id: string; name: string; category: string; price: string; quantity: number }>;
  status: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  replyMethod: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalReservations: number;
  todayReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalContacts: number;
  newContacts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reservations' | 'contacts'>('reservations');
  const [stats, setStats] = useState<Stats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit modal state
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    seatingArea: '',
    occasion: '',
    specialRequests: '',
    status: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('plateo_admin_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('plateo_admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const [statsRes, reservationsRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/reservations`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers }),
      ]);

      if (statsRes.status === 401 || reservationsRes.status === 401) {
        localStorage.removeItem('plateo_admin_token');
        router.push('/admin');
        return;
      }

      const [statsData, reservationsData, contactsData] = await Promise.all([
        statsRes.json(),
        reservationsRes.json(),
        contactsRes.json(),
      ]);

      if (statsData.success) setStats(statsData.data);
      if (reservationsData.success) setReservations(reservationsData.data);
      if (contactsData.success) setContacts(contactsData.data);
    } catch {
      console.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh stats helper
  const refreshStats = async () => {
    try {
      const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);
    } catch { /* ignore */ }
  };

  // Update reservation status (quick action buttons)
  const updateReservationStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        await refreshStats();
      }
    } catch {
      console.error('Failed to update reservation status');
    }
  };

  // DELETE a reservation
  const deleteReservation = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        setDeletingId(null);
        await refreshStats();
      }
    } catch {
      console.error('Failed to delete reservation');
    }
  };

  // Open the EDIT modal — pre-fill with current data
  const openEditModal = (r: Reservation) => {
    setEditingReservation(r);
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
      status: r.status,
    });
  };

  // SAVE the edit
  const saveEdit = async () => {
    if (!editingReservation) return;
    setIsSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/reservations/${editingReservation.id}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(editForm),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === editingReservation.id ? { ...r, ...data.data } : r))
        );
        setEditingReservation(null);
        await refreshStats();
      }
    } catch {
      console.error('Failed to save reservation edit');
    } finally {
      setIsSaving(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        await refreshStats();
      }
    } catch {
      console.error('Failed to update contact status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('plateo_admin_token');
    router.push('/admin');
  };

  const filteredReservations =
    statusFilter === 'all'
      ? reservations
      : reservations.filter((r) => r.status === statusFilter);

  if (isLoading) {
    return (
      <div style={s.loadingPage}>
        <div style={s.loadingText}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Top Navigation Bar */}
      <header style={s.topBar}>
        <div style={s.topBarLeft}>
          <span style={s.topLogo}>P</span>
          <span style={s.topBrand}>PLATEO</span>
          <span style={s.topSep}>•</span>
          <span style={s.topLabel}>ADMIN DASHBOARD</span>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>
          SIGN OUT
        </button>
      </header>

      <main style={s.main}>
        {/* Stats Cards Row */}
        {stats && (
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <span style={s.statNumber}>{stats.totalReservations}</span>
              <span style={s.statLabel}>TOTAL RESERVATIONS</span>
            </div>
            <div style={s.statCard}>
              <span style={{ ...s.statNumber, color: '#b88e4a' }}>{stats.todayReservations}</span>
              <span style={s.statLabel}>TODAY&apos;S BOOKINGS</span>
            </div>
            <div style={s.statCard}>
              <span style={{ ...s.statNumber, color: '#2ecc71' }}>{stats.confirmedReservations}</span>
              <span style={s.statLabel}>CONFIRMED</span>
            </div>
            <div style={s.statCard}>
              <span style={{ ...s.statNumber, color: '#e74c3c' }}>{stats.cancelledReservations}</span>
              <span style={s.statLabel}>CANCELLED</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statNumber}>{stats.totalContacts}</span>
              <span style={s.statLabel}>TOTAL MESSAGES</span>
            </div>
            <div style={s.statCard}>
              <span style={{ ...s.statNumber, color: '#f39c12' }}>{stats.newContacts}</span>
              <span style={s.statLabel}>NEW / UNREAD</span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={s.tabRow}>
          <button
            style={activeTab === 'reservations' ? s.tabActive : s.tab}
            onClick={() => setActiveTab('reservations')}
          >
            RESERVATIONS ({reservations.length})
          </button>
          <button
            style={activeTab === 'contacts' ? s.tabActive : s.tab}
            onClick={() => setActiveTab('contacts')}
          >
            CONTACT MESSAGES ({contacts.length})
          </button>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <>
            <div style={s.filterRow}>
              {['all', 'confirmed', 'cancelled', 'completed'].map((f) => (
                <button
                  key={f}
                  style={statusFilter === f ? s.filterActive : s.filter}
                  onClick={() => setStatusFilter(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
              <button style={s.refreshBtn} onClick={fetchData}>
                ↻ REFRESH
              </button>
            </div>

            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>CODE</th>
                    <th style={s.th}>GUEST</th>
                    <th style={s.th}>DATE</th>
                    <th style={s.th}>TIME</th>
                    <th style={s.th}>GUESTS</th>
                    <th style={s.th}>SEATING</th>
                    <th style={s.th}>OCCASION</th>
                    <th style={s.th}>STATUS</th>
                    <th style={s.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td style={s.td} colSpan={9}>
                        <em style={{ color: 'rgba(255,255,255,0.3)' }}>No reservations found</em>
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                      <tr key={r.id} style={s.tr}>
                        <td style={{ ...s.td, color: '#b88e4a', fontWeight: 600 }}>{r.bookingCode}</td>
                        <td style={s.td}>
                          <div>{r.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{r.email}</div>
                        </td>
                        <td style={s.td}>{r.date}</td>
                        <td style={s.td}>{r.time}</td>
                        <td style={s.td}>{r.guests}</td>
                        <td style={s.td}>{r.seatingArea}</td>
                        <td style={s.td}>
                          <div>{r.occasion}</div>
                          {Array.isArray(r.orderedItems) && r.orderedItems.length > 0 && (
                            <div style={{ fontSize: '10px', color: '#b88e4a', marginTop: '2px' }}>
                              🍷 {r.orderedItems.reduce((acc, i) => acc + i.quantity, 0)} meals/drinks pre-ordered
                            </div>
                          )}
                        </td>
                        <td style={s.td}>
                          <span
                            style={{
                              ...s.statusBadge,
                              background:
                                r.status === 'confirmed'
                                  ? 'rgba(46,204,113,0.15)'
                                  : r.status === 'cancelled'
                                  ? 'rgba(231,76,60,0.15)'
                                  : 'rgba(184,142,74,0.15)',
                              color:
                                r.status === 'confirmed'
                                  ? '#2ecc71'
                                  : r.status === 'cancelled'
                                  ? '#e74c3c'
                                  : '#b88e4a',
                            }}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {/* Status quick actions */}
                            {r.status !== 'confirmed' && (
                              <button
                                style={s.actionBtn}
                                onClick={() => updateReservationStatus(r.id, 'confirmed')}
                                title="Confirm"
                              >
                                ✓
                              </button>
                            )}
                            {r.status !== 'cancelled' && (
                              <button
                                style={{ ...s.actionBtn, color: '#e74c3c' }}
                                onClick={() => updateReservationStatus(r.id, 'cancelled')}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            )}
                            {r.status !== 'completed' && (
                              <button
                                style={{ ...s.actionBtn, color: '#b88e4a' }}
                                onClick={() => updateReservationStatus(r.id, 'completed')}
                                title="Complete"
                              >
                                ✔
                              </button>
                            )}
                            {/* EDIT button */}
                            <button
                              style={{ ...s.actionBtn, color: '#3498db' }}
                              onClick={() => openEditModal(r)}
                              title="Edit Reservation"
                            >
                              ✎
                            </button>
                            {/* DELETE button */}
                            <button
                              style={{ ...s.actionBtn, color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)' }}
                              onClick={() => setDeletingId(r.id)}
                              title="Delete Reservation"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>REF</th>
                  <th style={s.th}>FROM</th>
                  <th style={s.th}>DEPARTMENT</th>
                  <th style={s.th}>MESSAGE</th>
                  <th style={s.th}>REPLY VIA</th>
                  <th style={s.th}>STATUS</th>
                  <th style={s.th}>RECEIVED</th>
                  <th style={s.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td style={s.td} colSpan={8}>
                      <em style={{ color: 'rgba(255,255,255,0.3)' }}>No contact messages yet</em>
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} style={s.tr}>
                      <td style={{ ...s.td, color: '#b88e4a', fontWeight: 600 }}>{c.referenceCode}</td>
                      <td style={s.td}>
                        <div>{c.name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{c.email}</div>
                      </td>
                      <td style={s.td}>{c.department}</td>
                      <td style={{ ...s.td, maxWidth: '250px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.message}
                        </div>
                      </td>
                      <td style={s.td}>{c.replyMethod}</td>
                      <td style={s.td}>
                        <span
                          style={{
                            ...s.statusBadge,
                            background:
                              c.status === 'new'
                                ? 'rgba(243,156,18,0.15)'
                                : c.status === 'read'
                                ? 'rgba(52,152,219,0.15)'
                                : 'rgba(46,204,113,0.15)',
                            color:
                              c.status === 'new'
                                ? '#f39c12'
                                : c.status === 'read'
                                ? '#3498db'
                                : '#2ecc71',
                          }}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={s.td}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {c.status === 'new' && (
                            <button
                              style={{ ...s.actionBtn, color: '#3498db' }}
                              onClick={() => updateContactStatus(c.id, 'read')}
                            >
                              READ
                            </button>
                          )}
                          {c.status !== 'replied' && (
                            <button
                              style={{ ...s.actionBtn, color: '#2ecc71' }}
                              onClick={() => updateContactStatus(c.id, 'replied')}
                            >
                              REPLIED
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ============================================ */}
      {/* DELETE CONFIRMATION MODAL                    */}
      {/* ============================================ */}
      {deletingId && (
        <div style={s.modalOverlay} onClick={() => setDeletingId(null)}>
          <div style={s.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div style={s.deleteIcon}>⚠</div>
            <h3 style={s.deleteTitle}>Delete Reservation</h3>
            <p style={s.deleteText}>
              This will <strong>permanently remove</strong> booking{' '}
              <span style={{ color: '#b88e4a' }}>
                {reservations.find((r) => r.id === deletingId)?.bookingCode}
              </span>{' '}
              from the database. This action cannot be undone.
            </p>
            <div style={s.deleteActions}>
              <button
                style={s.deleteCancelBtn}
                onClick={() => setDeletingId(null)}
              >
                KEEP RESERVATION
              </button>
              <button
                style={s.deleteConfirmBtn}
                onClick={() => deleteReservation(deletingId)}
              >
                DELETE PERMANENTLY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* EDIT RESERVATION MODAL                       */}
      {/* ============================================ */}
      {editingReservation && (
        <div style={s.modalOverlay} onClick={() => setEditingReservation(null)}>
          <div style={s.editModal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={s.editHeader}>
              <div>
                <h3 style={s.editTitle}>Edit Reservation</h3>
                <p style={s.editSubtitle}>
                  Booking Code: <span style={{ color: '#b88e4a' }}>{editingReservation.bookingCode}</span>
                </p>
              </div>
              <button
                style={s.editCloseBtn}
                onClick={() => setEditingReservation(null)}
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(184,142,74,0.15)', margin: '0 0 24px 0' }} />

            {/* Edit Form */}
            <div style={s.editGrid}>
              {/* Full Name */}
              <div style={s.editField}>
                <label style={s.editLabel}>FULL NAME</label>
                <input
                  style={s.editInput}
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>

              {/* Email */}
              <div style={s.editField}>
                <label style={s.editLabel}>EMAIL</label>
                <input
                  style={s.editInput}
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div style={s.editField}>
                <label style={s.editLabel}>PHONE</label>
                <input
                  style={s.editInput}
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>

              {/* Date */}
              <div style={s.editField}>
                <label style={s.editLabel}>DATE</label>
                <input
                  style={s.editInput}
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>

              {/* Time */}
              <div style={s.editField}>
                <label style={s.editLabel}>TIME</label>
                <input
                  style={s.editInput}
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                />
              </div>

              {/* Guests */}
              <div style={s.editField}>
                <label style={s.editLabel}>GUESTS</label>
                <input
                  style={s.editInput}
                  type="number"
                  min={1}
                  max={12}
                  value={editForm.guests}
                  onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                />
              </div>

              {/* Seating Area */}
              <div style={s.editField}>
                <label style={s.editLabel}>SEATING AREA</label>
                <select
                  style={s.editInput}
                  value={editForm.seatingArea}
                  onChange={(e) => setEditForm({ ...editForm, seatingArea: e.target.value })}
                >
                  <option value="main">Main Dining Hall</option>
                  <option value="counter">Chef&apos;s Counter</option>
                  <option value="verandah">Garden Verandah</option>
                  <option value="private">Private Folio</option>
                </select>
              </div>

              {/* Status */}
              <div style={s.editField}>
                <label style={s.editLabel}>STATUS</label>
                <select
                  style={s.editInput}
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Occasion */}
              <div style={{ ...s.editField, gridColumn: '1 / -1' }}>
                <label style={s.editLabel}>OCCASION</label>
                <input
                  style={s.editInput}
                  value={editForm.occasion}
                  onChange={(e) => setEditForm({ ...editForm, occasion: e.target.value })}
                />
              </div>

              {/* Special Requests */}
              <div style={{ ...s.editField, gridColumn: '1 / -1' }}>
                <label style={s.editLabel}>SPECIAL REQUESTS</label>
                <textarea
                  style={{ ...s.editInput, minHeight: '80px', resize: 'vertical' as const }}
                  value={editForm.specialRequests}
                  onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={s.editActions}>
              <button
                style={s.editCancelBtn}
                onClick={() => setEditingReservation(null)}
              >
                DISCARD CHANGES
              </button>
              <button
                style={{
                  ...s.editSaveBtn,
                  opacity: isSaving ? 0.7 : 1,
                }}
                onClick={saveEdit}
                disabled={isSaving}
              >
                {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// STYLES — Plateo dark luxury aesthetic
// ================================================
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#e8e0d4',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
  },
  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
  },
  loadingText: {
    color: 'rgba(184,142,74,0.6)',
    fontSize: '12px',
    letterSpacing: '3px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid rgba(184,142,74,0.12)',
    background: 'rgba(18,18,18,0.95)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  topLogo: {
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(184,142,74,0.4)',
    borderRadius: '50%',
    color: '#b88e4a',
    fontSize: '14px',
    fontFamily: "'Times New Roman', serif",
  },
  topBrand: {
    fontSize: '14px',
    fontWeight: 300,
    letterSpacing: '5px',
    color: '#e8e0d4',
  },
  topSep: {
    color: 'rgba(184,142,74,0.3)',
    fontSize: '8px',
  },
  topLabel: {
    fontSize: '9px',
    letterSpacing: '3px',
    color: 'rgba(184,142,74,0.5)',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '9px',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  main: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '24px',
    background: 'rgba(18,18,18,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 300,
    color: '#e8e0d4',
    letterSpacing: '1px',
  },
  statLabel: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: 'rgba(255,255,255,0.35)',
  },
  tabRow: {
    display: 'flex',
    gap: '0',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tab: {
    padding: '14px 28px',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '10px',
    letterSpacing: '2px',
    cursor: 'pointer',
  },
  tabActive: {
    padding: '14px 28px',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid #b88e4a',
    color: '#b88e4a',
    fontSize: '10px',
    letterSpacing: '2px',
    cursor: 'pointer',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  filter: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '9px',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  filterActive: {
    padding: '8px 16px',
    background: 'rgba(184,142,74,0.1)',
    border: '1px solid rgba(184,142,74,0.3)',
    color: '#b88e4a',
    fontSize: '9px',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  refreshBtn: {
    marginLeft: 'auto',
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(184,142,74,0.2)',
    color: '#b88e4a',
    fontSize: '9px',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left' as const,
    fontSize: '9px',
    letterSpacing: '1.5px',
    color: 'rgba(184,142,74,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(18,18,18,0.9)',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
  },
  tr: {
    transition: 'background 0.2s',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '2px',
    fontSize: '9px',
    letterSpacing: '1px',
    fontWeight: 600,
  },
  actionBtn: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#2ecc71',
    fontSize: '10px',
    cursor: 'pointer',
    borderRadius: '2px',
    letterSpacing: '0.5px',
  },

  // ---- Modal shared ----
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },

  // ---- Delete Modal ----
  deleteModal: {
    background: '#121212',
    border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '2px',
    padding: '36px',
    maxWidth: '440px',
    width: '100%',
    textAlign: 'center' as const,
  },
  deleteIcon: {
    fontSize: '36px',
    marginBottom: '16px',
    color: '#e74c3c',
  },
  deleteTitle: {
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '3px',
    color: '#e8e0d4',
    margin: '0 0 12px 0',
  },
  deleteText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6',
    margin: '0 0 28px 0',
  },
  deleteActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  deleteCancelBtn: {
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '9px',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  deleteConfirmBtn: {
    padding: '12px 24px',
    background: 'rgba(231,76,60,0.9)',
    border: 'none',
    color: '#fff',
    fontSize: '9px',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 600,
  },

  // ---- Edit Modal ----
  editModal: {
    background: '#121212',
    border: '1px solid rgba(184,142,74,0.25)',
    borderRadius: '2px',
    padding: '32px',
    maxWidth: '680px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  editTitle: {
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '3px',
    color: '#e8e0d4',
    margin: '0 0 6px 0',
  },
  editSubtitle: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  editCloseBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  editGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  editLabel: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: 'rgba(184,142,74,0.6)',
    fontWeight: 500,
  },
  editInput: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px',
    color: '#e8e0d4',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  editCancelBtn: {
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '9px',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  editSaveBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, rgba(184,142,74,0.9) 0%, rgba(156,120,62,0.9) 100%)',
    border: 'none',
    color: '#0a0a0a',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};
