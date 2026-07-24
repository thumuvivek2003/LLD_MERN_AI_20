/**
 * Standard response envelope helpers (see API_CONTRACT.md).
 *   success: { success: true, data }
 *   failure: { success: false, error: { message, code } }
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 */
export function ok(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

/**
 * Send a failure response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {string} [code='ERROR']
 */
export function fail(res, statusCode, message, code = 'ERROR') {
  return res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
}
