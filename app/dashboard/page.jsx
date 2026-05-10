'use client';

import { useState } from 'react';

const MAKES = ['Honda','Yamaha','Kawasaki','Suzuki','Harley-Davidson','BMW','KTM','Ducati','Triumph','Royal Enfield','Indian','Other'];
const CONDITIONS = ['Excellent','Good','Fair','Poor / project','Non-running'];

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

export default function Dashboard() {
  const [form, setForm] = useState({ year: '', make: '', model: '', price: '', mileage: '', condition: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pipeline, setPipeline] = useState([]);
  const [tab, setTab] = useState('analyze');
  const [addedIds, setAddedIds] = useState(new Set());

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function analyze() {
    if (!form.make || !form.model || !form.price) {
      setError('Please fill in at least make, model, and asking price.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult({ ...data, id: Date.now(), bikeLabel: [form.year, form.make, form.model].filter(Boolean).join(' '), askPrice: parseInt(form.price), mileage: form.mileage });
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
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: 'sans-serif' }}>

      {/* TOP BAR */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', borderBottom: '1px solid #1a1a1a',
        position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100,
      }}>
        <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>🏍️ MotoFlip</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ fontSize: '13px', color: '#555', padding: '6px 12px' }}>Free plan · 5 analyses/mo</div>
          <div style={{ background: '#e8ff47', color: '#0a0a0a', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', cursor: 'pointer' }}>Upgrade to Pro</div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>YEAR</label>
                <input style={inputStyle} type="number" placeholder="e.g. 2019" value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>MAKE</label>
                <select style={inputStyle} value={form.make} onChange={e => set('make', e.target.value)}>
                  <option value="">Select make...</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>MODEL</label>
              <input style={inputStyle} placeholder="e.g. Ninja 400, MT-07, CB500F, Iron 883..." value={form.model} onChange={e => set('model', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                  <option value="">Select...</option>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>DESCRIPTION / NOTES</label>
              <textarea
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical', lineHeight: '1.6' }}
                placeholder="Paste the listing description, or add your own notes — motivated seller? recent repairs? missing title? anything unusual?"
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
              <div style={{ fontSize: '11px', color: '#444', marginTop: '5px', fontFamily: 'monospace' }}>
                Tip: more detail = better analysis. Paste the full listing if you can.
              </div>
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={analyze}
                disabled={loading}
                style={{
                  background: loading ? '#2a2a2a' : '#e8ff47',
                  color: loading ? '#555' : '#0a0a0a',
                  border: 'none', padding: '12px 24px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'monospace', letterSpacing: '0.02em',
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze flip potential →'}
              </button>
              <button
                onClick={() => { setForm({ year: '', make: '', model: '', price: '', mileage: '', condition: '', description: '' }); setResult(null); setError(''); }}
                style={{ background: 'transparent', color: '#555', border: '1px solid #222', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <div style={{ marginTop: '2rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                  <StatBox label="SUGGEST OFFER" value={`$${result.suggested_offer.toLocaleString()}`} />
                  <StatBox label="SELL FOR ~" value={`$${result.estimated_sell_price.toLocaleString()}`} />
                  <StatBox label="EST. PROFIT" value={`$${result.estimated_profit.toLocaleString()}`} green />
                  <StatBox label="TIME TO SELL" value={result.days_to_sell_estimate} />
                </div>

                <div style={{ background: '#161616', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', lineHeight: '1.7', color: '#aaa', marginBottom: '1rem' }}>
                  {result.summary}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
              <StatBox label="LISTINGS TRACKED" value={pipeline.length} />
              <StatBox label="AVG EST. PROFIT" value={`$${avgProfit.toLocaleString()}`} green />
              <StatBox label="HOT PICKS" value={hotCount} />
            </div>

            {pipeline.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#333', fontSize: '14px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏍️</div>
                No listings yet — analyze one and save it here.
              </div>
            ) : (
              pipeline.map(r => (
                <div key={r.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'Georgia, serif' }}>{r.bikeLabel}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>Ask: ${r.askPrice.toLocaleString()} · Offer: ${r.suggested_offer.toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ScoreBadge score={r.score} />
                      <button onClick={() => removeFromPipeline(r.id)} style={{ background: 'none', border: 'none', color: '#333', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
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
