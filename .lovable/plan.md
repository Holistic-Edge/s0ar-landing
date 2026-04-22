
## Refinement — Compact the email capture panel

One focused pass on `src/routes/index.tsx` to slim the form down so it stops dominating the viewport and gives the headline room to breathe.

### Size reductions

**Panel container**
- Max width: `max-w-lg` → `max-w-md` (narrower footprint)
- Padding: `p-6 sm:p-8` → `p-5 sm:p-6` (less internal bulk)
- Radius: `rounded-2xl` stays (matches brand softness)

**Inputs & select**
- Height: `h-14` → `h-11` across name, country code, phone, and email
- Country code select width: `w-28` → `w-24`
- Keep `rounded-lg`, cream text, glass background

**Button (Notify Me)**
- Height: `h-14` → `h-11`
- Keeps full width, cream fill, dark hover, tracked uppercase label

**Vertical rhythm**
- Form gap between rows: `gap-3` → `gap-2.5`
- Microcopy top margin: `mt-4` → `mt-3`
- Microcopy size: `0.875rem` → `0.8125rem` (slightly tighter supporting line)

**Headline ↔ panel spacing**
- Container gap: `gap-8 sm:gap-10` → `gap-6 sm:gap-8` so the two blocks read as one unit at the new compact size

### Confirmation panel parity
The "You're on the list." success state mirrors the same panel reductions (`max-w-md`, `p-5 sm:p-6`) so the swap doesn't cause a layout jump.

### Quiet runtime fix
While in the file, address the `ReferenceError: error is not defined` flagged in runtime errors (likely a stray reference left from an earlier edit) so the console stays clean.

### Out of scope
No changes to imagery, logo, headline copy/structure, animations, color palette, glassmorphic treatment, or validation logic.
