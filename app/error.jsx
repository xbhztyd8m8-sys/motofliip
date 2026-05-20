'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Next.js 16 error boundary — receives unstable_retry (not reset) to re-fetch + re-render
export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f0ede6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '0 1.5rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          letterSpacing: '0.08em',
          color: '#e8ff47',
          marginBottom: '1rem',
        }}>
          ERROR · UNEXPECTED
        </div>

        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }} aria-hidden="true">🏍️</div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Something fell off the bike.
        </h1>

        <p style={{
          color: '#777',
          fontSize: '15px',
          lineHeight: 1.65,
          marginBottom: '2rem',
        }}>
          An unexpected error occurred. Try refreshing — if it keeps happening,
          email us at{' '}
          <a href="mailto:support@motofliip.com" style={{ color: '#e8ff47', textDecoration: 'none' }}>
            support@motofliip.com
          </a>.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mf-btn-primary"
            style={{
              background: '#e8ff47',
              color: '#0a0a0a',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.02em',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link href="/" className="mf-btn-ghost" style={{
            background: 'transparent',
            color: '#f0ede6',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #2a2a2a',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
          }}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
