// Wallet is modelled as a field (walletBalance) on the User document for MVP simplicity.
// This file exists to satisfy the prescribed tree and to centralise the "which model holds wallet state" decision.
// If wallets ever need transactions/history, swap this for a real schema and update wallet.repository.js.

export { UserModel as WalletModel } from '../../auth/models/user.model.js';
