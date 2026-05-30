# TeamSync — B2B Project Management Platform

A full-stack, multi-workspace project management platform built with **React**, **Node.js/Express**, and **MongoDB**. TeamSync lets teams create workspaces, manage projects, assign tasks, and collaborate — all with role-based access control.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [API Overview](#api-overview)
- [Roles & Permissions](#roles--permissions)
- [Deployment](#deployment)
- [Known Issues & Fixes](#known-issues--fixes)

---

## Features

- **Authentication** — Email/password login and registration with session-based auth (Passport.js)
- **Workspaces** — Create and switch between multiple workspaces; invite members via unique invite links
- **Projects** — Create projects with emoji icons, descriptions, and per-project analytics
- **Tasks** — Full task management with status, priority, assignee, due date, and filtering
- **Role-Based Access Control** — Three roles (Owner, Admin, Member) with granular permissions
- **Analytics** — Total, overdue, and completed task counts per workspace and project
- **Pagination** — Server-side pagination on tasks and projects

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| Passport.js (Local) | Authentication strategy |
| cookie-session | Session management |
| bcrypt | Password hashing |
| Zod | Request validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state management |
| TanStack Table v8 | Data tables |
| Axios | HTTP client |
| Zustand | Client state management |
| Tailwind CSS + shadcn/ui | Styling & UI components |
| React Hook Form + Zod | Form handling & validation |
| nuqs | URL search param state |

---

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/          # App, DB, HTTP, Passport config
│   │   ├── controllers/     # Route handlers
│   │   ├── enums/           # Shared enums (roles, task status, etc.)
│   │   ├── middlewares/     # Auth, error handler, async wrapper
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routers
│   │   ├── seeders/         # Role seeder script
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers (bcrypt, appError, roleGuard, etc.)
│   │   ├── validation/      # Zod schemas
│   │   └── index.ts         # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── client/
    ├── src/
    │   ├── components/      # UI components (sidebar, workspace, tasks, etc.)
    │   ├── constant/        # Shared enums & permission types
    │   ├── context/         # Auth context & React Query provider
    │   ├── hooks/           # Custom hooks (auth, workspace, filters, etc.)
    │   ├── hoc/             # withPermission higher-order component
    │   ├── layout/          # App layout & base layout
    │   ├── lib/             # Axios client, API functions, helpers
    │   ├── page/            # Page components (Dashboard, Tasks, Members, etc.)
    │   ├── routes/          # Route definitions & guards
    │   └── types/           # TypeScript types
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in your values
cp .env.example .env

# 4. Seed the roles into the database (required before first use)
npm run seed

# 5. Start the development server
npm run dev
```

The API will be available at `http://localhost:8000/api`.

### Frontend Setup

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in your values
cp .env.example .env

# 4. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `8000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `SESSION_SECRET` | Secret key for signing session cookies | `a-long-random-string` |
| `SESSION_EXPIRES_IN` | Session expiry duration | `1d` |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:3000` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Full base URL of the backend API | `http://localhost:8000/api` |

> **Note:** Vite env variables are injected at **build time**. If deploying to a platform like Railway, ensure `VITE_API_BASE_URL` is set in the frontend service's environment variables and that you trigger a **full redeploy** (not just a restart) after changing them.

---

## Database Seeding

The roles (`OWNER`, `ADMIN`, `MEMBER`) and their associated permissions must be seeded before the app works correctly. Run the seeder once after setting up your database:

```bash
cd backend
npm run seed
```

This is safe to re-run — it clears existing roles and recreates them.

---

## API Overview

All routes are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Log in | No |
| `POST` | `/auth/logout` | Log out | No |
| `GET` | `/user/current` | Get current user | Yes |
| `POST` | `/workspace/create/new` | Create a workspace | Yes |
| `GET` | `/workspace/all` | Get all user's workspaces | Yes |
| `GET` | `/workspace/:id` | Get workspace by ID | Yes |
| `PUT` | `/workspace/update/:id` | Update workspace | Yes |
| `DELETE` | `/workspace/delete/:id` | Delete workspace | Yes |
| `GET` | `/workspace/members/:id` | Get workspace members | Yes |
| `GET` | `/workspace/analytics/:id` | Get workspace analytics | Yes |
| `PUT` | `/workspace/change/member/role/:id` | Change a member's role | Yes |
| `POST` | `/member/workspace/:inviteCode/join` | Join workspace via invite | Yes |
| `POST` | `/project/workspace/:workspaceId/create` | Create a project | Yes |
| `GET` | `/project/workspace/:workspaceId/all` | List projects | Yes |
| `GET` | `/project/:id/workspace/:workspaceId` | Get project by ID | Yes |
| `PUT` | `/project/:id/workspace/:workspaceId/update` | Update project | Yes |
| `DELETE` | `/project/:id/workspace/:workspaceId/delete` | Delete project | Yes |
| `GET` | `/project/:id/workspace/:workspaceId/analytics` | Project analytics | Yes |
| `POST` | `/task/project/:projectId/workspace/:workspaceId/create` | Create a task | Yes |
| `GET` | `/task/workspace/:workspaceId/all` | List tasks (with filters) | Yes |
| `PUT` | `/task/:id/project/:projectId/workspace/:workspaceId/update` | Update task | Yes |
| `DELETE` | `/task/:id/workspace/:workspaceId/delete` | Delete task | Yes |

### Task Filters (query params for `GET /task/workspace/:workspaceId/all`)

| Param | Type | Description |
|---|---|---|
| `keyword` | string | Search by task title |
| `status` | string | Comma-separated statuses (`TODO,IN_PROGRESS`) |
| `priority` | string | Comma-separated priorities (`HIGH,MEDIUM`) |
| `assignedTo` | string | Comma-separated user IDs |
| `projectId` | string | Filter by project |
| `dueDate` | string | Filter by exact due date |
| `pageNumber` | number | Page number (default: 1) |
| `pageSize` | number | Results per page (default: 10) |

---

## Roles & Permissions

| Permission | OWNER | ADMIN | MEMBER |
|---|:---:|:---:|:---:|
| Create Workspace | ✅ | ❌ | ❌ |
| Edit Workspace | ✅ | ❌ | ❌ |
| Delete Workspace | ✅ | ❌ | ❌ |
| Manage Workspace Settings | ✅ | ✅ | ❌ |
| Add Member | ✅ | ✅ | ❌ |
| Change Member Role | ✅ | ❌ | ❌ |
| Remove Member | ✅ | ❌ | ❌ |
| Create Project | ✅ | ✅ | ❌ |
| Edit Project | ✅ | ✅ | ❌ |
| Delete Project | ✅ | ✅ | ❌ |
| Create Task | ✅ | ✅ | ✅ |
| Edit Task | ✅ | ✅ | ✅ |
| Delete Task | ✅ | ✅ | ❌ |
| View Only | ✅ | ✅ | ✅ |

---

## Deployment

This project is configured for deployment on [Railway](https://railway.app).

### Backend

1. Set all required environment variables on the backend service
2. Set `NODE_ENV=production`
3. Set `FRONTEND_ORIGIN` to your frontend's public URL
4. Railway will run `npm run build` then `npm start`

### Frontend

1. Set `VITE_API_BASE_URL` to your backend's public API URL (e.g. `https://your-backend.up.railway.app/api`)
2. Trigger a **full redeploy** after setting env variables — Vite bakes them in at build time

---

## Known Issues & Fixes

### Session lost immediately after login (production)

When the frontend and backend are on different domains in production, two things are required:

**1. Trust Railway's proxy** — add to `backend/src/index.ts`:
```ts
app.set("trust proxy", 1);
```

**2. Use `sameSite: "none"` for cross-origin cookies** — update the session config:
```ts
session({
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  secure: config.NODE_ENV === "production",
  // ...
})
```

### CORS errors in production

Ensure `FRONTEND_ORIGIN` on the backend service exactly matches your frontend URL (no trailing slash). For multiple origins, separate them with commas.

### `VITE_API_BASE_URL` not picked up

Vite env variables are baked in at build time. After adding or changing `VITE_API_BASE_URL` on Railway, you must trigger a **new deploy** (not a restart) for the change to take effect.