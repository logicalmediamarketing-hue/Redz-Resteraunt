# SOP: Banquet Lead Capture Funnel

## Goal
Capture high-ticket leads for Banquets and Private Dining through a premium, multi-step form and store them in the CRM (Supabase).

## Inputs
- Source: Frontend UI (`/banquets` or `/private-dining` page)
- Format: JSON payload from React form

## Logic
1. User clicks "Inquire About Banquets".
2. A Framer Motion powered modal or multi-step form appears.
3. Steps: Event Type -> Date/Guest Count -> Contact Info -> Special Requests.
4. On submit, insert row into `public.leads` table in Supabase.
5. Trigger webhook (optional) to notify restaurant management.

## Edge Cases
- **Database Offline:** Show a fallback message requesting they call the restaurant.
- **Invalid Email/Phone:** Form validation using Zod before submission.

## Output
- Shape: Row inserted into `public.leads`
- Destination: Supabase DB
