# Classroom Frontend

Admin dashboard and student portal for the Classroom Management System — built with React 19, Refine v5, shadcn/ui, and Tailwind CSS v4.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Admin framework | Refine v5 |
| UI components | shadcn/ui + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Auth | better-auth (via backend) |
| Image uploads | Cloudinary upload widget |
| Deployment | Vercel |

## Prerequisites

- Node.js 20+
- The [backend](../classrom-backend) running on port 8000

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example below into a `.env` file at the project root:

```env
VITE_BACKEND_BASE_URL=http://localhost:8000/api/

# Cloudinary (optional — only needed for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
├── components/
│   ├── refine-ui/          # Refine-aware components (buttons, data table, views, layout)
│   └── ui/                 # shadcn/ui primitives
├── constants/              # BACKEND_BASE_URL, Cloudinary config, role constants
├── lib/
│   └── schema.ts           # Zod schemas (faculty, class, enrollment)
├── pages/
│   ├── auth/               # login.tsx, register.tsx
│   ├── classes/            # list, create, show (enrollments), edit
│   ├── dashboard/          # dashboard.tsx
│   ├── departments/        # list, create, show, edit
│   ├── subjects/           # list, create, show, edit
│   └── users/              # list, show, edit
├── providers/
│   ├── auth.ts             # Refine authProvider — talks to better-auth endpoints
│   └── data.ts             # Refine dataProvider — wraps @refinedev/rest with custom mappers
├── types/
│   └── index.ts            # User, Subject, Department, ClassDetails, Schedule, etc.
└── App.tsx                 # Refine root — resources, routes, providers
```

## Roles & Access Control

| Role | Access |
|---|---|
| `admin` | Full access to all resources |
| `teacher` | Dashboard, classes, subjects, departments; read-only users |
| `student` | Dashboard and classes only (join via invite code) |

Role checks are done directly in components via `useGetIdentity`.

## Authentication

Auth is handled entirely by the backend (better-auth). The frontend sends credentials to `/api/auth/*` with `credentials: include` — session cookies are managed by the browser.

- **Login**: `POST /api/auth/sign-in/email`
- **Register**: `POST /api/auth/sign-up/email`
- **Logout**: `POST /api/auth/sign-out`
- **Session**: `GET /api/auth/get-session`

## Deployment

The project deploys automatically to Vercel on every push to `main` via GitHub Actions. The workflow:

1. Runs `tsc --noEmit` (type-check)
2. Runs `npm run build`
3. Deploys to Vercel using `vercel --prod`

Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and the `VITE_*` secrets listed above.

## License

MIT
