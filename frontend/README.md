# Morsaab's — Web

Next.js 15 (App Router) + TypeScript front end for Morsaab's, a royal North
Indian and Indo-Chinese pure-vegetarian restaurant on Rama Park Road, Uttam
Nagar, New Delhi.

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

It runs standalone. With `BACKEND_API_URL` unset, the route handlers in
`app/api/` accept form submissions and log them rather than forwarding to the
FastAPI service, so every page and flow works without the backend up.

```bash
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm start            # serve the production build
```

> Do not run `npm run build` while `npm run dev` is live — they share `.next`
> and the build will pull the chunks out from under the dev server.

## Layout

```
app/                    routes; one folder per page
  api/                  route handlers → FastAPI (or accept-and-log)
  globals.css           design tokens, ornament classes, print stylesheet
  layout.tsx            chrome, fonts, metadata, JSON-LD, analytics
  opengraph-image.tsx   social card, generated at build time
  robots.ts sitemap.ts  generated from the content modules
components/
  ui/                   primitives (button, field, dialog, accordion, royal)
  layout/               header, footer, page-header, legal-layout
  sections/             page sections (hero, durbar-scene, menu-browser, …)
  forms/                reservation, order, contact, account
  shared/               search, breadcrumbs, cookie banner, floating actions
content/                menu, services, blog, faqs, reviews, stories, media
lib/                    site config, SEO, schema, analytics, consent, validation
```

## Things worth knowing before you change them

**`lib/site.ts` is the single source of truth** for the name, address, phone,
hours, promises and payment methods. They appear in page copy, the JSON-LD, the
sitemap and `llms.txt`; local SEO depends on them matching the Google Business
Profile exactly. Change them here, never inline.

**The hero backdrop is drawn, not photographed.** `components/sections/durbar-scene.tsx`
renders the palace courtyard as layered SVG with scroll parallax — a couple of
kilobytes, on-palette by construction, no image request on the LCP path.

**The hero entrance is CSS, not JS.** A JS-driven entrance starting at
`opacity: 0` leaves the headline invisible whenever the animation does not
advance — backgrounded tabs throttle rAF, and hydration can fail. The `.rise`
utility in `globals.css` always settles on the visible end state. Keep it that
way. Below-the-fold sections still use Framer Motion `whileInView`, with a
`<noscript>` fallback in `layout.tsx` that forces them visible without JS.

**Dates must resolve on the client.** `useToday()` in
`components/shared/use-error-focus.ts` exists because computing "today" at
module scope bakes the *build* date into prerendered HTML — the day after a
deploy the booking form would open on a date its own validator rejects.

**Error summaries focus in an effect, not after `setState`.** `useErrorFocus`
keys off a counter so the summary exists in the DOM before it is focused, and so
a repeat submit with identical errors re-announces.

**Colour tokens are contrast-checked.** `gold-600` is `#87691D` rather than the
more obvious `#A07C22` because the latter only reaches 3.7:1 on the sand
background — fine for an icon, short of AA for the eyebrow text that uses it.
Re-check any change to the ramps against background, card *and* muted surfaces.

## Placeholders to replace before launch

- **Photography** — everything in `content/media.ts` points at stock. The alt
  text is already written for the real subject. Team headshots especially must
  be genuine photos of the actual staff.
- **Reviews and case studies** — `content/reviews.ts` and `content/stories.ts`
  are representative, not real. Mirror the actual Google reviews and get written
  permission before naming any catering client.
- **Legal pages** — `/privacy` and `/terms` are written to match how the site
  actually behaves, but they are not legal advice. Have them reviewed against
  the DPDP Act 2023.
- **Accounts** — `/account` validates but does not authenticate. Wire it to a
  real identity provider before enabling it, and never post credentials through
  `lib/submit.ts`.
- **Env vars** — set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` and
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. The site URL drives canonicals, the
  sitemap and JSON-LD, so a wrong value silently breaks the SEO metadata.

## Deploying

Vercel needs no configuration beyond the environment variables above.

The existing AWS SAM stack in the repo root serves a **static** S3 bundle and
cannot host this app as-is: SSR, the route handlers, the generated OG image and
`sitemap.ts` all need a Node runtime. Either deploy the web app to Vercel and
keep SAM for the API, or move the site behind Lambda/OpenNext. This is a real
decision that has not been made yet — see the note in the project TODO.
