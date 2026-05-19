import Link from 'next/link';

export const metadata = {
  title: 'Page not found — MotoFlip',
  description: 'That page took a wrong turn.',
};

export default function NotFound() {
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
          ERROR · 404
        </div>

        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🏍️💨</div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          That page took a wrong turn.
        </h1>

        <p style={{
          color: '#777',
          fontSize: '15px',
          lineHeight: 1.65,
          marginBottom: '2rem',
        }}>
          We couldn&apos;t find what you were looking for. The URL might be off, or
          the page may have moved.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link href="/" className="mf-btn-primary" style={{
            background: '#e8ff47',
            color: '#0a0a0a',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
          }}>
            ← Back to home
          </Link>
          <Link href="/dashboard" className="mf-btn-ghost" style={{
            background: 'transparent',
            color: '#f0ede6',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #2a2a2a',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
          }}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
