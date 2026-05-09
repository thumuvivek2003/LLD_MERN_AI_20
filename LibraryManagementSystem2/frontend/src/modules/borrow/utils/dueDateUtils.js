export const calcOverdueDays = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  if (now <= due) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDate) => new Date() > new Date(dueDate);
