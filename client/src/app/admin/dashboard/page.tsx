'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ===========================================
// ADMIN DASHBOARD
// ===========================================
// This page displays:
//   1. Stats summary (total bookings, today's bookings, new contacts)
//   2. Reservations table (all bookings with status management)
//   3. Contact messages table (all inquiries with status management)
//
// HOW IT WORKS:
//   - On page load, we check if a JWT token exists in localStorage
//   - If no token → redirect to /admin (login page)
//   - If token exists → fetch data from backend with token in Authorization header
//   - Display data in tables with filtering and status update buttons

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

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('plateo_admin_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch all data from the backend
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

      // If any request returns 401, the token is expired
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

  // Update reservation status
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
        // Refresh stats
        const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }
    } catch {
      console.error('Failed to update reservation status');
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
        const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }
    } catch {
      console.error('Failed to update contact status');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('plateo_admin_token');
    router.push('/admin');
  };

  // Filter reservations by status
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
            {/* Filter row */}
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

            {/* Reservations Table */}
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
                        <td style={s.td}>{r.occasion}</td>
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
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {r.status !== 'confirmed' && (
                              <button
                                style={s.actionBtn}
                                onClick={() => updateReservationStatus(r.id, 'confirmed')}
                              >
                                ✓
                              </button>
                            )}
                            {r.status !== 'cancelled' && (
                              <button
                                style={{ ...s.actionBtn, color: '#e74c3c' }}
                                onClick={() => updateReservationStatus(r.id, 'cancelled')}
                              >
                                ✕
                              </button>
                            )}
                            {r.status !== 'completed' && (
                              <button
                                style={{ ...s.actionBtn, color: '#b88e4a' }}
                                onClick={() => updateReservationStatus(r.id, 'completed')}
                              >
                                ✔
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
    </div>
  );
}

// Inline styles (Plateo dark luxury aesthetic)
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
};
