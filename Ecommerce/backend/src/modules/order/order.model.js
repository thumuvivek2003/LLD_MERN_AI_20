import mongoose from 'mongoose';
import { ORDER_STATUS } from '../../common/constants/orderStatus.constants.js';
import { PAYMENT_TYPE, PAYMENT_STATUS } from '../../common/constants/paymentType.constants.js';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const PriceSummarySchema = new mongoose.Schema(
  {
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(PAYMENT_TYPE), required: true },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    transactionId: { type: String, default: '' },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    line1: String,
    city: String,
    pincode: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], default: [] },
    pricing: { type: PriceSummarySchema, required: true },
    payment: { type: PaymentSchema, required: true },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.CREATED },
    address: { type: AddressSchema, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', OrderSchema);
