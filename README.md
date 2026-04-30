# Proctura Frontend

Web client for Proctura — a multitenancy online coding exam platform for universities. Students write and submit real code instead of writing on paper.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** (server state)
- **Monaco Editor** (code editor)
- **React Hook Form** + **Yup** (forms and validation)
- **Axios** (HTTP client)

## Features

### Students
- Browse and take exams they are enrolled in
- Write code in a full Monaco editor with language support
- Run code against visible test cases before submitting
- Auto-save answers every 30 seconds
- Webcam recording during the exam — uploaded in the background after submission (student is not blocked)
- Anti-cheat detection (tab switch, window blur, fullscreen exit, clipboard) — auto-submits after 3 violations
- View graded results with per-question breakdown

### Lecturers
- Create and manage courses
- Enroll students into courses by matric number
- Build exams with questions, test cases, and point values
- Set exam language, duration, and availability window
- View all student submissions with scores and violation counts
- Review submitted code per student in a read-only editor
- Override scores per question manually with a single batch save

### All Roles
- Login notification email on every sign-in (time, IP, location)
- Forgot password / reset password flow
- Dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Proctura backend running at the configured API URL

### Setup

```bash
# 1. Clone and enter the project
git clone git@github.com:CodeEnthusiast09/proctura-frontend.git
cd proctura-frontend

# 2. Copy env file and fill in your values
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable                   | Description                     | Example                            |
|----------------------------|---------------------------------|------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL            | `http://localhost:8080/api/v1`     |
| `NEXT_PUBLIC_APP_URL`      | Frontend app URL                | `http://localhost:3000`            |

## Project Structure

```
src/
├── app/
│   ├── (auth)/               — login, register, forgot/reset password, accept invite
│   ├── (app)/dashboard/      — protected dashboard pages (courses, exams, results, users)
│   └── (exam)/exam/[id]/     — exam flow (detail, take, result)
├── components/               — globally reusable UI components
├── hooks/
│   ├── common/               — shared hooks (useCurrentUser, etc.)
│   └── services/             — API hooks grouped by domain
│       ├── auth/
│       ├── courses/
│       ├── exams/
│       ├── submissions/
│       ├── tenants/
│       └── users/
├── interfaces/               — TypeScript interfaces and types
├── lib/                      — axios instance, query client config
├── services/
│   ├── client/               — client-side API calls
│   └── server/               — server-side API calls
└── validations/              — Yup schemas
```

## Tenant Resolution

In production, the tenant is resolved from the subdomain (`unilag.proctura.com`).  
In local dev, set the `X-Tenant-Subdomain` header — the axios instance handles this automatically via the `NEXT_PUBLIC_APP_URL` environment variable.

## Commands

```bash
npm run dev     # start development server
npm run build   # production build
npm start       # start production server
npm run lint    # run ESLint
```
