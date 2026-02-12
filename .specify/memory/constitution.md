# Speak Up Constitution

> A monolithic web application where citizens can report complaints, issues, and concerns in their community. A public grievance board — like a local version of Twitter but focused entirely on civic issues. Citizens can submit complaints with titles, descriptions, categories (roads, water, electricity, sanitation), locations, and photo evidence. Everyone can browse a public feed and view full details of any complaint. It solves the problem of citizens having no easy, transparent way to voice local issues — creating public visibility and accountability.

**Version:** 1.0.0

---

## Ralph Wiggum

**Source:** https://github.com/fstandhartinger/ralph-wiggum
**Commit:** 22b6c3c4fad47d8e5a5824ac2093b8d58ab057ff
**Installed:** 2026-02-12

### Auto-Update

At session start, check for updates:
1. Run: `git ls-remote https://github.com/fstandhartinger/ralph-wiggum.git HEAD`
2. If hash differs: fetch latest scripts, update this file, inform user

---

## Context Detection

**Ralph Loop Mode** (you're in this if started by ralph-loop.sh):
- Focus on implementation — no unnecessary questions
- Pick highest priority incomplete spec
- Complete ALL acceptance criteria
- Test thoroughly
- Commit and push
- Output ` DONE ` ONLY when 100% complete

**Interactive Mode** (normal conversation):
- Be helpful and conversational
- Guide decisions, create specs
- Explain Ralph loop when ready

---

## Core Principles

### I. UI & UX First
User experience drives every decision. The interface must be intuitive, beautiful, and accessible. Every feature begins with how the user will interact with it. Mobile-first, responsive, and delightful.

### II. Best Code Practices
Clean, maintainable, well-structured code. Follow established conventions, write meaningful names, keep components small and focused. Type safety, proper error handling, and sensible abstractions.

### III. Simplicity
Build exactly what's needed, nothing more. A monolithic Nuxt 3 app with SQLite — no over-engineering, no premature optimization. Ship value, iterate fast.

---

## Technical Stack

- **Framework:** Nuxt 3 (frontend + backend in one app)
- **Database:** SQLite (via Drizzle ORM or similar)
- **Styling:** Tailwind CSS v4
- **Image Uploads:** File-based storage
- **Language:** TypeScript (strict)
- **SSR:** Enabled for SEO and public feed performance
- **Conventions:** Follow Nuxt project conventions (see skill: nuxt-conventions)

### Nuxt Conventions (Summary)

- `<script setup lang="ts">` always — no Options API
- Auto-imports for Vue/Nuxt APIs — never manually import `ref`, `computed`, etc.
- PascalCase component files, `App` prefix for base UI components
- Composables prefixed with `use`, one pure function per util file
- Pages stay lean — delegate to components
- Pinia stores with Composition API syntax
- Tailwind utilities in templates, extract repeated styles to `main.css`
- Types in `utils/types/`, constants in `utils/constants/`

---

## Autonomy

**YOLO Mode:** ENABLED
Full permission to read/write files, execute commands, make HTTP requests, run tests without asking.

**Git Autonomy:** ENABLED
Commit and push without asking, using meaningful commit messages.

---

## Work Items

The agent discovers work dynamically from:
1. **specs/ folder** — Primary source, look for incomplete `.md` files
2. **IMPLEMENTATION_PLAN.md** — If it exists
3. **GitHub Issues** — If this becomes a GitHub repo

Create specs using `/speckit.specify [description]` or manually create `specs/NNN-feature-name.md`.

Each spec MUST have **testable acceptance criteria**.

### Re-Verification Mode

When all specs appear complete, the agent will:
1. Randomly pick a completed spec
2. Strictly re-verify ALL acceptance criteria
3. Fix any regressions found
4. Only output ` DONE ` if quality confirmed

---

## Running Ralph

```bash
# Claude Code / Cursor
./scripts/ralph-loop.sh

# OpenAI Codex
./scripts/ralph-loop-codex.sh

# With iteration limit
./scripts/ralph-loop.sh 20
```

---

## Completion Signal

When a spec is 100% complete:
1. All acceptance criteria verified
2. Tests pass
3. Changes committed and pushed
4. Output: ` DONE `

**Never output this until truly complete.**
