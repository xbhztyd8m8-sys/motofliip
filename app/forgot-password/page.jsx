'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Reset password · MotoFlip';
  }, []);

  async function handleSubmit() {
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: '15px',
    border: '1px solid #222', borderRadius: '8px',
    background: '#111', color: '#f0ede6',
    fontFamily: 'sans-serif', outline: 'none', marginBottom: '12px',
  };

  if (sent) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', padding: '0 1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>
            Check your email
          </h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.65', marginBottom: '1.5rem' }}>
            We sent a password reset link to{' '}
            <strong style={{ color: '#f0ede6' }}>{email}</strong>.
            Click it and you&apos;ll be prompted to choose a new password.
          </p>
          <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.6' }}>
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button
              type="button"
              onClick={() => { setSent(false); setEmail(''); }}
              style={{ background: 'none', border: 'none', color: '#e8ff47', cursor: 'pointer', fontSize: '13px', padding: 0, fontWeight: '600' }}
            >
              try again
            </button>.
          </p>
          <a href="/login" style={{
            display: 'inline-block', marginTop: '1.5rem',
            color: '#555', textDecoration: 'none', fontSize: '13px',
          }}>← Back to login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏍️</div>
            <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Georgia, serif', color: '#f0ede6' }}>MotoFlip</div>
          </a>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>Enter your email and we&apos;ll send a reset link</p>
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '2rem' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
            Reset your password
          </h1>

          <label htmlFor="reset-email" style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace', letterSpacing: '0.04em' }}>EMAIL</label>
          <input
            id="reset-email"
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />

          {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: loading ? '#2a2a2a' : '#e8ff47',
              color: loading ? '#555' : '#0a0a0a',
              border: 'none', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace', letterSpacing: '0.02em',
            }}
          >
            {loading ? 'Sending...' : 'Send reset link →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '1.5rem' }}>
          Remembered it?{' '}
          <a href="/login" style={{ color: '#e8ff47', textDecoration: 'none', fontWeight: '600' }}>Back to login</a>
        </p>
      </div>
    </div>
  );
}
