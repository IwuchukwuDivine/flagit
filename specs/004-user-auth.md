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

- [x] Users table exists in the database with name, email, hashed password
- [x] `POST /api/auth/register` creates a user and returns a session/token
- [x] `POST /api/auth/register` returns 400 for missing fields or duplicate email
- [x] `POST /api/auth/login` authenticates and returns a session/token
- [x] `POST /api/auth/login` returns 401 for invalid credentials
- [x] `GET /api/auth/me` returns the authenticated user's profile
- [x] `GET /api/auth/me` returns 401 when not authenticated
- [x] `POST /api/complaints` requires authentication (401 if not logged in)
- [x] `POST /api/complaints` auto-sets `authorName` and `userId` from the session
- [x] `DELETE /api/complaints/:id` only succeeds for the complaint's author (403 otherwise)
- [x] `/auth/register` page works and redirects on success
- [x] `/auth/login` page works and redirects on success
- [x] `/submit` redirects to login when not authenticated
- [x] Navigation shows login/register when logged out, user name and logout when logged in
- [x] Passwords are hashed — never stored as plain text
- [x] Vitest tests cover auth endpoints (register, login, logout, me)
- [x] Vitest tests cover authorization (create complaint, delete own vs. others)
- [x] All existing tests from Phases 1–3 still pass (no regressions)
- [x] `nuxt build` succeeds with no errors

## Status: COMPLETE

All acceptance criteria met. User authentication fully implemented with cookie-based sessions, bcrypt password hashing, auth middleware, and comprehensive test coverage. Fixed cookie persistence issue in tests by implementing a TestClient helper class that manually manages cookies across requests.
