# Context Prebuild: Manarat Robotics Club - Scrollytelling Landing Page

## Objective
Design and implement a hyper-premium, Apple-level, cinematic scrollytelling landing page for the Manarat Robotics Club. The page serves as a product reveal and engineering showcase, driven by scroll-linked image sequence animation and premium typography/layout.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (utility-first, tight spacing)
- **Animation:** Framer Motion (scroll-linked, easing, transitions)
- **Rendering:** HTML5 Canvas (image sequence playback)

## Visual Direction & Brand Aesthetic
- **Vibe:** Cinematic, ultra-clean, minimal, luxury tech, Apple/Sony-style corporate.
- **Colors:**
  - Background: Deep charcoal `#050505` (must match image sequence background for seamless blending).
  - Secondary Background: `#0A0A0C`
  - Headings: `text-white/90` with subtle glows.
  - Body text: `text-white/60`
  - Accents: Deep Blue `#0050FF`, Electric Cyan `#00D6FF`
- **Typography:** Inter or SF Pro Display/Text. Ultra-clean, tight tracking, strong hierarchy.

## Core Interaction
- **Scroll-Linked Image Sequence:**
  - A sticky canvas spanning ~400vh.
  - Plays an image sequence of an LFR (Line Following Robot) disassembling into a floating technical diagram, then reassembling.
  - Images mapped dynamically to scroll progress to ensure buttery smooth performance.

## Storytelling Beats
1. **0–15% Hero / Intro:** Fully assembled hero beauty shot. Large headline "Manarat Robotics Club", "Build. Engineer. Innovate."
2. **15–40% Engineering Reveal:** Robot subtly separates. Copy left-aligned: "Built by students. Engineered to perform."
3. **40–65% Precision & Intelligence:** Components spread further. Highlight sensor array. Copy right-aligned: "Precision meets intelligence."
4. **65–85% Engineering & Performance:** Exploded view with soft highlights. Copy left/centered: "Engineering, made tangible."
5. **85–100% Reassembly & CTA:** Components glide back into place. Copy centered: "Build what comes next.", with CTA buttons.

## Implementation Details (Completed)
- **Next.js Initialization:** Created Next.js 14 App directory structure using `create-next-app`, inside a temporary folder and then moved to root due to naming constraints (`mrc web`).
- **Styles:** Configured Tailwind v4 with the deep charcoal background `#050505` in `globals.css`. Configured `Inter` font in `layout.tsx`.
- **Frames:** Upgraded to 240 high-definition frames at 30 fps in `/public/frames`. Format is `ezgif-frame-001.jpg` through `ezgif-frame-240.jpg`.
- **Components:**
  - `Preloader.tsx`: Mature, editorial full-screen preloader (Swiss/Apple design language) eliminating generic clichés (pulsing badges/glows). Features architectural framing with "Manarat Robotics Club" / "Engineering & Design" header, quiet centered typography ("Manarat Robotics" and spaced "MRC"), a 3-digit tabular index counter (`000 / 100`), and a crisp 1px hairline progress rule.
  - `Navbar.tsx`: Sticky transparent-to-blur navigation with `framer-motion` `useMotionValueEvent` listening to `scrollY`.
  - `CanvasSequence.tsx`: Client-side component that takes a Framer Motion `MotionValue<number>` representing scroll progress. Configured for 240 frames (30 fps sequence). It preloads 240 images and reports percentage load progress and completion callbacks. It draws to the canvas using `requestAnimationFrame` for buttery smoothness.
  - `Scrollytelling.tsx`: Container component with `500vh` height. Uses `framer-motion`'s `useScroll` and `useTransform` to map scroll progress to text overlays (opacities, transforms) aligning with the storytelling beats.
  - `PreferencesMenu.tsx`: Fixed bottom-left floating menu with glassmorphism popover. Features an Apple-style toggle switch for "Flowy Smooth Scroll" that turns Lenis inertia physics on or off dynamically.
  - `CustomScrollbar.tsx`: Custom minimal, thin floating scroll indicator replacing the clunky default browser scrollbars. Hidden when idle, smoothly reveals with a gradient glow (`#00D6FF`) along a razor-thin hairline track when actively scrolling.
  - `page.tsx`: Manages loading gate (`isLoading`), holding the underlying page transparent and un-interactable until assets fully load, followed by a cinematic crossfade into the landing page. Initializes Lenis smooth scrolling instance with pronounced mouse-wheel inertia (`duration: 1.8s`, `wheelMultiplier: 1.2`, heavy exponential deceleration easing). Unlocked root viewport constraints from `html/body` to ensure mouse wheel delta events intercept cleanly across physical notched wheels.
- **Database & Cloud Storage (Supabase):**
  - Integrated `@supabase/supabase-js` into `src/lib/supabase.ts` connected to project `rcigwuihxbgxjmqoygtl`.
  - Upgraded `src/lib/db.ts` to query live PostgreSQL tables (`events`, `registrations`, `waitlist`, `announcements`, `projects`, `users`) with zero-downtime memory fallbacks.
  - Created `supabase_schema.sql` ready to run in the Supabase SQL Editor.

## File Map
- `src/lib/supabase.ts` - Supabase client setup (Anon & Service Role).
- `src/lib/db.ts` - Cloud database service layer querying Supabase tables.
- `supabase_schema.sql` - Ready-to-run PostgreSQL schema script for Supabase.
- `src/app/page.tsx` - Main layout for landing page with Lenis smooth scroll provider.
- `src/components/CustomScrollbar.tsx` - Thin aesthetic floating scroll indicator.
- `src/components/PreferencesMenu.tsx` - Floating bottom-left preferences widget with smooth scroll toggle.
- `src/components/Preloader.tsx` - Minimalist luxury preloader with animated branding and progress bar.
- `src/components/Scrollytelling.tsx` - Scroll logic and overlays.
- `src/components/CanvasSequence.tsx` - HTML5 Canvas drawing image sequence with loading hooks.
- `src/components/Navbar.tsx` - Sticky premium navigation.
- `public/frames/` - 240 JPG frames (30 fps) for the LFR animation.

## Next Steps for other agents
- Evaluate the build output for any typescript or linting errors.
- Run the dev server to test performance.
- Fine-tune opacity and transform ranges in `Scrollytelling.tsx` if the timing feels slightly off relative to the exact frames of the animation.
- Add additional pages or sub-routes if the user requires them (e.g., Overview, Technology).
