import { UserStatus } from '../enums/UserStatus.js';
import { FineStatus } from '../enums/FineStatus.js';

export class User {
  constructor(data) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.isPremium = data.isPremium;
  }

  canBorrowBook(activeBorrows, pendingFinesCount) {
    return (
      this.status === UserStatus.ACTIVE &&
      activeBorrows < 3 &&
      pendingFinesCount === 0
    );
  }

  hasPendingFine(fines) {
    return fines.some(f => f.status === FineStatus.PENDING);
  }
}
