export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f0ede6',
      fontFamily: "'Georgia', serif",
    }}>

      {/* NAV */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid #1e1e1e',
        position: 'sticky',
        top: 0,
        background: '#0a0a0a',
        zIndex: 100,
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
          🏍️ MotoFlip
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="mf-nav-links" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            <a href="#how" className="mf-link" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>How it works</a>
            <a href="#pricing" className="mf-link" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>Pricing</a>
            <a href="/login" className="mf-link" style={{
              color: '#888',
              fontSize: '14px',
              textDecoration: 'none',
            }}>Log in</a>
          </div>
          <a href="/signup" className="mf-cta-primary" style={{
            background: '#e8ff47',
            color: '#0a0a0a',
            padding: '9px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
            boxShadow: '0 0 24px rgba(232,255,71,0.15)',
          }}>Get started →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="mf-section" style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '5rem 2rem 3.5rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '12px',
          color: '#e8ff47',
          fontFamily: 'monospace',
          marginBottom: '2rem',
          letterSpacing: '0.06em',
        }}>
          NOW WITH BROWSER EXTENSION
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: '700',
          lineHeight: '1.05',
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
        }}>
          Stop guessing.<br />
          <span style={{ color: '#e8ff47' }}>Start flipping.</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#888',
          maxWidth: '560px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.65',
          fontFamily: 'sans-serif',
          fontWeight: '400',
        }}>
          MotoFlip analyzes motorcycle listings in seconds — flip score, profit estimate,
          negotiation tips, and red flags. Right on Marketplace while you browse.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" className="mf-btn-primary" style={{
            background: '#e8ff47',
            color: '#0a0a0a',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: 'monospace',
          }}>
            Try free — no card needed
          </a>
          <a href="#how" className="mf-btn-ghost" style={{
            background: 'transparent',
            color: '#f0ede6',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            border: '1px solid #2a2a2a',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
          }}>
            See how it works
          </a>
        </div>
      </section>

      {/* EXTENSION PREVIEW MOCK */}
      <section className="mf-section" style={{
        maxWidth: '500px',
        margin: '0 auto 5rem',
        padding: '0 2rem',
      }}>
        <div style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(232,255,71,0.07)',
        }}>
          <div style={{
            background: '#161616',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #222',
          }}>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>🏍️ MotoFlip</span>
            <span style={{ color: '#444', fontSize: '18px', cursor: 'pointer' }}>×</span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{
              background: '#1a1a1a',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '14px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>2019 Kawasaki Ninja 400</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>$3,200 · 9,400 mi · Birmingham, AL</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '44px', fontWeight: '800', color: '#e8ff47', lineHeight: 1 }}>84</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>flip score / 100</div>
              </div>
              <div style={{
                background: '#1a2e1a',
                color: '#4ade80',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                🔥 Hot flip
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[['Offer', '$2,800'], ['Sell ~', '$3,900'], ['Profit', '+$850']].map(([label, val]) => (
                <div key={label} style={{ background: '#1a1a1a', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#666' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: label === 'Profit' ? '#4ade80' : '#f0ede6', marginTop: '2px' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#4ade80', marginBottom: '3px' }}>✓ Popular model — fast-moving</div>
              <div style={{ fontSize: '12px', color: '#4ade80', marginBottom: '3px' }}>✓ Priced 18% under market</div>
              <div style={{ fontSize: '12px', color: '#f87171' }}>✗ Mileage slightly high for year</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1, padding: '9px', borderRadius: '7px',
                background: '#e8ff47', color: '#0a0a0a',
                border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace',
              }}>Save to pipeline</button>
              <button style={{
                flex: 1, padding: '9px', borderRadius: '7px',
                background: 'transparent', color: '#f0ede6',
                border: '1px solid #2a2a2a', fontSize: '12px', cursor: 'pointer',
              }}>Full analysis</button>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#444', marginTop: '12px', fontFamily: 'monospace' }}>
          Works on Facebook Marketplace · Craigslist · Cycle Trader
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mf-section" style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { n: '01', title: 'Browse like normal', body: 'Go to Facebook Marketplace or Craigslist and search for motorcycles like you always do.' },
            { n: '02', title: 'Click the MotoFlip button', body: 'Our Chrome extension puts a button on every listing. One click and the analysis runs instantly.' },
            { n: '03', title: 'Get your flip score', body: 'See the flip score, suggested offer price, estimated profit, and any red flags — in about 2 seconds.' },
            { n: '04', title: 'Save the best ones', body: 'Add hot listings to your pipeline. Track everything in one dashboard. Never lose a deal.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="mf-card" style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '12px',
              padding: '1.5rem',
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#e8ff47', marginBottom: '10px', letterSpacing: '0.06em' }}>{n}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.65', fontFamily: 'sans-serif' }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mf-section" style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2rem)', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
          Simple pricing
        </h2>
        <div className="mf-grid-2" style={{ gap: '1rem' }}>
          <div className="mf-card" style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace', marginBottom: '6px' }}>FREE</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4px' }}>$0</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '1.5rem' }}>forever</div>
            {['5 analyses per month', 'Pipeline up to 10 listings', 'Basic flip scores', 'Web app only'].map(f => (
              <div key={f} style={{ fontSize: '13px', color: '#888', marginBottom: '8px', fontFamily: 'sans-serif' }}>✓ {f}</div>
            ))}
            <a href="/signup" className="mf-btn-ghost" style={{
              display: 'block', textAlign: 'center', marginTop: '1.5rem',
              border: '1px solid #2a2a2a', color: '#f0ede6', padding: '10px',
              borderRadius: '7px', textDecoration: 'none', fontSize: '14px',
            }}>Get started free</a>
          </div>
          <div className="mf-card" style={{
            background: '#111',
            border: '2px solid #e8ff47',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
              background: '#e8ff47', color: '#0a0a0a', fontSize: '11px', fontWeight: '800',
              padding: '3px 12px', borderRadius: '999px', fontFamily: 'monospace', letterSpacing: '0.06em',
            }}>MOST POPULAR</div>
            <div style={{ fontSize: '13px', color: '#e8ff47', fontFamily: 'monospace', marginBottom: '6px' }}>PRO</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4px' }}>$9</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '1.5rem' }}>per month</div>
            {['Unlimited analyses', 'Unlimited pipeline', 'Chrome extension', 'Market comps view', 'Profit tracking + sold log'].map(f => (
              <div key={f} style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px', fontFamily: 'sans-serif' }}>✓ {f}</div>
            ))}
            <a href="/signup?plan=pro" className="mf-btn-primary" style={{
              display: 'block', textAlign: 'center', marginTop: '1.5rem',
              background: '#e8ff47', color: '#0a0a0a', padding: '10px',
              borderRadius: '7px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace',
            }}>Start Pro free trial</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1a1a1a',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#333',
        fontSize: '13px',
        fontFamily: 'monospace',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <a href="/faq" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>FAQ</a>
          <a href="/privacy" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Terms of Service</a>
          <a href="mailto:support@motofliip.com" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Support</a>
        </div>
        <div>© 2026 MotoFlip · Built for flippers, by flippers</div>
        <div style={{ marginTop: '6px', color: '#2a2a2a' }}>
          Made with <span style={{ color: '#7a1f1f' }}>♥</span> in Alabama
        </div>
      </footer>

    </main>
  );
}



