import { CardReader } from "../interfaces/CardReader.js";

export class WebCardReader extends CardReader {
  readCard(cardNumber) {
    return { cardNumber };
  }
}
