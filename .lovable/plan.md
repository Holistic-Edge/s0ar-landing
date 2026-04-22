
## Refinement — Expand capture form to Name, Phone, Email

Add two new fields to the email capture form in `src/routes/index.tsx`. UI-only — no backend wiring (matches the existing email-only behavior).

### New form structure
Stack three inputs vertically inside the existing copper-rose glassmorphic panel, with the **Notify Me** button below as a full-width action:

```
┌─────────────────────────────────┐
│  [ Name                       ] │
│  [ 🇹🇭 +66 ▾ ][ Phone number  ] │
│  [ Email                      ] │
│  [        NOTIFY ME           ] │
│  Be the first to know...        │
└─────────────────────────────────┘
```

The previous side-by-side input+button layout is dropped — with three fields it no longer fits cleanly, especially at the current 390px mobile viewport.

### Fields
1. **Name** — `<input type="text">`, required, `maxLength={100}`, placeholder "Your name"
2. **Phone** — split into two controls in one row:
   - **Country code**: `<select>` with a curated list of common codes (TH +66, US +1, GB +44, AU +61, SG +65, MY +60, JP +81, CN +86, IN +91, AE +971, DE +49, FR +33). Default to `+66` (Thailand, since RIZZ Manta Ray is in Pattaya). Fixed width (~`w-28`).
   - **Phone number**: `<input type="tel" inputMode="numeric">`, required, `maxLength={20}`, placeholder "Phone number", flex-1.
3. **Email** — existing input, unchanged validation.

### Validation (client-side, zod-style inline checks)
- Name: trimmed, non-empty, ≤100 chars
- Phone: trimmed, digits/spaces/dashes only, 6–20 chars after stripping non-digits
- Email: existing regex check

On submit, validate all three. If any fail, set field-level error state (red border via `var(--rizz-bg)`, matching the existing email error pattern). On success, show the same "You're on the list." confirmation panel.

### Styling
- All three inputs share the existing input styling: `h-14`, `bg-white/20`, `border-white/50`, cream text, Work Sans 300, `rounded-lg`.
- Country-code `<select>` matches input height and styling; uses native select (chevron handled by browser, kept simple). Cream text on `bg-white/20`.
- Form gap: `gap-3` between stacked rows.
- Phone row uses `flex gap-2` for code + number.
- Button becomes full-width (`w-full`) below the inputs, keeps cream fill + dark hover.
- Microcopy ("Be the first to know when we open.") stays below the button, unchanged.
- Panel padding bumps slightly to accommodate the taller form: `p-6 sm:p-8` stays, but vertical rhythm now feels balanced with three fields.

### State changes in `TeaserPage`
Replace the single `email` state with:
```ts
const [name, setName] = useState("");
const [countryCode, setCountryCode] = useState("+66");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({});
```

`handleSubmit` validates each field, updates `errors`, and only sets `submitted` if all pass.

### Out of scope
No backend wiring (form remains UI-only, consistent with the original email-only flow). No new dependencies — validation stays inline. No changes to imagery, headline, logo, or animations.
