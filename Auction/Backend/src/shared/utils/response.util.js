export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function errorResponse(res, message, status = 500, code) {
  const body = { success: false, message };
  if (code) body.code = code;
  return res.status(status).json(body);
}
