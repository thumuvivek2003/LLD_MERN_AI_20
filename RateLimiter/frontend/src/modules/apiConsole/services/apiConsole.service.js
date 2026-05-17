import { http } from '../../shared/services/httpClient.js';

export async function sendRequest({ endpoint, apiKey }) {
  // x-api-key is the consumer's per-client key (not the JWT). We allow both
  // status 200 and 429 as valid responses, returning whichever body comes back.
  const res = await http.post(
    '/v1/request',
    { endpoint: endpoint || '/test' },
    {
      headers: { 'x-api-key': apiKey || '' },
      validateStatus: (s) => s === 200 || s === 429,
    },
  );
  return { status: res.status, body: res.data };
}
