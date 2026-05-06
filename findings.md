# B.L.A.S.T. Findings

## Discovery
1. **North Star:** High-converting sales and booking engine for Redz.
2. **Integrations:** Vercel AI SDK, Supabase (for CRM/Leads), Vercel Hosting.
3. **Source of Truth:** Supabase (leads & bookings).
4. **Delivery Payload:** UI Chat confirmations, Database entries.
5. **Rules:** Premium, sovereign tone. No broken forms. Henry handles the booking pipeline.

## Constraints
- Resy/OpenTable APIs are often closed/private. We may need to build a custom booking table in Supabase to mock the live integration until we have API access, allowing Henry to function-call against our own Supabase DB.
