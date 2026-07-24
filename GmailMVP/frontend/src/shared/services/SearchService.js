import { searchApi } from '../api/search.api.js';
import { MailViewModelFactory } from '../factory/MailViewModelFactory.js';
import { SearchContext } from '../strategy/SearchContext.js';

/**
 * Search service: uses the Strategy pattern to build the request, and falls
 * back to local filtering of the returned set for snappy refinement.
 */
export const SearchService = {
  async search({ userId, q, type = 'all' }) {
    const ctx = new SearchContext(type);
    const params = ctx.buildParams(userId, q);
    const dtos = await searchApi.search(params);
    const vms = MailViewModelFactory.listFromDTO(dtos, { context: 'search' });
    // Backend already scopes/filters; local filter is a resilient extra pass.
    return q ? ctx.filterLocally(vms, q) : vms;
  },
};

export default SearchService;
