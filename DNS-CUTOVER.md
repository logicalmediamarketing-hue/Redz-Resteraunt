# DNS cutover — put the NEW site on redzrestaurant.com

**Current state (verified):**
- `redzrestaurant.com` DNS → `159.135.35.210` (Rackspace / Microsoft-IIS) = **old ASP.NET site**
- Nameservers → `ns.rackspace.com` / `ns2.rackspace.com`
- New Next.js app is live at https://redz-restaurant.vercel.app and already aliased in Vercel to `redzrestaurant.com`

Until DNS points at Vercel, guests still see the old site on the custom domain.

## Option A (recommended) — A records at Rackspace DNS

Wherever this zone is edited (Rackspace Cloud DNS, or GoDaddy if they proxy to Rackspace):

| Type | Host | Value | TTL |
|---|---|---|---|
| `A` | `@` / apex | `76.76.21.21` | 300 |
| `A` | `www` | `76.76.21.21` | 300 |

Remove / replace any old A/CNAME that points `@` or `www` to `159.135.35.210`.

## Option B — Vercel nameservers

At the registrar, set NS to:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## After DNS

1. Wait for propagation (often 5–60 minutes; up to 48h).
2. Vercel → Domains → `redzrestaurant.com` shows **Valid** + SSL.
3. Confirm: `curl -I https://redzrestaurant.com` shows `server: Vercel` (not `Microsoft-IIS`).
4. In Resend → Domains → add/verify `redzrestaurant.com` so `info@redzrestaurant.com` can send.

## Resend DNS (email)

In Resend dashboard → Domains → Add `redzrestaurant.com` → copy the TXT/MX/CNAME records into the same DNS zone as above.
