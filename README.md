# Imageify — AI-Powered Image Generation Platform

A full-stack platform where users generate AI images from text prompts, manage a
credit balance, and buy more credits via Razorpay.

```
imageify/
├── backend/     # Node.js + Express + Prisma + PostgreSQL API   ✅ done
└── frontend/    # Angular 19 + Tailwind CSS                      ✅ done
```

## Stack

- **Frontend:** Angular 19 (standalone components) + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** Neon PostgreSQL + Prisma ORM
- **Auth:** JWT + bcrypt
- **Image AI:** Hugging Face Inference API
- **Payments:** Razorpay (Test Mode)
- **Deploy:** Frontend → Vercel · Backend → Render/Railway · DB → Neon

## Getting started

See [`backend/README.md`](./backend/README.md) for backend setup, full API
documentation, and deployment. See [`frontend/README.md`](./frontend/README.md)
for the Angular app setup and Vercel deployment.

**Quick start:** run the backend first (it must be on `http://localhost:5000`
with `CLIENT_URL=http://localhost:4200`), then `cd frontend && npm install && npm start`.

## Features

- Email/password auth with hashed passwords and JWT-protected routes
- 10 free credits per new user; 1 credit per generation; blocked at 0
- Text-to-image with style + aspect-ratio controls (Hugging Face)
- Image history with search, pagination, favorites, download, delete
- Razorpay credit packages with server-side signature verification
- Transaction history
- Profile editing + password change
- Optional admin role
