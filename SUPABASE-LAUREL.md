# Supabase = Laurel Lodging (marketing@) — not logicalmediamarketing

## Correct ownership

| Layer | Account / project | Notes |
|---|---|---|
| **Supabase (database + auth)** | **Laurel Lodging / marketing@laurellodging.com** → org **LaurelDev-os** → project `dbzvxncnkgqgfjqcbyai` | This is the live CRM DB |
| **Vercel (app host)** | `logicalmediamarketing-5894` → `redz-restaurant` | Hosting only; env vars point at Laurel Supabase |
| **CRM login** | `marketing@laurellodging.com` | Allowlisted in `NEXT_PUBLIC_ADMIN_EMAILS` |

**Do not** reconnect the old Supabase project that lived under logicalmediamarketing (or any other email). That causes “connected to a different database.”

Live project URL:  
https://supabase.com/dashboard/project/dbzvxncnkgqgfjqcbyai

---

## Chrome extension brief — fix the hookup

Copy everything below into Claude Chrome:

---

### Mission
Make sure Redz Restaurant uses the **Laurel Lodging / marketing@laurellodging.com** Supabase project only. Disconnect any Supabase link tied to **logicalmediamarketing**. Keep Vercel project `redz-restaurant` working with Laurel env vars.

### Part A — Supabase (marketing@laurellodging.com)

1. Open https://supabase.com/dashboard and ensure you are logged in as **marketing@laurellodging.com** (not a logicalmediamarketing / Gmail personal account).  
   - If wrong account: avatar → Sign out → Sign in with marketing@laurellodging.com  
2. Open org **LaurelDev-os's Org** (or whatever shows for Laurel).  
3. Open project **`LaurelDev-os's Project`** / ref **`dbzvxncnkgqgfjqcbyai`**.  
   - Direct link: https://supabase.com/dashboard/project/dbzvxncnkgqgfjqcbyai  
4. Confirm **Table Editor** has tables: `reservations`, `leads`.  
5. **Authentication → Users**: confirm `marketing@laurellodging.com` exists.  
6. **Authentication → Providers → Email**: turn **OFF** “Allow new users to sign up” → Save.  
7. **Project Settings → API**: leave this tab open — you’ll copy URL + `anon` `public` key for Vercel if needed.  
8. Optional rename for clarity: **Project Settings → General** → rename project to **`redz-restaurant`**.

If this project is **not** visible under marketing@:
- Check org switcher (top bar) for LaurelDev / Laurel Lodging org.  
- Or **Organization settings → Members**: invite `marketing@laurellodging.com` as Owner, accept invite, then continue.  
- Do **not** create a second empty project unless the LaurelDev project is missing entirely.

### Part B — Vercel: disconnect the wrong Supabase

1. Open https://vercel.com/logicalmediamarketing-5894s-projects/redz-restaurant/settings/integrations  
   (or Project → Settings → Integrations / Storage)  
2. If a **Supabase** integration is connected:
   - Open it → **Remove / Disconnect** (especially if it mentions a different project/email than LaurelDev / `dbzvxncnkgqgfjqcbyai`).  
3. Do **not** auto-connect a random Supabase from the logicalmediamarketing login.  
4. Prefer **manual env vars** (Part C) over the marketplace “Connect Supabase” button unless you can explicitly pick project `dbzvxncnkgqgfjqcbyai` while authorized on the Laurel org.

### Part C — Vercel env vars must point at Laurel Supabase

1. Open https://vercel.com/logicalmediamarketing-5894s-projects/redz-restaurant/settings/environment-variables  
2. For **Production**, set/update:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dbzvxncnkgqgfjqcbyai.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(paste anon public key from Supabase → Settings → API)* |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `marketing@laurellodging.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://redzrestaurant.com` |

3. Remove any old Supabase URL/key that is **not** `dbzvxncnkgqgfjqcbyai`.  
4. Keep OpenRouter + Resend vars as they are.  
5. **Deployments → … on latest Production → Redeploy** (clear build cache if offered).

### Part D — Verify

1. https://redz-restaurant.vercel.app/admin → sign in as `marketing@laurellodging.com`  
2. Submit a test reservation on the site → row appears in Laurel Supabase `reservations` table  
3. Report: which Supabase project URL is in Vercel, whether old integration was removed, whether `/admin` login works

### Do not
- Create a new Supabase under logicalmediamarketing  
- Re-link the old Redz CRM project from a different email  
- Delete the LaurelDev tables  

### Success
Vercel `redz-restaurant` talks only to `https://dbzvxncnkgqgfjqcbyai.supabase.co`, owned/accessible by **marketing@laurellodging.com**.

---
