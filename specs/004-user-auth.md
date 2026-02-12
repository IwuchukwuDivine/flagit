# 004 — User Authentication

## Overview

Add user authentication to the platform. Citizens register and log in to submit complaints. Complaints are tied to authenticated users, and only the author can delete their own complaint.

## Auth Approach

Use `nuxt-auth-utils` or a simple JWT-based auth system — whichever integrates cleanly with the existing Nuxt 3 server routes. Keep it simple.

## Database Changes

**Users table:**

| Column    | Type     | Notes                        |
|-----------|----------|------------------------------|
| id        | Int      | Auto-increment primary key   |
| name      | String   | Required, display name       |
| email     | String   | Required, unique             |
| password  | String   | Required, hashed (bcrypt)    |
| createdAt | DateTime | Auto-set                     |

**Complaints table updates:**

- Add `userId` field (Int, required, foreign key to Users)
- `authorName` is now auto-populated from the authenticated user's name
- Keep `authorName` stored on the complaint for display (denormalized)

## Server Routes

| Method | Route               | Description                        | Auth     |
|--------|---------------------|------------------------------------|----------|
| POST   | `/api/auth/register`| Register a new user                | Public   |
| POST   | `/api/auth/login`   | Log in, return session/token       | Public   |
| POST   | `/api/auth/logout`  | Log out, clear session             | Auth     |
| GET    | `/api/auth/me`      | Get current authenticated user     | Auth     |

## Route Changes

- `POST /api/complaints` — requires authentication; `authorName` and `userId` set from session
- `DELETE /api/complaints/:id` — requires authentication; only the complaint author can delete
- `GET` routes remain public (anyone can browse)

## Frontend Pages

### `/auth/register` — Registration Page

- Form: name, email, password
- Validation feedback for missing/invalid fields
- On success, auto-login and redirect to `/`

### `/auth/login` — Login Page

- Form: email, password
- Validation feedback for wrong credentials
- On success, redirect to `/`

### Navigation Updates

- Show login/register links when logged out
- Show user name and logout button when logged in
- `/submit` page redirects to `/auth/login` if not authenticated

### Submit Form Updates

- Remove `authorName` field from the form (auto-populated from session)
- Form only accessible when authenticated

## Requirements

- Passwords hashed with bcrypt (never stored in plain text)
- Auth middleware protects `/submit` route
- Proper 401 responses for unauthenticated API requests
- Proper 403 responses when deleting another user's complaint
- Tests for registration, login, logout, and authorization

## Acceptance Criteria

- [ ] Users table exists in the database with name, email, hashed password
- [ ] `POST /api/auth/register` creates a user and returns a session/token
- [ ] `POST /api/auth/register` returns 400 for missing fields or duplicate email
- [ ] `POST /api/auth/login` authenticates and returns a session/token
- [ ] `POST /api/auth/login` returns 401 for invalid credentials
- [ ] `GET /api/auth/me` returns the authenticated user's profile
- [ ] `GET /api/auth/me` returns 401 when not authenticated
- [ ] `POST /api/complaints` requires authentication (401 if not logged in)
- [ ] `POST /api/complaints` auto-sets `authorName` and `userId` from the session
- [ ] `DELETE /api/complaints/:id` only succeeds for the complaint's author (403 otherwise)
- [ ] `/auth/register` page works and redirects on success
- [ ] `/auth/login` page works and redirects on success
- [ ] `/submit` redirects to login when not authenticated
- [ ] Navigation shows login/register when logged out, user name and logout when logged in
- [ ] Passwords are hashed — never stored as plain text
- [ ] Vitest tests cover auth endpoints (register, login, logout, me)
- [ ] Vitest tests cover authorization (create complaint, delete own vs. others)
- [ ] All existing tests from Phases 1–3 still pass (no regressions)
- [ ] `nuxt build` succeeds with no errors

## Status: IN PROGRESS

**Regression Found**: Tests are failing due to cookie session not persisting between $fetch requests in the Nuxt test environment.

**Issues**:
1. The `$fetch` utility from `@nuxt/test-utils` doesn't automatically persist cookies between calls
2. 10 out of 46 tests failing - all related to authentication/authorization
3. Tests pass locally in isolation but fail when run together due to database cleanup conflicts

**Fixes Applied**:
- Fixed error handling in auth endpoints (register/login) to prevent crashes
- Updated test setup to recreate users between test suites
- Added `fileParallelism: false` to run tests sequentially
- 36 of 46 tests now passing

**Remaining Work**:
- Need to manually handle cookie persistence in tests OR refactor to use a different auth approach for testing
- Consider using supertest or similar library that handles cookies automatically
- OR implement a test-only auth header approach
