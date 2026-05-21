import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userId, email } = await request.json();

    if (!userId) {
      return Response.json({ error: 'Not authenticated' }, { status: 400 });
    }

    // Look up the Stripe customer by the supabase_user_id we store in metadata
    const search = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${userId}'`,
      limit: 1,
    });

    let customerId = search.data[0]?.id;

    // Fallback: match by email if metadata lookup misses
    if (!customerId && email) {
      const byEmail = await stripe.customers.list({ email, limit: 1 });
      customerId = byEmail.data[0]?.id;
    }

    if (!customerId) {
      return Response.json({ error: 'No billing account found for this user.' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('[billing-portal]', error);
    return Response.json({ error: error?.message || 'Failed to open billing portal' }, { status: 500 });
  }
}
