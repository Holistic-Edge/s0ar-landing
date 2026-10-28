# Project conventions
- Keep the pre-registration review experience browser-only until production integrations are explicitly approved; review submissions must never claim to save or send data.
- Put shared registration validation and opening-time calculations in a browser-safe module with rule tests, so UI and future integrations use the same constraints.
- Keep SOAR colors and page styling in the global design tokens; reuse the existing Button and Dialog controls.
- Use a shared searchable CountryPicker built on the existing Popover and Command controls for registration country fields, so selection stays accessible and consistent.