export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function errorResponse(res, message, status = 400, code = "ERROR") {
  return res.status(status).json({ success: false, code, message });
}
