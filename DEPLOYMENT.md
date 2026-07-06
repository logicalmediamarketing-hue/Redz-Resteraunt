# Redz Restaurant — Deployment & Domain Cutover Checklist

Production stack: **Next.js 16 → Vercel**, **Supabase** (Postgres + Auth), **OpenAI** (chat),
**Retell** (voice), **Resend** (email), **Twilio** (SMS).

---

## 1. Vercel environment variables

Set in **Vercel → Project → Settings → Environment Variables** (Production scope), then redeploy.
Full list and notes are in [`.env.example`](.env.example).

| Variable | Required? | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ on custom domain | Set to the live domain (e.g. `https://redzrestaurant.com`). Drives sitemap, robots, canonical/OG URLs. |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://xtdutubocjaonocucuzs.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase → Project Settings → API |
| `OPENAI_API_KEY` | ✅ for chat | **Account needs funded billing/quota** or chat shows "Henry is offline". |
| `RETELL_API_KEY` + `RETELL_AGENT_ID` | for voice | `RETELL_AGENT_ID` is read server-side. |
| `RESEND_API_KEY`, `FROM_EMAIL`, `RESTAURANT_EMAIL` | for email | `FROM_EMAIL` must be on a Resend-verified domain. Skips silently if unset. |
| `TWILIO_*` | for SMS | Skips silently if unset. |

## 2. Supabase (before handoff to a paying client)

- [ ] **Upgrade `redz-crm` to Pro ($25/mo).** Free tier auto-pauses after inactivity and takes the whole site down — this already happened once.
- [ ] **Disable public sign-ups:** Supabase → Authentication → Providers/Settings → turn off "Allow new users to sign up". The admin sign-up UI is already removed in code, but the anon key can still call `signUp` until this is off. Create staff logins manually under Authentication → Users.
- [ ] (Optional hardening) Reservation/lead RLS currently lets any authenticated user read all rows. Fine for a trusted single-owner login; revisit if staff logins are shared.

## 3. Custom domain

- [ ] Vercel → Settings → Domains → add the domain.
- [ ] Add the DNS records Vercel shows at the registrar:
  - Apex `redzrestaurant.com` → `A 76.76.21.21`
  - `www` → `CNAME cname.vercel-dns.com`
  - (Vercel displays the exact current values — use those.)
- [ ] Wait for SSL to provision (green check in Vercel).
- [ ] Update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy.
- [ ] If a Google Business Profile links the old URL, update it.

## 4. Post-deploy smoke test (on the live domain)

- [ ] Home, menus, about, contact, banquets, private-dining, reservations all load.
- [ ] Chat ("Henry") replies to a question (confirms OpenAI billing is live).
- [ ] Complete a reservation through chat → row appears in the admin dashboard.
- [ ] Submit the contact form and a banquet inquiry → 200, no error.
- [ ] `/<domain>/robots.txt` and `/<domain>/sitemap.xml` show the **correct domain**.
- [ ] Log into `/admin` with a staff account; confirm sign-up is gone.

## 5. Submit for indexing (optional, recommended)

- [ ] Google Search Console → add the domain → submit `sitemap.xml`.

---

### Deploy trigger
`main` is connected to Vercel — every push to `main` deploys to production.
Latest deployment-ready code is committed; push `main` to release.
