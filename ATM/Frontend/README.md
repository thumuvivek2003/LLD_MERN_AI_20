# ATM Frontend

React + Vite + Tailwind frontend for the ATM machine simulation.

## Setup

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment

`.env` already contains:

```
VITE_API_URL=http://localhost:5001/api/atm
```

Make sure the backend (Node/Express + Mongo) is running at that URL.

## Build

```bash
npm run build
npm run preview
```

## Notes

- All ATM screens render inside a single kiosk frame; the inner screen swaps based
  on the current `atmState` held in `ATMContext`.
- Session auto-times out after 60 seconds of inactivity once the user is authenticated.
- No real card reader; cards are picked from a dropdown populated via `GET /api/atm/cards`.
