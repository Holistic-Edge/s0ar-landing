
## Refinement — Even line spacing in mobile headline

One small fix in `src/routes/index.tsx`.

### Problem
The headline currently renders as two `<span class="block">` elements:
- Line 1: `Something Playfully Luxurious` (wraps to 2 visual lines on mobile: "Something *Playfully*" / "*Luxurious*")
- Line 2: `is coming.` (separate block with `mt-2`)

Because the wrap inside line 1 uses the natural `line-height: 0.9` of the `<h1>`, but the gap between line 1 and line 2 is forced by `mt-2` (8px) on top of that line-height, the visual rhythm is uneven on mobile — the wrap inside "Playfully Luxurious" sits tight while "is coming" sits noticeably further down.

### Fix
Collapse the headline into a single text flow so every line break is governed by the same `line-height`, producing perfectly even vertical spacing whether the headline renders as 2 or 3 visual lines.

- Remove the two `<span class="block">` wrappers and the `mt-2`.
- Use one continuous text node: `Something <em>Playfully Luxurious</em> is coming.`
- The `<em>` carries `fontWeight: 500` and `fontStyle: italic` (replacing the inline-styled span, semantically correct).
- Apply the responsive size classes (`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl`) directly on the `<h1>` instead of the inner spans.
- Keep `lineHeight: 0.9`, Cormorant Garamond, weight 300, letter spacing, color, and text shadow exactly as they are.
- Result: on mobile the headline naturally wraps into 3 lines ("Something" / "*Playfully Luxurious*" / "is coming.") with identical gaps between each line. On wider viewports it collapses to 1–2 lines with the same even rhythm.

### Out of scope
No changes to copy, color, font, animation timing, image rotation, or the email capture panel.
