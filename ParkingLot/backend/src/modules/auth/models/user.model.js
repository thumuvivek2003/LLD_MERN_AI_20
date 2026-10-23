export class User {
  constructor({ id, username, password, role, parkingLotId = null }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
    this.parkingLotId = parkingLotId;
  }
}
