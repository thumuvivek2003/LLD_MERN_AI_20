/**
 * Abstract base for channel strategies (Strategy pattern).
 * Subclasses must implement send(notification, rendered) and return:
 *   { success: boolean, error?: string, providerRef?: string }
 */
export class NotificationStrategy {
  constructor(channelType) {
    this.channelType = channelType;
  }

  // eslint-disable-next-line no-unused-vars
  async send(notification, rendered) {
    throw new Error('NotificationStrategy.send() must be implemented by subclass');
  }

  /** Helper for subclasses — simulates 80% success / 20% failure. */
  _simulateOutcome(label) {
    const ok = Math.random() < 0.8;
    if (ok) return { success: true, providerRef: `mock_${label}_${Date.now()}` };
    return { success: false, error: `simulated_${label}_failure` };
  }
}
