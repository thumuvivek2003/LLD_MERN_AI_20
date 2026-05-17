export function successResponse(res, data, status = 200) {
  return res.status(status).json(data);
}

export function errorResponse(res, status, message, code) {
  return res.status(status).json({ error: { message, code } });
}
