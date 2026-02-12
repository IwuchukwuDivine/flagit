# 003 — Frontend Pages: Feed, Submit, Detail

## Overview

Build the Nuxt 3 frontend pages for the citizen complaints platform. Three pages: a home feed, a submission form, and a complaint detail view. Styled with Tailwind CSS, following Nuxt conventions.

## Pages

### `/` — Home Feed

- Displays all complaints in a card layout, newest first
- Each card shows:
  - Title
  - Preview of body (truncated)
  - Image thumbnail (if present)
  - Author name
  - Category badge
  - Relative time (e.g. "2 hours ago")
- Cards link to the full complaint detail page
- Empty state message when no complaints exist

### `/submit` — Submit Complaint

- Form with fields: title, body, authorName, category (dropdown), location
- Image upload with preview before submission
- Category options: roads, water, electricity, sanitation
- Uploads image via `POST /api/upload`, then submits complaint with the returned imageUrl
- Shows validation errors for missing required fields
- On success, redirects to the home feed
- Loading/disabled state while submitting

### `/complaints/:id` — Complaint Detail

- Displays the full complaint: title, full body, image (full size), author, category, location, status, date
- 404-style message if complaint does not exist
- Back link to the home feed

## Technical Requirements

- Use `useFetch` for all API calls
- Components in `components/` directory (PascalCase filenames)
- Pages in `pages/` directory (file-based routing)
- `<script setup lang="ts">` on every `.vue` file
- Tailwind CSS for all styling
- Mobile-first responsive design
- No manual imports of Vue/Nuxt auto-imported APIs (`ref`, `computed`, `useFetch`, `navigateTo`, etc.)

## Suggested Components

- `ComplaintCard.vue` — card used in the feed
- `ComplaintForm.vue` — the submission form
- `ImageUpload.vue` — image upload with preview
- `CategoryBadge.vue` — styled category label

## Acceptance Criteria

- [x] `/` page loads and displays complaints from the API, newest first
- [x] Each complaint card shows title, body preview, image thumbnail, author, category, and relative time
- [x] Clicking a card navigates to `/complaints/:id`
- [x] `/submit` page renders a form with all required fields and a category dropdown
- [x] Image upload shows a preview of the selected image before submission
- [x] Submitting the form creates a complaint via the API and redirects to `/`
- [x] Form shows validation feedback if required fields are missing
- [x] `/complaints/:id` page shows full complaint details including the full-size image
- [x] `/complaints/:id` shows a not-found message for invalid IDs
- [x] All components use `<script setup lang="ts">`
- [x] All styling uses Tailwind CSS utility classes
- [x] Layout is responsive and looks good on mobile and desktop
- [x] `nuxt build` succeeds with no TypeScript errors
- [x] No ESLint errors
- [x] All existing backend tests from Phase 1 and Phase 2 still pass

## Status: COMPLETE

All acceptance criteria verified during re-verification. Fixed TypeScript errors in ComplaintForm.vue, server API routes, and test files. All tests pass, build succeeds with no errors, and all Nuxt conventions are followed.
