export const toDto = (show) => ({
  id: show._id,
  movie: show.movieId,
  screen: show.screenId,
  theater: show.theaterId,
  date: show.date,
  startTime: show.startTime,
  endTime: show.endTime,
  basePrice: show.basePrice,
  premiumPrice: show.premiumPrice,
  status: show.status,
});
