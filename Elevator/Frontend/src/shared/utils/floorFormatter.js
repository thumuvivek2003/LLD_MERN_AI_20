export function formatFloor(floor) {
  if (floor === 0 || floor === 'G') return 'G';
  return String(floor);
}

export function floorList(top = 10) {
  const list = [];
  for (let i = top; i >= 0; i--) list.push(i);
  return list;
}
