# Imageify — Backend API

AI-Powered Image Generation Platform. REST API built with **Node.js + Express + Prisma + Neon PostgreSQL**, JWT auth, Hugging Face image generation, and Razorpay payments.

---

## Tech Stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Runtime        | Node.js (ES Modules)                     |
| Framework      | Express.js                               |
| ORM            | Prisma                                   |
| Database       | Neon PostgreSQL                          |
| Auth           | JWT + bcryptjs                           |
| Validation     | Zod                                      |
| Image AI       | Hugging Face Inference API               |
| Payments       | Razorpay (Test Mode)                     |
| Security       | helmet, cors, express-rate-limit         |

---

## Folder Structure

```
backend/
├── prisma/
│   ├── migrations/            # SQL migrations
│   ├── schema.prisma          # DB schema
│   └── seed.js                # admin seed
├── src/
│   ├── config/                # env, prisma client, constants
│   ├── controllers/           # thin request handlers
│   ├── services/              # business logic (auth, image, payment, ...)
│   ├── routes/                # express routers
│   ├── middleware/            # auth, validate, role, error, 404
│   ├── validations/           # zod schemas
│   ├── utils/                 # ApiError, asyncHandler, jwt, ApiResponse
│   ├── app.js                 # express app
│   └── server.js              # entry point
├── .env.example
└── package.json
```

---

## Setup

```bash
cd backend
npm install

# 1. Configure environment
cp .env.example .env
#    -> fill in DATABASE_URL / DIRECT_URL (Neon), JWT_SECRET,
#       HF_API_TOKEN, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# 2. Generate the Prisma client
npm run prisma:generate

# 3. Apply migrations to your Neon database
npm run prisma:deploy      # (or `npm run prisma:migrate` in dev)

# 4. (optional) Seed an admin user  -> admin@imageify.com / Admin@123
npm run seed

# 5. Run
npm run dev                # http://localhost:5000
```

### Getting the keys

- **Neon**: create a project at neon.tech → copy the pooled connection string into `DATABASE_URL` and the direct (non-pooled) one into `DIRECT_URL`.
- **Hugging Face**: huggingface.co → Settings → Access Tokens → create a `read` token.
- **Razorpay**: dashboard.razorpay.com → Test Mode → Settings → API Keys.

---

## API Documentation

Base URL: `http://localhost:5000/api`
All protected routes require header: `Authorization: Bearer <token>`
All responses share the envelope `{ success, message, data }` (errors add `errors`).

### Auth

| Method | Endpoint                | Auth | Body                                              |
| ------ | ----------------------- | ---- | ------------------------------------------------- |
| POST   | `/auth/signup`          | —    | `{ name, email, password }`                       |
| POST   | `/auth/login`           | —    | `{ email, password }`                             |
| POST   | `/auth/logout`          | ✅   | —                                                 |
| GET    | `/auth/me`              | ✅   | —                                                 |
| PATCH  | `/auth/profile`         | ✅   | `{ name?, email? }`                               |
| PATCH  | `/auth/change-password` | ✅   | `{ currentPassword, newPassword }`                |

`signup`/`login` return `{ user, token }`.

### Images

| Method | Endpoint                | Auth | Body / Query                                        |
| ------ | ----------------------- | ---- | --------------------------------------------------- |
| POST   | `/images/generate`      | ✅   | `{ prompt, style, aspectRatio }`                    |
| GET    | `/images/history`       | ✅   | `?page&limit&search&favorites=true`                 |
| PATCH  | `/images/:id/favorite`  | ✅   | —                                                   |
| DELETE | `/images/:id`           | ✅   | —                                                   |

- `style` ∈ `Realistic | Anime | Digital Art | Sketch`
- `aspectRatio` ∈ `1:1 | 16:9 | 9:16`
- `generate` returns `{ image, credits }`. Costs **1 credit**; returns **402** when out of credits.
- Generated image is returned/stored as a base64 data URL in `image.imageUrl`.

### Payments

| Method | Endpoint                  | Auth | Body / Query                                                  |
| ------ | ------------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/payments/packages`      | —    | —                                                             |
| POST   | `/payments/order`         | ✅   | `{ packageId }`                                               |
| POST   | `/payments/verify`        | ✅   | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` |
| GET    | `/payments/transactions`  | ✅   | `?page&limit`                                                 |

Packages: `pack_99` (₹99→100), `pack_299` (₹299→350), `pack_499` (₹499→700).

**Payment flow:** `POST /order` → open Razorpay Checkout on the frontend → on success, `POST /verify` with the three Razorpay fields → backend verifies the HMAC-SHA256 signature, marks the transaction `SUCCESS`, and credits the account.

---

## Deployment (Render / Railway)

1. Push repo to GitHub.
2. Create a new **Web Service** pointing at `backend/`.
3. Build command: `npm install && npm run prisma:generate`
4. Start command: `npm run prisma:deploy && npm start`
5. Add all env vars from `.env.example` (set `NODE_ENV=production`, `CLIENT_URL=<your Vercel URL>`).
6. Neon works out of the box; make sure `?sslmode=require` is on the connection strings.

---

## Suggested Git Commits

```
chore: scaffold backend structure and tooling
feat: add prisma schema, migration, and db client
feat: implement JWT auth (signup, login, protected routes)
feat: add user profile and change-password endpoints
feat: integrate Hugging Face image generation with credit deduction
feat: add image history, search, pagination, and favorites
feat: integrate Razorpay orders and signature verification
feat: add transaction history endpoint
chore: add global error handling, validation, and rate limiting
docs: add README and API documentation
```
