import { adminRepository } from './admin.repository.js';
import { ROLES, RIDE_STATUS } from '../../config/constants.js';
import { AppError } from '../../core/exceptions/app.error.js';

class AdminService {
  async dashboard() {
    const [riders, drivers, rides, activeDrivers, totalRevenue, completed] = await Promise.all([
      adminRepository.countUsers({ role: ROLES.RIDER }),
      adminRepository.countUsers({ role: ROLES.DRIVER }),
      adminRepository.countRides(),
      adminRepository.countDrivers({ status: 'ONLINE' }),
      adminRepository.sumPaidAmount(),
      adminRepository.countRides({ status: RIDE_STATUS.COMPLETED }),
    ]);
    return { riders, drivers, rides, activeDrivers, totalRevenue, completed };
  }

  listRiders() { return adminRepository.listUsersByRole(ROLES.RIDER); }
  listDrivers() { return adminRepository.listUsersByRole(ROLES.DRIVER); }
  listRides() { return adminRepository.listAllRides(); }

  async setBlocked(userId, isBlocked) {
    const updated = await adminRepository.setBlocked(userId, isBlocked);
    if (!updated) throw new AppError('User not found', 404);
    return updated;
  }
}

export const adminService = new AdminService();
