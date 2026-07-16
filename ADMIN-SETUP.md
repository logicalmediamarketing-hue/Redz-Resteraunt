# Redz CRM admin setup

Staff use `/admin` to manage reservations (website + Henry + phone) and leads.

## Sign in

Existing account: `marketing@laurellodging.com` at `/admin`.

## Create a new staff account (no invite code)

1. Open `/admin` → **Create account**
2. Enter name, allowlisted email, and password (8+ characters)
3. You’re signed in automatically

**Who can create an account**
- Any `@laurellodging.com` email
- Or any email listed in `NEXT_PUBLIC_ADMIN_EMAILS` (after an admin opens the CRM once, or via **Staff access**)

Optional: signed-in staff can use **Staff access** to enable additional emails for signup.

```bash
NEXT_PUBLIC_ADMIN_EMAILS="marketing@laurellodging.com,other@example.com"
```

## Booking pipeline

| Channel | Source tag in CRM |
|---------|-------------------|
| `/reservations` form | `website` |
| Henry AI concierge | `henry` |
| Staff “New Booking” | `phone` / `admin` |
