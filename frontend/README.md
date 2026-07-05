# Imageify — Frontend (Angular 19)

The web client for Imageify. Angular 19 standalone components, Tailwind CSS, lazy-loaded routes, signals for state, JWT auth, and Razorpay checkout.

---

## Tech Stack

- **Angular 19** (standalone components, no NgModules)
- **Tailwind CSS 3** (dark mode via `class`)
- **Signals** for auth/theme/toast state
- **Reactive Forms** with validation
- **Functional guards + HTTP interceptors**
- Lazy loading via `loadComponent`

---

## Folder Structure

```
frontend/src/app/
├── core/
│   ├── models/           # typed interfaces (user, image, payment, api)
│   ├── services/         # auth, image, payment, theme, toast (signals)
│   ├── guards/           # authGuard, guestGuard, adminGuard
│   └── interceptors/     # auth (bearer token), error (toast + 401 logout)
├── shared/components/    # navbar, footer, spinner, skeleton, toast,
│                         # image-card, pagination
├── features/             # one folder per page (lazy-loaded)
│   ├── home/  auth/  dashboard/  generate/  history/
│   ├── pricing/  profile/  transactions/  not-found/
├── app.component.ts      # shell (navbar + outlet + footer + toasts)
├── app.config.ts         # providers (router, http, interceptors)
└── app.routes.ts         # lazy routes + guards
```

---

## Setup

```bash
cd frontend
npm install

# Point the app at your backend
#   src/environments/environment.ts       -> local  (default http://localhost:5000/api)
#   src/environments/environment.prod.ts  -> production backend URL

npm start           # dev server at http://localhost:4200
npm run build       # production build -> dist/imageify
```

The backend must be running (see `../backend/README.md`) and its
`CLIENT_URL` should be `http://localhost:4200` so CORS allows the client.

---

## Key Design Decisions

- **Theme:** ink base with a single violet→cyan "spectrum" gradient as the
  signature accent (brand mark, primary buttons, 404). Everything else stays
  quiet. Dark/light toggle persists to `localStorage` and respects the OS
  preference on first visit.
- **Fonts:** Bricolage Grotesque (display) + Inter (body), loaded from Google Fonts.
- **State:** `AuthService` exposes `user`, `isAuthenticated`, `credits`,
  `isAdmin` as signals/computed so the navbar credit badge updates instantly
  after a generation or purchase.
- **Credit gating:** the Generate page disables the form and shows a
  "Buy credits" call-to-action when the balance hits 0.
- **Razorpay:** the checkout script is loaded in `index.html`; the flow is
  create order → open checkout → verify signature server-side → sync credits.

---

## Accessibility & Polish

- Visible keyboard focus rings everywhere (`:focus-visible`).
- `prefers-reduced-motion` disables animations.
- Skeleton loaders and spinners for every async view.
- Mobile-first responsive layout.

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. In Vercel, import the project and set the **Root Directory** to `frontend`.
3. Framework preset: **Angular**. Build command `npm run build`,
   output directory `dist/imageify/browser`.
4. Set `environment.prod.ts` `apiUrl` to your deployed backend URL before building.
5. Add a rewrite so client-side routes work — create `frontend/vercel.json`:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## Suggested Git Commits

```
chore: scaffold angular 19 app with tailwind and design tokens
feat: add core models, auth service (signals), guards, interceptors
feat: build shared UI (navbar, toasts, spinner, skeleton, image card)
feat: add home landing page and auth (login/signup) with reactive forms
feat: implement image generation page with style/ratio controls
feat: add dashboard with credit balance and recent activity
feat: add gallery with search, favorites, and pagination
feat: integrate razorpay checkout on pricing page
feat: add profile editing, change password, and transactions pages
feat: add 404 page, dark/light mode, and responsive polish
docs: add frontend README and deployment notes
```
