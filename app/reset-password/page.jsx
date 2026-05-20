'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  // ready becomes true once Supabase fires the PASSWORD_RECOVERY event,
  // meaning the user arrived via a valid reset link and is authenticated.
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    document.title = 'Set new password · MotoFlip';

    const supabase = createClient();

    // Supabase fires PASSWORD_RECOVERY when the user lands from a reset email.
    // We also check for an existing session in case the callback already handled
    // the code exchange and the user is already authenticated.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true);
      }
    });

    // Also check immediately — the auth/callback route may have already set the session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // If no session or recovery event after 3s, the link was expired/invalid.
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) setExpired(true);
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit() {
    if (!password) { setError('Please enter a new password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords don\'t match.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: '15px',
    border: '1px solid #222', borderRadius: '8px',
    background: '#111', color: '#f0ede6',
    fontFamily: 'sans-serif', outline: 'none', marginBottom: '12px',
  };

  const labelStyle = {
    fontSize: '12px', color: '#555', fontFamily: 'monospace',
    letterSpacing: '0.04em', marginBottom: '4px', display: 'block',
  };

  // Success state
  if (done) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', padding: '0 1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>
            Password updated
          </h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.65' }}>
            You&apos;re all set. Taking you to your dashboard now...
          </p>
        </div>
      </div>
    );
  }

  // Expired / invalid link state
  if (expired) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', padding: '0 1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>
            Link expired
          </h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.65', marginBottom: '1.5rem' }}>
            This password reset link has expired or already been used.
          </p>
          <a href="/forgot-password" style={{
            display: 'inline-block',
            background: '#e8ff47', color: '#0a0a0a',
            padding: '12px 24px', borderRadius: '8px',
            fontSize: '14px', fontWeight: '700',
            textDecoration: 'none', fontFamily: 'monospace',
          }}>
            Request a new link →
          </a>
        </div>
      </div>
    );
  }

  // Loading state while waiting for auth event
  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏍️</div>
          <p style={{ color: '#555', fontSize: '14px', fontFamily: 'monospace' }}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Set new password form
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏍️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>Set a new password</h1>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '6px' }}>Choose something strong — at least 6 characters</p>
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '2rem' }}>
          <label htmlFor="new-password" style={labelStyle}>NEW PASSWORD</label>
          <input
            id="new-password"
            style={inputStyle}
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />

          <label htmlFor="confirm-password" style={labelStyle}>CONFIRM PASSWORD</label>
          <input
            id="confirm-password"
            style={inputStyle}
            type="password"
            placeholder="Same password again"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
            {loading ? 'Updating...' : 'Update password →'}
          </button>
        </div>
      </div>
    </div>
  );
}
