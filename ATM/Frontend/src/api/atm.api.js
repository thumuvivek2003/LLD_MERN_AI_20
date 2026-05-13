import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/atm';

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

function unwrap(promise) {
  return promise
    .then((res) => res.data?.data ?? res.data)
    .catch((err) => {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Network error';
      const status = err.response?.status;
      const payload = err.response?.data?.data || err.response?.data || {};
      const e = new Error(message);
      e.status = status;
      e.payload = payload;
      throw e;
    });
}

export const atmApi = {
  getCards: () => unwrap(client.get('/cards')),
  insertCard: (cardNumber) => unwrap(client.post('/insert-card', { cardNumber })),
  enterPin: (sessionId, pin) => unwrap(client.post('/enter-pin', { sessionId, pin })),
  getBalance: (sessionId) => unwrap(client.post('/balance', { sessionId })),
  withdrawPreview: (sessionId, amount) =>
    unwrap(client.post('/withdraw/preview', { sessionId, amount })),
  withdrawConfirm: (sessionId, amount) =>
    unwrap(client.post('/withdraw/confirm', { sessionId, amount })),
  collectCash: (sessionId) => unwrap(client.post('/collect-cash', { sessionId })),
  ejectCard: (sessionId) => unwrap(client.post('/eject-card', { sessionId }))
};

export default atmApi;
