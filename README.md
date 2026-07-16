# Redz Restaurant

Next.js website + Henry AI concierge (OpenRouter chat) + Supabase CRM.

## Accounts (Laurel Lodging / marketing)

| Service | Account / project |
|---|---|
| **Vercel** (host only) | `logicalmediamarketing-5894` → project `redz-restaurant` |
| **Supabase** (DB + Auth) | **Laurel Lodging / marketing@** → LaurelDev org → `dbzvxncnkgqgfjqcbyai` |
| **Domain** | `redzrestaurant.com` + `www` attached to the Vercel project |
| **CRM login** | `marketing@laurellodging.com` (allowlisted via `NEXT_PUBLIC_ADMIN_EMAILS`) |

If Vercel says the database is connected to the wrong account, see **[SUPABASE-LAUREL.md](./SUPABASE-LAUREL.md)**.

## Stack

- **Vercel** — hosts the Next.js app  
- **Supabase** — Postgres + Auth + reservations / leads  
- **OpenRouter** — Henry text chat only (voice/Retell removed)  
- **Resend** — email confirmations (add `RESEND_API_KEY` when ready)  
- **DNS** — point `redzrestaurant.com` at Vercel (see [DEPLOYMENT.md](./DEPLOYMENT.md))

## Local development

```bash
cp .env.example .env.local
# fill OPENROUTER_API_KEY + Supabase keys
npm install
npm run dev
```

Staff CRM: `/admin` (sign-in only — create users in Supabase Auth).

Full cutover checklist: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
