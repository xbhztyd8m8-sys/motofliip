export const metadata = {
  title: 'Blog',
  description: 'MotoFlip articles on motorcycle flipping, spotting deals, avoiding lemons, and building a profitable resale operation.',
};

const UPCOMING_ARTICLES = [
  'How to flip a Kawasaki Ninja 400 (the math behind a $900 profit)',
  '5 red flags on used motorcycle listings that most buyers miss',
  'What makes a hot flip in 2026 — the models moving fastest right now',
  'How to negotiate a motorcycle price using comparable listings',
  'Craigslist vs. Facebook Marketplace: where the better deals are hiding',
  'The beginner\'s guide to motorcycle flipping in a slow market',
];

export default function Blog() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        <a href="/" style={{ color: '#e8ff47', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>← Back to MotoFlip</a>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: '#e8ff47',
          margin: '2rem 0 0.75rem',
        }}>
          ARTICLES
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          The MotoFlip Blog
        </h1>

        <p style={{ color: '#666', fontSize: '15px', marginBottom: '3rem', lineHeight: 1.65 }}>
          Practical guides on motorcycle flipping — finding deals, reading listings,
          and running the numbers. Articles coming soon.
        </p>

        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontSize: '11px', fontFamily: 'monospace', color: '#555',
            letterSpacing: '0.06em', marginBottom: '1rem',
          }}>
            COMING SOON
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
            {UPCOMING_ARTICLES.map((title) => (
              <div key={title} style={{
                background: '#111',
                padding: '0.875rem 1rem',
                fontSize: '14px',
                color: '#555',
                lineHeight: 1.5,
                fontFamily: 'sans-serif',
              }}>
                {title}
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#444', fontFamily: 'monospace', lineHeight: 1.65 }}>
          Questions in the meantime?{' '}
          <a href="mailto:support@motofliip.com" style={{ color: '#e8ff47', textDecoration: 'none' }}>
            support@motofliip.com
          </a>
        </p>

      </div>
    </div>
  );
}
