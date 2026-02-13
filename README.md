# Flagit

A civic complaints platform where citizens can report issues, upvote problems, and track resolutions in their community. Think of it as a public grievance board focused entirely on local civic issues.

**Live:** [https://flagit.mooo.com](https://flagit.mooo.com)

## Features

- **Public feed** — Browse complaints with infinite scroll, filter by status (recent, pending, resolved)
- **Submit complaints** — Report issues with title, description, category, location, and photo evidence
- **Categories** — Roads, water supply, street lighting, sanitation, health care, education, transportation, public services
- **Likes and comments** — Upvote issues and join the conversation
- **User profiles** — View your submitted reports and stats
- **Image uploads** — Attach photo evidence (JPG, PNG, WEBP up to 5MB)
- **Auth** — Register, log in, session-based authentication with signed cookies
- **Responsive** — Mobile-first design with bottom nav and desktop sidebar

## Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com) (Vue 3, SSR)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) v4
- **Database:** SQLite via [Prisma](https://prisma.io) ORM
- **Validation:** [Zod](https://zod.dev)
- **Auth:** Custom session cookies with HMAC-SHA256 signing
- **Language:** TypeScript (strict)
- **Deployment:** Oracle Cloud VPS, Caddy, PM2

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
git clone <repo-url>
cd flagit
npm install
```

### Set up the database

```bash
cp .env.example .env
npx prisma generate
npx prisma db push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
flagit/
├── components/        # Vue components (AppIcon, ComplaintCard, ComplaintForm, etc.)
├── layouts/           # App layout with sidebar and mobile nav
├── pages/             # Route pages (feed, submit, profile, auth, complaint detail)
├── server/
│   ├── api/           # API routes (auth, complaints, comments, likes, upload)
│   └── utils/         # Auth helpers, Prisma client
├── utils/
│   ├── constants/     # Shared constants (categories)
│   └── types/         # TypeScript types (Complaint, IconName)
├── prisma/
│   └── schema.prisma  # Database schema
├── public/uploads/    # User-uploaded images
└── assets/css/        # Global styles
```

## Deployment

See [DEPLOY.md](DEPLOY.md) for full VPS deployment instructions.

Quick deploy summary:

```bash
# From your local machine — upload to server
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude '*.db' --exclude .env \
  -e "ssh -i ~/.ssh/your-key" ./ user@your-server:~/flagit/

# On the server — build and restart
cd ~/flagit && npm install && npm run build && pm2 restart flagit
```

## License

MIT
