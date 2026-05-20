import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { email, userId } = await request.json();

    if (!userId) {
      return Response.json({ error: 'Not authenticated' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      // client_reference_id is echoed back in the checkout.session.completed
      // webhook event so we can identify which Supabase user paid.
      client_reference_id: userId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      // Also stash it on the subscription so later subscription events
      // (updated, deleted) can identify the user even without a customer lookup.
      subscription_data: {
        metadata: { supabase_user_id: userId },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
