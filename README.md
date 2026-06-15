# StreamX

Full-stack streaming platform — **React + TypeScript** frontend on **Vercel**, **Node.js/Express** backend on **Railway**, **Supabase** PostgreSQL database.

## Architecture

```
Frontend (Vercel)  ──API calls──>  Backend (Railway)  ──SQL──>  Supabase (PostgreSQL)
   streamx.vercel.app                 streamx-backend.up.railway.app      hosted DB
```

## Deploy

### 1. Prerequisites

- GitHub account
- Railway account (free tier works)
- Vercel account (free tier works)
- Supabase project (already exists)

### 2. Initialize Git and push to GitHub

```bash
git init
git add .
git commit -m "StreamX full stack"
git branch -M main
git remote add origin https://github.com/yourusername/streamx.git
git push -u origin main
```

### 3. Deploy backend to Railway

1. Go to [railway.app](https://railway.app) → **Dashboard** → **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your `streamx` repository
4. Select the **backend** directory as the root (or set root directory in Railway settings)
5. Railway auto‑detects `railway.toml` — build: `npm install`, start: `node server.js`
6. Add the following **Environment Variables** in Railway dashboard:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://kaferdfrhxnptjtvfdiv.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZmVyZGZyaHhucHRqdHZmZGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1NTU2NiwiZXhwIjoyMDg2MDMxNTY2fQ.pubhaUM9wcCaxvQ-5wqpgiMzt_i9brwUSBMBHit2n6U` |
| `JWT_SECRET` | Generate a strong random string (e.g. `openssl rand -hex 32`) |
| `FRONTEND_URL` | Your Vercel frontend URL (e.g. `https://streamx.vercel.app`) |

7. Click **Deploy**
8. Railway provides a public URL (e.g. `https://streamx-backend.up.railway.app`)

### 4. Deploy frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your `streamx` repository
3. Vercel auto‑detects it as a Vite/React project
4. Add **Environment Variable**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://streamx-backend.up.railway.app/api` |

5. Click **Deploy**
6. Vercel provides your frontend URL (e.g. `https://streamx.vercel.app`)

### 5. Update Railway FRONTEND_URL

After Vercel deploys, go back to Railway dashboard → Variables → update `FRONTEND_URL` to your actual Vercel URL (e.g. `https://streamx.vercel.app`) → **Deploy** to apply.

## Local Development

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev       # runs on port 3001

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev       # runs on port 3000 (Vite)
```

The frontend dev server proxies API calls to `http://localhost:3001/api` via the fallback in `frontend/src/api/client.ts`.

## Project Structure

```
streamx/
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── config/         # database, auth, stripe
│   │   ├── controllers/    # auth, content, user, watch, payment, admin
│   │   ├── middleware/     # auth, validation, rateLimiter
│   │   ├── routes/         # all API route definitions
│   │   └── utils/          # helpers
│   ├── server.js
│   ├── package.json
│   └── railway.toml
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── api/client.ts   # API client with JWT handling
│   │   ├── components/     # All UI components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── vercel.json
├── DEPLOY.md               # Deployment instructions
├── README.md
└── .gitignore
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Motion, Tailwind CSS v4 |
| Backend | Node.js, Express, ESM |
| Database | Supabase (PostgreSQL) with `@supabase/supabase-js` |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Payments | Stripe (optional) |
| Security | Helmet, CORS, rate limiting, express-validator |
