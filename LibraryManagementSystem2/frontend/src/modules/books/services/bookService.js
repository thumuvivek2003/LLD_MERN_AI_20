import apiClient from '../../../shared/services/apiClient.js';

export const getBooks = (q = '') => apiClient.get(`/books?q=${q}`);
export const getBook = (id) => apiClient.get(`/books/${id}`);
export const addBook = (data) => apiClient.post('/books', data);
export const editBook = (id, data) => apiClient.put(`/books/${id}`, data);
export const deleteBook = (id) => apiClient.delete(`/books/${id}`);
