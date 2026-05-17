/**
 * Standard success envelope per API_CONTRACT.md.
 */
export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Standard error envelope per API_CONTRACT.md.
 */
export function errorResponse(res, code, message, status = 500) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}
