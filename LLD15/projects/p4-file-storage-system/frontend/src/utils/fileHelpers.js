export const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2) + " KB";
};