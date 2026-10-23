export const validateUserPayload = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.password && data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (data.role && !['admin', 'librarian', 'member'].includes(data.role)) {
    errors.push('Role must be one of: admin, librarian, member');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBookPayload = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
    errors.push('Author is required and must be a non-empty string');
  }

  if (!data.isbn || typeof data.isbn !== 'string' || data.isbn.trim().length === 0) {
    errors.push('ISBN is required and must be a non-empty string');
  }

  if (data.publishedYear && (!Number.isInteger(data.publishedYear) || data.publishedYear < 1000 || data.publishedYear > new Date().getFullYear())) {
    errors.push('Published year must be a valid year');
  }

  if (data.totalCopies !== undefined && (!Number.isInteger(data.totalCopies) || data.totalCopies < 0)) {
    errors.push('Total copies must be a non-negative integer');
  }

  if (data.availableCopies !== undefined && (!Number.isInteger(data.availableCopies) || data.availableCopies < 0)) {
    errors.push('Available copies must be a non-negative integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateReservationPayload = (data) => {
  const errors = [];

  if (!data.userId) {
    errors.push('User ID is required');
  }

  if (!data.bookId) {
    errors.push('Book ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};