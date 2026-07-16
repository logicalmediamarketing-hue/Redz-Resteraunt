# DNS cutover — put the NEW site on redzrestaurant.com

**Current state:**
- Registrar: **GoDaddy**
- Authoritative NS: `ns33.domaincontrol.com` / `ns34.domaincontrol.com`
- Apex currently points at Amazon/GoDaddy parking (`3.33.130.190`, `15.197.148.33`) — **not** Vercel
- New app is live: https://redz-restaurant.vercel.app (already aliased in Vercel)

## Fastest path (API) — paste keys to the agent

1. GoDaddy → https://developer.godaddy.com/keys → **Create New API Key** → **Production**
2. Copy **Key** + **Secret**
3. Paste them in chat (or run locally):

```bash
export GODADDY_API_KEY='...'
export GODADDY_API_SECRET='...'
node tools/godaddy-point-to-vercel.mjs
```

That sets:

| Type | Host | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `A` | `www` | `76.76.21.21` |

## Manual path (GoDaddy UI) — 2 minutes

1. https://dcc.godaddy.com/control/portfolio  
2. Open **redzrestaurant.com** → **DNS**  
3. Delete parking / old **A** / **CNAME** for `@` and `www`  
4. Add:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | 600 |
| `A` | `www` | `76.76.21.21` | 600 |

5. Save. Wait 5–30 minutes.

## After DNS

1. Vercel → Domains → green / Valid + SSL  
2. `curl -I https://redzrestaurant.com` shows `server: Vercel`  
3. Resend → Domains → verify `redzrestaurant.com` for `info@…` email  

## CRM admin

Created for `marketing@laurellodging.com`. Password is in local gitignored file  
`.admin-credentials.local` (change after first login).  
Sign-in: https://redz-restaurant.vercel.app/admin
