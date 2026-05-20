'use client';

// Catches errors in the root layout itself. Must render a full <html>/<body>
// document because the root layout may not have loaded. All styles are inline
// since globals.css may be unavailable when the layout crashes.
// Uses unstable_retry (Next.js 16) to attempt recovery.
export default function GlobalError({ error, unstable_retry }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: '#0a0a0a',
        color: '#f0ede6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '0.08em',
            color: '#e8ff47',
            marginBottom: '1rem',
          }}>
            ERROR · CRITICAL
          </div>

          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏍️</div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            margin: '0 0 0.75rem',
          }}>
            Something went wrong.
          </h1>

          <p style={{
            color: '#777',
            fontSize: '14px',
            lineHeight: 1.65,
            marginBottom: '2rem',
          }}>
            MotoFlip hit an unexpected error. Try again or{' '}
            <a href="/" style={{ color: '#e8ff47', textDecoration: 'none' }}>
              go back home
            </a>.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                background: '#e8ff47',
                color: '#0a0a0a',
                padding: '11px 22px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'monospace',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a href="/" style={{
              background: 'transparent',
              color: '#f0ede6',
              padding: '11px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #2a2a2a',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
            }}>
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
