'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const MAKES = ['Honda','Yamaha','Kawasaki','Suzuki','Harley-Davidson','BMW','KTM','Ducati','Triumph','Royal Enfield','Indian','Other'];
const CONDITIONS = ['Excellent','Good','Fair','Poor / project','Non-running'];

const EXAMPLE_LISTING = {
  year: '2019',
  make: 'Kawasaki',
  model: 'Ninja 400',
  price: '3200',
  mileage: '9400',
  condition: 'Good',
  description: 'Single owner, garage kept. Recent oil change and new chain. Small scratch on the tank from a tip-over in the driveway.',
};

function ScoreBadge({ score }) {
  const tier =
    score >= 80 ? { label: '🔥 Hot flip', bg: '#1a2e1a', color: '#4ade80' } :
    score >= 60 ? { label: '👍 Good pick', bg: '#1a1f2e', color: '#60a5fa' } :
    score >= 40 ? { label: '⚠️ Marginal', bg: '#2e2a1a', color: '#fbbf24' } :
                  { label: '❌ Pass', bg: '#2e1a1a', color: '#f87171' };
  return (
    <span style={{
      background: tier.bg, color: tier.color,
      padding: '4px 12px', borderRadius: '999px',
      fontSize: '13px', fontWeight: '700',
    }}>{tier.label}</span>
  );
}

function StatBox({ label, value, green }) {
  return (
    <div style={{ background: '#161616', borderRadius: '8px', padding: '12px 14px' }}>
      <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: green ? '#4ade80' : '#f0ede6' }}>{value}</div>
    </div>
  );
}

function AuthLoading() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏍️</div>
        <div style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
          Loading your dashboard…
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [form, setForm] = useState({ year: '', make: '', model: '', price: '', mileage: '', condition: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pipeline, setPipeline] = useState([]);
  const [tab, setTab] = useState('analyze');
  const [addedIds, setAddedIds] = useState(new Set());
  const [upgrading, setUpgrading] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [showUpgradeCelebration, setShowUpgradeCelebration] = useState(false);

  // Post-checkout celebration — runs once on mount if ?upgraded=true is set.
  // Clean the URL so a refresh doesn't re-trigger; auto-dismiss after 7s.
  // Also re-fetch the user a couple of times to pick up the webhook-driven
  // app_metadata.is_pro update (Stripe's webhook and the redirect to this
  // page race; the webhook usually lands within a second or two).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') !== 'true') return;
    setShowUpgradeCelebration(true);
    params.delete('upgraded');
    const rest = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (rest ? '?' + rest : ''));

    const dismiss = setTimeout(() => setShowUpgradeCelebration(false), 7000);

    let cancelled = false;
    const refreshUser = async () => {
      const supabase = createClient();
      const { data: { user: fresh } } = await supabase.auth.getUser();
      if (!cancelled && fresh) setUser(fresh);
    };
    const r1 = setTimeout(refreshUser, 2500);
    const r2 = setTimeout(refreshUser, 7000);

    return () => {
      cancelled = true;
      clearTimeout(dismiss);
      clearTimeout(r1);
      clearTimeout(r2);
    };
  }, []);

  // Auth guard — redirect anonymous users to /login
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!currentUser) {
        router.replace('/login');
        return;
      }
      setUser(currentUser);
      setAuthLoading(false);
    })();
    return () => { cancelled = true; };
  }, [router]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function tryExampleListing() {
    setForm(EXAMPLE_LISTING);
    setOnboardingDismissed(true);
    setError('');
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email || '', userId: user?.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
    setUpgrading(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  async function analyze() {
    if (!form.make || !form.model || !form.price) {
      setError('Please fill in at least make, model, and asking price.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    setOnboardingDismissed(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult({
        ...data,
        id: Date.now(),
        bikeLabel: [form.year, form.make, form.model].filter(Boolean).join(' '),
        askPrice: parseInt(form.price),
        mileage: form.mileage,
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function addToPipeline() {
    if (!result || addedIds.has(result.id)) return;
    setPipeline(p => [result, ...p]);
    setAddedIds(s => new Set([...s, result.id]));
  }

  function removeFromPipeline(id) {
    setPipeline(p => p.filter(x => x.id !== id));
  }

  if (authLoading) return <AuthLoading />;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'rider';
  const isPro = !!user?.app_metadata?.is_pro;
  const showOnboarding = !onboardingDismissed && !result && pipeline.length === 0 && tab === 'analyze';

  const avgProfit = pipeline.length ? Math.round(pipeline.reduce((s, p) => s + p.estimated_profit, 0) / pipeline.length) : 0;
  const hotCount = pipeline.filter(p => p.score >= 80).length;

  const inputStyle = {
    width: '100%', padding: '9px 11px', fontSize: '14px',
    border: '1px solid #222', borderRadius: '8px',
    background: '#111', color: '#f0ede6',
    fontFamily: 'sans-serif', outline: 'none',
  };
  const labelStyle = { fontSize: '12px', color: '#555', marginBottom: '4px', display: 'block', fontFamily: 'monospace', letterSpacing: '0.04em' };
  const tabStyle = (active) => ({
    padding: '8px 18px', fontSize: '14px', cursor: 'pointer',
    border: 'none', background: 'none', fontFamily: 'sans-serif',
    color: active ? '#f0ede6' : '#444',
    borderBottom: active ? '2px solid #e8ff47' : '2px solid transparent',
    marginBottom: '-1px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: 'sans-serif' }}>

      {/* TOP BAR */}
      <div className="mf-topbar" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', borderBottom: '1px solid #1a1a1a',
        position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100,
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>🏍️ MotoFlip</div>
          <div style={{ fontSize: '13px', color: '#666', fontFamily: 'sans-serif' }}>
            Hey {firstName} 👋
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isPro ? (
            <div className="mf-plan-badge" style={{
              fontSize: '12px', fontWeight: 700, fontFamily: 'monospace',
              letterSpacing: '0.08em',
              padding: '5px 11px', borderRadius: '999px',
              background: '#1a2e1a', color: '#4ade80',
              border: '1px solid #2a4a2a',
            }}>
              PRO · UNLIMITED
            </div>
          ) : (
            <>
              <div className="mf-plan-badge" style={{ fontSize: '13px', color: '#555', padding: '6px 12px', fontFamily: 'monospace' }}>
                Free plan · 5 analyses/mo
              </div>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="mf-btn-primary"
                style={{ background: '#e8ff47', color: '#0a0a0a', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', cursor: 'pointer', border: 'none' }}
              >
                {upgrading ? 'Loading…' : 'Upgrade to Pro'}
              </button>
            </>
          )}
          <button
            onClick={handleSignOut}
            className="mf-btn-ghost"
            style={{ background: 'transparent', color: '#888', border: '1px solid #222', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* POST-CHECKOUT CELEBRATION */}
        {showUpgradeCelebration && (
          <div
            className="mf-celebration"
            role="status"
            aria-live="polite"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1a2e1a 0%, #1a2913 60%, #2a3a1a 100%)',
              border: '1px solid #2f4a2f',
              borderRadius: '14px',
              padding: '1.25rem 3rem 1.25rem 1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 0 60px rgba(232,255,71,0.12)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setShowUpgradeCelebration(false)}
              aria-label="Dismiss"
              style={{
                position: 'absolute', top: '12px', right: '14px',
                background: 'transparent', border: 'none', color: '#888',
                fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              }}
            >×</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '2.25rem', lineHeight: 1 }} aria-hidden="true">🎉</div>
              <div>
                <div style={{
                  fontSize: '11px', fontFamily: 'monospace', color: '#e8ff47',
                  letterSpacing: '0.08em', marginBottom: '4px',
                }}>
                  YOU&apos;RE IN
                </div>
                <div style={{
                  fontSize: '17px', fontWeight: 700, fontFamily: 'Georgia, serif',
                  color: '#f0ede6', marginBottom: '4px',
                }}>
                  Welcome to Pro, {firstName}! 🏍️💨
                </div>
                <div style={{ fontSize: '13px', color: '#9bb89b', lineHeight: 1.55 }}>
                  Unlimited analyses unlocked, plus pipeline tracking and market comps.
                  Time to find your next flip.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', marginBottom: '2rem' }}>
          <button style={tabStyle(tab === 'analyze')} onClick={() => setTab('analyze')}>Analyze listing</button>
          <button style={tabStyle(tab === 'pipeline')} onClick={() => setTab('pipeline')}>
            Pipeline {pipeline.length > 0 && <span style={{ marginLeft: '4px', background: '#e8ff47', color: '#0a0a0a', borderRadius: '999px', fontSize: '11px', fontWeight: '800', padding: '1px 7px' }}>{pipeline.length}</span>}
          </button>
        </div>

        {/* ANALYZE TAB */}
        {tab === 'analyze' && (
          <div>
            {/* ONBOARDING EMPTY STATE — shown to first-time users */}
            {showOnboarding && (
              <div className="mf-card" style={{
                background: 'linear-gradient(180deg, #131613 0%, #111 100%)',
                border: '1px solid #1e1e1e',
                borderRadius: '14px',
                padding: '1.5rem 1.5rem 1.75rem',
                marginBottom: '1.75rem',
                position: 'relative',
              }}>
                <button
                  onClick={() => setOnboardingDismissed(true)}
                  aria-label="Dismiss"
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'transparent', border: 'none', color: '#444',
                    fontSize: '18px', cursor: 'pointer', lineHeight: 1,
                  }}
                >×</button>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#e8ff47', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  GET STARTED
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
                  Ready to find your next flip?
                </h2>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65, marginBottom: '1.25rem', maxWidth: '520px' }}>
                  Paste a Marketplace or Craigslist listing&apos;s details into the form
                  below and get a flip score, suggested offer, and red flags in
                  about two seconds. Or try it instantly with an example listing.
                </p>
                <button
                  onClick={tryExampleListing}
                  className="mf-btn-primary"
                  style={{
                    background: '#e8ff47', color: '#0a0a0a',
                    border: 'none', padding: '10px 18px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 700, fontFamily: 'monospace',
                    letterSpacing: '0.02em', cursor: 'pointer',
                  }}
                >
                  Try with an example listing →
                </button>
              </div>
            )}

            <div className="mf-grid-2" style={{ marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>YEAR</label>
                <input style={inputStyle} type="number" placeholder="e.g. 2019" value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>MAKE</label>
                <select style={inputStyle} value={form.make} onChange={e => set('make', e.target.value)}>
                  <option value="">Select make…</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>MODEL</label>
              <input style={inputStyle} placeholder="e.g. Ninja 400, MT-07, CB500F, Iron 883…" value={form.model} onChange={e => set('model', e.target.value)} />
            </div>

            <div className="mf-grid-3" style={{ marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>ASKING PRICE ($)</label>
                <input style={inputStyle} type="number" placeholder="3500" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>MILEAGE</label>
                <input style={inputStyle} type="number" placeholder="12000" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>CONDITION</label>
                <select style={inputStyle} value={form.condition} onChange={e => set('condition', e.target.value)}>
                  <option value="">Select…</option>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>DESCRIPTION / NOTES</label>
              <textarea
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical', lineHeight: '1.6' }}
                placeholder="Paste the listing description, or add your own notes…"
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={analyze}
                disabled={loading}
                className="mf-btn-primary"
                style={{
                  background: loading ? '#2a2a2a' : '#e8ff47',
                  color: loading ? '#555' : '#0a0a0a',
                  border: 'none', padding: '12px 24px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                {loading ? 'Analyzing…' : 'Analyze flip potential →'}
              </button>
              <button
                onClick={() => { setForm({ year: '', make: '', model: '', price: '', mileage: '', condition: '', description: '' }); setResult(null); setError(''); }}
                className="mf-btn-ghost"
                style={{ background: 'transparent', color: '#888', border: '1px solid #222', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <div className="mf-card" style={{ marginTop: '2rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>{result.bikeLabel}</div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '3px' }}>
                      Listed at ${result.askPrice.toLocaleString()}{result.mileage ? ` · ${parseInt(result.mileage).toLocaleString()} mi` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <ScoreBadge score={result.score} />
                    <div style={{ fontSize: '12px', color: '#444', marginTop: '5px', fontFamily: 'monospace' }}>{result.score}/100</div>
                  </div>
                </div>

                <div className="mf-grid-4 mf-stats-4" style={{ marginBottom: '1rem', gap: '8px' }}>
                  <StatBox label="SUGGEST OFFER" value={`$${result.suggested_offer.toLocaleString()}`} />
                  <StatBox label="SELL FOR ~" value={`$${result.estimated_sell_price.toLocaleString()}`} />
                  <StatBox label="EST. PROFIT" value={`$${result.estimated_profit.toLocaleString()}`} green />
                  <StatBox label="TIME TO SELL" value={result.days_to_sell_estimate} />
                </div>

                <div style={{ background: '#161616', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', lineHeight: '1.7', color: '#aaa', marginBottom: '1rem' }}>
                  {result.summary}
                </div>

                <div className="mf-grid-2" style={{ marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4ade80', marginBottom: '8px', letterSpacing: '0.04em' }}>GREEN FLAGS</div>
                    {result.green_flags.map((f, i) => <div key={i} style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px' }}>✓ {f}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f87171', marginBottom: '8px', letterSpacing: '0.04em' }}>RED FLAGS</div>
                    {result.red_flags.map((f, i) => <div key={i} style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px' }}>✗ {f}</div>)}
                  </div>
                </div>

                <div style={{ background: '#0f1a2e', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#93c5fd', lineHeight: '1.65', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '700' }}>Negotiation tip: </span>{result.negotiation_tip}
                </div>

                <button
                  onClick={addToPipeline}
                  disabled={addedIds.has(result.id)}
                  className={addedIds.has(result.id) ? '' : 'mf-btn-primary'}
                  style={{
                    background: addedIds.has(result.id) ? '#1a2e1a' : '#e8ff47',
                    color: addedIds.has(result.id) ? '#4ade80' : '#0a0a0a',
                    border: 'none', padding: '10px 20px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '700', cursor: addedIds.has(result.id) ? 'default' : 'pointer',
                    fontFamily: 'monospace',
                  }}
                >
                  {addedIds.has(result.id) ? '✓ Added to pipeline' : 'Save to pipeline →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* PIPELINE TAB */}
        {tab === 'pipeline' && (
          <div>
            <div className="mf-grid-3" style={{ marginBottom: '1.5rem' }}>
              <StatBox label="LISTINGS TRACKED" value={pipeline.length} />
              <StatBox label="AVG EST. PROFIT" value={`$${avgProfit.toLocaleString()}`} green />
              <StatBox label="HOT PICKS" value={hotCount} />
            </div>

            {pipeline.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#444', fontSize: '14px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏍️</div>
                <div style={{ marginBottom: '4px', color: '#888' }}>No listings tracked yet.</div>
                <div style={{ fontSize: '13px', color: '#555' }}>Analyze a listing and tap &ldquo;Save to pipeline&rdquo; to start tracking it here.</div>
              </div>
            ) : (
              pipeline.map(r => (
                <div key={r.id} className="mf-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'Georgia, serif' }}>{r.bikeLabel}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>Ask: ${r.askPrice.toLocaleString()} · Offer: ${r.suggested_offer.toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ScoreBadge score={r.score} />
                      <button onClick={() => removeFromPipeline(r.id)} aria-label="Remove" style={{ background: 'none', border: 'none', color: '#333', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                  <div className="mf-grid-4 mf-stats-4" style={{ gap: '8px' }}>
                    <StatBox label="EST. PROFIT" value={`$${r.estimated_profit.toLocaleString()}`} green />
                    <StatBox label="SELL FOR" value={`$${r.estimated_sell_price.toLocaleString()}`} />
                    <StatBox label="TIME TO SELL" value={r.days_to_sell_estimate} />
                    <StatBox label="SCORE" value={`${r.score}/100`} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
