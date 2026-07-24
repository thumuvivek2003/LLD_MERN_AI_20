import { get } from './api.client.js';

export const userApi = {
  getUsers: () => get('/users'),
  getUser: (id) => get(`/users/${id}`),
};

export default userApi;
