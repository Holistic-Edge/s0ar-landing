# Project conventions
- Keep `/review` separate from the public registration and synthetic-only; it is a screen-review tool, not an authenticated CMS or a source of production records.
- Route final submissions through the shared versioned Zod contract and injectable transport seam; keep the default transport network-free until SoCashless integration approval, so preview completion cannot imply durable capture.
- Keep the pre-registration review experience browser-only until production integrations are explicitly approved; review submissions must never claim to save or send data.
- Put shared registration validation and opening-time calculations in a browser-safe module with rule tests, so UI and future integrations use the same constraints.
- Keep SOAR colors and page styling in the global design tokens; reuse the existing Button and Dialog controls.
- Use a shared searchable CountryPicker built on the existing Popover and Command controls for registration country fields, so selection stays accessible and consistent.
- Reuse CountryPicker for calling codes with downward positioning and bounded scrolling, so all registration dropdowns behave consistently.
- Keep monochrome channel brand vectors in a dedicated browser-safe component, so icons inherit selected-state colors without raster assets.
- Keep the lifestyle gallery in a browser-safe component using the shared Dialog, separate thumbnail and full-image asset pointers, and on-demand lightbox loading to minimize page weight.