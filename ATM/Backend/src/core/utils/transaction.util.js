import { v4 as uuidv4 } from "uuid";

export function generateTransactionId() {
  return `TXN-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
}
