// Unwraps the { success, data, error } envelope. Services call this once,
// then resolve with `data` or throw a useful Error.
export async function handleApiResponse(promise) {
  try {
    const res = await promise;
    const body = res?.data;
    if (!body || typeof body !== 'object') {
      throw new Error('Malformed response from server');
    }
    if (body.success === false) {
      const err = body.error || {};
      const error = new Error(err.message || 'Request failed');
      error.code = err.code || 'UNKNOWN';
      throw error;
    }
    return body.data;
  } catch (err) {
    // Network / axios errors — surface message.
    if (err.response?.data?.error?.message) {
      const e = new Error(err.response.data.error.message);
      e.code = err.response.data.error.code || 'HTTP_ERROR';
      throw e;
    }
    throw err;
  }
}
