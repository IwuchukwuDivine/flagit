# Contributing to Flagit

First off, thank you for considering contributing to Flagit! Every contribution helps make civic engagement more accessible. Whether it's fixing a bug, suggesting a feature, improving docs, or writing tests — you're welcome here.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Running Tests](#running-tests)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Need Help?](#need-help)

## Code of Conduct

By participating in this project, you agree to be respectful and constructive. We are committed to providing a welcoming and inclusive experience for everyone. Harassment, discrimination, or any toxic behavior will not be tolerated.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/<your-username>/flagit.git
   cd flagit
   ```

3. **Add the upstream remote** so you can keep your fork in sync:

   ```bash
   git remote add upstream https://github.com/<original-owner>/flagit.git
   ```

## Development Setup

### Prerequisites

- **Node.js** 20 or later
- **npm**

### Installation

```bash
# Install dependencies
npm install

# Copy the example env file and configure it
cp .env.example .env

# Generate the Prisma client
npx prisma generate

# Push the database schema to your local SQLite database
npx prisma db push

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable         | Description                            | Default                      |
| ---------------- | -------------------------------------- | ---------------------------- |
| `DATABASE_URL`   | SQLite database file path              | `file:./prisma/dev.db`       |
| `SESSION_SECRET` | Secret key for signing session cookies | *(generate a random string)* |
| `NODE_ENV`       | Environment mode                       | `development`                |

## Project Structure

```
flagit/
├── assets/css/          # Global styles and Tailwind layers
├── components/          # Vue components (auto-imported by Nuxt)
├── layouts/             # App layouts
├── pages/               # File-based routing
├── server/
│   ├── api/             # API routes (auth, complaints, uploads)
│   └── utils/           # Server utilities (auth, Prisma client)
├── utils/               # Shared utilities and types
├── prisma/
│   └── schema.prisma    # Database schema
├── tests/
│   ├── api/             # API integration tests
│   └── helpers/         # Test utilities
└── public/uploads/      # User-uploaded images
```

## Making Changes

1. **Create a branch** from `master` for your work:

   ```bash
   git checkout -b feat/your-feature-name
   ```

   Use a descriptive branch name with a prefix:
   - `feat/` — new features
   - `fix/` — bug fixes
   - `docs/` — documentation changes
   - `test/` — adding or updating tests
   - `refactor/` — code refactoring

2. **Make your changes** in small, focused commits.

3. **Run the tests** to make sure nothing is broken (see [Running Tests](#running-tests)).

4. **Push** your branch and open a pull request.

## Code Style

This project follows standard Nuxt and Vue conventions:

- **TypeScript** is used throughout — avoid `any` types.
- **Vue components** use `<script setup lang="ts">` with typed props and emits.
- **Server API routes** use Nuxt's file-based routing conventions (e.g., `index.get.ts`, `[id].patch.ts`).
- **Validation** is done with **Zod** schemas on the server side.
- **Database access** goes through Prisma — use the singleton client from `server/utils/prisma.ts`.
- **Styling** uses Tailwind CSS utility classes. Avoid writing custom CSS unless absolutely necessary.

### General Guidelines

- Keep components small and focused on a single responsibility.
- Use Nuxt auto-imports — no need to manually import Vue APIs, components, or composables.
- Place shared types in `utils/types/` and constants in `utils/constants/`.
- Use meaningful variable and function names.
- Add comments only when the *why* isn't obvious from the code.

## Running Tests

Tests use **Vitest** with `@nuxt/test-utils` and run against a local SQLite database.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npx vitest --watch

# Run a specific test file
npx vitest tests/api/auth.test.ts
```

> **Note:** Tests use `prisma/dev.db` as the database. The test suite handles its own setup and cleanup.

If you're adding a new API endpoint, please add corresponding tests in `tests/api/`.

## Submitting a Pull Request

1. Make sure your branch is up to date with `master`:

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. Push your branch to your fork:

   ```bash
   git push origin feat/your-feature-name
   ```

3. Open a **Pull Request** against the `master` branch of the upstream repository.

4. In your PR description, include:
   - **What** — a clear summary of the changes.
   - **Why** — the motivation or issue being addressed.
   - **How to test** — steps to verify the changes work.
   - **Screenshots** — if the change affects the UI.

5. Be responsive to review feedback. We may suggest changes before merging.

### PR Checklist

- [ ] Code follows the project's conventions and style.
- [ ] All existing tests pass (`npm run test`).
- [ ] New features or bug fixes include relevant tests.
- [ ] The database schema changes (if any) are reflected in `prisma/schema.prisma`.
- [ ] No secrets, credentials, or `.env` files are committed.

## Reporting Bugs

Found a bug? Please [open an issue](../../issues/new) and include:

- A clear and descriptive title.
- Steps to reproduce the problem.
- What you expected to happen vs. what actually happened.
- Your environment (OS, browser, Node.js version).
- Screenshots or error logs, if applicable.

## Suggesting Features

Have an idea? We'd love to hear it. [Open an issue](../../issues/new) with:

- A clear description of the feature and why it would be useful.
- Any examples or mockups, if possible.
- Whether you'd be willing to work on it yourself.

## Need Help?

If you're unsure about anything or need guidance before starting, feel free to open an issue with a question. There are no stupid questions — we're happy to help you get started.

---

Thank you for helping make Flagit better for everyone!
