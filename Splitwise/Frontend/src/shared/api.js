import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const userId = localStorage.getItem('splitwise_user_id');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

client.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        const err = new Error(body.message || 'Request failed');
        err.code = body.code;
        throw err;
      }
      return body.data ?? {};
    }
    return body;
  },
  (err) => {
    const data = err.response?.data;
    const message = data?.message || err.message || 'Network error';
    const e = new Error(message);
    e.code = data?.code;
    e.status = err.response?.status;
    return Promise.reject(e);
  }
);

export const api = {
  // Users
  listUsers: () => client.get('/users'),
  createUser: (payload) => client.post('/users', payload),
  getUser: (userId) => client.get(`/users/${userId}`),

  // Groups
  listGroups: (userId) => client.get('/groups', { params: userId ? { userId } : {} }),
  createGroup: (payload) => client.post('/groups', payload),
  getGroup: (groupId) => client.get(`/groups/${groupId}`),
  updateGroup: (groupId, payload) => client.patch(`/groups/${groupId}`, payload),
  addMember: (groupId, userId) => client.post(`/groups/${groupId}/members`, { userId }),
  removeMember: (groupId, userId) => client.delete(`/groups/${groupId}/members/${userId}`),
  leaveGroup: (groupId, userId) => client.post(`/groups/${groupId}/leave`, { userId }),

  // Expenses
  listExpenses: (groupId) => client.get(`/groups/${groupId}/expenses`),
  createExpense: (groupId, payload) => client.post(`/groups/${groupId}/expenses`, payload),
  getExpense: (expenseId) => client.get(`/expenses/${expenseId}`),
  updateExpense: (expenseId, payload) => client.patch(`/expenses/${expenseId}`, payload),
  deleteExpense: (expenseId) => client.delete(`/expenses/${expenseId}`),

  // Settlements
  listSettlements: (groupId) => client.get(`/groups/${groupId}/settlements`),
  createSettlement: (groupId, payload) => client.post(`/groups/${groupId}/settlements`, payload),

  // Balances
  getBalances: (groupId) => client.get(`/groups/${groupId}/balances`),
  getSimplifiedDebts: (groupId) => client.get(`/groups/${groupId}/balances/simplified`)
};

export default api;
