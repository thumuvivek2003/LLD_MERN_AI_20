import { CHANNEL_TYPE } from '../../../constants/channelType.constants.js';
import { emailStrategy } from '../strategies/email.strategy.js';
import { smsStrategy } from '../strategies/sms.strategy.js';
import { pushStrategy } from '../strategies/push.strategy.js';
import { AppException } from '../../../shared/exceptions/app.exception.js';

const REGISTRY = {
  [CHANNEL_TYPE.EMAIL]: emailStrategy,
  [CHANNEL_TYPE.SMS]: smsStrategy,
  [CHANNEL_TYPE.PUSH]: pushStrategy,
};

/**
 * Factory — given a channel type, returns the matching strategy singleton.
 * New channels (SLACK, WHATSAPP, ...) just register here without touching callers.
 */
export function createChannelStrategy(channelType) {
  const strategy = REGISTRY[channelType];
  if (!strategy) {
    throw new AppException('UNSUPPORTED_CHANNEL', `Channel ${channelType} not supported`, 400);
  }
  return strategy;
}
