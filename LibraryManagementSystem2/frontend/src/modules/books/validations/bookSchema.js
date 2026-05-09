export const validateBook = ({ title, author, isbn, totalCopies }) => {
  const errors = {};
  if (!title) errors.title = 'Title is required';
  if (!author) errors.author = 'Author is required';
  if (!isbn) errors.isbn = 'ISBN is required';
  if (!totalCopies || totalCopies < 1) errors.totalCopies = 'At least 1 copy required';
  return errors;
};
