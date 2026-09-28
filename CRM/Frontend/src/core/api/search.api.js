import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Search + saved-view repository — CONTRACT §5.4. */
export const searchApi = {
  run: (query) => http.post(ENDPOINTS.search, query),
  suggest: (params) => http.get(ENDPOINTS.searchSuggest, { params }),
};

export const viewsApi = {
  list: (objectId) => http.get(ENDPOINTS.views, { params: objectId ? { objectId } : undefined }),
  create: (payload) => http.post(ENDPOINTS.views, payload),
  update: (viewId, patch) => http.patch(ENDPOINTS.view(viewId), patch),
  remove: (viewId) => http.delete(ENDPOINTS.view(viewId)),
};

export default searchApi;
