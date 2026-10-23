import { randomUUID } from 'crypto';
import { UserRole } from '../shared/enums/user-role.enum.js';

export const db = {
  users: new Map(),
  parkingLots: new Map(),
  floors: new Map(),
  slots: new Map(),
  tickets: new Map(),
  payments: new Map(),
  vehicles: new Map(),
};

export const seedDb = () => {
  const adminId = randomUUID();
  db.users.set(adminId, {
    id: adminId,
    username: 'admin',
    password: 'admin',
    role: UserRole.ADMIN,
    parkingLotId: null,
  });
};
