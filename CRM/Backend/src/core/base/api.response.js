/**
 * The one and only response envelope (CONTRACT.md §1).
 * Failures never travel through here — they go through the error middleware.
 */
export const ApiResponse = {
  ok(res, data) {
    return res.json({ success: true, data });
  },

  created(res, data) {
    return res.status(201).json({ success: true, data });
  },

  paginated(res, data, meta) {
    return res.json({ success: true, data, meta });
  },

  noContent(res) {
    return res.status(200).json({ success: true, data: null });
  },
};
