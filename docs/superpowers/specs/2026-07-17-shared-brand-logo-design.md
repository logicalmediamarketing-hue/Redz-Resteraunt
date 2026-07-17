# Shared Brand Logo Design

## Goal

Make the footer Redz logo exactly match the top-left navigation logo.

## Design

- Create one shared `BrandLogo` component used by both the navigation and footer.
- Use `/images/original/logo-mark-hires.png` at a 150px rendered width.
- Render “Inspired American Fare” as separate white uppercase text with the same size, tracking, spacing, and drop shadow in both locations.
- Link both logo instances to the homepage and use the same accessible label.
- Remove the footer’s use of the outdated `/images/original/logo-v2.png` asset.

## Constraints

- Preserve surrounding navigation and footer layout, spacing, links, and behavior.
- Do not change the logo artwork or tagline copy.
- Add no dependencies.

## Verification

- Run scoped lint and the production build.
- Confirm both rendered logo instances reference the same component and high-resolution artwork.
- Deploy to Vercel production and verify the live footer and header markup match.
