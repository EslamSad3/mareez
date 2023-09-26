const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'order must belong to user'],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'product',
        },
        quantity: Number,
        color: String,
        size: String,
        price: String,
      },
    ],
    taxFees: {
      type: Number,
      default: 0,
    },
    shippingFees: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', orderSchema);
