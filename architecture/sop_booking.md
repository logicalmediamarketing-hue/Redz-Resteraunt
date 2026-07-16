# SOP: AI Reservation Function Calling (Henry)

## Goal
Enable Henry (AI Concierge) to check availability and book reservations into the same Supabase CRM used by the website form and staff admin.

## Inputs
- Source: User chat messages via `@ai-sdk/react` (`useChat`)
- Format: Text
- Surfaces: Homepage and `/reservations` (AIConcierge widget)

## Logic
1. Henry identifies intent to book a reservation.
2. Henry gathers: Name, Email, Phone, Date (`yyyy-mm-dd`), Time, Party Size (1–12 online), optional special requests.
3. Henry calls `check_availability` for that date + party size and offers only open slots.
4. After the guest confirms a slot, Henry calls `book_reservation`.
5. The tool uses `createReservation()` in `src/lib/booking.ts` → inserts into `public.reservations` with `source: "henry"`, `status: "pending"`, and sends email/SMS via `sendNotifications`.
6. Henry confirms the **request was received** (staff still confirms in `/admin`).

## Capacity
- Slot capacity is enforced via RPC `day_reservation_covers` + `MAX_COVERS_PER_SLOT` (default 40 covers / 30-min slot).
- Outside breakfast/dinner service hours → rejected.
- Parties larger than 12 → phone / banquets.

## Edge Cases
- **Missing Information:** Ask for the specific missing field.
- **Full slot:** Suggest alternative times from `check_availability`.
- **Database / tool error:** Apologize and give 856-380-6045.

## Output
- Row in `public.reservations` visible in Redz CRM (`/admin`) with source badge **Henry**.
