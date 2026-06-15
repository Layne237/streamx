# StreamX

Full-stack streaming platform — **React + TypeScript** frontend on Vercel, **Node.js/Express** backend on Render, **Supabase** PostgreSQL database.

## Architecture

```
Frontend (Vercel)  ──API calls──>  Backend (Render)  ──SQL──>  Supabase (PostgreSQL)
   streamx.vercel.app                 streamx-backend.onrender.com      hosted DB
```

## Deploy

### 1. Prerequisites

- GitHub account
- Render account (free tier works)
- Vercel account (free tier works)
- Supabase project (already exists)

### 2. Initialize Git and push to GitHub

```bash
git init
git add .
git commit -m "StreamX full stack"
git remote add origin https://github.com/yourusername/streamx.git
git push -u origin main
```

### 3. Deploy backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your `streamx` repository
3. Render auto-detects `backend/render.yaml` — or configure manually:
   - **Name**: `streamx-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. Add the following **Environment Variables** (do not commit these to git):

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://kaferdfrhxnptjtvfdiv.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZmVyZGZyaHhucHRqdHZmZGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1NTU2NiwiZXhwIjoyMDg2MDMxNTY2fQ.pubhaUM9wcCaxvQ-5wqpgiMzt_i9brwUSBMBHit2n6U` |
| `JWT_SECRET` | Generate a strong random string (e.g. `openssl rand -hex 32`) |
| `FRONTEND_URL` | Your Vercel frontend URL (e.g. `https://streamx.vercel.app`) |
| `PORT` | `10000` |

5. Click **Deploy Web Service**
6. Note the backend URL (e.g. `https://streamx-backend.onrender.com`)

### 4. Deploy frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your `streamx` repository
3. Vercel auto-detects it as a Vite/React project
4. Add **Environment Variable**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://streamx-backend.onrender.com/api` |

5. Click **Deploy**
6. Vercel provides your frontend URL (e.g. `https://streamx.vercel.app`)

### 5. Update Render FRONTEND_URL

After Vercel deploys, go back to Render dashboard → Environment → update `FRONTEND_URL` to your actual Vercel URL (e.g. `https://streamx.vercel.app`) → **Save & Deploy**.

## Local Development

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev       # runs on port 3001

# Terminal 2 — Frontend
npm install
npm run dev       # runs on port 5173 (Vite default)
```

The frontend dev server proxies API calls to `http://localhost:3001/api` via the fallback in `src/api/client.ts`.

## Project Structure

```
streamx/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/       # database, auth, stripe
│   │   ├── controllers/  # auth, content, user, watch, payment, admin
│   │   ├── middleware/    # auth, validation, rateLimiter
│   │   ├── routes/       # all API route definitions
│   │   └── utils/        # helpers
│   ├── server.js
│   ├── package.json
│   └── render.yaml
├── src/                  # React + TypeScript frontend
│   ├── api/client.ts     # API client with JWT handling
│   ├── components/       # All UI components
│   ├── App.tsx
│   └── main.tsx
├── vercel.json           # Vercel SPA rewrites + env
├── package.json
└── README.md
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
