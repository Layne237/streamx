# StreamX Backend

Node.js/Express API for StreamX streaming platform. Uses Supabase PostgreSQL, JWT authentication, bcrypt password hashing, and Stripe for payments.

## Tech Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express 4
- **Database**: Supabase (PostgreSQL with `@supabase/supabase-js`)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Payments**: Stripe (optional, disabled without keys)
- **Security**: Helmet, CORS, rate limiting (`express-rate-limit`), input validation (`express-validator`)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # Supabase client init
│   │   ├── auth.js            # JWT sign/verify
│   │   └── stripe.js          # Stripe client init
│   ├── controllers/
│   │   ├── authController.js   # register, login, me
│   │   ├── contentController.js# catalog, featured, trending, byId, episodes, search
│   │   ├── userController.js   # profile, stats, watchlist, history, progress
│   │   ├── watchController.js  # stream token, progress reporting
│   │   ├── paymentController.js# plans, checkout, webhook, portal, cancel
│   │   └── adminController.js  # dashboard, users, reviews, DMCA
│   ├── middleware/
│   │   ├── auth.js            # authenticate, optionalAuth, requireAdmin
│   │   ├── validation.js      # express-validator rules
│   │   └── rateLimiter.js     # API-level and auth-level rate limiters
│   ├── routes/
│   │   ├── auth.js
│   │   ├── content.js
│   │   ├── users.js
│   │   ├── watch.js
│   │   ├── payment.js
│   │   └── admin.js
│   └── utils/
│       └── helpers.js         # paginate, formatContentRow, formatUserRow
├── server.js                  # Express app entry point
├── package.json
├── render.yaml                # Render deployment config
└── .env.example
```

## Quick Start

```bash
# 1. Clone and install
cd backend
npm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Start development server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service_role key (secret) |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (sk_) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret (whsec_) |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:3000`) |
| `PORT` | No | Server port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Create account (email, password, username)
- `POST /login` - Sign in (email, password)
- `GET /me` - Get current user (requires auth)

### Content (`/api/content`)
- `GET /catalog` - Browse with pagination, filters: `type`, `genre`, `year`, `search`, `sort`
- `GET /featured` - Featured/promoted content
- `GET /trending` - Trending (by recent views + rating)
- `GET /search?q=` - Full-text search
- `GET /:id` - Single content with seasons/episodes
- `GET /:id/episodes` - Episodes grouped by season

### Users (`/api/users`)
- `GET /profile` - Get profile
- `PATCH /profile` - Update profile (displayName, username, avatarUrl)
- `GET /stats` - Watchlist/history/review counts
- `GET /watchlist` - List watchlist with content details
- `POST /watchlist` - Add to watchlist (`{ content_id }`)
- `DELETE /watchlist/:contentId` - Remove from watchlist
- `GET /history` - Watch history
- `POST /history/progress` - Update watch progress
- `DELETE /history` - Clear history

### Watch (`/api/watch`)
- `GET /token/:id` - Get signed stream token
- `POST /progress/:id` - Report playback progress

### Payments (`/api/payments`)
- `GET /plans` - List available plans
- `POST /checkout` - Create Stripe checkout session
- `POST /webhook` - Stripe webhook (raw body)
- `GET /portal` - Stripe billing portal
- `POST /cancel` - Cancel subscription at period end

### Admin (`/api/admin`) — requires admin role
- `GET /dashboard` - Platform statistics
- `GET /users` - List users with search/pagination
- `PATCH /users/:id` - Update user (role, plan, etc.)
- `DELETE /users/:id` - Delete user and all related data
- `PATCH /reviews/:id/moderate` - Moderate a review
- `GET /dmca` - Unmoderated reviews (DMCA queue)

## Deploy to Render

1. Push to GitHub
2. In Render dashboard: **New → Web Service**
3. Connect your repo
4. Render auto-detects `render.yaml` or:
   - Build command: `npm install`
   - Start command: `node server.js`
5. Add environment variables in Render dashboard
6. Deploy

## Database Schema

All tables use `SERIAL` integer primary keys. Key tables:
- `users` — accounts, auth, roles
- `content` — movies & series metadata
- `seasons` — series seasons (FK → content)
- `episodes` — episode metadata (FK → seasons)
- `watchlist` — user saved items (FK → users, content)
- `watch_history` — playback progress (FK → users, content)
- `reviews` / `ratings` — user reviews and star ratings
- `subscriptions` / `invoices` / `payment_failures` / `payment_methods` — billing
- `video_streams` — transcoded video quality variants
- `stream_logs` — access logs per stream
- `genres` / `content_genres` — genre classification
- `profiles` — extended user profile data

## Security

- Rate limiting: 100 req/15 min per IP (global), 20 req/15 min (auth)
- Input validation on all mutation endpoints
- Helmet security headers
- CORS restricted to `FRONTEND_URL`
- JWT with 7-day expiry
- bcrypt with 12 salt rounds
- Stripe webhook signature verification
