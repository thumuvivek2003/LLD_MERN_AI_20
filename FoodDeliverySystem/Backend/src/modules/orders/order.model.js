import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_STATUS_LIST } from '../../core/constants/order-status.constants.js';
import { PAYMENT_METHODS } from '../../core/constants/payment.constants.js';

const OrderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHODS), required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    status: { type: String, enum: ORDER_STATUS_LIST, default: ORDER_STATUS.CREATED, index: true },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
    deliveryAddress: { type: String, required: true },
    deliveryOtp: { type: String, default: null },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model('Order', OrderSchema);
