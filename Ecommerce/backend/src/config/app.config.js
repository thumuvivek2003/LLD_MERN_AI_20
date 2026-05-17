import { PORT, JWT_SECRET } from './env.config.js';

export function getAppConfig() {
  return {
    port: PORT,
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: '7d',
  };
}
