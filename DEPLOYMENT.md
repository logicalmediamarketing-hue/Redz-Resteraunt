# Redz Restaurant — Live Cutover

Linked accounts (marketing / Laurel Lodging):

| Layer | Linked to |
|---|---|
| App host | Vercel team `logicalmediamarketing-5894s-projects` → **`redz-restaurant`** |
| Database / Auth | Supabase org **LaurelDev** → project `dbzvxncnkgqgfjqcbyai` |
| Domain | **`redzrestaurant.com`** + **`www.redzrestaurant.com`** on that Vercel project |
| Henry chat | OpenRouter (`OPENROUTER_API_KEY` set in Vercel Production) |
| CRM allowlist | `NEXT_PUBLIC_ADMIN_EMAILS=marketing@laurellodging.com` |

Voice/Retell removed — chat only.

---

## Done

- [x] Production code deployed to Vercel  
- [x] `OPENROUTER_API_KEY`, `CHAT_MODEL`, `NEXT_PUBLIC_SITE_URL` set  
- [x] Supabase URL/anon key pointed at LaurelDev project  
- [x] Stale `OPENAI_*` / `RETELL_*` env vars removed  
- [x] `reservations` + `leads` tables created with RLS  
- [x] Domain attached on Vercel (alias shows `https://redzrestaurant.com`)  

Live app (works now, before DNS):  
https://redz-restaurant.vercel.app  

Inspector:  
https://vercel.com/logicalmediamarketing-5894s-projects/redz-restaurant  

---

## BLOCKER — DNS still on old hosting

`redzrestaurant.com` currently resolves to Rackspace/`Microsoft-IIS` (old site), **not** Vercel.
Full steps: **[DNS-CUTOVER.md](./DNS-CUTOVER.md)**

Quick fix at Rackspace DNS (or wherever the zone lives):

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `A` | `www` | `76.76.21.21` |

Until that flips, share https://redz-restaurant.vercel.app as the live preview.

---

## You must finish (Supabase Auth)

1. Supabase → **Authentication → Users → Add user**  
   - Email: `marketing@laurellodging.com`  
   - Set a strong password (or invite)  
2. **Authentication → Providers → Email** → **disable “Allow new users to sign up”**  
3. Sign in at `https://redz-restaurant.vercel.app/admin` (then the custom domain)

---

## Email (Resend) — set in Vercel

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | set in Production |
| `FROM_EMAIL` | `info@redzrestaurant.com` |
| `RESTAURANT_EMAIL` | `marketing@laurellodging.com` |

**Required in Resend dashboard:** verify domain `redzrestaurant.com` (DNS records Resend shows). Until verified, sends from `info@redzrestaurant.com` may fail.

Optional Twilio SMS: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `RESTAURANT_PHONE_NUMBER`.

---

## Smoke test

- [ ] Open https://redz-restaurant.vercel.app — pages load  
- [ ] Henry chat replies (OpenRouter funded)  
- [ ] Book a table via chat or `/reservations` → row in Supabase + `/admin`  
- [ ] Banquet / contact form → **Leads / Contact** tab in CRM  
- [ ] After DNS: https://redzrestaurant.com matches, `/sitemap.xml` uses that host  

---

### Deploy trigger
Push to `main` or `vercel deploy --prod` from this repo (linked project).
