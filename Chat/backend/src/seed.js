import { UserModel } from './models/user.model.js';
import { ADMIN_SEED } from './shared/constants/app.constant.js';
import { ROLES } from './shared/constants/roles.constant.js';
import { logger } from './shared/logger/logger.js';

/**
 * Idempotent first-run seed: ensures the ADMIN user exists.
 */
export async function seedAdminUser() {
  try {
    const existing = await UserModel.findOne({ mobile: ADMIN_SEED.mobile }).lean();
    if (existing) {
      if (existing.role !== ROLES.ADMIN) {
        await UserModel.updateOne({ _id: existing._id }, { role: ROLES.ADMIN });
        logger.info(`Promoted existing user ${ADMIN_SEED.mobile} to ADMIN`);
      } else {
        logger.info(`Admin user already exists (${ADMIN_SEED.mobile})`);
      }
      return existing;
    }
    const created = await UserModel.create({
      name: ADMIN_SEED.name,
      mobile: ADMIN_SEED.mobile,
      role: ROLES.ADMIN,
    });
    logger.info(`Seeded ADMIN user: mobile=${ADMIN_SEED.mobile}`);
    return created.toObject();
  } catch (err) {
    logger.warn(`Admin seed skipped: ${err.message}`);
    return null;
  }
}
