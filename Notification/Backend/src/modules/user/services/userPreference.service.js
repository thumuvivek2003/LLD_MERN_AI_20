import { userRepository } from '../repositories/user.repository.js';
import { AppException } from '../../../shared/exceptions/app.exception.js';

function toUserDTO(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    pushToken: user.pushToken || undefined,
    role: user.role,
    preferences: {
      emailEnabled: !!user.preferences?.emailEnabled,
      smsEnabled: !!user.preferences?.smsEnabled,
      pushEnabled: !!user.preferences?.pushEnabled,
    },
  };
}

export const userPreferenceService = {
  async listUsers() {
    const users = await userRepository.findAll();
    return users.map(toUserDTO);
  },

  async getUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppException('USER_NOT_FOUND', `User ${id} not found`, 404);
    return toUserDTO(user);
  },

  async getPreferences(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppException('USER_NOT_FOUND', `User ${id} not found`, 404);
    return {
      emailEnabled: !!user.preferences?.emailEnabled,
      smsEnabled: !!user.preferences?.smsEnabled,
      pushEnabled: !!user.preferences?.pushEnabled,
    };
  },

  async updatePreferences(id, prefs) {
    const next = {
      emailEnabled: !!prefs.emailEnabled,
      smsEnabled: !!prefs.smsEnabled,
      pushEnabled: !!prefs.pushEnabled,
    };
    const updated = await userRepository.updatePreferences(id, next);
    if (!updated) throw new AppException('USER_NOT_FOUND', `User ${id} not found`, 404);
    return next;
  },
};
