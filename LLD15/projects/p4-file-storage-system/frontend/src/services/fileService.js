import apiClient from "../api/apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log('Form Data' ,formData);

  const response = await apiClient.post(
    API_ENDPOINTS.UPLOAD_FILE,
    formData
  );

  return response.data;
};

export const getFiles = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_FILES);
  return response.data;
};

export const deleteFile = async (id) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DELETE_FILE(id)
  );
  return response.data;
};

export const downloadFile = (id) => {
  window.open(
    `http://localhost:5001/api/v1${API_ENDPOINTS.DOWNLOAD_FILE(id)}`,
    "_blank"
  );
};