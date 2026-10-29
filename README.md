# S0AR Ocean Club - Pre-Registration Page

@project:16159b82-9595-4181-a274-1427011ff68e:"Rizz Manta Ray Ocean Club" RIZZ Manta Ray — Teaser Landing Page

Context & Import

Reference the existing Hero section from the current RIZZ Manta Ray project in this workspace. We're repurposing it as a standalone teaser landing page that will live at the production URL until the full website is ready to launch.

Treat this as a new page: / (root) should render this teaser as the entire page — no additional sections below, no footer, no other content. Full viewport, edge-to-edge.

What to Keep (exactly as-is)

•	The RIZZ manta ray logo, centered at the top of the hero

•	The serif typography treatment for the headline (Cormorant Garamond italic, the same scale and elegance)

•	The scrolling / cross-fading background image rotation (cinematic transitions, slow, ambient)

•	The warm cinematic overlay/grading over the imagery

•	The SCROLL indicator at the bottom — remove this, actually, since there is nothing below to scroll to. Replace with subtle ambient motion only.

What to Remove

1.	The top navigation entirely — no Experience / Packages / Menu / Music & Events / How It Works links. The logo stays centered and alone.

2.	The BOOK NOW button in the top-right.

3.	The two central CTA buttons (CHECK AVAILABILITY and EXPLORE EXPERIENCES).

4.	Any background images that show the full floating ocean club structure. This is critical. We are deliberately concealing the ocean club reveal. Audit every image in the rotation: 

o	❌ Remove: exterior shots of the club from water level, aerial/drone shots of the structure, any angle showing the floating platform silhouette, any shot where the ocean/water surrounding the club is the dominant context

o	✅ Keep: tight interior lifestyle moments, close-ups of guests, pool deck details that could read as any high-end resort, bar interiors, texture/material shots, golden-hour intimate moments, details of the Art Deco interior

If unsure whether an image reveals the floating club, err on the side of removal. We want the viewer to feel something luxurious and aspirational is coming — without giving away what it actually is.

What to Add

Replace the central CTA button area with an email subscription capture block. This is a non-functional UI mockup only — do not wire up any backend, form submission, or database. The 7Rooms email integration will be connected after the first design review.

Email capture design:

•	Sits in the same vertical position as the original CTA buttons, centered

•	Thin single-line input field with a subtle glassmorphic or frosted treatment so the background imagery still bleeds through

•	Placeholder text: "Enter your email for early access"

•	Inline submit button to the right of the input (or directly below on mobile), label: NOTIFY ME — styled to match the original CTA button treatment (thin outlined border, letter-spaced uppercase, copper rose hover state)

•	Small supporting microcopy beneath the input in the lighter body weight: "Be the first to know when we open."

•	The submit button should have hover states and click feedback, but on submit it should simply show a confirmation message in-place ("You're on the list.") — no network calls, no validation beyond a basic email format check for visual feedback.

Headline Copy

Replace "Playfully Luxurious Escapes" with:

Something Playfully Luxurious

is coming.

Same typographic treatment as the original — Cormorant Garamond italic, two-line break, centered, same scale. The period at the end is intentional — it anchors the tease.

Optionally, a small pre-headline above it in Work Sans, letter-spaced uppercase, much smaller: RIZZ MANTA RAY — PATTAYA — but keep it subtle, almost a whisper.

Tone & Feel

This page should feel like a held breath. Less is more. The viewer should feel curiosity, not urgency. The email capture is an invitation, not a conversion funnel.

Technical Notes

•	Maintain the existing project's design tokens (cream, copper rose, warm minimalism)

•	Responsive down to mobile — email input stacks above button on small screens

•	Keep the page lightweight — this is a single-purpose landing page

•	No analytics, no tracking pixels, no form backends — pure aesthetic mockup

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://s0ar-landing.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf90bf79-f94e-4909-ac4b-e13d9af628e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
