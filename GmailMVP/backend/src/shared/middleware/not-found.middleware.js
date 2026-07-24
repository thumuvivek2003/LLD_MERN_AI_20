/**
 * 404 handler for unmatched routes. Registered after all routes,
 * before the error handler.
 */
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
}
