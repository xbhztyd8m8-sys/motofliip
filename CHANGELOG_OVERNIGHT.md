# Overnight polish session — 2026-05-20

## What changed (per file)

- **app/error.jsx** (new) — Friendly error boundary matching `not-found.jsx` aesthetic. "ERROR · UNEXPECTED" eyebrow, 🏍️ emoji, Georgia headline "Something fell off the bike.", support email link, "Try again" (calls `unstable_retry()` — Next.js 16's recovery prop) and "Go home" buttons. `'use client'`, logs error to console.

- **app/global-error.jsx** (new) — Minimal root-layout error fallback. Full `<html>/<body>` document required since layout.tsx may not have loaded. All styles are inline. Same dark-theme vibe, "Try again" + "Go home", uses `unstable_retry`.

- **app/globals.css** (modified) — Added three new blocks:
  - `@keyframes mf-skeleton-pulse` (opacity 0.4→0.7→0.4, 1.4s ease-in-out infinite) + `.mf-skeleton-bar` utility class for the loading skeleton.
  - `.mf-fade-up` + `.mf-fade-up.mf-in-view` scroll-triggered fade animation (0.6s ease-out), with `prefers-reduced-motion` override that makes content visible immediately.
  - `.mf-greeting` class hidden below 480px (second breakpoint added for very small phones).
  - `--mf-space-1` through `--mf-space-8` CSS spacing-scale variables (4px→64px) in the `:root` block.

- **app/page.tsx** (modified) — Major landing-page pass:
  - Hero eyebrow chip changed from "NOW WITH BROWSER EXTENSION" to "🏍️ FOUNDING MEMBERS · $9/MO LOCKED IN FOREVER".
  - Added "First 100 founding members · No card required to start" line under hero CTAs.
  - Added subtle radial gradient on hero section (`rgba(232,255,71,0.08)` at top-right).
  - Added trust-signal row (⚡ ~2 seconds · 🇺🇸 US market data · 🔒 No card) between hero and extension mock, wrapped in `<FadeIn>`.
  - How-it-works step numbers wrapped in circular outlined chips (28px, border `#2a2a2a`, 999px radius).
  - Added "MEET THE BUILDER / Built by a flipper, for flippers" section between How-It-Works and Pricing, with thin yellow accent line on left and `<!-- TODO: replace with real founder story -->` comment.
  - Pricing section gets subtle `linear-gradient(180deg, transparent, rgba(232,255,71,0.02))` backdrop; "MOST POPULAR" badge renamed to "FOUNDING MEMBER"; Pro tagline updated to "per month · locked in for life".
  - Inline FAQ ("Quick questions") added below pricing cards — 4 items, `.mf-card` style, wrapped in `<FadeIn>`.
  - Footer: brand tagline "MotoFlip — AI flip scores for any motorcycle listing." added above link row; `/blog` link added to footer nav.
  - JSON-LD `SoftwareApplication` schema added at bottom of `<main>` via `dangerouslySetInnerHTML`.
  - Imported `<FadeIn>` component; wrapped trust signals, how-it-works cards, founder section, pricing grid, and FAQ in `<FadeIn>`.
  - All decorative emojis in nav given `aria-hidden="true"`.
  - Preview mock buttons given `type="button"`.

- **components/FadeIn.jsx** (new) — Lightweight `'use client'` IntersectionObserver wrapper. Applies `.mf-fade-up` on render and adds `.mf-in-view` when the element enters the viewport (threshold 0.1). Disconnects after first trigger. CSS `prefers-reduced-motion` override in globals.css makes content immediately visible for those users.

- **app/dashboard/page.jsx** (modified) — Multiple polish items (Stripe-related code untouched):
  - Added `useRef` import; `yearInputRef` + `dotCount` state.
  - `document.title = 'Dashboard · MotoFlip'` in `useEffect` at mount.
  - Animated dots useEffect: cycles `dotCount` 0→3 every 400ms while `loading`; clears on `loading` false. Button now renders `Analyzing...` with live dot count.
  - Auto-focus useEffect: focuses `yearInputRef` when `authLoading` becomes false and tab is `'analyze'`.
  - Esc-to-clear useEffect: `keydown` listener clears form + result + error when `tab === 'analyze'`.
  - Loading skeleton: full-height placeholder card shown between form and result while `loading === true` — mirrors shape of result card (header row, 4-col stat boxes, summary bar, flags grid, tip bar, button bar) using `.mf-skeleton-bar`.
  - Pipeline empty state upgraded: large emoji, "Your pipeline lives here" Georgia headline, description copy, `.mf-btn-primary` "Analyze a listing →" button that calls `setTab('analyze')`.
  - Topbar 🏍️ emoji wrapped in `<span aria-hidden="true">`.
  - `mf-greeting` class added to "Hey {firstName} 👋" div (hides below 480px).
  - Every `<button>` given explicit `type="button"` (upgrade, sign out, celebrate dismiss, both tabs, onboarding dismiss, try example, analyze, clear, add to pipeline, remove from pipeline).
  - Improved comments on `set()` helper, `isPro`/`showOnboarding` derivations, and `addedIds`/`addToPipeline` logic.

- **app/login/page.jsx** (modified) — Added `useEffect` import + `document.title = 'Log in · MotoFlip'` at mount. Added `htmlFor`/`id` to both inputs (`login-email`, `login-password`). Added `type="button"` to submit button.

- **app/signup/page.jsx** (modified) — Added `useEffect` import + `document.title = 'Create your account · MotoFlip'` at mount. Added `htmlFor`/`id` to all four inputs (`signup-name`, `signup-email`, `signup-password`, `signup-location`). Added `type="button"` to submit button.

- **app/faq/page.jsx** (modified) — Added `export const metadata` with `title: 'FAQ'` and a targeted description.

- **app/privacy/page.jsx** (modified) — Added `export const metadata` with `title: 'Privacy'` and description.

- **app/terms/page.jsx** (modified) — Added `export const metadata` with `title: 'Terms'` and description.

- **app/not-found.jsx** (modified) — Added `aria-hidden="true"` to the `🏍️💨` emoji div.

- **app/blog/page.jsx** (new) — On-brand "Articles coming soon" placeholder. `metadata` export with blog title + description. Lists 6 upcoming article titles as muted non-linked items. Support email link at bottom. Reserves the `/blog` route for internal linking.

- **app/sitemap.js** (modified) — Added `/blog` entry (`changeFrequency: 'monthly'`, `priority: 0.5`).

- **README.md** (modified) — Replaced boilerplate `create-next-app` README with a real project overview: what MotoFlip is, tech stack, env vars table, key files table, current status notes.

---

## What was completed

✅ 1.1 Error boundary (`app/error.jsx`)  
✅ 1.2 Global error (`app/global-error.jsx`)  
✅ 1.3 Loading skeleton on dashboard analyze  
✅ 1.4 Inline pricing FAQ ("Quick questions" section)  
✅ 1.5 Founding-member hero eyebrow + "First 100" subline  
✅ 1.6 Trust-signal row (⚡ 🇺🇸 🔒) below hero CTAs  
✅ 1.7 Founder paragraph section ("Built by a flipper, for flippers")  
✅ 1.8 Per-page titles — server pages via `metadata` export; client pages via `document.title` in `useEffect`  
✅ 1.9 JSON-LD `SoftwareApplication` schema on homepage  
✅ 2.1 Section visual variety (radial hero gradient, numbered chip badges, pricing gradient, founder accent line)  
✅ 2.2 Scroll-triggered fade-in via `<FadeIn>` component + `.mf-fade-up`/`.mf-in-view` CSS  
✅ 2.3 Polished pipeline empty state (headline, description, tab-switch CTA)  
✅ 2.4 Animated dots on analyze button (`Analyzing...` with live dot interpolation)  
✅ 2.5 Auto-focus year input on dashboard mount  
✅ 2.6 Esc-to-clear keyboard shortcut on dashboard  
✅ 2.7 Dashboard topbar mobile sweep (`.mf-greeting` hides below 480px)  
✅ 2.8 Footer brand tagline above link row  
✅ 3.1 Accessibility sweep (`aria-label` verified, `aria-hidden` on decorative emojis, `type="button"` everywhere, `htmlFor`/`id` on all auth inputs)  
✅ 3.2 Page metadata descriptions for `/faq`, `/privacy`, `/terms`  
✅ 3.3 `/blog` stub with coming-soon placeholder articles + sitemap entry  
✅ 4.1 Spacing system tokens (`--mf-space-1` through `--mf-space-8`) in `globals.css`  
✅ 4.2 Comment audit on dashboard (complex useEffects, `set()` helper, `isPro`/`showOnboarding`, `addedIds`)  
✅ 4.3 README updated (was generic create-next-app boilerplate)  

---

## What was started but not finished

Nothing left in a partial state. All started items were completed cleanly.

---

## What was skipped and why

**3.4 RSS / news SEO** — Explicitly out of scope per the polish list (no real content yet).

**3.5 Auth callback page** — Skipped. Here's why:
- The signup page already sets `emailRedirectTo: ${origin}/dashboard`, so the happy-path confirmation flow works today.
- A proper `/auth/callback` handler for expired/invalid links requires: (a) a **server-side** Supabase client (needs `SUPABASE_SECRET_KEY` and `createServerClient` from `@supabase/ssr`), (b) PKCE code exchange via `exchangeCodeForSession()`, and (c) configuring the "Redirect URLs" and error redirect in the Supabase dashboard to point to `/auth/callback`.
- None of that can be done purely in code without also touching Supabase's dashboard and testing the flow end-to-end.
- If you want to add this, the pattern is: create `app/auth/callback/route.js` (a **route handler**, not a page), read `?code=` from the URL, call `supabase.auth.exchangeCodeForSession(code)`, redirect to `/dashboard` on success or `/login?error=expired` on failure. Then create a thin `app/login/page.jsx` error state that reads `?error=expired` and shows a message.

---

## TODOs for the user

1. **Replace placeholder founder story** — Search for `TODO: replace with real founder story` in `app/page.tsx` (line ~334). Swap the two `<p>` placeholder paragraphs with your actual story. The signature line `— Hudson, Birmingham AL` is ready to go.

2. **Stripe webhook** — The signature verification issue (`400 "No signatures found"`) is still open. Likely cause: the raw request body is being consumed before Stripe reads it (common in Next.js App Router). See `app/api/stripe/webhook/route.js` — make sure you're using `request.text()` not `request.json()` to read the body, then pass the raw string to `stripe.webhooks.constructEvent()`.

3. **Chrome extension** — The hero eyebrow now says "FOUNDING MEMBERS" (the old "NOW WITH BROWSER EXTENSION" was removed since the extension isn't published yet). When the extension hits the Web Store, update the eyebrow chip text and the extension mock section copy accordingly.

4. **Blog articles** — `app/blog/page.jsx` is a placeholder. The six article titles listed are solid SEO targets. When you're ready to write them, convert each to a `app/blog/[slug]/page.jsx` dynamic route with real MDX or inline content.

5. **Auth callback (optional)** — See the "What was skipped" section above for the exact implementation path if you want branded error handling for expired confirmation links.

---

## How to land everything

From the repo root:

```bash
git add -A
git commit -m "overnight polish: error boundaries, trust/conversion copy, dashboard UX, a11y, SEO, blog stub, spacing tokens"
git push
```

That covers every file changed in this session. The three Stripe-related files (`app/api/stripe/webhook/route.js`, `app/api/checkout/route.js`, `app/dashboard/page.jsx` with its Stripe additions) are included in the `-A` and are safe — they were only extended, not restructured.
