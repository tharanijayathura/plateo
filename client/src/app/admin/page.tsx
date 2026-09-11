'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// ===========================================
// ADMIN LOGIN PAGE
// ===========================================
// This is the gateway to the admin dashboard.
// Staff enter their email + password → frontend sends POST /api/admin/login
// → Backend verifies credentials → Returns JWT token
// → We store the token in localStorage → Redirect to /admin/dashboard
//
// WHY localStorage?
// We need to remember that the admin is logged in across page navigations.
// localStorage persists even after closing the browser tab.
// On every admin API call, we read the token from localStorage and send it
// in the Authorization header.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send login request to the backend
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Store the JWT token in localStorage
      localStorage.setItem('plateo_admin_token', data.token);

      // Redirect to the admin dashboard
      router.push('/admin/dashboard');
    } catch {
      setError('Unable to connect to server. Is the backend running?');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoMark}>P</div>
          <h1 style={styles.brandName}>PLATEO</h1>
          <p style={styles.subtitle}>ADMIN CONSOLE</p>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.diamond}>◇</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@plateo.lk"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>

        <p style={styles.footerNote}>
          Authorized personnel only • Plateo Hospitality Group
        </p>
      </div>
    </div>
  );
}

// Inline styles to match Plateo's dark luxury aesthetic
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    position: 'relative',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 30%, rgba(184,142,74,0.06) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    padding: '48px 36px',
    background: 'rgba(18,18,18,0.95)',
    border: '1px solid rgba(184,142,74,0.2)',
    borderRadius: '2px',
    margin: '20px',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoMark: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    border: '1.5px solid rgba(184,142,74,0.5)',
    borderRadius: '50%',
    color: '#b88e4a',
    fontSize: '20px',
    fontWeight: 300,
    letterSpacing: '2px',
    marginBottom: '16px',
    fontFamily: "'Times New Roman', serif",
  },
  brandName: {
    fontSize: '22px',
    fontWeight: 300,
    letterSpacing: '8px',
    color: '#e8e0d4',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '10px',
    letterSpacing: '4px',
    color: 'rgba(184,142,74,0.7)',
    margin: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(184,142,74,0.15)',
  },
  diamond: {
    color: 'rgba(184,142,74,0.4)',
    fontSize: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: 'rgba(184,142,74,0.6)',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px',
    color: '#e8e0d4',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    margin: 0,
    padding: '8px 12px',
    background: 'rgba(231,76,60,0.08)',
    border: '1px solid rgba(231,76,60,0.2)',
    borderRadius: '2px',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(184,142,74,0.9) 0%, rgba(156,120,62,0.9) 100%)',
    border: 'none',
    borderRadius: '2px',
    color: '#0a0a0a',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    marginTop: '8px',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '9px',
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.2)',
    marginTop: '28px',
    marginBottom: 0,
  },
};
