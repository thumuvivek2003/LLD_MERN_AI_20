import { get } from './api.client.js';

export const threadApi = {
  getThread: (id) => get(`/threads/${id}`),
};

export default threadApi;
