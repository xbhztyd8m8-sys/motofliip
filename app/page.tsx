import FadeIn from '@/components/FadeIn';

const EXTENSION_URL = '#extension';

export const metadata = {
  title: 'MotoFlip — AI Flip Scores for Motorcycle Listings',
  description:
    'MotoFlip analyzes motorcycle listings in seconds. Get an AI flip score, profit estimate, suggested offer price, and red flags — right on Facebook Marketplace, Craigslist, and Cycle Trader.',
  keywords: [
    'motorcycle flip', 'motorcycle resale', 'flip motorcycles', 'motorcycle profit calculator',
    'Facebook Marketplace motorcycle', 'buy and sell motorcycles', 'used motorcycle value',
    'motorcycle flip score', 'motorcycle investment tool',
  ],
  openGraph: {
    title: 'MotoFlip — AI Flip Scores for Motorcycle Listings',
    description:
      'Instant AI analysis on any motorcycle listing. Flip score, profit estimate, red flags, and negotiation tips in about 2 seconds.',
    type: 'website',
  },
};

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
          <span aria-hidden="true">🏍️</span> MotoFlip
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="mf-nav-links" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            <a href="#extension" className="mf-link" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>Extension</a>
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
        /* Subtle radial glow at top-right */
        backgroundImage: 'radial-gradient(ellipse 60% 50% at 80% 0%, rgba(232,255,71,0.08) 0%, transparent 70%)',
      }}>
        {/* Chips row */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '12px',
            color: '#e8ff47',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
          }}>
            <span aria-hidden="true">🏍️</span>{"  "}FOUNDING MEMBERS · $9/MO LOCKED IN FOREVER
          </div>
          <a href="#extension" style={{
            display: 'inline-block',
            background: '#0d1a0d',
            border: '1px solid #1a3a1a',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '12px',
            color: '#4ade80',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
            textDecoration: 'none',
          }}>
            🧩{"  "}CHROME EXTENSION — COMING SOON
          </a>
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
          What used to take an hour of research — comps, pricing, red flags — now takes
          2 seconds. Paste any listing and get a flip score, suggested offer, and profit
          estimate before the seller even replies.
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

        {/* Founding-member / no-card line */}
        <p style={{
          fontSize: '12px',
          color: '#555',
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
          marginTop: '1rem',
          marginBottom: 0,
        }}>
          First 100 founding members · No card required to start
        </p>
      </section>

      {/* TRUST SIGNALS */}
      <FadeIn>
        <section className="mf-section" style={{
          maxWidth: '620px',
          margin: '0 auto 2rem',
          padding: '0 2rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#666',
          }}>
            <span>⚡ 2 seconds vs. an hour of research</span>
            <span style={{ color: '#2a2a2a' }}>·</span>
            <span>🇺🇸 Trained on US used-bike market data</span>
            <span style={{ color: '#2a2a2a' }}>·</span>
            <span>🔒 No credit card required to start</span>
          </div>
        </section>
      </FadeIn>

      {/* EXTENSION SELL SECTION */}
      <section id="extension" className="mf-section" style={{
        maxWidth: '960px',
        margin: '0 auto 5rem',
        padding: '0 2rem',
        borderTop: '1px solid #1a1a1a',
        paddingTop: '4rem',
      }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: '#0d1a0d',
              border: '1px solid #1a3a1a',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '11px',
              color: '#4ade80',
              fontFamily: 'monospace',
              marginBottom: '1.25rem',
              letterSpacing: '0.08em',
            }}>
              🧩 CHROME EXTENSION — COMING SOON
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              lineHeight: 1.1,
            }}>
              Flip scores right on<br />the listing page.
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#888',
              maxWidth: '520px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
              fontFamily: 'sans-serif',
            }}>
              The MotoFlip Chrome extension is launching soon — it puts an instant AI analysis
              directly on every listing you browse. No copy-pasting, no tab switching.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#4ade80', color: '#0a0a0a',
                padding: '13px 28px', borderRadius: '8px',
                fontSize: '15px', fontWeight: '700',
                textDecoration: 'none', fontFamily: 'monospace',
                letterSpacing: '0.02em',
                boxShadow: '0 0 32px rgba(74,222,128,0.2)',
              }}>
                🧩 Sign up to get notified at launch
              </a>
              <a href="/signup" style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'transparent', color: '#f0ede6',
                padding: '13px 28px', borderRadius: '8px',
                fontSize: '15px', border: '1px solid #2a2a2a',
                textDecoration: 'none', fontFamily: 'sans-serif',
              }}>
                Use the web app now
              </a>
            </div>
            <p style={{ fontSize: '12px', color: '#444', fontFamily: 'monospace', marginTop: '12px' }}>
              Chrome · Edge · Brave — any Chromium browser
            </p>
          </div>
        </FadeIn>

        {/* Extension mock + install steps side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}>
          {/* Mock UI */}
          <FadeIn>
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
                <span style={{ fontWeight: '700', fontSize: '14px' }}><span aria-hidden="true">🏍️</span> MotoFlip</span>
                <span style={{ color: '#444', fontSize: '18px' }}>×</span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>2019 Kawasaki Ninja 400</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>$3,200 · 9,400 mi · Listed on Marketplace</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '44px', fontWeight: '800', color: '#e8ff47', lineHeight: 1 }}>84</div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>flip score / 100</div>
                  </div>
                  <div style={{ background: '#1a2e1a', color: '#4ade80', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '700' }}>
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
                  <button type="button" style={{
                    flex: 1, padding: '9px', borderRadius: '7px',
                    background: '#e8ff47', color: '#0a0a0a',
                    border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace',
                  }}>Save to pipeline</button>
                  <button type="button" style={{
                    flex: 1, padding: '9px', borderRadius: '7px',
                    background: 'transparent', color: '#f0ede6',
                    border: '1px solid #2a2a2a', fontSize: '12px', cursor: 'pointer',
                  }}>Full analysis</button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Install steps */}
          <FadeIn>
            <div>
              <div style={{
                fontFamily: 'monospace', fontSize: '11px',
                letterSpacing: '0.08em', color: '#4ade80', marginBottom: '1.5rem',
              }}>
                HOW IT WORKS
              </div>
              {[
                {
                  n: '01',
                  title: 'Add to Chrome',
                  body: 'One click to install. No account required. The 🏍️ button pins to your toolbar and is ready instantly.',
                },
                {
                  n: '02',
                  title: 'Browse Marketplace or Craigslist',
                  body: 'Open any motorcycle listing on Facebook Marketplace, Craigslist, or Cycle Trader. The MotoFlip button appears automatically.',
                },
                {
                  n: '03',
                  title: 'Get your flip score instantly',
                  body: 'Click the button. In about 2 seconds you\'ll see the flip score, suggested offer price, estimated profit, and any red flags — right on the page.',
                },
                {
                  n: '04',
                  title: 'Save hot deals with one click',
                  body: 'Spotted a deal? Save it straight to your pipeline without leaving the listing. Track everything in your dashboard.',
                },
              ].map(({ n, title, body }) => (
                <div key={n} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '28px', height: '28px', borderRadius: '999px',
                    border: '1px solid #1a3a1a', fontSize: '11px',
                    fontFamily: 'monospace', color: '#4ade80',
                    flexShrink: 0, marginTop: '2px', letterSpacing: '0.04em',
                  }}>{n}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>{title}</div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.65', fontFamily: 'sans-serif' }}>{body}</div>
                  </div>
                </div>
              ))}

              <a href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#4ade80', color: '#0a0a0a',
                padding: '12px 24px', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700',
                textDecoration: 'none', fontFamily: 'monospace',
                marginTop: '0.5rem',
              }}>
                🧩 Get notified at launch
              </a>
              <div style={{ fontSize: '12px', color: '#333', fontFamily: 'monospace', marginTop: '10px' }}>
                Works on Facebook Marketplace · Craigslist · Cycle Trader
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Feature highlights row */}
        <FadeIn>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '3rem',
          }}>
            {[
              { icon: '⚡', title: '2 seconds, not an hour', body: 'AI runs the moment you click. What used to take manual research now happens instantly.' },
              { icon: '🔍', title: 'Stays on the listing', body: 'No new tabs. The panel overlays the page so you never lose your place.' },
              { icon: '💾', title: 'Save with one click', body: 'Hot deal? Save it straight to your pipeline without leaving the listing.' },
              { icon: '🔒', title: 'Free to install', body: 'The extension will be free. Pro subscription unlocks unlimited analyses.' },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{
                background: '#0d1a0d',
                border: '1px solid #1a3a1a',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }} aria-hidden="true">{icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65, fontFamily: 'sans-serif' }}>{body}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FOUNDER SECTION — moved up so visitors see it before scrolling away */}
      <section className="mf-section" style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <FadeIn>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Thin brand-yellow accent line on the left */}
            <div style={{
              width: '4px',
              background: '#e8ff47',
              borderRadius: '2px',
              flexShrink: 0,
              alignSelf: 'stretch',
              minHeight: '100%',
            }} />
            <div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: '#e8ff47',
                marginBottom: '0.75rem',
              }}>
                MEET THE BUILDER
              </div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}>
                Built by a flipper, for flippers.
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#888',
                lineHeight: 1.75,
                fontFamily: 'sans-serif',
                marginBottom: '1.25rem',
              }}>
                I&apos;ve been buying and selling motorcycles for years.
                Every deal started the same way — an hour of scrolling, manually checking comps,
                guessing at margins, and hoping I wasn&apos;t leaving money on the table.
                I built MotoFlip to cut that down to seconds.
              </p>
              <p style={{
                fontSize: '15px',
                color: '#888',
                lineHeight: 1.75,
                fontFamily: 'sans-serif',
                marginBottom: '1.5rem',
              }}>
                This is the tool I wish I had when I started flipping. Every feature comes
                from a real frustration I had as a buyer — the flip score, the negotiation
                tips, the pipeline tracker. It&apos;s all here because I needed it.
              </p>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#555',
                letterSpacing: '0.04em',
              }}>
                — Hudson, Founder
              </div>
            </div>
          </div>
        </FadeIn>
      </section>


      {/* HOW IT WORKS */}
      <section id="how" className="mf-section" style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
          How MotoFlip works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { n: '01', title: 'Browse like normal', body: 'Go to Facebook Marketplace or Craigslist and search for motorcycles like you always do.' },
            { n: '02', title: 'Click the MotoFlip button', body: 'Our Chrome extension puts a button on every listing. One click and the analysis runs instantly.' },
            { n: '03', title: 'Get your flip score', body: 'In about 2 seconds you\'ll see the flip score, suggested offer, estimated profit, and red flags. No comp hunting. No guessing.' },
            { n: '04', title: 'Save the best ones', body: 'Add hot listings to your pipeline. Track everything in one dashboard. Never lose a deal.' },
          ].map(({ n, title, body }) => (
            <FadeIn key={n}>
              <div className="mf-card" style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '12px',
                padding: '1.5rem',
                height: '100%',
              }}>
                {/* Numbered badge — circular outlined chip */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '999px',
                  border: '1px solid #2a2a2a',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#e8ff47',
                  marginBottom: '12px',
                  letterSpacing: '0.04em',
                }}>{n}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.65', fontFamily: 'sans-serif' }}>{body}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ — standalone section, above pricing so visitors see it without scrolling past price */}
      <section id="faq" className="mf-section" style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <FadeIn>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: '#e8ff47',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            COMMON QUESTIONS
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            Quick answers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your account at any time and keep access through the end of your billing period.',
              },
              {
                q: 'What if I hit the 5/month limit on free?',
                a: 'The free counter resets at the start of each calendar month. If you need more, Pro is $9/mo and unlimited.',
              },
              {
                q: 'Do I need the Chrome extension?',
                a: 'No — you can analyze any listing manually from the dashboard by pasting in the details. The Chrome extension makes it one-click while you browse.',
              },
              {
                q: 'What markets does MotoFlip cover?',
                a: 'MotoFlip is trained on US used-motorcycle market data. It works best for Facebook Marketplace, Craigslist, and Cycle Trader listings in the US.',
              },
              {
                q: 'Do you offer refunds?',
                a: "Yes — if you're unhappy with your first month, email us at support@motofliip.com and we'll refund it.",
              },
              {
                q: 'Is my data safe?',
                a: "Your account lives in Supabase; payments are processed by Stripe (we never see card numbers); listing data goes to Anthropic for analysis only. We don't sell your data.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="mf-card" style={{ background: '#111', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#f0ede6', fontFamily: 'sans-serif' }}>{q}</div>
                <div style={{ fontSize: '13px', color: '#777', lineHeight: '1.7', fontFamily: 'sans-serif' }}>{a}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mf-section" style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid #1a1a1a',
        backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(232,255,71,0.02) 100%)',
      }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2rem)', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
          Simple pricing
        </h2>
        <FadeIn>
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
              }}>FOUNDING MEMBER</div>
              <div style={{ fontSize: '13px', color: '#e8ff47', fontFamily: 'monospace', marginBottom: '6px' }}>PRO</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4px' }}>$9</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '1.5rem' }}>per month · locked in for life</div>
              {['Unlimited analyses', 'Unlimited pipeline', 'Chrome extension (coming soon)', 'Market comps view', 'Profit tracking + sold log'].map(f => (
                <div key={f} style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px', fontFamily: 'sans-serif' }}>✓ {f}</div>
              ))}
              <a href="/signup?plan=pro" className="mf-btn-primary" style={{
                display: 'block', textAlign: 'center', marginTop: '1.5rem',
                background: '#e8ff47', color: '#0a0a0a', padding: '10px',
                borderRadius: '7px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace',
              }}>Become a founding member</a>
            </div>
          </div>
        </FadeIn>
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
        {/* Brand tagline */}
        <p style={{
          color: '#444',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          maxWidth: '480px',
          margin: '0 auto 1.25rem',
          lineHeight: 1.55,
        }}>
          MotoFlip — AI flip scores for any motorcycle listing.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <a href="#extension" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Chrome Extension</a>
          <a href="/faq" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>FAQ</a>
          <a href="/privacy" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/blog" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Blog</a>
          <a href="mailto:support@motofliip.com" className="mf-link" style={{ color: '#555', textDecoration: 'none' }}>Support</a>
        </div>
        <div>© 2026 MotoFlip · Built for flippers, by flippers</div>
        <div style={{ marginTop: '6px', color: '#2a2a2a' }}>
          Made with <span style={{ color: '#7a1f1f' }}>♥</span> in Alabama
        </div>
      </footer>

      {/* JSON-LD structured data — SoftwareApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "MotoFlip",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "MotoFlip analyzes motorcycle listings in seconds. Get an AI flip score, profit estimate, suggested offer price, and red flags — right on Facebook Marketplace and Craigslist.",
          "url": "https://motofliip.vercel.app",
          "offers": [
            {
              "@type": "Offer",
              "name": "Free",
              "price": "0",
              "priceCurrency": "USD",
              "description": "5 analyses per month, pipeline up to 10 listings"
            },
            {
              "@type": "Offer",
              "name": "Pro",
              "price": "9",
              "priceCurrency": "USD",
              "billingIncrement": "P1M",
              "description": "Unlimited analyses, Chrome extension, unlimited pipeline, market comps"
            }
          ]
        }) }}
      />

      {/* JSON-LD — FAQPage schema for Google FAQ rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can I cancel my MotoFlip subscription anytime?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Cancel from your account at any time and keep access through the end of your billing period."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need the Chrome extension to use MotoFlip?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No — you can analyze any listing manually from the dashboard by pasting in the details. The Chrome extension makes it one-click while you browse Facebook Marketplace or Craigslist."
              }
            },
            {
              "@type": "Question",
              "name": "What motorcycle markets does MotoFlip cover?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "MotoFlip is trained on US used-motorcycle market data. It works best for Facebook Marketplace, Craigslist, and Cycle Trader listings in the United States."
              }
            },
            {
              "@type": "Question",
              "name": "Does MotoFlip offer refunds?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes — if you're unhappy with your first month, email us at support@motofliip.com and we'll refund it."
              }
            },
            {
              "@type": "Question",
              "name": "Is my data safe with MotoFlip?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your account lives in Supabase; payments are processed by Stripe (we never see card numbers); listing data goes to Anthropic for analysis only. We don't sell your data."
              }
            },
            {
              "@type": "Question",
              "name": "How much does MotoFlip cost?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "MotoFlip has a free tier with 5 analyses per month. Pro is $9/month with unlimited analyses, unlimited pipeline, and the Chrome extension. Founding members lock in $9/mo forever."
              }
            }
          ]
        }) }}
      />

    </main>
  );
}
