export const API_ENDPOINTS = {
  UPLOAD_FILE: "/files/upload",
  GET_FILES: "/files",
  DELETE_FILE: (id) => `/files/${id}`,
  DOWNLOAD_FILE: (id) => `/files/${id}/download`
};