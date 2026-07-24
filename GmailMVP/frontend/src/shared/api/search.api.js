import { get } from './api.client.js';

export const searchApi = {
  // type: 'all' | 'from' | 'to' | 'subject' | 'body'
  search: ({ userId, q, type = 'all' }) =>
    get('/search', { params: { userId, q, type } }),
};

export default searchApi;
