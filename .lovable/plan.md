
## Refinements — Headline emphasis + glassmorphic capture

Two tweaks to `src/routes/index.tsx`.

### 1. Restructure headline with mixed emphasis
Currently both lines render as one block: *"Something Playfully Luxurious / is coming."* — uniform weight, no italic.

Restructure to three parts across two lines so emphasis lands on the brand promise:

- **Line 1**: `Something ` (regular, weight 300) + `Playfully Luxurious` (bold + italic, weight 600, `italic`)
- **Line 2**: `is coming.` (regular, weight 300)

Both lines stay in Cormorant Garamond, same color, same shadow.

**Size bump (~15% larger):**
- Current: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`
- New: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`

This gives "Playfully Luxurious" room to breathe as the visual anchor while "Something" and "is coming." recede into supporting roles.

### 2. Subtle glassmorphic email capture
Currently the panel is solid `bg-[#B87261]` — strong, but reads a touch flat. Soften it into a glass object without losing its presence:

- **Background**: `bg-[#B87261]` → `bg-[#B87261]/85` (15% transparency lets imagery whisper through)
- **Add**: `backdrop-blur-md` so anything behind the panel diffuses softly
- **Add**: thin highlight border `border border-white/20` for the glass edge
- **Add**: `shadow-2xl shadow-black/20` for depth lift off the imagery
- Apply identical treatment to the "You're on the list." confirmation panel so both states match.

Input, button, microcopy, radius, and layout all stay as-is — only the panel surface changes.

### Out of scope
No changes to image rotation, logo, animations, copy text, or layout structure.
