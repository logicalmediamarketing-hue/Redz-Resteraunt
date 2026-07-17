# News & Events Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the retired News & Events promotions with current Happy Hour and private-dining content while preserving the Thursday special and Redz presentation.

**Architecture:** Keep the route as a client-rendered Next.js App Router page because it already uses Framer Motion. Render two compact promotion cards from static data, then render the longer private-dining promotion as a dedicated responsive split feature. Keep route metadata in the existing News layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, `next/image`, and `next/link`.

## Global Constraints

- Keep the Thursday Night Special wording, schedule, description, and image unchanged.
- Use the exact approved private-dining title and body copy.
- Happy Hour schedule must read `Monday–Friday | 4:00 PM–6:00 PM`.
- Happy Hour CTA must link to `/menus/happy-hour` and read `View Happy Hour Menu`.
- Private-dining CTA must link to `/private-dining` and read `Book Your Private Dining Room`.
- Preserve the existing visual style, motion language, responsive behavior, and accessibility.
- Do not alter unrelated rib-eye menu items or customer reviews.
- Do not create a git commit unless the user explicitly requests one.

---

### Task 1: Refresh News Promotions and Responsive Layout

**Files:**
- Modify: `src/app/news/page.tsx:3-93`

**Interfaces:**
- Consumes: existing `Navbar`, `Footer`, Framer Motion, and public image assets.
- Produces: customer-facing links to `/menus/happy-hour` and `/private-dining`.

- [ ] **Step 1: Verify the retired promotion text currently exists**

Run:

```bash
rg -n "Spirits After 4|It.s Back.*28 oz|Bone-in-Rib Eye" src/app/news/page.tsx
```

Expected: matches for both retired promotions.

- [ ] **Step 2: Add `Link` and reduce the compact promotion data to Thursday and Happy Hour**

Add the import:

```tsx
import Link from "next/link";
```

Replace `specials` with:

```tsx
const specials = [
  {
    title: "Thursday Night Special",
    time: "Every Thursday | 4:00pm - Close",
    desc: "Bartender's Choice: $15.00 bottle of wine! Discount available at bar only.",
    img: "/images/original/thursday_wine_special.jpg",
    imageAlt: "Wine bottles featured for the Thursday Night Special",
  },
  {
    title: "Happy Hour",
    time: "Monday–Friday | 4:00 PM–6:00 PM",
    desc: "Join us for Happy Hour with discounted drinks and appetizers at the bar.",
    img: "/images/original/craft-cocktails.jpg",
    imageAlt: "Handcrafted cocktail served at the Redz bar",
    href: "/menus/happy-hour",
    cta: "View Happy Hour Menu",
  },
];
```

- [ ] **Step 3: Render the two compact promotions with stable keys and the Happy Hour CTA**

Change the card grid to two columns at medium widths:

```tsx
<div className="grid md:grid-cols-2 gap-8">
```

Use `special.title` as the key, use `special.imageAlt` for the image, and add this after the description:

```tsx
{special.href && special.cta ? (
  <Link
    href={special.href}
    className="mt-6 inline-flex items-center justify-center rounded bg-gradient-to-b from-white to-slate-100 px-6 py-3 font-bold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-white hover:to-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
  >
    {special.cta}
  </Link>
) : null}
```

Make the content wrapper a column so the CTA remains aligned below the description:

```tsx
<div className="p-8 flex flex-1 flex-col">
```

- [ ] **Step 4: Add the full-width private-dining feature beneath the card grid**

Insert this after the two-card grid and before the section closes:

```tsx
<motion.article
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ delay: 0.1 }}
  className="mt-12 overflow-hidden rounded-2xl border border-white/5 bg-redz-charcoal-light lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
>
  <div className="relative min-h-72 lg:min-h-full">
    <Image
      src="/images/original/bar-and-lounge-01.jpg"
      alt="The warm bar and lounge at Redz Restaurant"
      fill
      sizes="(min-width: 1024px) 45vw, 100vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal-light/70 to-transparent lg:bg-gradient-to-r" />
  </div>

  <div className="p-8 sm:p-10 lg:p-12">
    <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-300">
      Happy Hour &amp; Private Dining
    </p>
    <h2 className="mb-6 text-3xl font-serif text-redz-accent sm:text-4xl">
      Gather at Redz for Happy Hour
    </h2>
    <div className="space-y-5 text-gray-300 leading-relaxed">
      <p>
        Looking for the perfect setting for a small gathering, team outing, birthday toast, or casual celebration? Redz Restaurant &amp; Bar offers a warm, inviting atmosphere, great food, handcrafted cocktails, and a private dining room that is ideal for bringing people together.
      </p>
      <p>
        Join us for Happy Hour Monday through Friday from 4 PM to 6 PM and enjoy a relaxed setting with shareable bites, cold drinks, and the kind of hospitality that makes every gathering feel easy.
      </p>
      <p>
        Our private dining room is available for small groups looking for a more comfortable and personal space to connect, celebrate, or unwind.
      </p>
      <p>
        Book your private dining room today and make your next gathering a Redz gathering.
      </p>
    </div>
    <Link
      href="/private-dining"
      className="mt-8 inline-flex items-center justify-center rounded bg-gradient-to-b from-white to-slate-100 px-7 py-4 font-bold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-white hover:to-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      Book Your Private Dining Room
    </Link>
  </div>
</motion.article>
```

- [ ] **Step 5: Verify the page source contains the required content and no retired promotion**

Run:

```bash
rg -n "Thursday Night Special|Happy Hour|View Happy Hour Menu|Gather at Redz for Happy Hour|Book Your Private Dining Room|Spirits After 4|It.s Back.*28 oz|Bone-in-Rib Eye" src/app/news/page.tsx
```

Expected: required current promotions and CTAs match; no retired promotion matches.

### Task 2: Update News Metadata and Check Customer-Facing References

**Files:**
- Modify: `src/app/news/layout.tsx:3-6`

**Interfaces:**
- Consumes: Next.js `Metadata`.
- Produces: updated title and description for the `/news` route.

- [ ] **Step 1: Replace the stale metadata**

Use:

```tsx
export const metadata: Metadata = {
  title: "News, Happy Hour & Private Dining",
  description:
    "Discover Happy Hour, private dining, events, and current specials at Redz Restaurant in Mt Laurel, NJ.",
};
```

- [ ] **Step 2: Search all customer-facing source files for retired promotion references**

Run:

```bash
rg -n -i "Spirits After 4|It.s Back.*28 oz|28 oz\\. Bone-in-Rib Eye|bone-in-rib-eye" src public
```

Expected: no customer-facing source references remain. A now-unused image file may still exist under `public`; source code must not render it.

- [ ] **Step 3: Confirm unrelated rib-eye content remains untouched**

Run:

```bash
rg -n -i "ribeye|rib-eye" src/app/menus src/components/GoogleReviews.tsx
```

Expected: the dinner menu item and customer review still exist.

### Task 3: Validate the Change

**Files:**
- Verify: `src/app/news/page.tsx`
- Verify: `src/app/news/layout.tsx`

**Interfaces:**
- Consumes: project ESLint and Next.js build configuration.
- Produces: lint-clean, production-buildable News route.

- [ ] **Step 1: Check IDE diagnostics on both edited files**

Expected: no new TypeScript, JSX, accessibility, or import diagnostics.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0. Fix only errors caused by this implementation.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 and `/news` appears among the generated routes.

- [ ] **Step 4: Review the final diff without disturbing unrelated work**

Run:

```bash
git diff -- src/app/news/page.tsx src/app/news/layout.tsx docs/superpowers/specs/2026-07-17-news-events-refresh-design.md docs/superpowers/plans/2026-07-17-news-events-refresh.md
```

Expected: only the approved News page, metadata, design spec, and plan changes appear.
