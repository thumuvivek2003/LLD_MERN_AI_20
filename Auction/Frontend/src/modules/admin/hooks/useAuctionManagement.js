import { useCallback, useEffect } from 'react';
import { adminAuctionApi } from '../services/adminAuction.api.js';
import { useAdminAuctionStore } from '../store/adminAuction.store.js';
import { showSuccessToast } from '../../shared/utils/toast.util.js';

export function useAuctionManagement(autoLoad = true) {
  const { auctions, total, loading, setAuctions, setLoading, updateAuction, addAuction } =
    useAdminAuctionStore();

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await adminAuctionApi.getAuctions(params);
      setAuctions(data.auctions || [], data.total || 0);
    } catch {
      /* toast handled */
    } finally {
      setLoading(false);
    }
  }, [setAuctions, setLoading]);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  const create = useCallback(async (payload) => {
    const data = await adminAuctionApi.createAuction(payload);
    addAuction(data.auction);
    showSuccessToast('Auction created');
    return data.auction;
  }, [addAuction]);

  const close = useCallback(async (id) => {
    const data = await adminAuctionApi.closeAuction(id);
    updateAuction(data.auction);
    showSuccessToast('Auction closed');
    return data.auction;
  }, [updateAuction]);

  const assign = useCallback(async (id, userIds) => {
    const data = await adminAuctionApi.assignBidders(id, userIds);
    updateAuction(data.auction);
    showSuccessToast('Bidders assigned');
    return data.auction;
  }, [updateAuction]);

  return { auctions, total, loading, load, create, close, assign };
}
