// utils/format.js
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatISBN = (isbn) => {
  if (!isbn) return '';
  const cleaned = isbn.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  
  if (cleaned.length === 13) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 12)}-${cleaned.slice(12)}`;
  }
  
  return isbn;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

export const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatUserRole = (role) => {
  const roleMap = {
    member: 'Member',
    librarian: 'Librarian',
    admin: 'Administrator',
  };
  return roleMap[role] || capitalize(role);
};

export const formatBookStatus = (status) => {
  const statusMap = {
    available: 'Available',
    borrowed: 'Borrowed',
    reserved: 'Reserved',
    unavailable: 'Unavailable',
  };
  return statusMap[status] || capitalize(status);
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const isOverdue = (dueDate) => {
  const days = getDaysUntilDue(dueDate);
  return days !== null && days < 0;
};