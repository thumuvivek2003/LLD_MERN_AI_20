export const toDto = (movie) => ({
  id: movie._id,
  title: movie.title,
  description: movie.description,
  duration: movie.duration,
  genre: movie.genre,
  language: movie.language,
  releaseDate: movie.releaseDate,
  posterUrl: movie.posterUrl,
  bannerUrl: movie.bannerUrl,
  rating: movie.rating,
  cast: movie.cast,
  director: movie.director,
});
