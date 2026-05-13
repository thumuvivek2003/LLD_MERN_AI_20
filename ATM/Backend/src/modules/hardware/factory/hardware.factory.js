import { WebCardReader } from "../implementations/WebCardReader.js";
import { WebKeypad } from "../implementations/WebKeypad.js";
import { WebScreen } from "../implementations/WebScreen.js";
import { WebCashDispenser } from "../implementations/WebCashDispenser.js";

export function createCardReader() {
  return new WebCardReader();
}

export function createKeypad() {
  return new WebKeypad();
}

export function createScreen() {
  return new WebScreen();
}

export function createCashDispenser() {
  return new WebCashDispenser();
}
