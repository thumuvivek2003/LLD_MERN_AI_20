export function calculateSubtotal(items = []) {
  return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}

export function itemSubtotal(item) {
  return Number(item.price) * Number(item.quantity);
}
