import { useState } from 'react';
import { bidApi } from '../services/bid.api.js';
import { showSuccessToast } from '../../shared/utils/toast.util.js';

export function usePlaceBid() {
  const [submitting, setSubmitting] = useState(false);

  async function placeBid(auctionId, amount) {
    setSubmitting(true);
    try {
      const data = await bidApi.placeBid(auctionId, amount);
      showSuccessToast('Bid placed');
      return data;
    } finally {
      setSubmitting(false);
    }
  }

  return { placeBid, submitting };
}
