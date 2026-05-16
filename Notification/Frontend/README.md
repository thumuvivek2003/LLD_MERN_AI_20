# Notification System — Frontend

React + Vite + Tailwind + Zustand frontend for the Notification System MVP.
Talks to the backend at `http://localhost:5001/api`.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 and use the **actor switcher** in the topbar (User / Admin / System) to change context. The selected actor drives the route group and the `x-actor-id` / `x-actor-role` headers sent on every request.

## Stack

- React 18 (ESM) + Vite 5
- React Router v6
- Zustand for stores
- Axios singleton (`shared/api/axiosClient.js`)
- Tailwind 3

## Structure

```
src/
  app/          providers + root store
  config/       routes + sidebar configs
  layouts/      shells (sidebar + topbar)
  modules/      user | admin | template | notification | system
  routes/       router groups
  shared/       api, components, hooks, utils, constants, state
```

Each module follows: `pages/`, `components/`, `services/`, `hooks/`, `state/`.

## API Contract

See `../_contract/API_CONTRACT.md` — response envelope is `{ success, data, error }`, headers are `x-actor-id` + `x-actor-role`.
