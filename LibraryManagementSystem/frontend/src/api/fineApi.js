import api from './axiosConfig';

export const fineApi = {
  getUserFines: (params) => api.get('/fines/my', { params }),
  payFine: (id) => api.patch(`/fines/${id}/pay`),
  getAllFines: (params) => api.get('/fines', { params }),
};
