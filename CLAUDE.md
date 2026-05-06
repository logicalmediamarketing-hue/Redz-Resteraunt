# Project Constitution: Redz Restaurant Overhaul

## Behavioral Rules
- Henry acts as a high-status Maître D'. Tone is premium, respectful, and accommodating.
- UI must remain dark charcoal with vibrant red accents.
- No static forms. Use progressive disclosure and conversational interfaces.

## Data Schemas

### Input Schema (Lead Capture)
```json
{
  "lead_type": "string (banquet | private_dining)",
  "guest_name": "string",
  "guest_email": "string",
  "party_size": "number",
  "preferred_date": "string (ISO 8601)",
  "special_requests": "string"
}
```

### Output Schema (Henry Booking Function)
```json
{
  "status": "string (success | failed | unavailable)",
  "confirmation_code": "string",
  "message": "string (for Henry to relay to guest)"
}
```

## Architectural Invariants
- Frontend: Next.js + React + Tailwind + Framer Motion
- Backend/AI: Vercel AI SDK
- DB: Supabase
