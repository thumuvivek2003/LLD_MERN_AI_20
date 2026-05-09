export const generateDefaultLayout = (rows, seatsPerRow) => {
  const layout = [];
  for (let i = 0; i < rows; i++) {
    const row = String.fromCharCode(65 + i); // A, B, C...
    layout.push({
      row,
      type: i < 2 ? 'premium' : 'normal',
      seats: seatsPerRow,
    });
  }
  return layout;
};
