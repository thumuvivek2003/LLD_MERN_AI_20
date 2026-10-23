export const paginate = (items, page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  return {
    page,
    limit,
    total: items.length,
    items: items.slice(start, start + limit),
  };
};
