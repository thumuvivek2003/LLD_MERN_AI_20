// modules/privacy/strategies/privacy.strategy.js
// Strategy interface: every privacy rule answers one question — canView().
// (JS has no interfaces; this documents the contract and gives a safe default.)
export class PrivacyStrategy {
  // eslint-disable-next-line no-unused-vars
  canView(_status, _viewerId) {
    throw new Error('canView() must be implemented by a concrete strategy');
  }
}
