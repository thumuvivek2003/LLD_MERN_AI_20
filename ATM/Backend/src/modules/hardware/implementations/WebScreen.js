import { Screen } from "../interfaces/Screen.js";

export class WebScreen extends Screen {
  display(message) {
    return { message };
  }
}
