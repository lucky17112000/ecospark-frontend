---
name: IdeaInfiniteSlider Component
description: Live backend data infinite right-to-left slider used on the landing page, powered by getLimitedIdea()
type: project
---

`src/components/shared/IdeaInfiniteSlider.tsx` renders a continuous right-to-left card slider.

**Why:** User requested live backend data displayed as a visually appealing infinite scroll on the landing page.

**How to apply:** Import and use wherever live idea data should be shown as a slider.

## Usage
```tsx
import { IdeaInfiniteSlider } from "@/components/shared/IdeaInfiniteSlider";

<IdeaInfiniteSlider
  ideas={liveIdeas}       // IIdeaResponse[] from getLimitedIdea()
  isLoading={isLoading}   // shows skeleton while loading
  className="px-4"
/>
```

## How it works
- Duplicates idea array (`[...ideas, ...ideas]`) for seamless loop
- CSS animation: `eco-idea-slide` keyframe moves track from `translateX(0)` to `translateX(-50%)` over 35s
- Hover pauses animation via `animation-play-state: paused` on `.eco-idea-slider-track:hover`
- Edge fade via `.eco-idea-slider` mask-image gradient
- Shows `SliderSkeleton` (5 placeholder cards) while `isLoading` is true

## Placement in LandingPage
Section 7 — "Live from the community" — between Categories (section 6) and Community Highlights (section 8).
Data comes from `useQuery({ queryKey: ["ideaLimit"], queryFn: getLimitedIdea })`.

## Card design (`IdeaSlideCard`)
- Fixed width: `w-68`, image height `h-40`
- Hover: `-translate-y-1.5`, `border-emerald-200`, `shadow-xl`
- Image: `scale-[1.06]` on group hover
- Gradient overlay fades in on hover
- Footer: author initial avatar + name, upvote/downvote counts
