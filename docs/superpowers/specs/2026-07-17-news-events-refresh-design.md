# News & Events Refresh Design

## Goal

Update the News & Events page to reflect the GM-approved Happy Hour and private-dining promotions while preserving the existing Thursday Night Special, Redz styling, motion, responsive behavior, and accessibility.

## Content and Layout

- Keep the Thursday Night Special wording, schedule, description, and image unchanged.
- Replace “Spirits After 4” with a Happy Hour card showing “Monday–Friday | 4:00 PM–6:00 PM,” using `/images/original/craft-cocktails.jpg` and an accessible “View Happy Hour Menu” link to `/menus/happy-hour`.
- Remove the complete 28 oz. bone-in rib-eye promotional card.
- Add a full-width “Gather at Redz for Happy Hour” feature below the two compact promotion cards. Use the exact approved body copy without rewriting it.
- Use `/images/original/bar-and-lounge-01.jpg` for the private-dining feature because no new prompt attachment is available in the workspace and this existing image best represents Redz’s intimate bar and gathering atmosphere.
- Include a prominent “Book Your Private Dining Room” link to `/private-dining`.

The full-width private-dining feature will use a responsive split layout: image and copy side by side on larger screens, stacked on smaller screens. This prevents the longer copy from being compressed into the existing equal-height card grid.

## Metadata and Repository Cleanup

- Update News page metadata to reference current Happy Hour and private dining.
- Remove customer-facing instances of the retired “Spirits After 4” and “It’s Back” rib-eye promotions.
- Preserve unrelated rib-eye menu items and customer-review text because they are not the retired promotion.

## Accessibility and Validation

- Use semantic headings and Next.js `Link` elements with descriptive labels.
- Give promotional images concise, contextual alternative text.
- Retain visible focus behavior, sufficient contrast, responsive image sizing, and the existing motion language.
- Run `npm run lint` and `npm run build`, fixing only errors introduced by this change.
