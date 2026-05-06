# SOP: AI Reservation Function Calling (Henry 2.0)

## Goal
Enable the AI Concierge (Henry) to autonomously check availability and book reservations directly into the Supabase database.

## Inputs
- Source: User chat messages via `@ai-sdk/react` (`useChat`)
- Format: Text

## Logic
1. Henry identifies intent to book a reservation.
2. Henry requests missing parameters sequentially (Name, Email, Phone, Date, Time, Party Size).
3. Once all parameters are collected, Henry executes the `book_reservation` tool function.
4. The tool function calls `supabase.from('reservations').insert()`.
5. The tool returns success/failure to Henry.
6. Henry relays the confirmation status to the user in a high-status tone.

## Edge Cases
- **Missing Information:** Henry must politely ask for the specific missing details.
- **Database Error:** Henry should apologize gracefully and provide the phone number (856-380-6045).

## Output
- Shape: Row inserted into `public.reservations`
- Destination: Supabase DB
