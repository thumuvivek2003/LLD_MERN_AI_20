export function parseApiResponse(res) {
  return res?.data ?? null;
}

export function extractErrorMessage(err, fallback = 'Something went wrong') {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}
