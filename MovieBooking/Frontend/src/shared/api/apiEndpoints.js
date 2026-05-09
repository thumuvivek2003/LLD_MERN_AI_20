export const ENDPOINTS = {
  auth: { login: '/auth/login', register: '/auth/register', logout: '/auth/logout', me: '/auth/me' },
  movies: { list: '/movies', detail: (id) => `/movies/${id}`, shows: (id) => `/shows/movie/${id}` },
  shows: { detail: (id) => `/shows/${id}`, seats: (id) => `/seat-locks/show/${id}` },
  seatLocks: { lock: '/seat-locks' },
  payments: { process: '/payments/process' },
  bookings: { create: '/bookings', list: '/bookings/me', detail: (id) => `/bookings/${id}`, cancel: (id) => `/bookings/${id}/cancel` },
  admin: {
    dashboard: '/admin/dashboard',
    movies: { list: '/movies', create: '/movies', update: (id) => `/movies/${id}`, delete: (id) => `/movies/${id}` },
    theaters: { list: '/admin/theaters', create: '/admin/theaters', update: (id) => `/admin/theaters/${id}`, delete: (id) => `/admin/theaters/${id}` },
    screens: { byTheater: (tId) => `/admin/screens/theater/${tId}`, layout: (sId) => `/admin/screens/${sId}/layout` },
    shows: { list: '/shows', create: '/shows', update: (id) => `/shows/${id}`, delete: (id) => `/shows/${id}` },
  },
};
