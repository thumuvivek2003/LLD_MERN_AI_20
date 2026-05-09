import { create } from 'zustand';

export const useBookStore = create((set) => ({
  books: [],
  setBooks: (books) => set({ books }),
  addBook: (book) => set((s) => ({ books: [...s.books, book] })),
  updateBook: (id, data) =>
    set((s) => ({ books: s.books.map((b) => (b._id === id ? { ...b, ...data } : b)) })),
  removeBook: (id) => set((s) => ({ books: s.books.filter((b) => b._id !== id) })),
}));
