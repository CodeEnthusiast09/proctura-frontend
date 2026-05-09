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
- Sign in with **email or matric number** on the exam page itself — no
  student dashboard, no separate login URL
- `/exam` lands students on a picker showing only their currently-active
  enrolled exams (proctor-friendly: lab machines just point at one URL)
- Write code in a full Monaco editor with language support
- Run code against visible test cases before submitting
- Auto-save answers every 30 seconds
- Webcam + mic recording — permission requested on the start page so the
  prompt never drops the student out of fullscreen mid-exam
- Anti-cheat detection (tab switch, window blur, fullscreen exit,
  clipboard) — auto-submits after 3 violations
- **Auto logout on submit**: localStorage clears and the page returns to
  the picker, ready for the next CBT student. No proctor action needed
  between students
- See graded results only after the lecturer releases them

### Lecturers
- Create and manage courses
- Enroll students into courses by matric number
- Build exams with questions, test cases, and point values
- Set exam language, duration, and availability window
- View all student submissions with scores and violation counts
- Review submitted code per student in a read-only editor
- Override scores per question manually with a single batch save
- **Release Results** toggle — students don't see scores until released

### School Admins
- View-only on academic content (courses, exams, results) — they don't
  author exams
- Manage users: invite lecturers, invite/import students, activate /
  deactivate accounts
- Up to **2 active school admins per tenant**. Either can invite a
  co-admin; last-admin protection prevents lockout
- Settings page for editing own name + changing password

### Super Admins
- Onboard new schools (tenants) and the first school admin per tenant
- Activate / deactivate tenants (login is blocked for any user in an
  inactive tenant)
- **Recovery**: invite a new school admin into any tenant if both
  existing admins are unreachable

### All Roles
- Login notification email on every sign-in (time, IP, location)
- Forgot password / reset password flow
- **Settings page** — edit own profile and change own password (super,
  school admin, lecturer)
- Dark mode

### Deployment
- **Installable PWA** with themed splash (`#0d1117`) — one-click install
  on each CBT lab machine. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the
  recommended kiosk-mode setup.

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
public/
├── manifest.webmanifest      — PWA manifest (name, icons, theme color)
├── sw.js                     — minimal service worker (registers for install prompt)
└── icons/                    — PWA icons (192, 512, maskable, apple-touch)
src/
├── app/
│   ├── (auth)/               — login, register, forgot/reset password, accept invite
│   ├── (app)/dashboard/      — protected dashboard pages
│   │   ├── schools/          — super admin: tenant management + recovery invite
│   │   ├── users/            — school admin: admin/lecturer/student tabs
│   │   ├── courses/          — view-only for school admin, full CRUD for lecturer
│   │   ├── exams/            — same role split as courses
│   │   ├── results/          — staff results view
│   │   ├── my-results/       — student results view (post-release)
│   │   └── settings/         — profile + change password (all non-student staff)
│   └── (exam)/exam/          — student exam flow
│       ├── page.tsx          — picker (lab machines land here, no id needed)
│       └── [id]/             — exam detail, take, result
├── components/
│   ├── auth/StudentAuth.tsx  — inline sign-in (email or matric) for /exam routes
│   ├── ServiceWorkerRegister.tsx — PWA registration (production only)
│   └── …                     — globally reusable UI
├── hooks/
│   ├── common/               — shared hooks (useCurrentUser, etc.)
│   └── services/             — API hooks grouped by domain
│       ├── auth/
│       ├── courses/
│       ├── exams/
│       ├── profile/          — PATCH /me + change password
│       ├── submissions/
│       ├── tenants/
│       └── users/            — incl. invite-admin (co-admin) + recovery
├── interfaces/               — TypeScript interfaces and types
├── lib/                      — axios instance, query client config
├── services/
│   ├── client/               — client-side API calls (incl. profile.ts)
│   └── server/               — server-side API calls
└── validations/              — Yup schemas (incl. profile.ts)
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

## Deploying to a CBT lab

Proctura ships as an installable PWA. For the recommended exam-day setup —
PWA install per machine, kiosk-mode launch at boot, camera permissions,
network requirements, and troubleshooting — see [DEPLOYMENT.md](./DEPLOYMENT.md).
