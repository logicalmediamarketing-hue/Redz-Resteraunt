# Cool-White Public Button Design

## Goal

Replace red public-facing buttons and action links with a polished glassmorphic-white system while retaining Redz red as a distinctive brand accent.

## Scope

Apply the redesign to public pages and shared public components. Do not restyle the staff admin dashboard. Keep semantic red error and destructive states unchanged.

## Visual System

- Primary actions: balanced frosted-white glass with a translucent white surface, white text, `backdrop-blur-xl`, a luminous border, an inset top highlight, and a soft white outer glow.
- Primary hover state: slightly brighter glass, a stronger border, and a gently elevated glow without becoming opaque.
- Secondary actions: quieter transparent glass with restrained white borders, white text, moderate blur, and a more visible frosted hover state.
- Circular concierge controls use the same balanced primary-glass treatment.
- Quiet text actions: cool gray text that transitions to white on hover.
- Icon controls: cool gray or white icons with subtle white surface feedback.
- Disabled actions: reduced opacity and a disabled cursor.
- Red remains on logos, decorative accents, icons, focus indicators, selection/progress states, and semantic error/destructive controls.

## Interaction and Accessibility

- Preserve existing links, form behavior, loading states, and responsive layouts.
- Maintain strong contrast on charcoal backgrounds.
- Keep text white on glass surfaces so labels remain legible over photography and dark panels.
- Keep hover and focus feedback visible without adding distracting animation.
- Preserve button hierarchy so primary actions remain more prominent than secondary actions.

## Affected Areas

- Header navigation and Book Now controls
- Homepage hero and event calls to action
- Menu cards and menu return links
- Reservation, private-dining, banquet, and contact actions
- Google Reviews, footer, and concierge controls

## Verification

- Run lint and production build.
- Confirm no public red button treatments remain except intentional brand, state, and semantic uses.
- Deploy to Vercel production and verify the live homepage uses the new treatment.
