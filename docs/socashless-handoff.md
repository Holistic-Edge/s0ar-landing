# SOAR pre-registration — SoCashless handoff

## Status
Frontend review only. **No CMS, credentials, database, live webhook or message sending is connected.** Phillip's team owns production capture. No Cloud service has been enabled. `/review` is an unlinked, noindex design-review page, **not a protected admin area**. It contains synthetic defaults and no stored records. Anyone with the URL can open it; do not use real guest information there. Remove or protect it with real server-enforced authentication before production if access must be private.

## Review workflow
Open `/review` and select Introduction, Your vibe, Fine print, or either Thank you outcome (On the list / Not this time). Each selection resets to sample details. Submit Fine print to inspect/copy the validated JSON held only in memory. Refresh clears all state. The normal public page starts blank and retains its required step order. Both completion screens carry a small "preview only" line until live capture exists. Which outcome a guest sees must be decided by the SoCashless response; the frontend currently always shows "On the list".

## Contract
Source of truth: `src/lib/registration-submission.ts` (`registrationSchema`, `RegistrationPayload`, `buildRegistrationPayload`, `submitRegistration`). Portable schema: `docs/registration.schema.json`. Sample: `docs/registration.example.json`.

- `schemaVersion`: `1.0`.
- `submissionId`: UUID, generated once per mounted form for retry deduplication.
- `submittedAt`: UTC ISO timestamp supplied by browser; server must record its own received time.
- `contact`: firstName, lastName, nationality, residence, dialCode, phone, email, channel, instagram. Optional fields are empty strings. Instagram excludes `@`. Phone is the entered national number; dial code remains separate. Channel is a preference, not a verified destination. LINE/WeChat handles are not collected; the integration must decide how those invitations will reach guests.
- `vibe`: moment, move, group and optional occasion are single strings; music is 1–2 distinct strings. occasionDate is a calendar date or empty string. Allowed values match the form questions.
- `consent`: adult, policy, privacy must be true; marketing may be false. Includes policyVersion and privacyVersion. Both are `2026-10-29-draft` until the owner approves the actual legal notices. The age checkbox is a 23+ declaration, not identity verification.
- `attribution`: utm_source, utm_medium, utm_campaign, referrer (origin only), landing_path (pathname only). No full referring URL/query is retained.

## Integration seam — not an endpoint yet
`submitRegistration(payload)` validates and returns `{status:"preview"}` without network/storage. Phillip can supply the typed `RegistrationTransport` once production implementation is explicitly approved. **Do not place secret keys or a privileged webhook in a VITE environment variable.** No arbitrary browser-configurable webhook was added. A future app-hosted server adapter requires approved Cloud setup; Phillip may instead implement the adapter in the SoCashless hosting environment.

Proposed HTTP contract for Phillip's implementation (URL to be provided by his team):

```http
POST <SoCashless-approved registration endpoint>
Content-Type: application/json
Idempotency-Key: <submissionId>
```

Body: validated RegistrationPayload. On durable capture only, return 200/201 with `{"status":"accepted","registrationId":"<opaque record id>"}`. Duplicate IDs with the same payload must return the original receipt; conflicting payloads must be rejected. Reject malformed data with 400/422, throttle with 429, and return safe errors for failures. Do not return guest data or internal errors. The injectable transport checks the receipt at runtime.

## Production flow to implement
1. Guest completes the ordered form; validate contact, preferences/date and required consent again at final submit.
2. Send to the approved adapter. Server repeats schema validation; enforce body-size limits, abuse/rate limits, origin/CORS policy where needed and idempotency. Guest registration may be public; owner/admin reads must be authenticated and authorized server-side.
3. Server stores a durable record with server receipt timestamp and approved legal versions. Review or log only what is necessary; never log guest details. Protect guest data and admin aggregates with proper permissions.
4. Return the durable receipt. Only then enable live success copy. On error, retain entered values, show a safe retry message and reuse the submission ID. Do not clear fields or display membership/invitation success before storage succeeds.
5. SoCashless manages records and Captain-reviewed invitations. Registration never guarantees boarding. Optional marketing consent is separate from required registration consent. No invitation, email, WhatsApp, LINE, WeChat or Instagram message is sent by this repo.

## Needed from Phillip / owner
- Approved endpoint URL and hosting choice, required auth/signature protocol (server-only credentials), CORS policy, exact error/receipt contract.
- Approved privacy notice/contact/retention and final policy versions; resolve channel delivery requirements.
- SoCashless management access and notification ownership. GitHub push/access is handled by Alex; this task has not pushed, published or provisioned a CMS.
- Production acceptance: submit through real UI, confirm record in SoCashless management, retry without duplication, force an error without fake success, check non-admin access denied, and confirm actual messages only if enabled.

## Checks
Run `bun test src/lib/preregistration.test.js src/lib/registration-submission.test.js`. Regenerate the portable contract with `bun scripts/registration-contract.js` after rule changes. JSON Schema covers choices, bounds and uniqueness; repeat Zod validation for refinements such as real calendar dates and minimum phone digits. Browser checks cover blank public start, validation gating, state retained on Back, direct review screen switching, preview completion and sample payload. Production capture/delivery remains unverified until configured.