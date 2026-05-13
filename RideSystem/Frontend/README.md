# Ride System Frontend

React + Vite + Tailwind. ESM, SOLID, module-based.

## Run

```bash
cd Frontend
npm install
npm run dev   # http://localhost:5173 (proxies /api to backend)
```

## Modules
- **auth** – Login / Register
- **rider** – Home, Find driver, Searching, Driver accepted, Live tracking, OTP, In-progress, Completed, Payment, History, Details
- **driver** – Dashboard, Vehicle register, Online/offline, Incoming ride, Accepted, OTP verify, On trip, Summary, Earnings, History, Profile
- **admin** – Dashboard, Riders/Drivers management, Driver details, Ride monitoring, Ride details, Analytics, Profile
- **notification** – Toasts driven by socket events

## Patterns
- **Singleton** – axios client, socket connection
- **Strategy-of-rendering** – role-based guards & layouts
- **Repository-like** – per-module api files isolating endpoints from UI
- **Observer / Pub-Sub** – socket events → notification service → toasts
- **Context providers** – Auth, Socket, Notification (Dependency Inversion in React)

## Conventions
- Pages → `modules/<role>/pages/*Page.jsx`
- Components → `modules/<role>/components/*.jsx`
- Reusable UI → `core/components/ui/*`
- API per module → `modules/<role>/services/*.api.js` using `core/api/api.endpoints.js`
