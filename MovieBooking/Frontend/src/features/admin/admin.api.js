import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';

export const getDashboard = () => api.get(ENDPOINTS.admin.dashboard);
export const getMovies = () => api.get(ENDPOINTS.admin.movies.list);
export const createMovie = (data) => api.post(ENDPOINTS.admin.movies.create, data);
export const updateMovie = (id, data) => api.patch(ENDPOINTS.admin.movies.update(id), data);
export const deleteMovie = (id) => api.delete(ENDPOINTS.admin.movies.delete(id));
export const getTheaters = () => api.get(ENDPOINTS.admin.theaters.list);
export const createTheater = (data) => api.post(ENDPOINTS.admin.theaters.create, data);
export const updateTheater = (id, data) => api.patch(ENDPOINTS.admin.theaters.update(id), data);
export const deleteTheater = (id) => api.delete(ENDPOINTS.admin.theaters.delete(id));
export const getShows = () => api.get(ENDPOINTS.admin.shows.list);
export const createShow = (data) => api.post(ENDPOINTS.admin.shows.create, data);
export const updateShow = (id, data) => api.patch(ENDPOINTS.admin.shows.update(id), data);
export const deleteShow = (id) => api.delete(ENDPOINTS.admin.shows.delete(id));
export const getScreensByTheater = (theaterId) => api.get(ENDPOINTS.admin.screens.byTheater(theaterId));
export const getLayout = (screenId) => api.get(ENDPOINTS.admin.screens.layout(screenId));
export const updateLayout = (screenId, layout) => api.put(ENDPOINTS.admin.screens.layout(screenId), { layout });
