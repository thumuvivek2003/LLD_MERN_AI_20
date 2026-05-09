import api from './axiosConfig';

export const borrowApi = {
  borrowBook: (bookId) => api.post('/borrows', { bookId }),
  returnBook: (id) => api.patch(`/borrows/${id}/return`),
  getBorrowHistory: (params) => api.get('/borrows/history', { params }),
  getAllActiveBorrows: (params) => api.get('/borrows/active', { params }),
};
