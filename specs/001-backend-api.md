# 001 — Backend API: Complaints CRUD

## Overview

Set up the Nuxt 3 project foundation with server API routes and a SQLite database. This is Phase 1 — backend only, no frontend UI.

## Setup

- Nuxt 3 project with server API routes
- SQLite database with Prisma ORM
- Vitest configured for API testing

## Database Schema

**Complaints table:**

| Column     | Type     | Notes                                              |
|------------|----------|----------------------------------------------------|
| id         | Int      | Auto-increment primary key                         |
| title      | String   | Required                                           |
| body       | String   | Required                                           |
| imageUrl   | String?  | Nullable (not used yet, Phase 1 is text-only)      |
| authorName | String   | Required                                           |
| category   | String   | Required (roads, water, electricity, sanitation)    |
| location   | String   | Required                                           |
| status     | String   | Default: "pending"                                 |
| createdAt  | DateTime | Auto-set                                           |
| updatedAt  | DateTime | Auto-updated                                       |

## Server Routes

Implement in `server/api/`:

| Method | Route                  | Description          |
|--------|------------------------|----------------------|
| POST   | `/api/complaints`      | Create a complaint (text fields only for now) |
| GET    | `/api/complaints`      | List all complaints, sorted by newest first   |
| GET    | `/api/complaints/:id`  | Get a single complaint by ID                  |
| DELETE | `/api/complaints/:id`  | Delete a complaint by ID                      |

## Requirements

- Input validation on all endpoints
- Proper error responses (400 for validation, 404 for not found, 500 for server errors)
- Tests for every endpoint using Vitest + `$fetch`

## Acceptance Criteria

- [x] Nuxt 3 project initialised and runs without errors
- [x] Prisma is configured with SQLite and the Complaints model matches the schema above
- [x] `prisma db push` (or migrate) creates the database successfully
- [x] POST `/api/complaints` creates a complaint and returns it with status 200
- [x] POST `/api/complaints` returns 400 if required fields are missing (title, body, authorName, category, location)
- [x] GET `/api/complaints` returns all complaints sorted by `createdAt` descending
- [x] GET `/api/complaints/:id` returns a single complaint by ID
- [x] GET `/api/complaints/:id` returns 404 for a non-existent ID
- [x] DELETE `/api/complaints/:id` deletes the complaint and returns a success response
- [x] DELETE `/api/complaints/:id` returns 404 for a non-existent ID
- [x] All endpoints return proper JSON error responses (not HTML or stack traces)
- [x] Vitest tests cover every endpoint and pass

## Status: COMPLETE

All acceptance criteria met. Implementation verified through manual testing and automated tests.
