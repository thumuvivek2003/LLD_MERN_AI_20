export const success = (res, data = null, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

export const error = (res, message = 'An error occurred', status = 500) => {
  return res.status(status).json({
    success: false,
    error: message
  });
};