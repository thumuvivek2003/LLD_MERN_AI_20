// modules/privacy/privacy.factory.js — createStrategy() [Factory]
// Maps a privacy mode string to the concrete Strategy instance.
// Strategies are stateless, so we cache one instance of each.
import { PRIVACY } from '../../core/constants/privacy.constants.js';
import { EveryoneStrategy } from './strategies/everyone.strategy.js';
import { ExcludeStrategy } from './strategies/exclude.strategy.js';
import { OnlyShareStrategy } from './strategies/onlyShare.strategy.js';

const registry = {
  [PRIVACY.EVERYONE]: new EveryoneStrategy(),
  [PRIVACY.CONTACTS_EXCEPT]: new ExcludeStrategy(),
  [PRIVACY.ONLY_SHARE_WITH]: new OnlyShareStrategy(),
};

export function createStrategy(privacyMode) {
  // Default to the safest permissive rule (Everyone) if unknown.
  return registry[privacyMode] || registry[PRIVACY.EVERYONE];
}
