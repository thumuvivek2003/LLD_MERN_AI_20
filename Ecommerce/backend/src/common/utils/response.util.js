export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function errorResponse(res, { code = 'APP_ERROR', message = 'Something went wrong', status = 500 } = {}) {
  return res.status(status).json({ success: false, error: { code, message } });
}
