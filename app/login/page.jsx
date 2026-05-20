'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiredLink, setExpiredLink] = useState(false);

  useEffect(() => {
    document.title = 'Log in · MotoFlip';
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'expired') setExpiredLink(true);
  }, []);

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: '15px',
    border: '1px solid #222', borderRadius: '8px',
    background: '#111', color: '#f0ede6',
    fontFamily: 'sans-serif', outline: 'none', marginBottom: '12px',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏍️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>Welcome back</h1>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '6px' }}>Log in to your MotoFlip account</p>
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '2rem' }}>
          <label htmlFor="login-email" style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace', letterSpacing: '0.04em' }}>EMAIL</label>
          <input
            id="login-email"
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <label htmlFor="login-password" style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace', letterSpacing: '0.04em' }}>PASSWORD</label>
            <a href="/forgot-password" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Forgot password?</a>
          </div>
          <input
            id="login-password"
            style={inputStyle}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          {expiredLink && (
            <div style={{ background: '#1a1010', border: '1px solid #3a1a1a', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#f87171', lineHeight: 1.6 }}>
              That link has expired.{' '}
              <a href="/forgot-password" style={{ color: '#e8ff47', textDecoration: 'none', fontWeight: '600' }}>Request a new one →</a>
            </div>
          )}
          {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

          <button
            type="button"
            onClick={handleLogin}
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
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#e8ff47', textDecoration: 'none', fontWeight: '600' }}>Sign up free</a>
        </p>
      </div>
    </div>
  );
}
