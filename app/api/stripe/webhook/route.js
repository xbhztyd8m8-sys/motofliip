import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Route handlers are dynamic by default for non-GET methods. We need the raw
// request body to verify Stripe's signature, so we read it with request.text().

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function setProStatus(userId, isPro) {
  if (!userId) {
    console.warn('[stripe webhook] setProStatus called without userId');
    return;
  }
  const supabase = supabaseAdmin();
  // Fetch existing app_metadata so we merge rather than clobber other fields.
  const { data: { user }, error: fetchErr } = await supabase.auth.admin.getUserById(userId);
  if (fetchErr) {
    console.error('[stripe webhook] getUserById failed:', fetchErr);
    return;
  }
  const merged = { ...(user?.app_metadata || {}), is_pro: !!isPro };
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: merged,
  });
  if (error) {
    console.error('[stripe webhook] updateUserById failed:', error);
  }
}

async function userIdFromCustomer(customerId) {
  if (!customerId) return null;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer?.deleted) return null;
    return customer?.metadata?.supabase_user_id || null;
  } catch (err) {
    console.error('[stripe webhook] customers.retrieve failed:', err);
    return null;
  }
}

export async function POST(request) {
  if (!webhookSecret) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET is not set');
    return new Response('Webhook not configured', { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId =
          session.client_reference_id ||
          session.metadata?.supabase_user_id ||
          null;

        // Persist the user ID on the Stripe customer so later subscription
        // events (renewal, cancellation) can look up which user it belongs to.
        if (session.customer && userId) {
          try {
            await stripe.customers.update(session.customer, {
              metadata: { supabase_user_id: userId },
            });
          } catch (err) {
            console.error('[stripe webhook] customers.update failed:', err);
          }
        }

        await setProStatus(userId, true);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = await userIdFromCustomer(sub.customer);
        const active = ['active', 'trialing'].includes(sub.status);
        await setProStatus(userId, active);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = await userIdFromCustomer(sub.customer);
        await setProStatus(userId, false);
        break;
      }

      default:
        // ignore other event types; respond 200 so Stripe doesn't retry
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error('[stripe webhook] handler error:', err);
    return new Response('Server error', { status: 500 });
  }
}
