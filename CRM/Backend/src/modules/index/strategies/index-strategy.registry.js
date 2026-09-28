import { HashIndexStrategy } from './hash.strategy.js';
import { BTreeIndexStrategy } from './btree.strategy.js';
import { TrieIndexStrategy } from './trie.strategy.js';
import { INDEX_TYPE, FIELD_TYPE } from '../../../config/constants.js';
import { BadRequestError } from '../../../core/exceptions/bad-request.error.js';

const NUMERIC_FIELDS = new Set([FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY]);

/**
 * Index Strategy Factory. GEO is declared in the contract but not implemented —
 * adding it is one file plus one entry here.
 */
const BUILDERS = {
  [INDEX_TYPE.HASH]: () => new HashIndexStrategy(),
  [INDEX_TYPE.BTREE]: (opts) => new BTreeIndexStrategy(opts),
  [INDEX_TYPE.TRIE]: (opts) => new TrieIndexStrategy(opts),
};

export const indexStrategyFactory = {
  supported: () => Object.keys(BUILDERS),

  create(type, field = {}) {
    const build = BUILDERS[type];
    if (!build) throw new BadRequestError(`Index type '${type}' is declared but not implemented`);
    return build({ numeric: NUMERIC_FIELDS.has(field.type) });
  },
};
