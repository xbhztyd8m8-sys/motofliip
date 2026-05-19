import { ImageResponse } from 'next/og';

export const alt = 'MotoFlip — AI-powered motorcycle flip scores in seconds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          color: '#f0ede6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundImage:
            'radial-gradient(circle at 85% 12%, rgba(232,255,71,0.12) 0%, transparent 55%)',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#f0ede6', display: 'flex' }}>
            🏍️&nbsp;MotoFlip
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 15,
              color: '#e8ff47',
              letterSpacing: '0.12em',
              padding: '7px 14px',
              border: '1px solid #2a2a2a',
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            AI FLIP ANALYZER
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: '#f0ede6',
            }}
          >
            Stop guessing.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: '#e8ff47',
            }}
          >
            Start flipping.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#9a9a9a',
              maxWidth: 880,
              lineHeight: 1.4,
              marginTop: 12,
            }}
          >
            Get a flip score, suggested offer, and red flags on any motorcycle
            listing — in about two seconds.
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1e1e1e',
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 28,
              fontSize: 18,
              color: '#666',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            <span style={{ display: 'flex' }}>FLIP SCORE</span>
            <span style={{ display: 'flex', color: '#333' }}>·</span>
            <span style={{ display: 'flex' }}>PROFIT EST.</span>
            <span style={{ display: 'flex', color: '#333' }}>·</span>
            <span style={{ display: 'flex' }}>RED FLAGS</span>
            <span style={{ display: 'flex', color: '#333' }}>·</span>
            <span style={{ display: 'flex' }}>NEGOTIATION TIPS</span>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#444', fontWeight: 600 }}>
            motofliip.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
