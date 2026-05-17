import { z } from 'zod';
import { ROLES } from '../../../shared/constants/roles.constant.js';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  role: z.enum([ROLES.MEMBER, ROLES.SPECTATOR, ROLES.ADMIN]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function toUserDTO(userDoc) {
  return {
    id: userDoc.id || userDoc._id?.toString(),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    walletBalance: userDoc.walletBalance ?? 0,
  };
}
