# Agent Khan Baba

A Next.js 14 (TypeScript, Tailwind CSS) + Supabase website that guides people through **official** SIM verification in Pakistan, with a secure admin panel.

**What it is:** a mobile/CNIC format validator, official verification guides, helplines, reporting steps, FAQs and legal pages.
**What it is not:** a private SIM-owner database. No owner names, addresses or CNICs are ever shown unless a legally authorized provider is connected, and then only the fields you allow-list.

## Professional UI and integrations

- Persistent light/dark theme toggle (uses the device preference on first visit and remembers the user's choice locally).
- Responsive navigation, accessible focus states, reduced-motion support, search, and floating WhatsApp contact (requires its environment variable).
- Existing integration points: Supabase admin/content backend, optional authorized verification API, contact-message handling, editable SEO metadata, and structured data.
- The verification tool is guidance-only until a legitimately authorized provider is configured. It does not expose private SIM-owner details by itself.

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in values (see below)
npm run dev                    # http://localhost:3000
npm test                       # unit tests
npm run build                  # production build
```

The public site works with **no environment variables** (built-in default content). Supabase is needed for the admin panel, editable content, the contact form and logs.

## 1. Supabase setup

1. Create a project at supabase.com.
2. SQL editor: run `supabase/schema.sql` (tables, constraints and Row Level Security).
3. Authentication > Users: create your admin user (email + strong password). Turn **off** public sign-ups in Authentication settings.
4. Make that user an admin (SQL editor, replace the email):
   ```sql
   insert into public.admin_users (user_id) select id from auth.users where email = 'you@example.com';
   ```
5. Copy the project URL, anon key and service-role key into `.env.local`.

Admin access is enforced in three places: middleware (server), a second check in the admin layout (server), and Row Level Security (`is_admin()`) on every table. There are no hard-coded credentials.

## 2. Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URL, sitemap, robots |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase client |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | Floating WhatsApp button (digits only, e.g. `923001234567`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Shown on contact and legal pages |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Writing logs / contact messages |
| `LOG_HASH_SECRET` | **server only** | HMAC key for hashing identifiers in logs |
| `VERIFICATION_API_URL`, `VERIFICATION_API_KEY` | **server only** | Optional authorized provider |
| `VERIFICATION_ALLOWED_FIELDS` | **server only** | Comma list of response fields you may display |

Never prefix secrets with `NEXT_PUBLIC_`.

## 3. Deploy to Vercel

1. Push the project to a Git repository and import it in Vercel (framework: Next.js, defaults are fine).
2. Add every variable from the table in Project Settings > Environment Variables (Production and Preview).
3. Set `NEXT_PUBLIC_SITE_URL` to your final domain, then deploy.
4. In Supabase > Authentication > URL configuration, add your domain.
5. Submit `https://your-domain/sitemap.xml` in Google Search Console.

## 4. Integrating a legally authorized verification provider

Do this **only** if you hold a written agreement or approval that permits the lookup and the display of each returned field. Do not integrate leaked, scraped or resold databases.

1. Add `VERIFICATION_API_URL`, `VERIFICATION_API_KEY` and `VERIFICATION_ALLOWED_FIELDS` in Vercel.
2. Open `src/lib/provider.ts` and adjust `lookup()` to your provider's request and response contract. The default sends `POST {type, value}` with Bearer auth and expects a flat JSON object.
3. Only fields in `VERIFICATION_ALLOWED_FIELDS` ever reach the browser (covered by `tests/provider.test.ts`).
4. When configured, the tool requires an ownership/permission confirmation tick-box before each lookup.
5. Test against the provider's sandbox, then check **Admin > API & logs** for health and errors.
6. Update the Privacy Policy and Disclaimer to name the provider and what is shared with it.

If the provider is unreachable, users automatically see the official steps instead.

## 5. Security measures

- Zod and custom validation on every API route; strict length limits (also enforced by DB check constraints).
- Rate limiting: 8 verify requests per minute and 3 contact messages per 10 minutes per IP. This is in-memory per server instance; for strict global limits replace `src/lib/ratelimit.ts` with Upstash Redis.
- No raw CNIC or mobile number is stored or logged; logs hold HMAC hashes only, and the admin UI does not display even those.
- React escapes all content (no `dangerouslySetInnerHTML` except for server-built JSON-LD with `<` escaped). Supabase client uses parameterised queries, so there is no SQL injection surface.
- Security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Honeypot field on the contact form.

## 6. SEO and AdSense readiness

Unique titles and descriptions per page (editable in Admin > SEO), sitemap, robots, canonical URLs, FAQ structured data, mobile-first layout, and privacy / terms / disclaimer / contact pages. Approval is decided by Google and cannot be guaranteed. Before applying: add more original, helpful written content, use your own domain, confirm all helplines and links are accurate, and follow the current AdSense program policies. Add the AdSense script and a cookie/consent notice if your audience or policy requires it.

## 7. Before launch: verify these

The default helpline numbers and official URLs in `src/lib/defaults.ts` are provided as a starting point from general knowledge and **may be outdated**. Confirm each one on the operator's or PTA's own website, then maintain them in Admin > Helplines / Official links.

## 8. Testing checklist

- [ ] `npm test` passes; `npm run build` passes
- [ ] Mobile tab: `03001234567`, `+923001234567` accepted; `12345`, letters, wrong prefix rejected with a message
- [ ] CNIC tab: 13 digits (with/without dashes) accepted; wrong length rejected
- [ ] With no provider: valid input shows official steps and links, never data
- [ ] Rapid repeated submissions return the "too many requests" message
- [ ] Header search, menu, quick cards, footer links and floating WhatsApp button all work
- [ ] All 11 pages load; unknown URL shows 404; `/sitemap.xml` and `/robots.txt` load
- [ ] `/admin` redirects to login when signed out; non-admin users are refused; log out works
- [ ] Admin can add, edit, hide and delete FAQs, helplines and links; changes appear on the public site within 5 minutes
- [ ] Contact form submits; message appears in Admin > Messages; mark read and delete work
- [ ] SEO edits save and show in page source; announcement banner appears and clears
- [ ] Admin > API & logs shows provider status and recent events, with no personal data
- [ ] Lighthouse mobile run: performance, accessibility and SEO scores reviewed

## Project layout

```
src/app/            pages, API routes (verify, contact), admin panel, sitemap, robots
src/components/     UI components and admin editors
src/lib/            validation, provider adapter, rate limit, logging, Supabase clients, defaults
supabase/schema.sql database schema + RLS
tests/              validation and provider tests
```
