
## RIZZ Manta Ray — Teaser Landing Page

A single, full-viewport teaser at `/` that reuses the cinematic Hero treatment from the source project, strips it down to a held-breath moment, and replaces the CTAs with an email capture (UI-only).

### Brand & assets to import
From the source project (`Rizz Manta Ray Ocean Club`):
- **Logo:** `RIZZ_Manta_Ray_logo-02.png` (light/cream version for dark imagery)
- **Hero rotation:** `Header_1.jpg` through `Header_8.jpg` — all 8 copied; you'll flag any to delete after seeing the preview
- **Fonts:** Cormorant Garamond (italic display), Work Sans (body & button), IBM Plex Mono (micro labels) — loaded via Google Fonts in `__root.tsx`
- **Tokens added to `src/styles.css`:**
  - `--cream` `#F9F7EF`
  - `--copper-rose` `#B87463`
  - `--rose-gold` `#DAA28F`
  - Page background `#1a1510` (warm dark fallback behind imagery)

### Page structure (`src/routes/index.tsx`)
Full-viewport `h-screen` section, edge-to-edge, no scroll target, no footer.

**Layered, top to bottom:**

1. **Image stack** — All 8 Header images rendered persistently; cross-fade with subtle blur every 5s using Framer Motion (1.4s ease-in-out), exactly matching the source. Decode-aware preloading so rotation only starts once every image is fully decoded.
2. **Cinematic overlay** — Warm vertical gradient `from-black/60 via-black/40 to-black/70` for the film-grade feel.
3. **Centered logo** — RIZZ Manta Ray mark, top of the viewport (~8vh from top), modest width (~140–180px), no nav, no booking button — alone.
4. **Centered headline block** — vertically centered:
   > *Something Playfully Luxurious*  
   > *is coming.*
   
   Cormorant Garamond italic, light weight, two-line break, same scale ramp as source (`text-4xl sm:text-5xl md:text-7xl lg:text-9xl`), tight `line-height: 0.85`, cream color, gentle fade-up on mount.
5. **Email capture** (in the same vertical slot the original CTAs occupied):
   - Single thin frosted/glassmorphic input: `bg-white/5 backdrop-blur-md border border-cream/30`, rounded-none to match the brand's sharp edges, `placeholder:text-cream/40`
   - Placeholder: *"Enter your email for early access"*
   - Inline button to the right (stacks below on mobile): **NOTIFY ME** — styled with `.btn-rizz-light` treatment (uppercase, `tracking-[0.15em]`, thin cream border), copper-rose hover (`hover:border-[--copper-rose] hover:text-[--copper-rose]`)
   - Microcopy below in Work Sans light, cream/50: *"Be the first to know when we open."*
   - On submit: basic regex email check; if valid, swap input+button for an in-place fade message *"You're on the list."* in cream italic display font. No network, no storage.
6. **Ambient motion (replaces SCROLL indicator)** — a single thin vertical line (`w-px h-12 bg-cream/20`) at bottom-center with a slow opacity pulse (3s ease-in-out infinite). No label, no chevron.

### Behavior & polish
- Logo, headline, and email block fade up in sequence on mount (delays 0.2s / 0.4s / 1.0s).
- Email input focus ring uses copper-rose at low opacity.
- Mobile: input and button stack vertically with `gap-3`; max-width `max-w-md` mx-auto on desktop.
- No analytics, tracking, form backend, or external requests beyond image/font loading.

### Routing & SEO
- Route: `/` only (`src/routes/index.tsx`)
- `head()` meta:
  - title: *"RIZZ Manta Ray — Coming Soon"*
  - description: *"Something playfully luxurious is coming to Pattaya. Sign up for early access."*
  - matching `og:title`, `og:description`
  - `og:image` set to `Header_1.jpg` (you can swap after the audit)
- Existing 404 / error boundaries in `__root.tsx` and `router.tsx` left untouched.

### Out of scope (per brief)
No nav, no booking, no other routes, no footer, no real form backend, no analytics. The 7Rooms integration is a later step.

### After preview
Once it's live, tell me which `Header_*.jpg` files reveal the floating club / aerial / water context and I'll remove them from the rotation array and delete the assets.
