import { InvalidStateTransition } from '../../../core/exceptions/ride.error.js';

export class RideState {
  constructor(name) {
    this.name = name;
  }

  assign(_ride) { this.#deny('ASSIGN'); }
  arrive(_ride) { this.#deny('ARRIVE'); }
  verifyOtp(_ride, _otp) { this.#deny('VERIFY_OTP'); }
  start(_ride) { this.#deny('START'); }
  complete(_ride) { this.#deny('COMPLETE'); }
  cancel(_ride, _by) { this.#deny('CANCEL'); }

  #deny(action) {
    throw new InvalidStateTransition(this.name, action);
  }
}
