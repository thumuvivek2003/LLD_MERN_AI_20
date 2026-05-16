/**
 * Centralised response envelope helpers.
 * Every controller MUST go through these so the FE contract stays consistent.
 */
export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data, error: null });
}

export function fail(res, status, code, message) {
  return res.status(status).json({
    success: false,
    data: null,
    error: { code, message },
  });
}
