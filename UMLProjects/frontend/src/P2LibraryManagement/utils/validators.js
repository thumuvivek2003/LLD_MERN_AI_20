// utils/validators.js
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateISBN = (isbn) => {
  const regex = /^(?:\d{10}|\d{13})$/;
  return regex.test(isbn.replace(/-/g, ''));
};

export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.message || `${field} is required`;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }

    if (rule.password && value && !validatePassword(value)) {
      errors[field] = 'Password must be at least 6 characters';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || 'Invalid format';
    }

    if (rule.custom && value) {
      const customError = rule.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};