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
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
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
    status: { type: String, enum: ['delivered', 'review','shipping'], default: 'review' },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email phone ' })
    .populate({
      path: 'cartItems.product',
      select: 'title imageCover color size price',
    })
    .populate({ path: 'shippingAddress', select: 'details phone postalCode' });
  next();
});

module.exports = mongoose.model('order', orderSchema);
