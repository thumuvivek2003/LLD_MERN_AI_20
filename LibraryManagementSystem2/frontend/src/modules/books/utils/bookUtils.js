export const isAvailable = (book) => book.availableCopies > 0;
export const formatCopies = (book) => `${book.availableCopies} / ${book.totalCopies} available`;
