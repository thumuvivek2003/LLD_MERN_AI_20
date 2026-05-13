import { Keypad } from "../interfaces/Keypad.js";

export class WebKeypad extends Keypad {
  captureInput(input) {
    return String(input);
  }
}
