export default function FAQ() {
  const faqs = [
    {
      q: 'How does MotoFlip work?',
      a: 'MotoFlip uses AI to analyze motorcycle listings and score their flip potential from 0-100. Enter the details of any listing — year, make, model, price, mileage — and get an instant analysis including suggested offer price, estimated profit, and red flags.'
    },
    {
      q: 'Does it work on Facebook Marketplace and Craigslist?',
      a: 'Yes. The MotoFlip Chrome extension works directly on Facebook Marketplace and Craigslist motorcycle listings. It automatically reads the listing details and gives you a flip score without leaving the page.'
    },
    {
      q: 'How accurate are the profit estimates?',
      a: 'Our estimates are AI-generated based on general US market data and should be used as a starting point, not a guarantee. Prices vary by region, season, and local demand. Always check comparable listings in your area before making a purchase.'
    },
    {
      q: 'What is the free plan?',
      a: 'The free plan gives you 5 analyses per month and access to the web app dashboard. It\'s a great way to try MotoFlip before committing to Pro.'
    },
    {
      q: 'What does Pro include?',
      a: 'Pro gives you unlimited analyses, access to the Chrome extension, unlimited pipeline tracking, market comps, and profit tracking. It\'s $9/month and you can cancel anytime.'
    },
    {
      q: 'Can I cancel my Pro subscription?',
      a: 'Yes, you can cancel anytime. You\'ll keep access until the end of your current billing period and won\'t be charged again.'
    },
    {
      q: 'Does the extension track my browsing?',
      a: 'No. The extension only reads listing data when you actively click it on a supported page. It does not run in the background or track your browsing history.'
    },
    {
      q: 'What motorcycles does it work for?',
      a: 'MotoFlip works for all makes and models — Honda, Yamaha, Kawasaki, Suzuki, Harley-Davidson, KTM, BMW, Ducati, Triumph, Royal Enfield, Indian, and more.'
    },
    {
      q: 'Is my data safe?',
      a: 'Yes. Your account data is stored securely via Supabase. We never sell your data to third parties. Payments are processed by Stripe and we never see your card details.'
    },
    {
      q: 'I have a question not answered here.',
      a: 'Email us at support@motofliip.com and we\'ll get back to you within 24 hours.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <a href="/" style={{ color: '#e8ff47', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>← Back to MotoFlip</a>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Georgia, serif', margin: '2rem 0 0.5rem' }}>Frequently asked questions</h1>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '3rem' }}>Everything you need to know about MotoFlip.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          {faqs.map(({ q, a }) => (
            <div key={q} style={{ background: '#111', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#f0ede6' }}>{q}</div>
              <div style={{ fontSize: '14px', color: '#777', lineHeight: '1.75' }}>{a}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <a href="/signup" style={{
            display: 'inline-block', background: '#e8ff47', color: '#0a0a0a',
            padding: '12px 28px', borderRadius: '8px', textDecoration: 'none',
            fontSize: '14px', fontWeight: '700', fontFamily: 'monospace'
          }}>Try MotoFlip free →</a>
        </div>
      </div>
    </div>
  );
}
