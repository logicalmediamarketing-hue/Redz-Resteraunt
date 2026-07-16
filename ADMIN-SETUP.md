# Redz CRM admin setup

Staff use `/admin` to manage reservations (website + Henry + phone) and leads.

## Sign in (existing account)

- Email: `marketing@laurellodging.com` (already provisioned)
- URL: `/admin` on production or preview

## Create a new staff account

1. **Allowlist the email** in Vercel / env:

```bash
NEXT_PUBLIC_ADMIN_EMAILS="marketing@laurellodging.com,newstaff@laurellodging.com"
```

Redeploy after changing this.

2. **Signed-in staff** opens `/admin` → **Invite staff** → enter the allowlisted email → **Generate invite**.

3. Share the invite code (e.g. `REDZ-AB12-CD34`) securely.

4. New staff opens `/admin` → **Create account** → email + invite code + password → they are signed in.

Invites are stored in `staff_invites` and claimed via the `register_staff_from_invite` database function (no `SUPABASE_SERVICE_ROLE_KEY` required).

### Optional: service-role shortcut

If `SUPABASE_SERVICE_ROLE_KEY` is set on the server, allowlisted emails can also be created without an invite code (Admin API). Prefer invites for auditability.

## Booking pipeline (connected)

| Channel | Source tag in CRM |
|---------|-------------------|
| `/reservations` form | `website` |
| Henry AI concierge | `henry` |
| Staff “New Booking” | `phone` / `admin` |

All channels write to the same `reservations` table. Website + Henry enforce capacity; staff CRM entries can override.
