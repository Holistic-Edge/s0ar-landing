
## Refinements — Email capture + headline

Two small tweaks to `src/routes/index.tsx`.

### 1. Solid copper-rose email capture panel
Currently the panel is `bg-black/30 backdrop-blur-md` — translucent, so it still washes out against bright imagery. Make it a deliberate, solid block:

- **Container background**: swap `bg-black/30 backdrop-blur-md` → solid `bg-[#B87261]` (the copper-rose). Drop the backdrop blur (no longer needed).
- **Border**: remove the cream border — the solid color carries the panel on its own.
- **Radius**: add `rounded-2xl` to the panel for a softer, more modern feel.
- **Input**: on the copper-rose ground, switch to `bg-white/20`, border `rgba(249,247,239,0.5)`, placeholder `rgba(249,247,239,0.8)`, add `rounded-lg`. Keep `h-14`.
- **Button**: keep solid cream fill (`bg-[var(--cream)] text-[var(--rizz-bg)]`), add `rounded-lg`. Hover state changes to a darker shade (`hover:bg-[var(--rizz-bg)] hover:text-[var(--cream)]`) since copper-rose hover would clash with the new panel color. Remove the `sm:border-l-0` overlap (panels are now separate rounded shapes, not joined).
- **Form layout**: add `sm:gap-3` so the rounded input and button have breathing room side-by-side.
- **Microcopy**: bump opacity to `rgba(249,247,239,0.9)` for legibility on copper-rose.
- **Confirmation state** ("You're on the list."): same solid copper-rose panel, `rounded-2xl`, cream text — consistent with the form state.

### 2. Headline — remove italic
- Drop the `italic` class from the `<h1>`.
- Keep Cormorant Garamond, weight 300, same scale, same color, same shadow. Roman (upright) reads slightly more confident and modern; the held-breath tone still lands without the slant.

### Out of scope
No changes to logo, image rotation, animations, copy text, or layout structure.
