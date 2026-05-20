# MotoFlip

AI-powered motorcycle flip analyzer. Paste a listing's details, get a 0–100 flip score, suggested offer price, estimated profit, green/red flags, and a negotiation tip — powered by Claude Haiku.

**Live:** https://motofliip.vercel.app  
**Repo:** https://github.com/xbhztyd8m8-sys/motofliip

---

## Tech stack

- **Next.js 16** (App Router, `.jsx` + `.tsx` mixed, no TypeScript-only)
- **Tailwind v4** installed but unused in pages — design is inline styles + `globals.css` utility classes
- **Supabase** — auth (email/password), user metadata (`app_metadata.is_pro` for Pro status)
- **Stripe** — subscription payments (test mode). Webhook at `/api/stripe/webhook` sets `is_pro`.
- **Anthropic SDK** — `claude-haiku-4-5` powers the flip analysis at `/api/analyze`

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` with:

```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=
```

## Deployment

Deployed on Vercel. Push to `main` auto-deploys. Set all env vars in the Vercel project settings.

For Stripe webhooks in production, register `https://motofliip.vercel.app/api/stripe/webhook` in the Stripe dashboard and set `STRIPE_WEBHOOK_SECRET` to the signing secret.

## Key files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page (server component) |
| `app/dashboard/page.jsx` | Main app — analyze + pipeline (client) |
| `app/api/analyze/route.js` | Anthropic API call — returns flip score JSON |
| `app/api/checkout/route.js` | Creates Stripe checkout session |
| `app/api/stripe/webhook/route.js` | Stripe webhook — sets `is_pro` in Supabase |
| `app/globals.css` | Design tokens, utility classes, animations |
| `lib/supabase.js` | Supabase browser client factory |
| `components/FadeIn.jsx` | IntersectionObserver scroll-fade wrapper |

## Current status (May 2026)

- ✅ Free tier (5 analyses/month) + Pro ($9/mo) UI
- ✅ Stripe checkout flow
- ⚠️ Stripe webhook signature verification failing — under investigation
- ✅ Auth (email/password via Supabase)
- 🚧 Chrome extension — built but not yet published to the Web Store
