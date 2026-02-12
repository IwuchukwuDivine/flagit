# Implementation Plan

> Auto-generated breakdown of specs into tasks.
> Delete this file to return to working directly from specs.

---

## Project Status: GREENFIELD

This is a brand new project with no source code yet. All four specs need complete implementation from scratch.

---

## Priority Tasks

### PHASE 1: Backend Foundation (Spec 001)

- [ ] [HIGH] Initialize Nuxt 3 project with TypeScript - from spec 001
- [ ] [HIGH] Install and configure Prisma ORM with SQLite - from spec 001
- [ ] [HIGH] Create Prisma schema for Complaints table (id, title, body, imageUrl, authorName, category, location, status, createdAt, updatedAt) - from spec 001
- [ ] [HIGH] Run `prisma db push` to create database - from spec 001
- [ ] [HIGH] Configure Vitest for API testing - from spec 001
- [ ] [HIGH] Implement `POST /api/complaints` endpoint with validation - from spec 001
- [ ] [HIGH] Implement `GET /api/complaints` endpoint (list all, sorted by newest) - from spec 001
- [ ] [HIGH] Implement `GET /api/complaints/:id` endpoint - from spec 001
- [ ] [HIGH] Implement `DELETE /api/complaints/:id` endpoint - from spec 001
- [ ] [HIGH] Add input validation and error responses (400, 404, 500) to all endpoints - from spec 001
- [ ] [HIGH] Write Vitest tests for all 4 API endpoints - from spec 001
- [ ] [HIGH] Verify all tests pass and spec 001 acceptance criteria complete - from spec 001

### PHASE 2: Image Upload (Spec 002)

- [ ] [HIGH] Create `public/uploads/` directory for image storage - from spec 002
- [ ] [HIGH] Implement `POST /api/upload` endpoint for multipart image upload - from spec 002
- [ ] [HIGH] Add file type validation (jpg, jpeg, png, webp only) with 400 errors - from spec 002
- [ ] [HIGH] Add file size validation (max 5MB) with 400 errors - from spec 002
- [ ] [HIGH] Generate unique filenames for uploads (UUID or timestamp-based) - from spec 002
- [ ] [HIGH] Return public image URL in upload response - from spec 002
- [ ] [HIGH] Update `POST /api/complaints` to accept optional `imageUrl` field - from spec 002
- [ ] [HIGH] Write Vitest tests for upload endpoint (valid file, invalid type, oversized file) - from spec 002
- [ ] [HIGH] Write Vitest tests for complaint creation with and without imageUrl - from spec 002
- [ ] [HIGH] Verify all Phase 1 tests still pass (regression check) - from spec 002
- [ ] [HIGH] Verify all spec 002 acceptance criteria complete - from spec 002

### PHASE 3: Frontend Pages (Spec 003)

- [ ] [MEDIUM] Install and configure Tailwind CSS v4 - from spec 003
- [ ] [MEDIUM] Create `ComplaintCard.vue` component (title, body preview, image thumbnail, author, category, time) - from spec 003
- [ ] [MEDIUM] Create `CategoryBadge.vue` component for category display - from spec 003
- [ ] [MEDIUM] Create `ImageUpload.vue` component with preview functionality - from spec 003
- [ ] [MEDIUM] Create `ComplaintForm.vue` component with all fields and validation - from spec 003
- [ ] [MEDIUM] Implement `/` page (home feed) - display complaints, newest first, with empty state - from spec 003
- [ ] [MEDIUM] Implement `/submit` page with complaint submission form - from spec 003
- [ ] [MEDIUM] Implement `/complaints/:id` page (detail view) with 404 handling - from spec 003
- [ ] [MEDIUM] Add navigation between pages (home ↔ submit ↔ detail) - from spec 003
- [ ] [MEDIUM] Ensure mobile-first responsive design with Tailwind utilities - from spec 003
- [ ] [MEDIUM] Test form validation feedback and error display - from spec 003
- [ ] [MEDIUM] Test image upload workflow (select, preview, submit) - from spec 003
- [ ] [MEDIUM] Verify `nuxt build` succeeds with no TypeScript errors - from spec 003
- [ ] [MEDIUM] Verify no ESLint errors - from spec 003
- [ ] [MEDIUM] Verify all backend tests from Phases 1-2 still pass - from spec 003
- [ ] [MEDIUM] Verify all spec 003 acceptance criteria complete - from spec 003

### PHASE 4: User Authentication (Spec 004)

- [ ] [MEDIUM] Install bcrypt for password hashing - from spec 004
- [ ] [MEDIUM] Install auth library (nuxt-auth-utils or JWT-based) - from spec 004
- [ ] [MEDIUM] Create Prisma schema for Users table (id, name, email, password, createdAt) - from spec 004
- [ ] [MEDIUM] Add `userId` foreign key to Complaints table - from spec 004
- [ ] [MEDIUM] Run Prisma migration for auth tables - from spec 004
- [ ] [MEDIUM] Implement `POST /api/auth/register` endpoint with password hashing - from spec 004
- [ ] [MEDIUM] Implement `POST /api/auth/login` endpoint with session/token generation - from spec 004
- [ ] [MEDIUM] Implement `POST /api/auth/logout` endpoint - from spec 004
- [ ] [MEDIUM] Implement `GET /api/auth/me` endpoint for current user - from spec 004
- [ ] [MEDIUM] Update `POST /api/complaints` to require authentication and auto-set authorName/userId - from spec 004
- [ ] [MEDIUM] Update `DELETE /api/complaints/:id` to require authentication and verify ownership (403 for others) - from spec 004
- [ ] [MEDIUM] Create `/auth/register` page with registration form - from spec 004
- [ ] [MEDIUM] Create `/auth/login` page with login form - from spec 004
- [ ] [MEDIUM] Add auth middleware to protect `/submit` route - from spec 004
- [ ] [MEDIUM] Update navigation to show login/register when logged out, user name/logout when logged in - from spec 004
- [ ] [MEDIUM] Remove `authorName` field from submit form (auto-populate from session) - from spec 004
- [ ] [MEDIUM] Write Vitest tests for all auth endpoints (register, login, logout, me) - from spec 004
- [ ] [MEDIUM] Write Vitest tests for authorization (create complaint, delete own vs others) - from spec 004
- [ ] [MEDIUM] Verify all tests from Phases 1-3 still pass (regression check) - from spec 004
- [ ] [MEDIUM] Verify `nuxt build` succeeds with no errors - from spec 004
- [ ] [MEDIUM] Verify all spec 004 acceptance criteria complete - from spec 004

---

## Implementation Strategy

### Dependencies
1. **Phase 1** (spec 001) has no dependencies - start here
2. **Phase 2** (spec 002) depends on Phase 1 being complete
3. **Phase 3** (spec 003) depends on Phases 1 and 2 being complete
4. **Phase 4** (spec 004) depends on all previous phases being complete

### Technical Notes
- Use `<script setup lang="ts">` in all Vue components
- Rely on Nuxt auto-imports - never manually import `ref`, `computed`, `useFetch`, etc.
- Follow PascalCase for component filenames
- Use Tailwind CSS utilities for all styling
- Run tests after each phase to catch regressions early
- Test both happy paths and error cases thoroughly

### Quality Checkpoints
After each phase, verify:
1. All acceptance criteria from the spec are met
2. All Vitest tests pass
3. No TypeScript errors in `nuxt build`
4. No ESLint errors
5. All previous tests still pass (no regressions)

---

## Completed

_(Tasks will move here as they are completed)_

---

## Prioritization Rationale

**HIGH priority:**
- Phases 1-2 (Backend API + Image Upload) are foundational - nothing else can work without them
- Backend is invisible to end users but critical for the entire application

**MEDIUM priority:**
- Phases 3-4 (Frontend + Auth) build on the backend foundation
- These phases deliver visible user value and complete the MVP

**Task Breakdown:**
- Complex tasks broken into small, testable steps
- Each task maps to specific acceptance criteria from specs
- Testing integrated throughout (not bolted on at the end)
- Progressive enhancement: text-only → images → UI → auth

---

**Next Step:** Begin Phase 1, starting with Nuxt 3 project initialization.
