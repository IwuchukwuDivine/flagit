# 002 — Image Upload for Complaints

## Overview

Add image upload capability to the complaint system. Citizens can attach photo evidence when submitting a complaint.

## Server Routes

| Method | Route            | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/api/upload`    | Accept multipart image upload, return URL |

## Upload Behaviour

- Accept multipart form data with an image file
- Save to `public/uploads/` with a unique filename (UUID or timestamp-based)
- Return the public image URL in the response
- Validate file type: only `jpg`, `jpeg`, `png`, `webp` allowed
- Validate file size: must be under 5MB
- Reject invalid files with 400 and a clear error message

## Complaint Integration

- Update `POST /api/complaints` to accept an optional `imageUrl` field
- The `imageUrl` should be the path returned by the upload endpoint
- Complaints without images should still work (imageUrl remains nullable)

## Requirements

- Input validation on the upload endpoint (type + size)
- Proper error responses (400 for invalid file type/size, 500 for server errors)
- Tests for the upload endpoint and complaint creation with image

## Acceptance Criteria

- [ ] `POST /api/upload` accepts a multipart image and saves it to `public/uploads/`
- [ ] Upload response returns the public URL of the saved image
- [ ] Each uploaded file gets a unique filename (no overwrites)
- [ ] Upload rejects files that are not `jpg`, `jpeg`, `png`, or `webp` with 400
- [ ] Upload rejects files larger than 5MB with 400
- [ ] `POST /api/complaints` accepts an optional `imageUrl` field and stores it
- [ ] Complaints created without `imageUrl` still work as before
- [ ] `GET /api/complaints/:id` returns the `imageUrl` when present
- [ ] Vitest tests cover the upload endpoint (valid file, invalid type, oversized file)
- [ ] Vitest tests cover complaint creation with and without imageUrl
- [ ] All existing Phase 1 tests still pass (no regressions)

## Completion Signal

**Output when complete:** ` DONE `
