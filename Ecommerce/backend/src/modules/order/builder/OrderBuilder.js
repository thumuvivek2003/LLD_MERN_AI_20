import { ORDER_STATUS } from '../../../common/constants/orderStatus.constants.js';

export class OrderBuilder {
  constructor() {
    this._userId = null;
    this._items = [];
    this._pricing = null;
    this._payment = null;
    this._address = null;
    this._status = ORDER_STATUS.CREATED;
  }

  setUser(userId) {
    this._userId = userId;
    return this;
  }

  setItems(items) {
    this._items = (items || []).map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    }));
    return this;
  }

  setPricing(pricing) {
    this._pricing = pricing;
    return this;
  }

  setPayment(payment) {
    this._payment = payment;
    return this;
  }

  setAddress(address) {
    this._address = address;
    return this;
  }

  setStatus(status) {
    this._status = status;
    return this;
  }

  build() {
    if (!this._userId) throw new Error('OrderBuilder: userId is required');
    if (!this._items.length) throw new Error('OrderBuilder: items are required');
    if (!this._pricing) throw new Error('OrderBuilder: pricing is required');
    if (!this._payment) throw new Error('OrderBuilder: payment is required');
    if (!this._address) throw new Error('OrderBuilder: address is required');
    return {
      userId: this._userId,
      items: this._items,
      pricing: this._pricing,
      payment: this._payment,
      address: this._address,
      status: this._status,
    };
  }
}
