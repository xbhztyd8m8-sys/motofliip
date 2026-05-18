export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <a href="/" style={{ color: '#e8ff47', textDecoration: 'none', fontSize: '14px', fontFamily: 'monospace' }}>← Back to MotoFlip</a>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'Georgia, serif', margin: '2rem 0 1rem' }}>Privacy Policy</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '2rem' }}>Last updated: May 2026</p>

        {[
          {
            title: 'What we collect',
            body: 'We collect your email address and password when you create an account. Optionally, we collect your name and location to personalize your experience. We also collect the motorcycle listing details you enter into MotoFlip to provide our analysis service.'
          },
          {
            title: 'How we use your data',
            body: 'Your listing data is sent to the Anthropic API to generate flip analysis. We do not store individual listing analyses permanently. Your account information is stored securely in Supabase. We never sell your personal data to third parties.'
          },
          {
            title: 'Payments',
            body: 'Payment processing is handled by Stripe. We never see or store your credit card details. Stripe\'s privacy policy applies to all payment transactions.'
          },
          {
            title: 'Browser extension',
            body: 'The MotoFlip Chrome extension reads motorcycle listing data from Facebook Marketplace and Craigslist pages only when you actively click the extension. It does not run in the background or track your browsing history.'
          },
          {
            title: 'Cookies',
            body: 'We use cookies only for authentication purposes — to keep you logged in. We do not use advertising or tracking cookies.'
          },
          {
            title: 'Data deletion',
            body: 'You can delete your account at any time by emailing us. We will remove all your personal data within 30 days.'
          },
          {
            title: 'Contact',
            body: 'Questions about privacy? Email us at support@motofliip.com'
          }
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#f0ede6' }}>{title}</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.75' }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
