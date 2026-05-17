# Rate Limiter Frontend

React + Vite + Tailwind frontend for the Rate Limiter learning project.

## Run

```bash
npm install
npm run dev
```

Dev server: http://localhost:5173 (proxies `/api` to `http://localhost:4000`).

The backend must be running on port 4000.

## Default seeded credentials

- Admin: `admin` / `admin123`
- Demo client: `mobile-app` / `client123`

## Stack

- React 18, Vite 5, Tailwind 3
- react-router-dom v6
- zustand (with localStorage persistence for auth)
- axios

## Structure

- `src/app/` providers, layouts, router
- `src/modules/auth` login + auth store
- `src/modules/dashboard` admin + client dashboards
- `src/modules/strategies` strategy selection
- `src/modules/configurations` rate-limit knobs
- `src/modules/users` client management + details
- `src/modules/apiConsole` send test requests with `x-api-key`
- `src/modules/shared` shared components, http client, utils
