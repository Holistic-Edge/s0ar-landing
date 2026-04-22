
## Refinements — Teaser Landing Page

Three targeted tweaks to `src/routes/index.tsx` plus asset cleanup.

### 1. Trim image rotation to approved set
- Keep only `Header_3.jpg`, `Header_4.jpg`, `Header_5.jpg`, `Header_8.jpg` in the rotation array
- Remove imports for `Header_1`, `Header_2`, `Header_6`, `Header_7`
- Delete the four removed asset files from `src/assets/`
- Update `og:image` / `twitter:image` from `Header_1` → `Header_5` (the warm sunset hero — strongest social preview)

### 2. Reduce headline scale (~40% smaller)
Current: `text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl` (up to 128px)
New: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl` (up to 72px)

This lets the headline breathe without dominating the frame, and gives the email block more visual weight by comparison.

### 3. Make email capture more prominent
Currently the input nearly disappears against bright imagery. Strengthen it with:

- **Container**: Wrap input + button + microcopy in a subtle frosted panel — `bg-black/30 backdrop-blur-md` with a thin cream border, generous padding (`p-6 sm:p-8`), so the whole capture reads as one deliberate object
- **Input**: Bump background opacity `bg-white/5` → `bg-white/15`, border `rgba(249,247,239,0.3)` → `rgba(249,247,239,0.6)`, taller (`h-12` → `h-14`), placeholder opacity `0.4` → `0.65`
- **Button**: Solid cream fill (`bg-[var(--cream)] text-[var(--rizz-bg)]`) instead of outline-only — high contrast against any background. Hover swaps to copper-rose fill with cream text. Taller (`h-14`) to match input
- **Microcopy**: Increase opacity `0.5` → `0.75` and bump font-size `0.8125rem` → `0.875rem`
- **Max width**: `max-w-md` → `max-w-lg` so the panel has presence
- **Spacing**: Tighten gap between headline and capture (`gap-12 sm:gap-16` → `gap-8 sm:gap-10`) so they read as a connected unit

### Out of scope
No structural/route changes, no copy changes, no logo or animation changes.
