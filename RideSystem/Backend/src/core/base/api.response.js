export const ApiResponse = {
  ok: (res, data, message = 'OK') => res.json({ success: true, message, data }),
  created: (res, data, message = 'Created') => res.status(201).json({ success: true, message, data }),
  fail: (res, status, message, code) =>
    res.status(status).json({ success: false, message, code: code || 'ERROR' }),
};
