# StreamX Deployment Guide

## Architecture

```
Frontend (Vercel)  ──API calls──>  Backend (Railway)  ──SQL──>  Supabase (PostgreSQL)
   streamx.vercel.app              streamx-backend.up.railway.app       hosted DB
```

## 1. Prerequisites

- [GitHub](https://github.com) account
- [Railway](https://railway.app) account (free tier)
- [Vercel](https://vercel.com) account (free tier)
- Supabase project (already exists)

## 2. Local Testing

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm install
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` — the frontend proxies API calls to `http://localhost:3001/api`.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "StreamX full stack"
git branch -M main
git remote add origin https://github.com/yourusername/streamx.git
git push -u origin main
```

## 4. Deploy Backend to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard) → **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your `streamx` repository
4. Railway auto-detects `railway.toml` in the `backend/` directory
5. Set **Root Directory** to `backend` in Railway project settings
6. Add these **Environment Variables** in Railway dashboard:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | `https://kaferdfrhxnptjtvfdiv.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key |
| `JWT_SECRET` | Generate with `openssl rand -hex 32` |
| `FRONTEND_URL` | `http://localhost:3000` (update after Vercel deploy) |

7. Click **Deploy**
8. Railway provides a public URL (e.g. `https://streamx-backend.up.railway.app`)

## 5. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**
2. Import your `streamx` repository
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://streamx-backend.up.railway.app/api` |

5. Click **Deploy**
6. Vercel provides your frontend URL (e.g. `https://streamx.vercel.app`)

## 6. Final Step

Go back to Railway dashboard → **Variables** → update `FRONTEND_URL` to your Vercel URL (e.g. `https://streamx.vercel.app`) → redeploy.

## Environment Variables Reference

### Backend (`backend/.env.example`)

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...       # optional
STRIPE_WEBHOOK_SECRET=whsec_...      # optional
```

### Frontend

```
VITE_API_URL=http://localhost:3001/api   # dev fallback
```

In production, set `VITE_API_URL` in Vercel dashboard to the Railway backend URL.
