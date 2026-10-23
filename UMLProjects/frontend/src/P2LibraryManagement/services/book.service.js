// services/book.service.js
import api from './api.js';

export const addBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const listBooks = async (params = {}) => {
  const response = await api.get('/books', { params });
  return response.data;
};


export const getBooks = async () => {
  const response = await api.get(`/books/`);
  return response.data;
};

export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const reserveBook = async (bookId) => {
  const response = await api.post(`/books/${bookId}/reserve`);
  return response.data;
};

export const cancelReservation = async (bookId) => {
  const response = await api.post(`/books/${bookId}/cancel-reservation`);
  return response.data;
};

export const issueBook = async (data) => {
  const response = await api.post('/books/issue', data);
  return response.data;
};

export const returnBook = async (data) => {
  const response = await api.post('/books/return', data);
  return response.data;
};

export const searchBooks = async (query) => {
  const response = await api.get('/books/search', { params: { q: query } });
  return response.data;
};