import { get, post } from './api.client.js';

export const mailApi = {
  // body: { senderId, to: string[], subject, body }
  send: (payload) => post('/mails/send', payload),
  getInbox: (userId) => get('/mails/inbox', { params: { userId } }),
  getSent: (userId) => get('/mails/sent', { params: { userId } }),
  // marks READ for this user
  getMail: (id, userId) => get(`/mails/${id}`, { params: { userId } }),
  // body: { senderId, body }
  reply: (id, payload) => post(`/mails/${id}/reply`, payload),
};

export default mailApi;
