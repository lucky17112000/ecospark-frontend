---
name: EcoSpark Design System
description: Card patterns, animation classes, section templates, and color system used across all EcoSpark pages
type: project
---

EcoSpark uses a unified emerald design system across all public pages.

**Why:** Consistency was broken — ContactPage and MissionPage used `green-xxx` Tailwind classes while all other pages used `emerald-xxx`. Standardized in May 2025.

**How to apply:** All new components must follow these patterns.

## Card Pattern
```
rounded-2xl border bg-card p-6
transition-all duration-300
hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg
dark:hover:border-emerald-800
```
Add `group` to the card div to enable icon transitions.

## Icon Container (inside card)
```
inline-flex size-11 items-center justify-center rounded-xl
bg-emerald-100 text-emerald-600
transition-all duration-300
group-hover:bg-emerald-600 group-hover:text-white
dark:bg-emerald-900/40 dark:text-emerald-400
```

## Section Badge + Heading Pattern
```tsx
<Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
  Section label
</Badge>
<h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
  Title
</h2>
<p className="mt-4 text-muted-foreground">Subtitle</p>
```

## CTA Section Template
```tsx
<section className="border-t">
  <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-700 py-20 sm:py-28">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />
    </div>
    {/* Icon, h2, p, buttons */}
  </div>
</section>
```
CTA buttons: primary = `bg-white text-emerald-700 hover:bg-emerald-50`, secondary = `border-white/40 text-white hover:bg-white/10 hover:text-white`

## Hero Background Orbs
```tsx
<div className="pointer-events-none absolute inset-0 select-none">
  <div className="absolute -top-40 -right-32 size-96 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20" />
  <div className="absolute bottom-0 -left-24 size-80 rounded-full bg-teal-50/80 blur-2xl dark:bg-teal-900/10" />
</div>
```

## Primary Action Button
```
bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700
```

## Animation Classes (defined in globals.css)
- `animate-eco-float` — gentle vertical float, 6s ease-in-out (hero cards)
- `eco-marquee` + `eco-marquee-track` — infinite LTR scroll, 18s (trending topics)
- `eco-idea-slider` + `eco-idea-slider-track` — infinite RTL scroll, 35s, pauses on hover (live ideas)
- `animate-eco-fade-up` — entrance: opacity 0→1 + translateY 22px→0, 0.65s spring easing
- `animate-eco-fade-in` — entrance: opacity 0→1, 0.5s ease
- `animate-delay-100/200/300/400/500/600` — stagger delay utilities (combine with fade-up/fade-in)

## Entrance Animation Usage Pattern
Apply to hero section children with staggered delays:
```tsx
<div className="animate-eco-fade-up animate-delay-100">{/* badges */}</div>
<h1 className="animate-eco-fade-up animate-delay-200">...</h1>
<p className="animate-eco-fade-up animate-delay-300">...</p>
<div className="animate-eco-fade-up animate-delay-400">{/* buttons */}</div>
<div className="animate-eco-fade-up animate-delay-500">{/* social proof */}</div>
{/* Right side panel: */}
<div className="animate-eco-fade-in animate-delay-400">...</div>
```
All animations respect `prefers-reduced-motion` (disabled when set).

## Container Width
- Public pages: `max-w-7xl`
- Narrow content (FAQ, forms): `max-w-2xl` or `max-w-4xl`
- Section padding: `py-20 sm:py-24`

## Colors (semantic — never use raw green-xxx)
- Primary action: `emerald-600` / hover `emerald-700`
- Accent on dark: `emerald-400`
- Card bg: `bg-card` (semantic token)
- Muted text: `text-muted-foreground`
- Badge: `border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400`
