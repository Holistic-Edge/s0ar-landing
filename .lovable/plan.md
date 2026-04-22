
## Refinement — Soften "Playfully Luxurious" weight

One small tweak to `src/routes/index.tsx`.

### Change
"Playfully Luxurious" is currently rendered at `fontWeight: 600` (semibold), which reads as too heavy/blocky against the delicate Cormorant Garamond at weight 300 used for the surrounding words.

Drop it to `fontWeight: 500` (medium). This keeps a clear hierarchical lift over the 300-weight "Something" and "is coming." without the chunky, over-emphasized feel of full semibold/bold. Italic stays on — the slant carries the emphasis; the weight just provides a gentle assist.

- Before: `fontWeight: 600, fontStyle: "italic"`
- After: `fontWeight: 500, fontStyle: "italic"`

No other changes — size, color, font family, shadow, line height, and layout all stay exactly as they are.

### Out of scope
No changes to the rest of the headline, email capture, imagery, or layout.
