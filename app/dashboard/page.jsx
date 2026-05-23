'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const MAKES = ['Honda','Yamaha','Kawasaki','Suzuki','Harley-Davidson','BMW','KTM','Ducati','Triumph','Royal Enfield','Indian','Other'];
const CONDITIONS = ['Excellent','Good','Fair','Poor / project','Non-running'];
const TITLE_STATUSES = ['Clean title','Salvage title','Rebuilt/reconstructed title','No title (bill of sale only)','Title in hand — not yet transferred'];
const REGIONS = [
  'Los Angeles / San Diego',
  'San Francisco / Sacramento',
  'Seattle / Portland',
  'Phoenix / Las Vegas',
  'Dallas / Houston / Austin',
  'Atlanta / Nashville',
  'Miami / Tampa / Orlando',
  'Chicago / Detroit',
  'Minneapolis / Kansas City',
  'Denver / Salt Lake City',
  'New York / DC / Philadelphia',
  'Boston / Providence',
];

const EXAMPLE_LISTING = {
  year: '2019',
  make: 'Kawasaki',
  model: 'Ninja 400',
  price: '3200',
  mileage: '9400',
  condition: 'Good',
  titleStatus: 'Clean title',
  region: 'Atlanta / Nashville',
  description: 'Single owner, garage kept. Recent oil change and new chain. Small scratch on the tank from a tip-over in the driveway.',
};

function ScoreBadge({ score }) {
  const tier =
    score >= 80 ? { label: '🔥 Hot flip', bg: '#1a2e1a', color: '#4ade80' } :
    score >= 70 ? { label: '👍 Good flip', bg: '#1a1f2e', color: '#60a5fa' } :
    score >= 60 ? { label: '⚠️ Marginal', bg: '#2e2a1a', color: '#fbbf24' } :
    score >= 40 ? { label: '🎲 Risky', bg: '#2e2010', color: '#fb923c' } :
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

  const [form, setForm] = useState({ year: '', make: '', model: '', price: '', mileage: '', condition: '', titleStatus: '', region: '', description: '', listingUrl: '' });
  const [photos, setPhotos] = useState([]); // [{ preview, base64, mediaType }]
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pipeline, setPipeline] = useState([]);
  const [tab, setTab] = useState('analyze');
  const [addedIds, setAddedIds] = useState(new Set());
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [showUpgradeCelebration, setShowUpgradeCelebration] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');
  const yearInputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Set page title
  useEffect(() => {
    document.title = 'Dashboard · MotoFlip';
  }, []);

  // Animated dots while analyzing (cycles 0→1→2→3 every 400ms)
  useEffect(() => {
    if (!loading) { setDotCount(0); return; }
    const id = setInterval(() => setDotCount(n => (n + 1) % 4), 400);
    return () => clearInterval(id);
  }, [loading]);

  // Auto-focus the Year input once auth check completes, only on analyze tab
  useEffect(() => {
    if (!authLoading && tab === 'analyze' && yearInputRef.current) {
      yearInputRef.current.focus();
    }
  }, [authLoading, tab]);

  // Esc key clears the form and result while on analyze tab
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && tab === 'analyze') clearForm();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Close profile dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleBillingPortal() {
    setPortalLoading(true);
    setPortalError('');
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setPortalError(data.error || 'Could not open billing portal.');
    } catch (e) {
      setPortalError('Something went wrong. Try again.');
    }
    setPortalLoading(false);
  }

  // Functional-style field setter — avoids spreading the whole form object at each call site
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Resize an image file to max 1024px before encoding — keeps base64 payload manageable
  function resizeImage(file) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1024;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({ preview: dataUrl, base64: dataUrl.split(',')[1], mediaType: 'image/jpeg' });
      };
      img.src = url;
    });
  }

  async function handlePhotoAdd(e) {
    const files = Array.from(e.target.files);
    const slots = 4 - photos.length;
    const toProcess = files.slice(0, slots);
    const resized = await Promise.all(toProcess.map(resizeImage));
    setPhotos(prev => [...prev, ...resized]);
    e.target.value = '';
  }

  function removePhoto(idx) {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  }

  function clearForm() {
    setForm({ year: '', make: '', model: '', price: '', mileage: '', condition: '', titleStatus: '', region: '', description: '', listingUrl: '' });
    setPhotos([]);
    setResult(null);
    setError('');
  }

  function tryExampleListing() {
    setForm(EXAMPLE_LISTING);
    setOnboardingDismissed(true);
    setError('');
  }

  async function handleUpgrade() {
    setUpgrading(true);
    setUpgradeError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email || '', userId: user?.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return; // keep upgrading=true while navigating away
      }
      // API returned an error object
      setUpgradeError(data.error || 'Something went wrong. Please try again.');
    } catch (e) {
      console.error('[upgrade]', e);
      setUpgradeError('Could not reach checkout. Check your connection and try again.');
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
        body: JSON.stringify({
          ...form,
          region: form.region || null,
          titleStatus: form.titleStatus || null,
          images: photos.map(p => ({ base64: p.base64, mediaType: p.mediaType })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult({
        ...data,
        id: Date.now(),
        bikeLabel: [form.year, form.make, form.model].filter(Boolean).join(' '),
        askPrice: parseInt(form.price),
        mileage: form.mileage,
        listingUrl: form.listingUrl || '',
        region: form.region || null,
        titleStatus: form.titleStatus || null,
        photos: photos.map(p => p.preview),
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // addedIds tracks which result IDs have been saved so the button turns into a
  // confirmation state ("✓ Added") instead of allowing double-adds.
  function addToPipeline() {
    if (!result || addedIds.has(result.id)) return;
    setPipeline(p => [result, ...p]);
    setAddedIds(s => new Set([...s, result.id]));
  }

  function removeFromPipeline(id) {
    setPipeline(p => p.filter(x => x.id !== id));
  }

  if (authLoading) return <AuthLoading />;

  // Derived display values — computed each render from the latest user object
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'rider';
  // isPro is set server-side by the Stripe webhook via Supabase app_metadata.is_pro
  const isPro = !!user?.app_metadata?.is_pro;
  // Show the onboarding card only on first visit (no dismissal, no result, empty pipeline, analyze tab)
  const showOnboarding = !onboardingDismissed && !result && pipeline.length === 0 && tab === 'analyze';

  const avgProfit = pipeline.length ? Math.round(pipeline.reduce((s, p) => s + (p.net_profit_estimate ?? p.estimated_profit), 0) / pipeline.length) : 0;
  const hotCount = pipeline.filter(p => p.score >= 80).length;

  const menuItemStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '9px 16px', fontSize: '13px', color: '#aaa',
    textDecoration: 'none', fontFamily: 'sans-serif',
    cursor: 'pointer', background: 'transparent', border: 'none',
    width: '100%', textAlign: 'left',
  };
  const menuBtnStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '9px 16px', fontSize: '13px',
    fontFamily: 'sans-serif', cursor: 'pointer',
    background: 'transparent', border: 'none',
    width: '100%', textAlign: 'left',
  };

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
          <div style={{ fontSize: '15px', fontWeight: '700', fontFamily: 'Georgia, serif' }}><span aria-hidden="true">🏍️</span> MotoFlip</div>
          <div className="mf-greeting" style={{ fontSize: '13px', color: '#666', fontFamily: 'sans-serif' }}>
            Hey {firstName} 👋
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Upgrade button — only shown for free users, outside the dropdown for visibility */}
          {!isPro && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="mf-btn-primary"
                style={{ background: '#e8ff47', color: '#0a0a0a', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', cursor: upgrading ? 'not-allowed' : 'pointer', border: 'none' }}
              >
                {upgrading ? 'Loading…' : 'Upgrade to Pro'}
              </button>
              {upgradeError && (
                <div style={{ fontSize: '12px', color: '#f87171', maxWidth: '180px', lineHeight: 1.4 }}>
                  {upgradeError}
                </div>
              )}
            </div>
          )}

          {/* Profile avatar + dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="Account menu"
              style={{
                width: '34px', height: '34px', borderRadius: '999px',
                background: isPro ? '#1a2e1a' : '#1a1a1a',
                border: isPro ? '1px solid #2a4a2a' : '1px solid #2a2a2a',
                color: isPro ? '#4ade80' : '#e8ff47',
                fontSize: '13px', fontWeight: '700', fontFamily: 'monospace',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                letterSpacing: 0,
              }}
            >
              {firstName[0]?.toUpperCase() || '?'}
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#111', border: '1px solid #222', borderRadius: '12px',
                minWidth: '240px', zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}>
                {/* User info header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#f0ede6', marginBottom: '3px' }}>
                    {user?.user_metadata?.full_name || firstName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {user?.email}
                  </div>
                  <div style={{
                    display: 'inline-block', marginTop: '8px',
                    fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
                    letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '999px',
                    background: isPro ? '#1a2e1a' : '#1a1a1a',
                    color: isPro ? '#4ade80' : '#888',
                    border: isPro ? '1px solid #2a4a2a' : '1px solid #222',
                  }}>
                    {isPro ? '✓ Pro · Unlimited' : 'Free · 5 analyses/mo'}
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px 0' }}>
                  <a href="/faq" style={menuItemStyle}>
                    <span>FAQ</span>
                    <span style={{ color: '#333' }}>→</span>
                  </a>
                  <a href="/privacy" style={menuItemStyle}>
                    <span>Privacy Policy</span>
                    <span style={{ color: '#333' }}>→</span>
                  </a>
                  <a href="/terms" style={menuItemStyle}>
                    <span>Terms of Service</span>
                    <span style={{ color: '#333' }}>→</span>
                  </a>
                </div>

                {/* Billing section — Pro users only */}
                {isPro && (
                  <div style={{ borderTop: '1px solid #1a1a1a', padding: '6px 0' }}>
                    <button
                      type="button"
                      onClick={handleBillingPortal}
                      disabled={portalLoading}
                      style={{ ...menuBtnStyle, color: portalLoading ? '#555' : '#f0ede6' }}
                    >
                      <span>{portalLoading ? 'Opening…' : 'Manage billing'}</span>
                      <span style={{ color: '#333' }}>→</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBillingPortal}
                      disabled={portalLoading}
                      style={{ ...menuBtnStyle, color: '#f87171' }}
                    >
                      <span>Cancel membership</span>
                    </button>
                    {portalError && (
                      <div style={{ fontSize: '12px', color: '#f87171', padding: '4px 16px 8px', lineHeight: 1.5 }}>
                        {portalError}
                      </div>
                    )}
                  </div>
                )}

                {/* Upgrade nudge — free users */}
                {!isPro && (
                  <div style={{ borderTop: '1px solid #1a1a1a', padding: '6px 0' }}>
                    <button
                      type="button"
                      onClick={() => { setDropdownOpen(false); handleUpgrade(); }}
                      style={{ ...menuBtnStyle, color: '#e8ff47' }}
                    >
                      <span>Upgrade to Pro — $9/mo</span>
                      <span>→</span>
                    </button>
                  </div>
                )}

                {/* Sign out */}
                <div style={{ borderTop: '1px solid #1a1a1a', padding: '6px 0' }}>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{ ...menuBtnStyle, color: '#666' }}
                  >
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
              type="button"
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
          <button type="button" style={tabStyle(tab === 'analyze')} onClick={() => setTab('analyze')}>Analyze listing</button>
          <button type="button" style={tabStyle(tab === 'pipeline')} onClick={() => setTab('pipeline')}>
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
                  type="button"
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
                  type="button"
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

            {/* LISTING URL */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>LISTING URL <span style={{ color: '#333' }}>— optional</span></label>
              <input
                style={inputStyle}
                type="url"
                placeholder="https://facebook.com/marketplace/item/..."
                value={form.listingUrl}
                onChange={e => set('listingUrl', e.target.value)}
              />
            </div>

            <div className="mf-grid-2" style={{ marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>YEAR</label>
                <input ref={yearInputRef} style={inputStyle} type="number" placeholder="e.g. 2019" value={form.year} onChange={e => set('year', e.target.value)} />
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

            <div className="mf-grid-2" style={{ marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>TITLE STATUS <span style={{ color: '#f87171', fontWeight: 700 }}>— critical</span></label>
                <select style={inputStyle} value={form.titleStatus} onChange={e => set('titleStatus', e.target.value)}>
                  <option value="">Select…</option>
                  {TITLE_STATUSES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>YOUR REGION <span style={{ color: '#555' }}>— affects pricing</span></label>
                <select style={inputStyle} value={form.region} onChange={e => set('region', e.target.value)}>
                  <option value="">Select region…</option>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>DESCRIPTION / NOTES</label>
              <textarea
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical', lineHeight: '1.6' }}
                placeholder="Paste the listing description, or add your own notes…"
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            {/* PHOTO UPLOAD */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                PHOTOS <span style={{ color: '#333' }}>— optional · up to 4 · AI scans for damage &amp; condition</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                    <img
                      src={p.preview}
                      alt={`Photo ${i + 1}`}
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #222' }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '18px', height: '18px', borderRadius: '999px',
                        background: '#f87171', color: '#fff', border: 'none',
                        fontSize: '11px', cursor: 'pointer', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >×</button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label style={{
                    width: '72px', height: '72px', borderRadius: '8px',
                    border: '1px dashed #333', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: '#444', fontSize: '11px', fontFamily: 'monospace', gap: '4px',
                  }}>
                    <span style={{ fontSize: '20px' }}>+</span>
                    <span>Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handlePhotoAdd}
                    />
                  </label>
                )}
              </div>
              {photos.length > 0 && (
                <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace', marginTop: '6px' }}>
                  {photos.length}/4 photo{photos.length !== 1 ? 's' : ''} · AI will scan {photos.length > 1 ? 'all of them' : 'it'} for damage, wear, and condition
                </div>
              )}
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
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
                {loading ? `Analyzing${'.'.repeat(dotCount)}` : 'Analyze flip potential →'}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="mf-btn-ghost"
                style={{ background: 'transparent', color: '#888', border: '1px solid #222', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {/* SKELETON — shown while analysis is loading, same shape as result card */}
            {loading && (
              <div style={{ marginTop: '2rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1.5rem' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div className="mf-skeleton-bar" style={{ height: '18px', width: '55%', marginBottom: '8px' }} />
                    <div className="mf-skeleton-bar" style={{ height: '12px', width: '35%' }} />
                  </div>
                  <div className="mf-skeleton-bar" style={{ height: '26px', width: '90px', borderRadius: '999px' }} />
                </div>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ background: '#161616', borderRadius: '8px', padding: '12px 14px' }}>
                      <div className="mf-skeleton-bar" style={{ height: '10px', width: '60%', marginBottom: '8px' }} />
                      <div className="mf-skeleton-bar" style={{ height: '20px', width: '80%' }} />
                    </div>
                  ))}
                </div>
                {/* Summary bar */}
                <div className="mf-skeleton-bar" style={{ height: '72px', borderRadius: '8px', marginBottom: '1rem' }} />
                {/* Flags row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                  <div>
                    <div className="mf-skeleton-bar" style={{ height: '10px', width: '50%', marginBottom: '10px' }} />
                    {[0,1,2].map(i => <div key={i} className="mf-skeleton-bar" style={{ height: '13px', width: '90%', marginBottom: '6px' }} />)}
                  </div>
                  <div>
                    <div className="mf-skeleton-bar" style={{ height: '10px', width: '50%', marginBottom: '10px' }} />
                    {[0,1].map(i => <div key={i} className="mf-skeleton-bar" style={{ height: '13px', width: '80%', marginBottom: '6px' }} />)}
                  </div>
                </div>
                {/* Negotiation tip bar */}
                <div className="mf-skeleton-bar" style={{ height: '52px', borderRadius: '8px', marginBottom: '1rem' }} />
                {/* Button placeholder */}
                <div className="mf-skeleton-bar" style={{ height: '38px', width: '160px', borderRadius: '8px' }} />
              </div>
            )}

            {/* RESULT */}
            {result && (
              <div className="mf-card" style={{ marginTop: '2rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1.5rem' }}>
                {/* Photo strip */}
                {result.photos?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {result.photos.map((src, i) => (
                      <img key={i} src={src} alt={`Photo ${i + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #222' }} />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>{result.bikeLabel}</div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '3px' }}>
                      Listed at ${result.askPrice.toLocaleString()}{result.mileage ? ` · ${parseInt(result.mileage).toLocaleString()} mi` : ''}
                      {result.estimated_market_value ? ` · Market value ~$${result.estimated_market_value.toLocaleString()}` : ''}
                      {result.listingUrl && (
                        <> · <a href={result.listingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#e8ff47', textDecoration: 'none' }}>View listing →</a></>
                      )}
                    </div>
                    {(result.region || result.titleStatus) && (
                      <div style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace', marginTop: '4px', letterSpacing: '0.02em' }}>
                        {result.region && <span>{result.region}</span>}
                        {result.region && result.titleStatus && <span> · </span>}
                        {result.titleStatus && <span>{result.titleStatus}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <ScoreBadge score={result.score} />
                    <div style={{ fontSize: '12px', color: '#444', marginTop: '5px', fontFamily: 'monospace' }}>{result.score}/100</div>
                  </div>
                </div>

                {/* Chips row — market demand + confidence */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {result.market_demand && (
                    <span style={{
                      fontSize: '11px', fontFamily: 'monospace', fontWeight: '700',
                      letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '999px',
                      background: result.market_demand === 'High' ? '#1a2e1a' : result.market_demand === 'Low' || result.market_demand === 'Niche' ? '#2e1a1a' : '#1a1f2e',
                      color: result.market_demand === 'High' ? '#4ade80' : result.market_demand === 'Low' || result.market_demand === 'Niche' ? '#f87171' : '#60a5fa',
                      border: result.market_demand === 'High' ? '1px solid #2a4a2a' : result.market_demand === 'Low' || result.market_demand === 'Niche' ? '1px solid #4a2a2a' : '1px solid #2a3a4a',
                    }}>
                      {result.market_demand === 'High' ? '🔥' : result.market_demand === 'Low' ? '🐢' : result.market_demand === 'Niche' ? '🎯' : '📊'} {result.market_demand} demand
                    </span>
                  )}
                  {result.confidence && (
                    <span style={{
                      fontSize: '11px', fontFamily: 'monospace', fontWeight: '700',
                      letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '999px',
                      background: '#1a1a1a', color: result.confidence === 'High' ? '#888' : result.confidence === 'Low' ? '#fbbf24' : '#666',
                      border: '1px solid #2a2a2a',
                    }}>
                      {result.confidence === 'Low' ? '⚠️' : ''} {result.confidence} confidence
                    </span>
                  )}
                </div>

                <div className="mf-grid-4 mf-stats-4" style={{ marginBottom: '1rem', gap: '8px' }}>
                  <StatBox label="SUGGEST OFFER" value={`$${result.suggested_offer.toLocaleString()}`} />
                  <StatBox label="SELL FOR ~" value={`$${result.estimated_sell_price.toLocaleString()}`} />
                  <StatBox label="NET PROFIT EST." value={`$${(result.net_profit_estimate ?? result.estimated_profit).toLocaleString()}`} green />
                  <StatBox label="TIME TO SELL" value={result.days_to_sell_estimate} />
                </div>

                {/* Cost breakdown note */}
                {result.estimated_costs != null && (
                  <div style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                    Gross profit ~${result.estimated_profit?.toLocaleString()} · Est. costs ~${result.estimated_costs?.toLocaleString()} (title, prep, transport) · Net ~${(result.net_profit_estimate ?? result.estimated_profit).toLocaleString()}
                  </div>
                )}

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
                    {result.red_flags?.length > 0
                      ? result.red_flags.map((f, i) => <div key={i} style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px' }}>✗ {f}</div>)
                      : <div style={{ fontSize: '13px', color: '#555' }}>None identified</div>
                    }
                  </div>
                </div>

                {/* Inspect checklist */}
                {result.inspect_checklist?.length > 0 && (
                  <div style={{ background: '#1a1500', border: '1px solid #2a2200', borderRadius: '8px', padding: '12px 14px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fbbf24', marginBottom: '8px', letterSpacing: '0.04em' }}>🔍 WHAT TO INSPECT</div>
                    {result.inspect_checklist.map((item, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px', lineHeight: '1.5' }}>· {item}</div>
                    ))}
                  </div>
                )}

                <div style={{ background: '#0f1a2e', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#93c5fd', lineHeight: '1.65', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '700' }}>Negotiation tip: </span>{result.negotiation_tip}
                </div>

                <button
                  type="button"
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
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} aria-hidden="true">🏍️</div>
                <h3 style={{
                  fontSize: '20px', fontWeight: 700, fontFamily: 'Georgia, serif',
                  color: '#f0ede6', marginBottom: '10px',
                }}>
                  Your pipeline lives here
                </h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.65, maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                  Analyze a listing and tap &ldquo;Save to pipeline&rdquo; to start tracking it.
                  Keep your hottest finds in one place and never lose a deal.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('analyze')}
                  className="mf-btn-primary"
                  style={{
                    background: '#e8ff47', color: '#0a0a0a',
                    border: 'none', padding: '10px 20px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 700, fontFamily: 'monospace',
                    letterSpacing: '0.02em', cursor: 'pointer',
                  }}
                >
                  Analyze a listing →
                </button>
              </div>
            ) : (
              pipeline.map(r => (
                <div key={r.id} className="mf-card" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem', marginBottom: '10px' }}>
                  {r.photos?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {r.photos.map((src, i) => (
                        <img key={i} src={src} alt={`Photo ${i + 1}`} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #222' }} />
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'Georgia, serif' }}>{r.bikeLabel}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                        Ask: ${r.askPrice.toLocaleString()} · Offer: ${r.suggested_offer.toLocaleString()}
                        {r.listingUrl && (
                          <> · <a href={r.listingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#e8ff47', textDecoration: 'none' }}>View listing →</a></>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ScoreBadge score={r.score} />
                      <button type="button" onClick={() => removeFromPipeline(r.id)} aria-label="Remove" style={{ background: 'none', border: 'none', color: '#333', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                  <div className="mf-grid-4 mf-stats-4" style={{ gap: '8px' }}>
                    <StatBox label="NET PROFIT EST." value={`$${(r.net_profit_estimate ?? r.estimated_profit).toLocaleString()}`} green />
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
