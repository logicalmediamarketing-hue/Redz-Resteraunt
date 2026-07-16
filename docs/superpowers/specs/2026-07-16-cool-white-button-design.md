# Cool-White Public Button Design

## Goal

Replace red public-facing buttons and action links with a clearer, more polished cool-white system while retaining Redz red as a distinctive brand accent.

## Scope

Apply the redesign to public pages and shared public components. Do not restyle the staff admin dashboard. Keep semantic red error and destructive states unchanged.

## Visual System

- Primary actions: crisp cool white (`bg-slate-50`) with charcoal text, a soft white border, subtle shadow, and a brighter white hover state.
- Secondary actions: transparent or lightly frosted white surfaces with restrained white borders and a more visible frosted hover state.
- Quiet text actions: cool gray text that transitions to white on hover.
- Icon controls: cool gray or white icons with subtle white surface feedback.
- Disabled actions: reduced opacity and a disabled cursor.
- Red remains on logos, decorative accents, icons, focus indicators, selection/progress states, and semantic error/destructive controls.

## Interaction and Accessibility

- Preserve existing links, form behavior, loading states, and responsive layouts.
- Maintain strong contrast on charcoal backgrounds.
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
