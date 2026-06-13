# Creative Classroom Website Redesign

Frontend-only redesign of the Creative Classroom Wix site.

## What is preserved

- Primary navigation links from the original site.
- 2026 Leadership Camp signup CTA linking to the existing Google Form.
- About, PVSA, program, team, partner, and email contact links.
- Impact metrics, mission copy, testimonials, and original Wix-hosted imagery.
- Email join interaction with validation and the original "Thank you!" success message.

## Backend-ready form

The site is intentionally frontend-only for now. To connect the Join form later, set `BACKEND_ENDPOINT` in `script.js` to a POST endpoint that accepts:

```json
{ "email": "student@example.com" }
```

When no endpoint is configured, the form validates locally and stores signups in `localStorage` under `creativeClassroomSignupQueue`. This keeps the prototype frontend-only while making the later backend handoff explicit.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.
