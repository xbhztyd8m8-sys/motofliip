'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Create your account · MotoFlip';
  }, []);

  async function handleSignup() {
    if (!email || !password || !name) {
      setError('Please fill in your name, email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: name, location: location }
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
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
    letterSpacing: '0.04em', marginBottom: '4px', display: 'block'
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>Check your email</h2>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.65' }}>
            We sent a confirmation link to <strong style={{ color: '#f0ede6' }}>{email}</strong>. Click it to activate your account and start flipping.
          </p>
          <a href="/login" style={{
            display: 'inline-block', marginTop: '1.5rem',
            color: '#e8ff47', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
          }}>Back to login →</a>
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
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏍️</div>
            <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Georgia, serif', color: '#f0ede6' }}>MotoFlip</div>
          </a>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>Free — 5 analyses per month to start</p>
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '2rem' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>Create your account</h1>

          <label htmlFor="signup-name" style={labelStyle}>FULL NAME</label>
          <input
            id="signup-name"
            style={inputStyle}
            type="text"
            placeholder="Hudson Rukstalis"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label htmlFor="signup-email" style={labelStyle}>EMAIL</label>
          <input
            id="signup-email"
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label htmlFor="signup-password" style={labelStyle}>PASSWORD</label>
          <input
            id="signup-password"
            style={inputStyle}
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />

          <label htmlFor="signup-location" style={labelStyle}>LOCATION <span style={{ color: '#333' }}>— optional</span></label>
          <input
            id="signup-location"
            style={inputStyle}
            type="text"
            placeholder="e.g. Birmingham, AL"
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />

          {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: '8px',
              background: loading ? '#2a2a2a' : '#e8ff47',
              color: loading ? '#555' : '#0a0a0a',
              border: 'none', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace', letterSpacing: '0.02em',
            }}
          >
            {loading ? 'Creating account...' : 'Create free account →'}
          </button>

          <p style={{ fontSize: '12px', color: '#444', textAlign: 'center', marginTop: '12px', lineHeight: '1.6' }}>
            By signing up you agree to our terms. No credit card required.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#e8ff47', textDecoration: 'none', fontWeight: '600' }}>Log in</a>
        </p>
      </div>
    </div>
  );
}
